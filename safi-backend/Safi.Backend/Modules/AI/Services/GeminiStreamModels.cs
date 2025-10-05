using System.Text.Json.Serialization;

namespace Safi.Backend.Modules.AI.Services;

/// <summary>
/// Resposta da API Gemini 2.5 Flash Lite (streaming)
/// </summary>
public class GeminiStreamResponse
{
    [JsonPropertyName("candidates")]
    public GeminiCandidate[]? candidates { get; set; }
    
    [JsonPropertyName("usageMetadata")]
    public GeminiUsageMetadata? usageMetadata { get; set; }
    
    [JsonPropertyName("modelVersion")]
    public string? modelVersion { get; set; }
    
    [JsonPropertyName("responseId")]
    public string? responseId { get; set; }
}

public class GeminiUsageMetadata
{
    [JsonPropertyName("promptTokenCount")]
    public int? promptTokenCount { get; set; }
    
    [JsonPropertyName("candidatesTokenCount")]
    public int? candidatesTokenCount { get; set; }
    
    [JsonPropertyName("totalTokenCount")]
    public int? totalTokenCount { get; set; }
}
