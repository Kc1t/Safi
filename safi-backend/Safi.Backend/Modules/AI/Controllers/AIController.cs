using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Safi.Backend.Modules.AI.DTOs;
using Safi.Backend.Modules.AI.Services;
using Safi.Backend.Shared.Attributes;

namespace Safi.Backend.Modules.AI.Controllers;

/// <summary>
/// Controller para funcionalidades de IA
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class AIController : ControllerBase
{
    private readonly IAIService _aiService;
    private readonly ILogger<AIController> _logger;

    public AIController(IAIService aiService, ILogger<AIController> logger)
    {
        _aiService = aiService;
        _logger = logger;
    }

    /// <summary>
    /// Analisa um ticket e sugere categoria e prioridade
    /// </summary>
    /// <param name="request">Dados do ticket para análise</param>
    /// <returns>Análise da IA</returns>
    [HttpPost("analyze-ticket")]
    [IsPublic]
    public async Task<IActionResult> AnalyzeTicket([FromBody] AIAnalysisRequest request)
    {
        try
        {
            _logger.LogInformation("Análise de IA solicitada para ticket: {Title}", request.Title);

            var analysis = await _aiService.AnalyzeTicketAsync(request);
            if (analysis == null)
            {
                _logger.LogWarning("Falha na análise de IA para ticket: {Title}", request.Title);
                return BadRequest(new { message = "Erro na análise de IA" });
            }

            _logger.LogInformation("Análise de IA concluída para ticket: {Title}", request.Title);
            return Ok(analysis);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro durante análise de IA para ticket: {Title}", request.Title);
            return StatusCode(500, new { message = "Erro interno do servidor" });
        }
    }

    /// <summary>
    /// Gera sugestão de resposta para um ticket
    /// </summary>
    /// <param name="request">Dados para geração de resposta</param>
    /// <returns>Sugestão de resposta</returns>
    [HttpPost("suggest-response")]
    [IsPublic]
    public async Task<IActionResult> SuggestResponse([FromBody] AIResponseRequest request)
    {
        try
        {
            _logger.LogInformation("Sugestão de resposta solicitada para ticket: {TicketId}", request.TicketId);

            var suggestion = await _aiService.GenerateResponseSuggestionAsync(request);
            if (suggestion == null)
            {
                _logger.LogWarning("Falha na geração de sugestão para ticket: {TicketId}", request.TicketId);
                return BadRequest(new { message = "Erro na geração de sugestão" });
            }

            _logger.LogInformation("Sugestão de resposta gerada para ticket: {TicketId}", request.TicketId);
            return Ok(suggestion);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro durante geração de sugestão para ticket: {TicketId}", request.TicketId);
            return StatusCode(500, new { message = "Erro interno do servidor" });
        }
    }

    /// <summary>
    /// Analisa sentimento de uma mensagem
    /// </summary>
    /// <param name="message">Mensagem para análise</param>
    /// <returns>Análise de sentimento</returns>
    [HttpPost("analyze-sentiment")]
    [IsPublic]
    public async Task<IActionResult> AnalyzeSentiment([FromBody] string message)
    {
        try
        {
            _logger.LogInformation("Análise de sentimento solicitada");

            var analysis = await _aiService.AnalyzeSentimentAsync(message);
            if (analysis == null)
            {
                _logger.LogWarning("Falha na análise de sentimento");
                return BadRequest(new { message = "Erro na análise de sentimento" });
            }

            _logger.LogInformation("Análise de sentimento concluída: {Sentiment}", analysis.Sentiment);
            return Ok(analysis);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro durante análise de sentimento");
            return StatusCode(500, new { message = "Erro interno do servidor" });
        }
    }

    /// <summary>
    /// Verifica se o serviço de IA está disponível
    /// </summary>
    /// <returns>Status do serviço</returns>
    [HttpGet("status")]
    [IsPublic]
    public async Task<IActionResult> GetServiceStatus()
    {
        try
        {
            _logger.LogInformation("Verificação de status do serviço de IA solicitada");

            var isAvailable = await _aiService.IsServiceAvailableAsync();

            var response = new
            {
                service = "AI Service",
                status = isAvailable ? "Available" : "Unavailable",
                timestamp = DateTime.UtcNow,
                version = "1.0.0-mock"
            };

            _logger.LogInformation("Status do serviço de IA: {Status}", response.status);
            return Ok(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao verificar status do serviço de IA");
            return StatusCode(500, new { message = "Erro interno do servidor" });
        }
    }
}
