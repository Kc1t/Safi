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
    private readonly IConfiguration _configuration;

    public AIController(IAIService aiService, ILogger<AIController> logger, IConfiguration configuration)
    {
        _aiService = aiService;
        _logger = logger;
        _configuration = configuration;
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

    /// <summary>
    /// Teste simples com mensagem direta para API Gemini
    /// </summary>
    /// <param name="message">Mensagem para enviar à IA</param>
    /// <returns>Resposta da IA</returns>
    [HttpPost("simple-test")]
    [Microsoft.AspNetCore.Authorization.Authorize]
    public async Task<IActionResult> SimpleTest([FromBody] SimpleTestRequest request)
    {
        try
        {
            _logger.LogInformation("Teste simples solicitado: {Message}", request.Message);

            // Criar request de análise com a mensagem
            var analysisRequest = new AIAnalysisRequest
            {
                Title = request.Message,
                Description = request.Message
            };

            var analysis = await _aiService.AnalyzeTicketAsync(analysisRequest);
            
            if (analysis != null)
            {
                return Ok(new
                {
                    message = "Teste realizado com sucesso",
                    userMessage = request.Message,
                    aiResponse = new
                    {
                        category = analysis.SuggestedCategory,
                        priority = analysis.SuggestedPriority,
                        confidence = analysis.Confidence,
                        reasoning = analysis.Reasoning,
                        processingTime = analysis.ProcessingTimeMs
                    },
                    timestamp = DateTime.UtcNow
                });
            }
            else
            {
                return BadRequest(new { message = "Falha no teste simples" });
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro durante teste simples");
            return StatusCode(500, new { message = "Erro interno do servidor" });
        }
    }

    /// <summary>
    /// Obter estatísticas do sistema de IA
    /// </summary>
    /// <returns>Estatísticas do sistema</returns>
    [HttpGet("stats")]
    [Microsoft.AspNetCore.Authorization.Authorize]
    public async Task<IActionResult> GetAIStats()
    {
        try
        {
            var isAvailable = await _aiService.IsServiceAvailableAsync();
            
            // Verificar se está em modo mock
            var useMockOnly = _configuration.GetValue<bool>("ExternalServices:GeminiApi:UseMockOnly", false);
            
            return Ok(new
            {
                service = useMockOnly ? "Mock AI Service" : "Gemini API",
                isAvailable = isAvailable,
                mode = useMockOnly ? "development" : "production",
                timestamp = DateTime.UtcNow,
                features = new
                {
                    retryWithBackoff = !useMockOnly,
                    circuitBreaker = !useMockOnly,
                    responseCache = true,
                    rateLimiting = !useMockOnly,
                    mockAnalysis = true
                },
                message = useMockOnly 
                    ? "Sistema de IA em modo desenvolvimento (mock apenas)" 
                    : (isAvailable ? "Sistema de IA operacional" : "Sistema de IA com limitações temporárias")
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao obter estatísticas da IA");
            return StatusCode(500, new { message = "Erro interno do servidor" });
        }
    }

    /// <summary>
    /// Chat simples com IA - apenas HTTP
    /// </summary>
    /// <param name="message">Mensagem do usuário</param>
    /// <returns>Resposta da IA</returns>
    [HttpPost("chat")]
    [Microsoft.AspNetCore.Authorization.Authorize]
    public async Task<IActionResult> SimpleChat([FromBody] SimpleChatRequest request)
    {
        try
        {
            _logger.LogInformation("Chat simples solicitado: {Message}", request.Message);

            // Criar request de análise
            var analysisRequest = new AIAnalysisRequest
            {
                Title = request.Message,
                Description = request.Message
            };

            // Analisar com IA
            var analysis = await _aiService.AnalyzeTicketAsync(analysisRequest);
            
            if (analysis != null)
            {
                // Gerar resposta baseada na análise
                string response = GenerateResponse(analysis);
                
                return Ok(new
                {
                    message = response,
                    analysis = analysis,
                    timestamp = DateTime.UtcNow,
                    type = "ai_response"
                });
            }
            else
            {
                return Ok(new
                {
                    message = "Desculpe, não consegui processar sua mensagem no momento.",
                    timestamp = DateTime.UtcNow,
                    type = "error"
                });
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro no chat simples");
            return StatusCode(500, new { message = "Erro interno do servidor" });
        }
    }

    /// <summary>
    /// Gerar resposta baseada na análise
    /// </summary>
    private string GenerateResponse(AIAnalysisResponse analysis)
    {
        return analysis.SuggestedCategory switch
        {
            "Hardware" => $"🔧 Identifiquei um problema de hardware. Com base na análise, sugiro verificar os componentes físicos do equipamento. Prioridade: {analysis.SuggestedPriority}",
            "Software" => $"💻 Problema de software detectado. Vamos resolver isso passo a passo. Recomendo verificar atualizações e configurações. Prioridade: {analysis.SuggestedPriority}",
            "Rede" => $"🌐 Problema de conectividade identificado. Vou guiá-lo através das verificações de rede. Prioridade: {analysis.SuggestedPriority}",
            "Email" => $"📧 Problema de email detectado. Vamos verificar as configurações da sua conta e servidor. Prioridade: {analysis.SuggestedPriority}",
            "Autenticação" => $"🔐 Problema de acesso identificado. Vou ajudá-lo a resolver questões de login e senha. Prioridade: {analysis.SuggestedPriority}",
            _ => $"📋 Analisei sua solicitação. Com base na análise, sugiro uma abordagem personalizada para seu caso. Prioridade: {analysis.SuggestedPriority}"
        };
    }

    /// <summary>
    /// Chat público com contexto estruturado
    /// </summary>
    /// <param name="request">Dados do chat público</param>
    /// <returns>Resposta da IA</returns>
    [HttpPost("public-assistant")]
    [IsPublic]
    public async Task<IActionResult> PublicAssistant([FromBody] PublicChatRequest request)
    {
        try
        {
            _logger.LogInformation("Chat público solicitado por: {Nome} ({Email})", request.Nome, request.Email);

            var response = await _aiService.ProcessPublicChatAsync(request);

            if (response != null)
            {
                _logger.LogInformation("Chat público processado com sucesso em {ProcessingTime}ms", response.ProcessingTimeMs);
                return Ok(response);
            }
            else
            {
                _logger.LogWarning("Falha ao processar chat público");
                return Ok(new PublicChatResponse
                {
                    Result = "Desculpe, não consegui processar sua mensagem no momento. Por favor, tente novamente.",
                    Timestamp = DateTime.UtcNow,
                    ProcessingTimeMs = 0
                });
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro no chat público");
            return StatusCode(500, new { message = "Erro interno do servidor" });
        }
    }
}

/// <summary>
/// Request simples para chat
/// </summary>
public class SimpleChatRequest
{
    public string Message { get; set; } = string.Empty;
}

/// <summary>
/// Request para teste simples
/// </summary>
public class SimpleTestRequest
{
    public string Message { get; set; } = string.Empty;
}
