using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace Safi.Backend.Shared.Controllers;

/// <summary>
/// Controller para testes básicos e verificação de saúde da API
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class HealthController : ControllerBase
{
    private readonly ILogger<HealthController> _logger;

    public HealthController(ILogger<HealthController> logger)
    {
        _logger = logger;
    }

    /// <summary>
    /// Endpoint Hello World para verificar se a API está funcionando
    /// </summary>
    /// <returns>Mensagem de saudação com informações básicas</returns>
    [HttpGet]
    public IActionResult Get()
    {
        _logger.LogInformation("Hello World endpoint accessed");
        
        return Ok(new
        {
            message = "Hello World! SAFI Backend API está funcionando! 🚀",
            timestamp = DateTime.UtcNow,
            version = "1.0.0",
            environment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") ?? "Development"
        });
    }

    /// <summary>
    /// Endpoint para verificar saúde da API
    /// </summary>
    /// <returns>Status de saúde da aplicação</returns>
    [HttpGet("health")]
    public IActionResult Health()
    {
        _logger.LogInformation("Health check endpoint accessed");
        
        return Ok(new
        {
            status = "Healthy",
            timestamp = DateTime.UtcNow,
            uptime = Environment.TickCount64,
            version = "1.0.0"
        });
    }
}
