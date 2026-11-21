using System.ComponentModel.DataAnnotations;

namespace Cars.API.DTOs;

public sealed class RegisterDto
{
    [Required, StringLength(80, MinimumLength = 2)]
    public string UserName { get; set; } = string.Empty;

    [Required, EmailAddress, StringLength(256)]
    public string Email { get; set; } = string.Empty;

    [Required, StringLength(100, MinimumLength = 8)]
    public string Password { get; set; } = string.Empty;
}
