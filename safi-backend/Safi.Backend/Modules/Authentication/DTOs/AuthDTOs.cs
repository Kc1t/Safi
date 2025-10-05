using System.ComponentModel.DataAnnotations;

namespace Safi.Backend.Modules.Authentication.DTOs;

/// <summary>
/// DTO para requisição de login
/// </summary>
public class LoginRequest
{
    /// <summary>
    /// Email do usuário
    /// </summary>
    [Required(ErrorMessage = "Email é obrigatório")]
    [EmailAddress(ErrorMessage = "Email deve ter formato válido")]
    public string Email { get; set; } = string.Empty;

    /// <summary>
    /// Senha do usuário
    /// </summary>
    [Required(ErrorMessage = "Senha é obrigatória")]
    [MinLength(6, ErrorMessage = "Senha deve ter pelo menos 6 caracteres")]
    public string Password { get; set; } = string.Empty;
}

/// <summary>
/// DTO para requisição de registro
/// </summary>
public class RegisterRequest
{
    /// <summary>
    /// Nome completo do usuário
    /// </summary>
    [Required(ErrorMessage = "Nome é obrigatório")]
    [MinLength(2, ErrorMessage = "Nome deve ter pelo menos 2 caracteres")]
    public string Name { get; set; } = string.Empty;

    /// <summary>
    /// Email do usuário
    /// </summary>
    [Required(ErrorMessage = "Email é obrigatório")]
    [EmailAddress(ErrorMessage = "Email deve ter formato válido")]
    public string Email { get; set; } = string.Empty;

    /// <summary>
    /// Senha do usuário
    /// </summary>
    [Required(ErrorMessage = "Senha é obrigatória")]
    [MinLength(6, ErrorMessage = "Senha deve ter pelo menos 6 caracteres")]
    public string Password { get; set; } = string.Empty;

    /// <summary>
    /// Confirmação da senha
    /// </summary>
    [Required(ErrorMessage = "Confirmação de senha é obrigatória")]
    [Compare(nameof(Password), ErrorMessage = "Senhas não coincidem")]
    public string ConfirmPassword { get; set; } = string.Empty;
}

/// <summary>
/// DTO para requisição de refresh token
/// </summary>
public class RefreshTokenRequest
{
    /// <summary>
    /// Refresh token
    /// </summary>
    [Required(ErrorMessage = "Refresh token é obrigatório")]
    public string RefreshToken { get; set; } = string.Empty;
}

/// <summary>
/// DTO para resposta de autenticação
/// </summary>
public class AuthResponse
{
    /// <summary>
    /// Token JWT
    /// </summary>
    public string Token { get; set; } = string.Empty;

    /// <summary>
    /// Refresh token
    /// </summary>
    public string RefreshToken { get; set; } = string.Empty;

    /// <summary>
    /// Data de expiração do token
    /// </summary>
    public DateTime ExpiresAt { get; set; }

    /// <summary>
    /// Informações do usuário
    /// </summary>
    public UserInfo User { get; set; } = new();
}

/// <summary>
/// DTO para informações do usuário
/// </summary>
public class UserInfo
{
    /// <summary>
    /// ID do usuário
    /// </summary>
    public int Id { get; set; }

    /// <summary>
    /// Nome do usuário
    /// </summary>
    public string Name { get; set; } = string.Empty;

    /// <summary>
    /// Email do usuário
    /// </summary>
    public string Email { get; set; } = string.Empty;

    /// <summary>
    /// Tipo do usuário
    /// </summary>
    public string UserType { get; set; } = string.Empty;

    /// <summary>
    /// Nível do analista (se aplicável)
    /// </summary>
    public string? AnalystLevel { get; set; }
}
