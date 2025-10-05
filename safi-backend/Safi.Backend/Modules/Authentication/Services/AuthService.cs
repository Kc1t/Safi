using Microsoft.EntityFrameworkCore;
using Safi.Backend.Core.Entities;
using Safi.Backend.Core.Enums;
using Safi.Backend.Core.Interfaces;
using Safi.Backend.Modules.Authentication.DTOs;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace Safi.Backend.Modules.Authentication.Services;

/// <summary>
/// Interface para serviço de autenticação
/// </summary>
public interface IAuthService
{
    /// <summary>
    /// Autentica um usuário
    /// </summary>
    /// <param name="request">Dados de login</param>
    /// <returns>Resposta de autenticação</returns>
    Task<AuthResponse?> LoginAsync(LoginRequest request);

    /// <summary>
    /// Registra um novo usuário
    /// </summary>
    /// <param name="request">Dados de registro</param>
    /// <returns>Resposta de autenticação</returns>
    Task<AuthResponse?> RegisterAsync(RegisterRequest request);

    /// <summary>
    /// Renova o token de acesso
    /// </summary>
    /// <param name="request">Dados do refresh token</param>
    /// <returns>Nova resposta de autenticação</returns>
    Task<AuthResponse?> RefreshTokenAsync(RefreshTokenRequest request);

    /// <summary>
    /// Faz logout do usuário
    /// </summary>
    /// <param name="userId">ID do usuário</param>
    /// <returns>True se logout realizado com sucesso</returns>
    Task<bool> LogoutAsync(int userId);

    /// <summary>
    /// Valida se um token é válido
    /// </summary>
    /// <param name="token">Token a ser validado</param>
    /// <returns>True se válido</returns>
    Task<bool> ValidateTokenAsync(string token);

    /// <summary>
    /// Obtém usuário por email
    /// </summary>
    /// <param name="email">Email do usuário</param>
    /// <returns>Usuário encontrado ou null</returns>
    Task<User?> GetUserByEmailAsync(string email);
}

/// <summary>
/// Implementação do serviço de autenticação
/// </summary>
public class AuthService : IAuthService
{
    private readonly IRepository<User> _userRepository;
    private readonly IRepository<Department> _departmentRepository;
    private readonly ILogger<AuthService> _logger;

    public AuthService(
        IRepository<User> userRepository,
        IRepository<Department> departmentRepository,
        ILogger<AuthService> logger)
    {
        _userRepository = userRepository;
        _departmentRepository = departmentRepository;
        _logger = logger;
    }

    public async Task<AuthResponse?> LoginAsync(LoginRequest request)
    {
        try
        {
            _logger.LogInformation("Tentativa de login para email: {Email}", request.Email);

            var user = await GetUserByEmailAsync(request.Email);
            if (user == null)
            {
                _logger.LogWarning("Usuário não encontrado para email: {Email}", request.Email);
                return null;
            }

            // TODO: Implementar verificação de senha com hash
            // Por enquanto, aceita qualquer senha para usuários existentes
            if (string.IsNullOrEmpty(request.Password))
            {
                _logger.LogWarning("Senha não fornecida para email: {Email}", request.Email);
                return null;
            }

            // Gerar tokens JWT
            var token = GenerateJwtToken(user);
            var refreshToken = GenerateRefreshToken();

            _logger.LogInformation("Login realizado com sucesso para usuário: {UserId}", user.Id);

            return new AuthResponse
            {
                Token = token,
                RefreshToken = refreshToken,
                ExpiresAt = DateTime.UtcNow.AddMinutes(15)
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro durante login para email: {Email}", request.Email);
            return null;
        }
    }

    public async Task<AuthResponse?> RegisterAsync(RegisterRequest request)
    {
        try
        {
            _logger.LogInformation("Tentativa de registro para email: {Email}", request.Email);

            // Verificar se usuário já existe
            var existingUser = await GetUserByEmailAsync(request.Email);
            if (existingUser != null)
            {
                _logger.LogWarning("Usuário já existe para email: {Email}", request.Email);
                return null;
            }

            // Criar novo usuário
            var user = new User
            {
                Name = request.Name,
                Email = request.Email,
                UserType = UserType.Common, // Por padrão, usuários são comuns
                CreatedAt = DateTime.UtcNow
            };

            // TODO: Implementar hash da senha
            // Por enquanto, não armazenamos senha

            var createdUser = await _userRepository.AddAsync(user);

            // Gerar tokens JWT
            var token = GenerateJwtToken(createdUser);
            var refreshToken = GenerateRefreshToken();

            _logger.LogInformation("Registro realizado com sucesso para usuário: {UserId}", createdUser.Id);

            return new AuthResponse
            {
                Token = token,
                RefreshToken = refreshToken,
                ExpiresAt = DateTime.UtcNow.AddMinutes(15)
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro durante registro para email: {Email}", request.Email);
            return null;
        }
    }

    public async Task<AuthResponse?> RefreshTokenAsync(RefreshTokenRequest request)
    {
        try
        {
            _logger.LogInformation("Tentativa de refresh token");

            // TODO: Implementar validação do refresh token
            // Por enquanto, gera um novo token

            // Gerar novos tokens
            var token = GenerateJwtToken(null); // TODO: Obter usuário do refresh token
            var refreshToken = GenerateRefreshToken();

            _logger.LogInformation("Refresh token realizado com sucesso");

            return new AuthResponse
            {
                Token = token,
                RefreshToken = refreshToken,
                ExpiresAt = DateTime.UtcNow.AddMinutes(15)
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro durante refresh token");
            return null;
        }
    }

    public async Task<bool> LogoutAsync(int userId)
    {
        try
        {
            _logger.LogInformation("Logout realizado para usuário: {UserId}", userId);
            
            // TODO: Implementar invalidação de tokens
            // Por enquanto, apenas loga o logout
            
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro durante logout para usuário: {UserId}", userId);
            return false;
        }
    }

    public async Task<bool> ValidateTokenAsync(string token)
    {
        try
        {
            // TODO: Implementar validação JWT real
            // Por enquanto, aceita qualquer token não vazio
            return !string.IsNullOrEmpty(token);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro durante validação de token");
            return false;
        }
    }

    public async Task<User?> GetUserByEmailAsync(string email)
    {
        return await _userRepository.FirstOrDefaultAsync(u => u.Email == email);
    }

    private string GenerateJwtToken(User? user)
    {
        // TODO: Implementar geração JWT real
        // Por enquanto, retorna um token mock
        return $"mock_jwt_token_{user?.Id ?? 0}_{DateTime.UtcNow.Ticks}";
    }

    private string GenerateRefreshToken()
    {
        // TODO: Implementar geração de refresh token real
        // Por enquanto, retorna um token mock
        return $"mock_refresh_token_{DateTime.UtcNow.Ticks}";
    }
}
