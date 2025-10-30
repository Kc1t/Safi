namespace Safi.Backend.Modules.AI.DTOs;

/// <summary>
/// Request para análise de ticket pela IA
/// </summary>
public class AIAnalysisRequest
{
    /// <summary>
    /// Título do ticket
    /// </summary>
    public string Title { get; set; } = string.Empty;

    /// <summary>
    /// Descrição do problema
    /// </summary>
    public string Description { get; set; } = string.Empty;

    /// <summary>
    /// Email do usuário
    /// </summary>
    public string UserEmail { get; set; } = string.Empty;

    /// <summary>
    /// Tipo de problema atual (se já definido)
    /// </summary>
    public string? CurrentIssueType { get; set; }
}

/// <summary>
/// Response da análise de IA
/// </summary>
public class AIAnalysisResponse
{
    /// <summary>
    /// Categoria sugerida
    /// </summary>
    public string SuggestedCategory { get; set; } = string.Empty;

    /// <summary>
    /// Prioridade sugerida
    /// </summary>
    public string SuggestedPriority { get; set; } = string.Empty;

    /// <summary>
    /// Nível de confiança (0.0 a 1.0)
    /// </summary>
    public float Confidence { get; set; }

    /// <summary>
    /// Explicação do raciocínio da IA
    /// </summary>
    public string Reasoning { get; set; } = string.Empty;

    /// <summary>
    /// Tempo de processamento em milissegundos
    /// </summary>
    public int ProcessingTimeMs { get; set; }
}

/// <summary>
/// Request para geração de sugestão de resposta
/// </summary>
public class AIResponseRequest
{
    /// <summary>
    /// ID do ticket
    /// </summary>
    public int TicketId { get; set; }

    /// <summary>
    /// Tipo do problema
    /// </summary>
    public string IssueType { get; set; } = string.Empty;

    /// <summary>
    /// Mensagem do usuário
    /// </summary>
    public string UserMessage { get; set; } = string.Empty;

    /// <summary>
    /// Histórico de mensagens (opcional)
    /// </summary>
    public List<string>? MessageHistory { get; set; }
}

/// <summary>
/// Sugestão de resposta da IA
/// </summary>
public class AIResponseSuggestion
{
    /// <summary>
    /// Resposta sugerida
    /// </summary>
    public string SuggestedResponse { get; set; } = string.Empty;

    /// <summary>
    /// Nível de confiança (0.0 a 1.0)
    /// </summary>
    public float Confidence { get; set; }

    /// <summary>
    /// Explicação do raciocínio da IA
    /// </summary>
    public string Reasoning { get; set; } = string.Empty;

    /// <summary>
    /// Tempo de processamento em milissegundos
    /// </summary>
    public int ProcessingTimeMs { get; set; }
}

/// <summary>
/// Análise de sentimento
/// </summary>
public class AISentimentAnalysis
{
    /// <summary>
    /// Sentimento detectado (Positive, Negative, Neutral)
    /// </summary>
    public string Sentiment { get; set; } = string.Empty;

    /// <summary>
    /// Nível de confiança (0.0 a 1.0)
    /// </summary>
    public float Confidence { get; set; }

    /// <summary>
    /// Explicação do raciocínio da IA
    /// </summary>
    public string Reasoning { get; set; } = string.Empty;

    /// <summary>
    /// Tempo de processamento em milissegundos
    /// </summary>
    public int ProcessingTimeMs { get; set; }
}

/// <summary>
/// Mensagem no histórico do chat público
/// </summary>
public class PublicChatMessage
{
    /// <summary>
    /// Papel da mensagem (user ou ai)
    /// </summary>
    public string Role { get; set; } = string.Empty;

    /// <summary>
    /// Conteúdo da mensagem
    /// </summary>
    public string Content { get; set; } = string.Empty;
}

/// <summary>
/// Request para chat público com contexto
/// </summary>
public class PublicChatRequest
{
    /// <summary>
    /// Nome do usuário
    /// </summary>
    public string Nome { get; set; } = string.Empty;

    /// <summary>
    /// Email do usuário
    /// </summary>
    public string Email { get; set; } = string.Empty;

    /// <summary>
    /// Setor do usuário
    /// </summary>
    public string Setor { get; set; } = string.Empty;

    /// <summary>
    /// Histórico de mensagens
    /// </summary>
    public List<PublicChatMessage> Historico { get; set; } = new();
}

/// <summary>
/// Response do chat público
/// </summary>
public class PublicChatResponse
{
    /// <summary>
    /// Resultado da resposta da IA
    /// </summary>
    public string Result { get; set; } = string.Empty;

    /// <summary>
    /// Timestamp da resposta
    /// </summary>
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;

    /// <summary>
    /// Tempo de processamento em milissegundos
    /// </summary>
    public int ProcessingTimeMs { get; set; }
}
