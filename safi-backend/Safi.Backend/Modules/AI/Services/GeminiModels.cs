using System.Text.Json.Serialization;

namespace Safi.Backend.Modules.AI.Services;

/// <summary>
/// Resposta da API Gemini 2.5 Flash
/// </summary>
public class GeminiResponse
{
    [JsonPropertyName("candidates")]
    public GeminiCandidate[]? candidates { get; set; }
}

public class GeminiCandidate
{
    [JsonPropertyName("content")]
    public GeminiContent? content { get; set; }
    
    [JsonPropertyName("finishReason")]
    public string? finishReason { get; set; }
    
    [JsonPropertyName("safetyRatings")]
    public GeminiSafetyRating[]? safetyRatings { get; set; }
}

public class GeminiContent
{
    [JsonPropertyName("role")]
    public string? role { get; set; }
    
    [JsonPropertyName("parts")]
    public GeminiPart[]? parts { get; set; }
}

public class GeminiPart
{
    [JsonPropertyName("text")]
    public string? text { get; set; }
    
    [JsonPropertyName("inlineData")]
    public GeminiInlineData? inlineData { get; set; }
}

public class GeminiInlineData
{
    [JsonPropertyName("mimeType")]
    public string? mimeType { get; set; }
    
    [JsonPropertyName("data")]
    public string? data { get; set; }
}

public class GeminiSafetyRating
{
    [JsonPropertyName("category")]
    public string? category { get; set; }
    
    [JsonPropertyName("probability")]
    public string? probability { get; set; }
}

/// <summary>
/// Análise estruturada retornada pelo Gemini
/// </summary>
public class GeminiAnalysisResponse
{
    [JsonPropertyName("suggestedCategory")]
    public string? suggestedCategory { get; set; }

    [JsonPropertyName("suggestedPriority")]
    public string? suggestedPriority { get; set; }

    [JsonPropertyName("confidence")]
    public float? confidence { get; set; }

    [JsonPropertyName("reasoning")]
    public string? reasoning { get; set; }
}
