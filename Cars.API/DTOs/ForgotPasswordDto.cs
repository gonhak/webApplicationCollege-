using System.ComponentModel.DataAnnotations;

namespace Cars.API.DTOs;

public sealed class ForgotPasswordDto
{
    [Required, EmailAddress, StringLength(256)]
    public string Email { get; set; } = string.Empty;
}
