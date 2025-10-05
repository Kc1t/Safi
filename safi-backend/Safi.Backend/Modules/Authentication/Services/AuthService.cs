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

    /// <summary>
    /// Lista todos os usuários (apenas para debug)
    /// </summary>
    /// <returns>Lista de usuários</returns>
    Task<IEnumerable<User>> GetAllUsersAsync();
}

/// <summary>
/// Implementação do serviço de autenticação
/// </summary>
public class AuthService : IAuthService
{
    private readonly IRepository<User> _userRepository;
    private readonly IRepository<Department> _departmentRepository;
    private readonly ILogger<AuthService> _logger;
    private readonly IConfiguration _configuration;

    public AuthService(
        IRepository<User> userRepository,
        IRepository<Department> departmentRepository,
        ILogger<AuthService> logger,
        IConfiguration configuration)
    {
        _userRepository = userRepository;
        _departmentRepository = departmentRepository;
        _logger = logger;
        _configuration = configuration;
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
                ExpiresAt = DateTime.UtcNow.AddMinutes(15),
                User = new UserInfo
                {
                    Id = user.Id,
                    Name = user.Name,
                    Email = user.Email,
                    UserType = user.UserType.ToString(),
                    AnalystLevel = user.AnalystLevel?.ToString()
                }
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
                ExpiresAt = DateTime.UtcNow.AddMinutes(15),
                User = new UserInfo
                {
                    Id = createdUser.Id,
                    Name = createdUser.Name,
                    Email = createdUser.Email,
                    UserType = createdUser.UserType.ToString(),
                    AnalystLevel = createdUser.AnalystLevel?.ToString()
                }
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro durante registro para email: {Email}", request.Email);
            return null;
        }
    }

    public Task<AuthResponse?> RefreshTokenAsync(RefreshTokenRequest request)
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

            return Task.FromResult<AuthResponse?>(new AuthResponse
            {
                Token = token,
                RefreshToken = refreshToken,
                ExpiresAt = DateTime.UtcNow.AddMinutes(15)
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro durante refresh token");
            return Task.FromResult<AuthResponse?>(null);
        }
    }

    public Task<bool> LogoutAsync(int userId)
    {
        try
        {
            _logger.LogInformation("Logout realizado para usuário: {UserId}", userId);
            
            // TODO: Implementar invalidação de tokens
            // Por enquanto, apenas loga o logout
            
            return Task.FromResult(true);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro durante logout para usuário: {UserId}", userId);
            return Task.FromResult(false);
        }
    }

    public Task<bool> ValidateTokenAsync(string token)
    {
        try
        {
            // TODO: Implementar validação JWT real
            // Por enquanto, aceita qualquer token não vazio
            return Task.FromResult(!string.IsNullOrEmpty(token));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro durante validação de token");
            return Task.FromResult(false);
        }
    }

    public async Task<User?> GetUserByEmailAsync(string email)
    {
        _logger.LogInformation("Buscando usuário por email: {Email}", email);
        
        var user = await _userRepository.FirstOrDefaultAsync(u => u.Email == email);
        
        if (user != null)
        {
            _logger.LogInformation("Usuário encontrado: {UserId} - {UserName} - {UserEmail}", user.Id, user.Name, user.Email);
        }
        else
        {
            _logger.LogWarning("Usuário não encontrado para email: {Email}", email);
        }
        
        return user;
    }

    public async Task<IEnumerable<User>> GetAllUsersAsync()
    {
        _logger.LogInformation("Buscando todos os usuários");
        
        var users = await _userRepository.GetAllAsync();
        
        _logger.LogInformation("Total de usuários encontrados: {Count}", users.Count());
        
        return users;
    }

    private string GenerateJwtToken(User? user)
    {
        if (user == null)
        {
            return $"mock_jwt_token_0_{DateTime.UtcNow.Ticks}";
        }

        try
        {
            var jwtSettings = _configuration.GetSection("JwtSettings");
            var secretKey = jwtSettings["SecretKey"] ?? "default_secret_key_for_development";
            var issuer = jwtSettings["Issuer"] ?? "SAFI";
            var audience = jwtSettings["Audience"] ?? "SAFI";

            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.UTF8.GetBytes(secretKey);

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.Name),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim("UserType", user.UserType.ToString()),
                new Claim("DepartmentId", user.DepartmentId?.ToString() ?? ""),
                new Claim("AnalystLevel", user.AnalystLevel?.ToString() ?? "")
            };

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddMinutes(15),
                Issuer = issuer,
                Audience = audience,
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao gerar JWT token para usuário: {UserId}", user.Id);
            return $"mock_jwt_token_{user.Id}_{DateTime.UtcNow.Ticks}";
        }
    }

    private string GenerateRefreshToken()
    {
        // TODO: Implementar geração de refresh token real
        // Por enquanto, retorna um token mock
        return $"mock_refresh_token_{DateTime.UtcNow.Ticks}";
    }
}
