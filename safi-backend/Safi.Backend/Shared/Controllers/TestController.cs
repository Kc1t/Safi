using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace Safi.Backend.Shared.Controllers;

/// <summary>
/// Controller de teste para verificar se as rotas estão funcionando
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class TestController : ControllerBase
{
    private readonly ILogger<TestController> _logger;

    public TestController(ILogger<TestController> logger)
    {
        _logger = logger;
    }

    /// <summary>
    /// Endpoint de teste simples
    /// </summary>
    /// <returns>Mensagem de teste</returns>
    [HttpGet]
    public IActionResult Get()
    {
        _logger.LogInformation("Test endpoint accessed");
        
        return Ok(new
        {
            message = "Test endpoint funcionando!",
            timestamp = DateTime.UtcNow,
            status = "OK"
        });
    }

    /// <summary>
    /// Endpoint de teste com parâmetro
    /// </summary>
    /// <param name="id">ID de teste</param>
    /// <returns>Mensagem com ID</returns>
    [HttpGet("{id}")]
    public IActionResult GetById(int id)
    {
        _logger.LogInformation("Test endpoint with ID accessed: {Id}", id);
        
        return Ok(new
        {
            message = $"Test endpoint com ID {id} funcionando!",
            id = id,
            timestamp = DateTime.UtcNow,
            status = "OK"
        });
    }
}
