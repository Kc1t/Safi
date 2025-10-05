using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Safi.Backend.Modules.Authentication.DTOs;
using Safi.Backend.Modules.Authentication.Services;

namespace Safi.Backend.Modules.Authentication.Controllers;

/// <summary>
/// Controller para autenticação e autorização
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;
    private readonly ILogger<AuthController> _logger;

    public AuthController(IAuthService authService, ILogger<AuthController> logger)
    {
        _authService = authService;
        _logger = logger;
    }

    /// <summary>
    /// Login de analista
    /// </summary>
    /// <param name="request">Credenciais de login</param>
    /// <returns>Token JWT e informações do usuário</returns>
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        try
        {
            _logger.LogInformation("Tentativa de login para email: {Email}", request.Email);

            var response = await _authService.LoginAsync(request);
            if (response == null)
            {
                _logger.LogWarning("Login falhou para email: {Email}", request.Email);
                return Unauthorized(new { message = "Email ou senha inválidos" });
            }

            _logger.LogInformation("Login realizado com sucesso para email: {Email}", request.Email);
            return Ok(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro durante login para email: {Email}", request.Email);
            return StatusCode(500, new { message = "Erro interno do servidor" });
        }
    }

    /// <summary>
    /// Registro de novo usuário
    /// </summary>
    /// <param name="request">Dados do novo usuário</param>
    /// <returns>Confirmação de registro</returns>
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request)
    {
        try
        {
            _logger.LogInformation("Tentativa de registro para email: {Email}", request.Email);

            var response = await _authService.RegisterAsync(request);
            if (response == null)
            {
                _logger.LogWarning("Registro falhou para email: {Email}", request.Email);
                return BadRequest(new { message = "Email já existe ou dados inválidos" });
            }

            _logger.LogInformation("Registro realizado com sucesso para email: {Email}", request.Email);
            return Ok(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro durante registro para email: {Email}", request.Email);
            return StatusCode(500, new { message = "Erro interno do servidor" });
        }
    }

    /// <summary>
    /// Refresh do token JWT
    /// </summary>
    /// <param name="request">Refresh token</param>
    /// <returns>Novo token JWT</returns>
    [HttpPost("refresh")]
    public async Task<IActionResult> Refresh([FromBody] RefreshTokenRequest request)
    {
        try
        {
            _logger.LogInformation("Tentativa de refresh token");

            var response = await _authService.RefreshTokenAsync(request);
            if (response == null)
            {
                _logger.LogWarning("Refresh token falhou");
                return Unauthorized(new { message = "Refresh token inválido" });
            }

            _logger.LogInformation("Refresh token realizado com sucesso");
            return Ok(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro durante refresh token");
            return StatusCode(500, new { message = "Erro interno do servidor" });
        }
    }

    /// <summary>
    /// Logout do usuário
    /// </summary>
    /// <returns>Confirmação de logout</returns>
    [HttpPost("logout")]
    public async Task<IActionResult> Logout()
    {
        try
        {
            // TODO: Obter userId do token JWT
            var userId = 1; // Mock para desenvolvimento

            _logger.LogInformation("Tentativa de logout para usuário: {UserId}", userId);

            var success = await _authService.LogoutAsync(userId);
            if (!success)
            {
                _logger.LogWarning("Logout falhou para usuário: {UserId}", userId);
                return BadRequest(new { message = "Erro durante logout" });
            }

            _logger.LogInformation("Logout realizado com sucesso para usuário: {UserId}", userId);
            return Ok(new { message = "Logout realizado com sucesso" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro durante logout");
            return StatusCode(500, new { message = "Erro interno do servidor" });
        }
    }

    /// <summary>
    /// Endpoint de debug para listar usuários (apenas para desenvolvimento)
    /// </summary>
    /// <returns>Lista de usuários</returns>
    [HttpGet("debug/users")]
    public async Task<IActionResult> GetUsersDebug()
    {
        try
        {
            var users = await _authService.GetAllUsersAsync();
            
            var response = users.Select(u => new
            {
                id = u.Id,
                name = u.Name,
                email = u.Email,
                userType = u.UserType.ToString(),
                departmentId = u.DepartmentId,
                createdAt = u.CreatedAt
            });

            return Ok(new
            {
                message = "Usuários encontrados",
                count = users.Count(),
                users = response
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao listar usuários para debug");
            return StatusCode(500, new { message = "Erro interno do servidor" });
        }
    }
}
