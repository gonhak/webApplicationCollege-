using System.Text;
using Cars.API.DTOs;
using Cars.API.Services;
using Cars.Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.AspNetCore.Mvc;

namespace Cars.API.Controllers;

[AllowAnonymous]
public class AccountController : BaseApiController
{
    private readonly UserManager<AppUser> _userManager;
    private readonly ITokenService _tokenService;
    private readonly IEmailService _emailService;
    private readonly IConfiguration _configuration;

    public AccountController(
        UserManager<AppUser> userManager,
        ITokenService tokenService,
        IEmailService emailService,
        IConfiguration configuration)
    {
        _userManager = userManager;
        _tokenService = tokenService;
        _emailService = emailService;
        _configuration = configuration;
    }

    [HttpPost("register")]
    public async Task<ActionResult> Register(RegisterDto dto, CancellationToken cancellationToken)
    {
        var user = new AppUser
        {
            UserName = dto.UserName.Trim(),
            Email = dto.Email.Trim(),
        };

        var createResult = await _userManager.CreateAsync(user, dto.Password);
        if (!createResult.Succeeded)
        {
            return BadRequest(createResult.Errors.Select(error => error.Description));
        }

        var roleResult = await _userManager.AddToRoleAsync(user, "User");
        if (!roleResult.Succeeded)
        {
            return BadRequest(roleResult.Errors.Select(error => error.Description));
        }

        var rawToken = await _userManager.GenerateEmailConfirmationTokenAsync(user);
        var token = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(rawToken));
        var baseUrl = GetClientBaseUrl();
        var confirmationUrl = QueryHelpers.AddQueryString(
            $"{baseUrl}/confirm-email",
            new Dictionary<string, string?> { ["userId"] = user.Id, ["token"] = token });

        var subject = "Potwierdź konto Cars";
        var html = $"<h2>Cars</h2><p>Kliknij, aby potwierdzić adres e-mail:</p><p><a href=\"{confirmationUrl}\">Potwierdź adres e-mail</a></p>";
        await _emailService.SendAsync(user.Email!, subject, html, cancellationToken);

        return Ok(new { message = "Konto utworzono. Sprawdź e-mail i potwierdź rejestrację." });
    }

    [HttpGet("confirm-email")]
    public async Task<ActionResult> ConfirmEmail(
        [FromQuery] string userId,
        [FromQuery] string token)
    {
        var user = await _userManager.FindByIdAsync(userId);
        if (user is null)
        {
            return BadRequest("Nieprawidłowy użytkownik.");
        }

        if (!TryDecodeToken(token, out var decodedToken))
        {
            return BadRequest("Nieprawidłowy token.");
        }

        var result = await _userManager.ConfirmEmailAsync(user, decodedToken);
        if (!result.Succeeded)
        {
            return BadRequest(result.Errors.Select(error => error.Description));
        }

        return Ok(new { message = "Adres e-mail został potwierdzony." });
    }

    [HttpPost("login")]
    public async Task<ActionResult<UserDto>> Login(LoginDto dto)
    {
        var user = await _userManager.FindByEmailAsync(dto.Email.Trim());
        if (user is null || !await _userManager.CheckPasswordAsync(user, dto.Password))
        {
            return Unauthorized("Nieprawidłowy e-mail lub hasło.");
        }

        if (!user.EmailConfirmed)
        {
            return Unauthorized("Najpierw potwierdź adres e-mail.");
        }

        return Ok(await CreateUserDtoAsync(user));
    }

    [HttpPost("forgot-password")]
    public async Task<ActionResult> ForgotPassword(ForgotPasswordDto dto, CancellationToken cancellationToken)
    {
        var user = await _userManager.FindByEmailAsync(dto.Email.Trim());
        if (user is not null && user.EmailConfirmed)
        {
            var rawToken = await _userManager.GeneratePasswordResetTokenAsync(user);
            var token = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(rawToken));
            var resetUrl = QueryHelpers.AddQueryString(
                $"{GetClientBaseUrl()}/reset-password",
                new Dictionary<string, string?> { ["email"] = user.Email, ["token"] = token });
            var html = $"<h2>Cars</h2><p>Kliknij, aby ustawić nowe hasło:</p><p><a href=\"{resetUrl}\">Ustaw nowe hasło</a></p>";
            await _emailService.SendAsync(user.Email!, "Reset hasła Cars", html, cancellationToken);
        }

        return Ok(new { message = "Jeżeli konto istnieje, wysłaliśmy wiadomość z instrukcją." });
    }

    [HttpPost("reset-password")]
    public async Task<ActionResult> ResetPassword(ResetPasswordDto dto)
    {
        var user = await _userManager.FindByEmailAsync(dto.Email.Trim());
        if (user is null)
        {
            return BadRequest("Nie udało się zresetować hasła.");
        }

        if (!TryDecodeToken(dto.Token, out var decodedToken))
        {
            return BadRequest("Nieprawidłowy token.");
        }

        var result = await _userManager.ResetPasswordAsync(user, decodedToken, dto.NewPassword);
        if (!result.Succeeded)
        {
            return BadRequest(result.Errors.Select(error => error.Description));
        }

        return Ok(new { message = "Hasło zostało zmienione." });
    }

    private async Task<UserDto> CreateUserDtoAsync(AppUser user)
    {
        var roles = await _userManager.GetRolesAsync(user);
        var token = await _tokenService.CreateTokenAsync(user);
        return new UserDto(user.Id, user.UserName ?? string.Empty, user.Email ?? string.Empty, token, roles.ToArray());
    }

    private string GetClientBaseUrl() =>
        (_configuration["Client:BaseUrl"] ?? throw new InvalidOperationException("Brak Client:BaseUrl.")).TrimEnd('/');

    private static bool TryDecodeToken(string token, out string decodedToken)
    {
        try
        {
            decodedToken = Encoding.UTF8.GetString(WebEncoders.Base64UrlDecode(token));
            return true;
        }
        catch (FormatException)
        {
            decodedToken = string.Empty;
            return false;
        }
        catch (ArgumentException)
        {
            decodedToken = string.Empty;
            return false;
        }
    }
}
