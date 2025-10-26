using Safi.Backend.Modules.AI.DTOs;

namespace Safi.Backend.Modules.AI.Services;

/// <summary>
/// Interface para serviço de IA
/// </summary>
public interface IAIService
{
    /// <summary>
    /// Analisa um ticket e sugere categoria e prioridade
    /// </summary>
    /// <param name="request">Dados do ticket para análise</param>
    /// <returns>Sugestões de IA</returns>
    Task<AIAnalysisResponse?> AnalyzeTicketAsync(AIAnalysisRequest request);

    /// <summary>
    /// Gera sugestão de resposta para um ticket
    /// </summary>
    /// <param name="request">Dados para geração de resposta</param>
    /// <returns>Sugestão de resposta</returns>
    Task<AIResponseSuggestion?> GenerateResponseSuggestionAsync(AIResponseRequest request);

    /// <summary>
    /// Analisa sentimento de uma mensagem
    /// </summary>
    /// <param name="message">Mensagem para análise</param>
    /// <returns>Análise de sentimento</returns>
    Task<AISentimentAnalysis?> AnalyzeSentimentAsync(string message);

    /// <summary>
    /// Verifica se o serviço de IA está disponível
    /// </summary>
    /// <returns>True se disponível</returns>
    Task<bool> IsServiceAvailableAsync();

    /// <summary>
    /// Envia uma mensagem livre para a IA e retorna a resposta
    /// </summary>
    /// <param name="prompt">Prompt/mensagem para a IA</param>
    /// <returns>Resposta da IA</returns>
    Task<string> SendMessageAsync(string prompt);
}
