using Safi.Backend.Modules.AI.DTOs;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Configuration;
using System.Text.Json;

namespace Safi.Backend.Modules.AI.Services;

/// <summary>
/// Implementação do serviço de IA usando Gemini API
/// </summary>
public class AIService : IAIService
{
    private readonly HttpClient _httpClient;
    private readonly ILogger<AIService> _logger;
    private readonly IConfiguration _configuration;

    public AIService(HttpClient httpClient, ILogger<AIService> logger, IConfiguration configuration)
    {
        _httpClient = httpClient;
        _logger = logger;
        _configuration = configuration;
    }

    public async Task<AIAnalysisResponse?> AnalyzeTicketAsync(AIAnalysisRequest request)
    {
        try
        {
            _logger.LogInformation("Iniciando análise de IA para ticket: {Title}", request.Title);

            // TODO: Implementar integração real com Gemini API
            // Por enquanto, retorna análise mock baseada em palavras-chave
            
            var response = new AIAnalysisResponse
            {
                SuggestedCategory = AnalyzeCategory(request.Title, request.Description),
                SuggestedPriority = AnalyzePriority(request.Title, request.Description),
                Confidence = 0.75f,
                Reasoning = "Análise baseada em palavras-chave (implementação mock)",
                ProcessingTimeMs = 150
            };

            _logger.LogInformation("Análise de IA concluída para ticket: {Title}", request.Title);
            return response;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro durante análise de IA para ticket: {Title}", request.Title);
            return null;
        }
    }

    public async Task<AIResponseSuggestion?> GenerateResponseSuggestionAsync(AIResponseRequest request)
    {
        try
        {
            _logger.LogInformation("Gerando sugestão de resposta para ticket: {TicketId}", request.TicketId);

            // TODO: Implementar integração real com Gemini API
            // Por enquanto, retorna sugestão mock baseada no tipo de problema
            
            var suggestion = new AIResponseSuggestion
            {
                SuggestedResponse = GenerateMockResponse(request.IssueType, request.UserMessage),
                Confidence = 0.80f,
                Reasoning = "Sugestão baseada em templates pré-definidos (implementação mock)",
                ProcessingTimeMs = 200
            };

            _logger.LogInformation("Sugestão de resposta gerada para ticket: {TicketId}", request.TicketId);
            return suggestion;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao gerar sugestão de resposta para ticket: {TicketId}", request.TicketId);
            return null;
        }
    }

    public async Task<AISentimentAnalysis?> AnalyzeSentimentAsync(string message)
    {
        try
        {
            _logger.LogInformation("Analisando sentimento da mensagem");

            // TODO: Implementar análise real de sentimento
            // Por enquanto, análise simples baseada em palavras-chave
            
            var sentiment = AnalyzeSentimentMock(message);
            
            var analysis = new AISentimentAnalysis
            {
                Sentiment = sentiment,
                Confidence = 0.70f,
                Reasoning = "Análise baseada em palavras-chave (implementação mock)",
                ProcessingTimeMs = 100
            };

            _logger.LogInformation("Análise de sentimento concluída: {Sentiment}", sentiment);
            return analysis;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro durante análise de sentimento");
            return null;
        }
    }

    public async Task<bool> IsServiceAvailableAsync()
    {
        try
        {
            // TODO: Implementar verificação real da API Gemini
            // Por enquanto, sempre retorna true para desenvolvimento
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao verificar disponibilidade do serviço de IA");
            return false;
        }
    }

    #region Métodos Mock (para desenvolvimento)

    private string AnalyzeCategory(string title, string description)
    {
        var text = $"{title} {description}".ToLower();
        
        if (text.Contains("login") || text.Contains("senha") || text.Contains("acesso"))
            return "Autenticação";
        if (text.Contains("email") || text.Contains("outlook"))
            return "Email";
        if (text.Contains("impressora") || text.Contains("print"))
            return "Hardware";
        if (text.Contains("internet") || text.Contains("rede") || text.Contains("wifi"))
            return "Rede";
        if (text.Contains("software") || text.Contains("programa") || text.Contains("aplicativo"))
            return "Software";
        
        return "Outros";
    }

    private string AnalyzePriority(string title, string description)
    {
        var text = $"{title} {description}".ToLower();
        
        if (text.Contains("urgente") || text.Contains("crítico") || text.Contains("emergência"))
            return "Urgent";
        if (text.Contains("importante") || text.Contains("prioridade"))
            return "High";
        if (text.Contains("baixa") || text.Contains("não urgente"))
            return "Low";
        
        return "Medium";
    }

    private string GenerateMockResponse(string issueType, string userMessage)
    {
        return issueType.ToLower() switch
        {
            "autenticação" => "Olá! Vou ajudá-lo com o problema de autenticação. Primeiro, vamos verificar se suas credenciais estão corretas...",
            "email" => "Entendo que você está com problemas de email. Vamos verificar as configurações da sua conta...",
            "hardware" => "Vou ajudá-lo com o problema de hardware. Primeiro, vamos fazer alguns testes básicos...",
            "rede" => "Vamos resolver o problema de conectividade. Primeiro, vamos verificar sua conexão de rede...",
            "software" => "Entendo o problema com o software. Vamos verificar se há atualizações disponíveis...",
            _ => "Obrigado por entrar em contato! Vou analisar seu problema e fornecer uma solução adequada."
        };
    }

    private string AnalyzeSentimentMock(string message)
    {
        var text = message.ToLower();
        
        if (text.Contains("urgente") || text.Contains("problema") || text.Contains("erro"))
            return "Negative";
        if (text.Contains("obrigado") || text.Contains("obrigada") || text.Contains("agradeço"))
            return "Positive";
        
        return "Neutral";
    }

    #endregion
}
