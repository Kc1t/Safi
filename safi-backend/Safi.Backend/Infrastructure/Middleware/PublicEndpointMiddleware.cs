using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using Safi.Backend.Core.Entities;
using Safi.Backend.Core.Enums;
using Safi.Backend.Shared.Attributes;
using System.Security.Claims;

namespace Safi.Backend.Infrastructure.Middleware;

/// <summary>
/// Middleware para interceptar endpoints públicos e injetar usuário mockado
/// </summary>
public class PublicEndpointMiddleware
{
    private readonly RequestDelegate _next;

    public PublicEndpointMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        var endpoint = context.GetEndpoint();
        
        if (endpoint?.Metadata.GetMetadata<IsPublicAttribute>() != null)
        {
            // Criar usuário mockado para endpoints públicos
            var mockUser = CreateMockUser();
            
            // Criar claims do usuário mockado
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, mockUser.Id.ToString()),
                new Claim(ClaimTypes.Name, mockUser.Name),
                new Claim(ClaimTypes.Email, mockUser.Email),
                new Claim("UserType", mockUser.UserType.ToString()),
                new Claim("DepartmentId", mockUser.DepartmentId?.ToString() ?? ""),
                new Claim("AnalystLevel", mockUser.AnalystLevel?.ToString() ?? "")
            };

            var identity = new ClaimsIdentity(claims, "MockAuthentication");
            var principal = new ClaimsPrincipal(identity);
            
            context.User = principal;
        }

        await _next(context);
    }

    private static User CreateMockUser()
    {
        return new User
        {
            Id = 999, // ID especial para usuário mockado
            Name = "Usuário Mockado",
            Email = "mock@safi.com",
            UserType = UserType.Common,
            DepartmentId = 1, // TI - Tecnologia da Informação
            AnalystLevel = null,
            CreatedAt = DateTime.UtcNow
        };
    }
}

