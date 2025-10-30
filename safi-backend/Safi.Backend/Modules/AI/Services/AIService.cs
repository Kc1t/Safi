using Safi.Backend.Modules.AI.DTOs;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Configuration;
using System.Text.Json;
using System.Collections.Concurrent;
using System.Text;

namespace Safi.Backend.Modules.AI.Services;

/// <summary>
/// Implementação do serviço de IA usando Gemini API
/// </summary>
public class AIService : IAIService
{
    private readonly HttpClient _httpClient;
    private readonly ILogger<AIService> _logger;
    private readonly IConfiguration _configuration;
    private readonly ConcurrentDictionary<string, DateTime> _lastRequestTimes = new();
    private readonly ConcurrentDictionary<string, int> _consecutiveFailures = new();
    private readonly ConcurrentDictionary<string, (AIAnalysisResponse response, DateTime timestamp)> _responseCache = new();
    private readonly object _circuitBreakerLock = new object();
    private bool _circuitBreakerOpen = false;
    private DateTime _circuitBreakerOpenTime = DateTime.MinValue;

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

            var startTime = DateTime.UtcNow;
            
            // Verificar cache primeiro
            var cacheKey = GenerateCacheKey(request.Title, request.Description);
            var cachedResponse = GetCachedResponse(cacheKey);
            if (cachedResponse != null)
            {
                _logger.LogInformation("Resposta encontrada no cache para ticket: {Title}", request.Title);
                cachedResponse.ProcessingTimeMs = (int)(DateTime.UtcNow - startTime).TotalMilliseconds;
                return cachedResponse;
            }
            
                // Verificar se deve usar apenas mock (modo desenvolvimento)
                var useMockOnly = _configuration.GetValue<bool>("ExternalServices:GeminiApi:UseMockOnly", false);
                _logger.LogInformation("Configuração UseMockOnly: {UseMockOnly}", useMockOnly);
                
                if (!useMockOnly)
            {
            // Tentar usar Gemini API real primeiro
            var geminiResponse = await AnalyzeWithGeminiAsync(request);
            if (geminiResponse != null)
            {
                var processingTime = (DateTime.UtcNow - startTime).TotalMilliseconds;
                geminiResponse.ProcessingTimeMs = (int)processingTime;
                    
                    // Armazenar no cache
                    CacheResponse(cacheKey, geminiResponse);
                
                _logger.LogInformation("Análise de IA concluída com Gemini para ticket: {Title}", request.Title);
                return geminiResponse;
                }
            }
            else
            {
                _logger.LogInformation("Modo desenvolvimento ativo - usando apenas análise mock para ticket: {Title}", request.Title);
            }

            // Fallback para análise mock se Gemini falhar
            _logger.LogWarning("Gemini API indisponível, usando análise mock para ticket: {Title}", request.Title);
            
            var response = new AIAnalysisResponse
            {
                SuggestedCategory = AnalyzeCategory(request.Title, request.Description),
                SuggestedPriority = AnalyzePriority(request.Title, request.Description),
                Confidence = 0.75f,
                Reasoning = "Análise baseada em palavras-chave (fallback mock)",
                ProcessingTimeMs = (int)(DateTime.UtcNow - startTime).TotalMilliseconds
            };

            // Cache da resposta mock também
            CacheResponse(cacheKey, response);

            _logger.LogInformation("Análise de IA concluída (mock) para ticket: {Title}", request.Title);
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

            // Verificar se deve usar apenas mock
            var useMockOnly = _configuration.GetValue<bool>("ExternalServices:GeminiApi:UseMockOnly");
            if (useMockOnly)
            {
                _logger.LogInformation("Usando mock para geração de sugestão (UseMockOnly = true)");
                return GenerateMockResponseSuggestion(request);
            }

            // Tentar usar a API Gemini
            var geminiResponse = await AnalyzeWithGeminiAsync(new AIAnalysisRequest
            {
                Title = $"Chat: {request.IssueType}",
                Description = request.UserMessage
            });

            if (geminiResponse != null)
            {
                // Gerar resposta baseada na análise da IA
                var suggestedResponse = GenerateResponseFromAnalysis(geminiResponse, request.UserMessage);
            
            var suggestion = new AIResponseSuggestion
            {
                    SuggestedResponse = suggestedResponse,
                    Confidence = geminiResponse.Confidence,
                    Reasoning = $"Análise da IA: {geminiResponse.Reasoning}",
                    ProcessingTimeMs = 1500 // Tempo estimado
                };

                _logger.LogInformation("Sugestão de resposta gerada com IA para ticket: {TicketId}", request.TicketId);
            return suggestion;
            }

            // Fallback para mock se a IA falhar
            _logger.LogWarning("Falha na IA, usando mock para sugestão de resposta");
            return GenerateMockResponseSuggestion(request);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao gerar sugestão de resposta para ticket: {TicketId}", request.TicketId);
            return GenerateMockResponseSuggestion(request);
        }
    }

    private AIResponseSuggestion GenerateMockResponseSuggestion(AIResponseRequest request)
    {
        return new AIResponseSuggestion
        {
            SuggestedResponse = GenerateMockResponse(request.IssueType, request.UserMessage),
            Confidence = 0.80f,
            Reasoning = "Sugestão baseada em templates pré-definidos (implementação mock)",
            ProcessingTimeMs = 200
        };
    }

    private string GenerateResponseFromAnalysis(AIAnalysisResponse analysis, string userMessage)
    {
        // Detectar operações matemáticas de forma mais inteligente
        var mathPattern = @"(\d+)\s*[+\-*/]\s*(\d+)";
        var mathMatch = System.Text.RegularExpressions.Regex.Match(userMessage, mathPattern);
        
        if (mathMatch.Success)
        {
            var num1 = int.Parse(mathMatch.Groups[1].Value);
            var num2 = int.Parse(mathMatch.Groups[2].Value);
            var operation = userMessage.Contains("+") ? "+" : 
                           userMessage.Contains("-") ? "-" : 
                           userMessage.Contains("*") ? "*" : "/";
            
            int result = operation switch
            {
                "+" => num1 + num2,
                "-" => num1 - num2,
                "*" => num1 * num2,
                "/" => num2 != 0 ? num1 / num2 : 0,
                _ => 0
            };
            
            return $"{num1} {operation} {num2} = {result}. Posso ajudar com mais cálculos também!";
        }

        // Para perguntas matemáticas simples com texto
        if (userMessage.ToLower().Contains("quanto é"))
        {
            // Extrair números da pergunta
            var numbers = System.Text.RegularExpressions.Regex.Matches(userMessage, @"\d+");
            if (numbers.Count >= 2)
            {
                var num1 = int.Parse(numbers[0].Value);
                var num2 = int.Parse(numbers[1].Value);
                var operation = userMessage.Contains("+") ? "+" : 
                               userMessage.Contains("-") ? "-" : 
                               userMessage.Contains("*") ? "*" : "/";
                
                int result = operation switch
                {
                    "+" => num1 + num2,
                    "-" => num1 - num2,
                    "*" => num1 * num2,
                    "/" => num2 != 0 ? num1 / num2 : 0,
                    _ => 0
                };
                
                return $"{num1} {operation} {num2} = {result}. Precisa de ajuda com mais cálculos?";
            }
        }

        // Para perguntas sobre identidade
        if (userMessage.ToLower().Contains("quem é") || userMessage.ToLower().Contains("quem voce"))
        {
            return "Sou o assistente de IA do sistema SAFI! Estou aqui para ajudar você com problemas técnicos, suporte e dúvidas. Como posso ser útil hoje?";
        }

        // Para cumprimentos simples
        if (userMessage.ToLower() == "oi" || userMessage.ToLower() == "olá" || userMessage.ToLower() == "ola")
        {
            return "Olá! Sou o assistente de IA do SAFI. Estou aqui para ajudar com problemas técnicos, suporte e qualquer dúvida que você tenha. Como posso ajudar hoje?";
        }

        // Gerar resposta contextual baseada na análise da IA
        var responses = new Dictionary<string, string[]>
        {
            ["Hardware"] = new[]
            {
                "Entendo que você está enfrentando um problema de hardware. Vou ajudá-lo a diagnosticar e resolver essa questão.",
                "Problemas de hardware podem ser complexos. Vamos investigar passo a passo para encontrar a solução.",
                "Vou orientá-lo através de algumas verificações básicas para identificar o problema de hardware."
            },
            ["Software"] = new[]
            {
                "Vejo que você está com dificuldades relacionadas a software. Vamos resolver isso juntos.",
                "Problemas de software são comuns e geralmente têm soluções diretas. Como posso ajudar?",
                "Vou guiá-lo através das etapas para resolver essa questão de software."
            },
            ["Rede"] = new[]
            {
                "Problemas de conectividade podem ser frustrantes. Vamos diagnosticar sua conexão de rede.",
                "Vou ajudá-lo a verificar sua configuração de rede e resolver os problemas de conectividade.",
                "Problemas de rede são solucionáveis. Vamos investigar juntos."
            },
            ["Email"] = new[]
            {
                "Problemas de email são importantes para a comunicação. Vamos resolver isso rapidamente.",
                "Vou ajudá-lo a configurar e resolver questões relacionadas ao seu email.",
                "Problemas de email podem afetar sua produtividade. Como posso ajudar?"
            },
            ["Autenticação"] = new[]
            {
                "Questões de autenticação são críticas para a segurança. Vamos resolver isso com cuidado.",
                "Vou ajudá-lo a recuperar o acesso à sua conta de forma segura.",
                "Problemas de login são comuns. Vamos resolver isso passo a passo."
            },
            ["Outros"] = new[]
            {
                "Entendo sua pergunta. Embora não seja um problema técnico tradicional, posso ajudar com informações gerais.",
                "Vou fazer o melhor para responder sua dúvida, mesmo que não seja relacionada a suporte técnico.",
                "Posso ajudar com uma variedade de questões. O que você gostaria de saber?"
            }
        };

        var categoryResponses = responses.GetValueOrDefault(analysis.SuggestedCategory, new[]
        {
            "Obrigado por entrar em contato! Vou analisar seu problema e fornecer uma solução adequada.",
            "Entendo sua preocupação. Vamos trabalhar juntos para resolver essa questão.",
            "Vou ajudá-lo da melhor forma possível. Pode me dar mais detalhes sobre o problema?"
        });

        var random = new Random();
        var baseResponse = categoryResponses[random.Next(categoryResponses.Length)];

        // Adicionar contexto específico baseado na mensagem do usuário
        if (userMessage.ToLower().Contains("não funciona"))
        {
            baseResponse += " Vamos investigar o que pode estar causando o mau funcionamento.";
        }
        else if (userMessage.ToLower().Contains("erro"))
        {
            baseResponse += " Erros podem ter várias causas. Vamos identificar a origem do problema.";
        }
        else if (userMessage.ToLower().Contains("lento"))
        {
            baseResponse += " Problemas de performance podem ser resolvidos com algumas otimizações.";
        }

        return baseResponse;
    }

    public Task<AISentimentAnalysis?> AnalyzeSentimentAsync(string message)
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
            return Task.FromResult<AISentimentAnalysis?>(analysis);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro durante análise de sentimento");
            return Task.FromResult<AISentimentAnalysis?>(null);
        }
    }

    public Task<bool> IsServiceAvailableAsync()
    {
        try
        {
            // Verificar se está em modo mock apenas
            var useMockOnly = _configuration.GetValue<bool>("ExternalServices:GeminiApi:UseMockOnly", false);
            if (useMockOnly)
            {
                _logger.LogInformation("Serviço de IA em modo desenvolvimento (mock apenas)");
                return Task.FromResult(true); // Mock sempre disponível
            }

            // Verificar se circuit breaker está aberto
            if (IsCircuitBreakerOpen())
            {
                _logger.LogWarning("Serviço de IA indisponível: Circuit breaker aberto");
                return Task.FromResult(false);
            }

            // Verificar se pode fazer requisição (rate limiting)
            if (!CanMakeRequest())
            {
                _logger.LogWarning("Serviço de IA indisponível: Rate limit ativo");
                return Task.FromResult(false);
            }

            // Verificar configuração da API
            var apiKey = _configuration["ExternalServices:GeminiApi:ApiKey"];
            if (string.IsNullOrEmpty(apiKey) || apiKey == "YOUR_GEMINI_API_KEY_HERE")
            {
                _logger.LogWarning("Serviço de IA indisponível: Chave da API não configurada");
                return Task.FromResult(false);
            }

            return Task.FromResult(true);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao verificar disponibilidade do serviço de IA");
            return Task.FromResult(false);
        }
    }

    #region Integração com Gemini API

    private async Task<AIAnalysisResponse?> AnalyzeWithGeminiAsync(AIAnalysisRequest request)
    {
        try
        {
            // Verificar circuit breaker
            if (IsCircuitBreakerOpen())
            {
                _logger.LogWarning("Circuit breaker está aberto, pulando chamada para Gemini API");
                return null;
            }

            var apiKey = _configuration["ExternalServices:GeminiApi:ApiKey"];
            var baseUrl = _configuration["ExternalServices:GeminiApi:BaseUrl"];
            var modelId = _configuration["ExternalServices:GeminiApi:ModelId"] ?? "gemini-2.5-flash-image";
            var generateContentApi = _configuration["ExternalServices:GeminiApi:GenerateContentApi"] ?? "streamGenerateContent";
            var maxRetries = _configuration.GetValue<int>("ExternalServices:GeminiApi:MaxRetries", 3);
            var baseDelayMs = _configuration.GetValue<int>("ExternalServices:GeminiApi:BaseDelayMs", 1000);
            
            if (string.IsNullOrEmpty(apiKey) || apiKey == "YOUR_GEMINI_API_KEY_HERE")
            {
                _logger.LogWarning("Chave da API Gemini não configurada");
                return null;
            }

            // Rate limiting - verificar se pode fazer nova requisição
            if (!CanMakeRequest())
            {
                _logger.LogWarning("Rate limit atingido, aguardando antes de fazer nova requisição");
                return null;
            }

            var prompt = $@"
Analise o seguinte ticket de suporte e forneça uma análise estruturada:

Título: {request.Title}
Descrição: {request.Description}

Por favor, analise e responda em formato JSON com as seguintes informações:
- suggestedCategory: Categoria mais apropriada (Autenticação, Email, Hardware, Rede, Software, Outros)
- suggestedPriority: Prioridade (Low, Medium, High, Urgent)
- confidence: Nível de confiança (0.0 a 1.0)
- reasoning: Explicação da análise

Responda APENAS com o JSON, sem texto adicional.
";

            var geminiRequest = new
            {
                contents = new[]
                {
                    new
                    {
                        role = "user",
                        parts = new[]
                        {
                            new { text = prompt }
                        }
                    }
                },
                generationConfig = new
                {
                    thinkingConfig = new
                    {
                        thinkingBudget = 0
                    }
                }
            };

            var jsonContent = JsonSerializer.Serialize(geminiRequest);
            var content = new StringContent(jsonContent, System.Text.Encoding.UTF8, "application/json");

            _httpClient.DefaultRequestHeaders.Clear();
            _httpClient.DefaultRequestHeaders.Add("x-goog-api-key", apiKey);

            // Implementar retry com backoff exponencial
            for (int attempt = 0; attempt <= maxRetries; attempt++)
            {
                try
                {
                    // Registrar tentativa de requisição
                    RecordRequestAttempt();

            var response = await _httpClient.PostAsync($"{baseUrl}/models/{modelId}:{generateContentApi}?key={apiKey}", content);
            
            if (response.IsSuccessStatusCode)
            {
                        // Resetar contador de falhas em caso de sucesso
                        ResetFailureCount();
                        
                var responseContent = await response.Content.ReadAsStringAsync();
                        _logger.LogInformation("Resposta da API Gemini: {ResponseContent}", responseContent);
                        
                        // Processar resposta streaming (array de objetos)
                        var streamResponses = JsonSerializer.Deserialize<GeminiStreamResponse[]>(responseContent);
                        if (streamResponses != null && streamResponses.Length > 0)
                        {
                            // Concatenar todas as partes do texto
                            var fullText = new StringBuilder();
                            foreach (var streamResponse in streamResponses)
                            {
                                if (streamResponse?.candidates?.Length > 0)
                                {
                                    var candidate = streamResponse.candidates[0];
                                    if (candidate.content?.parts?.Length > 0)
                                    {
                                        fullText.Append(candidate.content.parts[0].text ?? string.Empty);
                                    }
                                }
                            }
                            
                            var responseText = fullText.ToString();
                            _logger.LogInformation("Texto completo da resposta Gemini: {ResponseText}", responseText);
                            
                            // Tentar extrair JSON da resposta
                            var analysisResponse = ExtractAnalysisFromResponse(responseText);
                            if (analysisResponse != null)
                            {
                                return analysisResponse;
                            }
                        }
                        
                        // Fallback: tentar como resposta normal
                        try
                        {
                var geminiResponse = JsonSerializer.Deserialize<GeminiResponse>(responseContent);
                if (geminiResponse?.candidates?.Length > 0)
                {
                    var candidate = geminiResponse.candidates[0];
                    if (candidate.content?.parts?.Length > 0)
                    {
                                    var responseText = candidate.content.parts[0].text ?? string.Empty;
                                    _logger.LogInformation("Texto da resposta Gemini: {ResponseText}", responseText);
                                    
                                    // Tentar extrair JSON da resposta
                                    var analysisResponse = ExtractAnalysisFromResponse(responseText);
                                    if (analysisResponse != null)
                                    {
                                        return analysisResponse;
                                    }
                                }
                            }
                        }
                        catch (Exception ex)
                        {
                            _logger.LogWarning(ex, "Erro ao processar resposta normal da API Gemini");
                        }
                        
                        _logger.LogWarning("Não foi possível processar a resposta da API Gemini");
                    }
                    else if (response.StatusCode == System.Net.HttpStatusCode.TooManyRequests)
                    {
                        _logger.LogWarning("Rate limit atingido na tentativa {Attempt}/{MaxRetries}", attempt + 1, maxRetries + 1);
                        
                        // Incrementar contador de falhas
                        IncrementFailureCount();
                        
                        if (attempt < maxRetries)
                        {
                            // Calcular delay com backoff exponencial
                            var delay = baseDelayMs * Math.Pow(2, attempt);
                            _logger.LogInformation("Aguardando {Delay}ms antes da próxima tentativa", delay);
                            await Task.Delay((int)delay);
                            continue;
                        }
                        else
                        {
                            _logger.LogError("Erro na API Gemini após {MaxRetries} tentativas: {StatusCode} - {ReasonPhrase}", 
                                maxRetries + 1, response.StatusCode, response.ReasonPhrase);
                            break;
                        }
                    }
                    else
                    {
                        _logger.LogError("Erro na API Gemini: {StatusCode} - {ReasonPhrase}", 
                            response.StatusCode, response.ReasonPhrase);
                        IncrementFailureCount();
                        break;
                    }
                }
                catch (HttpRequestException ex)
                {
                    _logger.LogWarning(ex, "Erro de rede na tentativa {Attempt}/{MaxRetries}", attempt + 1, maxRetries + 1);
                    IncrementFailureCount();
                    
                    if (attempt < maxRetries)
                    {
                        var delay = baseDelayMs * Math.Pow(2, attempt);
                        await Task.Delay((int)delay);
                        continue;
                    }
                    else
                    {
                        throw;
                    }
                }
            }

            return null;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao chamar API Gemini");
            return null;
        }
    }

    #endregion

    #region Rate Limiting e Circuit Breaker

    private bool CanMakeRequest()
    {
        var key = "gemini_api";
        var minIntervalMs = _configuration.GetValue<int>("ExternalServices:GeminiApi:MinIntervalMs", 2000); // 2 segundos entre requisições
        
        if (_lastRequestTimes.TryGetValue(key, out var lastRequest))
        {
            var timeSinceLastRequest = DateTime.UtcNow - lastRequest;
            if (timeSinceLastRequest.TotalMilliseconds < minIntervalMs)
            {
                return false;
            }
        }
        
        return true;
    }

    private void RecordRequestAttempt()
    {
        var key = "gemini_api";
        _lastRequestTimes[key] = DateTime.UtcNow;
    }

    private void IncrementFailureCount()
    {
        var key = "gemini_api";
        _consecutiveFailures.AddOrUpdate(key, 1, (k, v) => v + 1);
        
        var maxFailures = _configuration.GetValue<int>("ExternalServices:GeminiApi:MaxConsecutiveFailures", 5);
        if (_consecutiveFailures[key] >= maxFailures)
        {
            OpenCircuitBreaker();
        }
    }

    private void ResetFailureCount()
    {
        var key = "gemini_api";
        _consecutiveFailures.TryRemove(key, out _);
        CloseCircuitBreaker();
    }

    private bool IsCircuitBreakerOpen()
    {
        lock (_circuitBreakerLock)
        {
            if (!_circuitBreakerOpen) return false;
            
            var timeoutMinutes = _configuration.GetValue<int>("ExternalServices:GeminiApi:CircuitBreakerTimeoutMinutes", 5);
            if (DateTime.UtcNow - _circuitBreakerOpenTime > TimeSpan.FromMinutes(timeoutMinutes))
            {
                CloseCircuitBreaker();
                return false;
            }
            
            return true;
        }
    }

    private void OpenCircuitBreaker()
    {
        lock (_circuitBreakerLock)
        {
            if (!_circuitBreakerOpen)
            {
                _circuitBreakerOpen = true;
                _circuitBreakerOpenTime = DateTime.UtcNow;
                _logger.LogWarning("Circuit breaker aberto devido a muitas falhas consecutivas");
            }
        }
    }

    private void CloseCircuitBreaker()
    {
        lock (_circuitBreakerLock)
        {
            if (_circuitBreakerOpen)
            {
                _circuitBreakerOpen = false;
                _logger.LogInformation("Circuit breaker fechado - tentando novamente");
            }
        }
    }

    #endregion

    #region Cache Management

    private string GenerateCacheKey(string title, string description)
    {
        // Criar uma chave baseada no conteúdo, normalizando espaços e case
        var normalizedText = $"{title?.Trim().ToLowerInvariant()} {description?.Trim().ToLowerInvariant()}".Trim();
        return Convert.ToBase64String(System.Text.Encoding.UTF8.GetBytes(normalizedText));
    }

    private AIAnalysisResponse? GetCachedResponse(string cacheKey)
    {
        if (_responseCache.TryGetValue(cacheKey, out var cached))
        {
            var cacheExpiryMinutes = _configuration.GetValue<int>("ExternalServices:GeminiApi:CacheExpiryMinutes", 30);
            if (DateTime.UtcNow - cached.timestamp < TimeSpan.FromMinutes(cacheExpiryMinutes))
            {
                return cached.response;
            }
            else
            {
                // Remover entrada expirada
                _responseCache.TryRemove(cacheKey, out _);
            }
        }
        return null;
    }

    private AIAnalysisResponse? ExtractAnalysisFromResponse(string responseText)
    {
        try
        {
                        // Tentar extrair JSON da resposta
                        var jsonStart = responseText.IndexOf('{');
                        var jsonEnd = responseText.LastIndexOf('}');
                        
                        if (jsonStart >= 0 && jsonEnd > jsonStart)
                        {
                            var jsonText = responseText.Substring(jsonStart, jsonEnd - jsonStart + 1);
                            var analysis = JsonSerializer.Deserialize<GeminiAnalysisResponse>(jsonText);
                            
                            return new AIAnalysisResponse
                            {
                                SuggestedCategory = analysis?.suggestedCategory ?? "Outros",
                                SuggestedPriority = analysis?.suggestedPriority ?? "Medium",
                                Confidence = analysis?.confidence ?? 0.5f,
                                Reasoning = analysis?.reasoning ?? "Análise realizada pela IA Gemini"
                            };
                        }
                    }
        catch (Exception ex)
            {
            _logger.LogWarning(ex, "Erro ao extrair análise da resposta: {ResponseText}", responseText);
            }

            return null;
        }

    private void CacheResponse(string cacheKey, AIAnalysisResponse response)
    {
        var maxCacheSize = _configuration.GetValue<int>("ExternalServices:GeminiApi:MaxCacheSize", 100);
        
        // Limpar cache se estiver muito grande
        if (_responseCache.Count >= maxCacheSize)
        {
            CleanupCache();
        }
        
        _responseCache[cacheKey] = (response, DateTime.UtcNow);
    }

    private void CleanupCache()
    {
        var cacheExpiryMinutes = _configuration.GetValue<int>("ExternalServices:GeminiApi:CacheExpiryMinutes", 30);
        var cutoffTime = DateTime.UtcNow - TimeSpan.FromMinutes(cacheExpiryMinutes);
        
        var keysToRemove = _responseCache
            .Where(kvp => kvp.Value.timestamp < cutoffTime)
            .Select(kvp => kvp.Key)
            .ToList();
            
        foreach (var key in keysToRemove)
        {
            _responseCache.TryRemove(key, out _);
        }
        
        _logger.LogInformation("Cache limpo: {RemovedCount} entradas removidas", keysToRemove.Count);
    }

    #endregion

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

    public async Task<string> SendMessageAsync(string prompt)
    {
        try
        {
            _logger.LogInformation("Enviando mensagem livre para IA");

            // Verificar se deve usar apenas mock
            var useMockOnly = _configuration.GetValue<bool>("ExternalServices:GeminiApi:UseMockOnly", false);

            if (!useMockOnly)
            {
                // Tentar usar Gemini API real
                var geminiResponse = await SendToGeminiAsync(prompt);
                if (!string.IsNullOrEmpty(geminiResponse))
                {
                    _logger.LogInformation("Mensagem processada com sucesso pela Gemini API");
                    return geminiResponse;
                }
            }

            // Fallback para resposta mock
            _logger.LogWarning("Usando resposta mock para mensagem livre");
            return "Análise gerada com base nos dados fornecidos. Sistema em modo de desenvolvimento.";
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao enviar mensagem para IA");
            return "Erro ao processar análise. Por favor, tente novamente.";
        }
    }

    private async Task<string?> SendToGeminiAsync(string prompt)
    {
        try
        {
            var apiKey = _configuration["ExternalServices:GeminiApi:ApiKey"];
            if (string.IsNullOrEmpty(apiKey))
            {
                _logger.LogWarning("API Key da Gemini não configurada");
                return null;
            }

            var requestBody = new
            {
                contents = new[]
                {
                    new
                    {
                        parts = new[]
                        {
                            new { text = prompt }
                        }
                    }
                }
            };

            var jsonContent = JsonSerializer.Serialize(requestBody);
            var content = new StringContent(jsonContent, Encoding.UTF8, "application/json");

            var url = $"https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key={apiKey}";
            var response = await _httpClient.PostAsync(url, content);

            if (!response.IsSuccessStatusCode)
            {
                _logger.LogWarning("Gemini API retornou status {StatusCode}", response.StatusCode);
                return null;
            }

            var responseBody = await response.Content.ReadAsStringAsync();
            var jsonResponse = JsonSerializer.Deserialize<JsonElement>(responseBody);

            if (jsonResponse.TryGetProperty("candidates", out var candidates) &&
                candidates.GetArrayLength() > 0)
            {
                var firstCandidate = candidates[0];
                if (firstCandidate.TryGetProperty("content", out var contentProp) &&
                    contentProp.TryGetProperty("parts", out var parts) &&
                    parts.GetArrayLength() > 0)
                {
                    var firstPart = parts[0];
                    if (firstPart.TryGetProperty("text", out var textProp))
                    {
                        return textProp.GetString();
                    }
                }
            }

            _logger.LogWarning("Resposta da Gemini API não contém texto válido");
            return null;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao chamar Gemini API");
            return null;
        }
    }

    public async Task<PublicChatResponse?> ProcessPublicChatAsync(PublicChatRequest request)
    {
        try
        {
            var startTime = DateTime.UtcNow;
            _logger.LogInformation("Processando chat público para usuário: {Nome} ({Email})", request.Nome, request.Email);

            // Construir o prompt completo com as regras e o histórico
            var prompt = BuildStructuredPrompt(request);

            // Verificar se deve usar apenas mock
            var useMockOnly = _configuration.GetValue<bool>("ExternalServices:GeminiApi:UseMockOnly", false);

            string? aiResponse = null;

            if (!useMockOnly)
            {
                // Tentar usar Gemini API real
                aiResponse = await SendToGeminiAsync(prompt);
            }

            // Fallback para resposta básica se a IA falhar ou estiver em modo mock
            if (string.IsNullOrEmpty(aiResponse))
            {
                _logger.LogWarning("Usando resposta fallback para chat público");
                aiResponse = GenerateFallbackResponse(request);
            }

            var processingTime = (int)(DateTime.UtcNow - startTime).TotalMilliseconds;

            var response = new PublicChatResponse
            {
                Result = aiResponse,
                Timestamp = DateTime.UtcNow,
                ProcessingTimeMs = processingTime
            };

            _logger.LogInformation("Chat público processado em {ProcessingTime}ms", processingTime);
            return response;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao processar chat público");
            return null;
        }
    }

    private string BuildStructuredPrompt(PublicChatRequest request)
    {
        var promptBuilder = new StringBuilder();

        // Cabeçalho com instruções e contexto
        promptBuilder.AppendLine(@"Você é um assistente virtual N0 da NeoPharma, operando no sistema SAFI (Sistema de Apoio Farmacêutico Inteligente). Seu papel é realizar a triagem automatizada de chamados para suporte técnico interno.");
        promptBuilder.AppendLine(@"Este ambiente é uma **demonstração**: todos os nomes, setores e informações aqui utilizados são **hipotéticos e destinados à apresentação do produto**.");
        promptBuilder.AppendLine();
        promptBuilder.AppendLine("📌 **COMO RESPONDER**");
        promptBuilder.AppendLine("- Seja receptivo, empático e cordial.");
        promptBuilder.AppendLine("- **PRIMEIRO**: Entenda completamente o problema antes de sugerir soluções.");
        promptBuilder.AppendLine("- Se o problema não estiver claro, faça perguntas específicas para obter mais informações.");
        promptBuilder.AppendLine("- Apenas sugira soluções quando tiver informações suficientes.");
        promptBuilder.AppendLine("- **IMPORTANTE**: Só use *\"Resolvido?\"* quando fornecer uma solução específica e executável.");
        promptBuilder.AppendLine();
        promptBuilder.AppendLine("🔍 **ESTRATÉGIA DE ATENDIMENTO**");
        promptBuilder.AppendLine("1. **PRIMEIRA PRIORIDADE**: Compreender o problema");
        promptBuilder.AppendLine("   - Se a descrição for vaga, pergunte detalhes específicos");
        promptBuilder.AppendLine("   - Identifique o sistema/aplicação afetado");
        promptBuilder.AppendLine("   - Entenda quando o problema começou");
        promptBuilder.AppendLine("   - Determine se há mensagens de erro específicas");
        promptBuilder.AppendLine();
        promptBuilder.AppendLine("2. **SEGUNDA PRIORIDADE**: Classificar urgência e impacto");
        promptBuilder.AppendLine("   - Quantos usuários são afetados?");
        promptBuilder.AppendLine("   - O problema impede o trabalho completamente?");
        promptBuilder.AppendLine("   - Há workarounds disponíveis?");
        promptBuilder.AppendLine();
        promptBuilder.AppendLine("3. **TERCEIRA PRIORIDADE**: Fornecer soluções progressivas");
        promptBuilder.AppendLine("   - Comece com soluções simples e rápidas");
        promptBuilder.AppendLine("   - Escalecione gradualmente a complexidade");
        promptBuilder.AppendLine("   - Ofereça múltiplas alternativas quando possível");
        promptBuilder.AppendLine();
        promptBuilder.AppendLine("👤 **DADOS DO SOLICITANTE**");
        promptBuilder.AppendLine($"- Nome: {(string.IsNullOrEmpty(request.Nome) ? "[nome não informado]" : request.Nome)}");
        promptBuilder.AppendLine($"- Email: {(string.IsNullOrEmpty(request.Email) ? "[email não informado]" : request.Email)}");
        promptBuilder.AppendLine($"- Setor: {(string.IsNullOrEmpty(request.Setor) ? "[setor não informado]" : request.Setor)}");
        promptBuilder.AppendLine();
        promptBuilder.AppendLine("**CRÍTICO**: Os dados acima JÁ estão disponíveis no sistema. NUNCA peça nome, email ou setor novamente.");
        promptBuilder.AppendLine();
        promptBuilder.AppendLine("⚖️ **PRIORIDADES POR SETOR (critério interno de atendimento)**");
        promptBuilder.AppendLine("- Qualidade: 5");
        promptBuilder.AppendLine("- Pronto Atendimento: 4");
        promptBuilder.AppendLine("- TI / Produção: 3");
        promptBuilder.AppendLine("- Logística: 2");
        promptBuilder.AppendLine("- Administração / Marketing / Comercial: 1");
        promptBuilder.AppendLine();
        promptBuilder.AppendLine("📈 **REGRAS INTERNAS DE TRIAGEM E ESCALONAMENTO**");
        promptBuilder.AppendLine("- **IMPORTANTE**: Colete informações suficientes antes de propor soluções.");
        promptBuilder.AppendLine("- Tente resolver com **PELO MENOS 3-4 soluções diferentes** antes de escalar.");
        promptBuilder.AppendLine("- Chamados urgentes: **mínimo 3 tentativas** de resolução antes do escalonamento (N0 → N1 → N2 → N3).");
        promptBuilder.AppendLine("- Chamados gerais: **mínimo 5 tentativas** de resolução antes do escalonamento.");
        promptBuilder.AppendLine("- **Progressão de soluções**: Comece com soluções simples, depois intermediárias, e por último as mais complexas.");
        promptBuilder.AppendLine("- Clientes Terceiros só recebem suporte remoto (não é permitido solicitar manutenção física de hardware).");
        promptBuilder.AppendLine("- Chamados duplicados em 24h são agrupados automaticamente.");
        promptBuilder.AppendLine();
        promptBuilder.AppendLine("🎯 **REGRAS DE ENCERRAMENTO DE CHAMADO**");
        promptBuilder.AppendLine("- **Quando o usuário confirmar que o problema foi resolvido** (ex: \"resolveu\", \"obrigado\", \"funcionou\"):");
        promptBuilder.AppendLine("  1. Responda: \"Vou encerrar esse chamado. Tem certeza que deseja encerrar?\"");
        promptBuilder.AppendLine("  2. **NÃO use \"Resolvido?\" após confirmação de resolução**");
        promptBuilder.AppendLine("- **Se o usuário confirmar o encerramento**: Responda apenas \"Finalizando Chamado!\"");
        promptBuilder.AppendLine("- **Se o usuário não quiser encerrar**: Continue o atendimento normalmente");
        promptBuilder.AppendLine();
        promptBuilder.AppendLine("💡 **PERGUNTAS PARA COLETA DE INFORMAÇÕES**");
        promptBuilder.AppendLine("Use essas perguntas quando o problema não estiver claro:");
        promptBuilder.AppendLine("- \"Qual sistema ou aplicação está apresentando o problema?\"");
        promptBuilder.AppendLine("- \"Quando esse problema começou a acontecer?\"");
        promptBuilder.AppendLine("- \"Há alguma mensagem de erro específica aparecendo?\"");
        promptBuilder.AppendLine("- \"O problema acontece sempre ou esporadicamente?\"");
        promptBuilder.AppendLine("- \"Você consegue reproduzir o erro? Se sim, quais passos?\"");
        promptBuilder.AppendLine("- \"Outros colegas estão enfrentando o mesmo problema?\"");
        promptBuilder.AppendLine();
        promptBuilder.AppendLine("🔧 **ESTRATÉGIA DE RESOLUÇÃO PROGRESSIVA** (após coletar informações)");
        promptBuilder.AppendLine("1. **Primeira tentativa**: Solução mais comum/simples");
        promptBuilder.AppendLine("2. **Segunda tentativa**: Verificação de configurações básicas");
        promptBuilder.AppendLine("3. **Terceira tentativa**: Limpeza de cache/dados temporários");
        promptBuilder.AppendLine("4. **Quarta tentativa**: Verificação de conectividade/permissões");
        promptBuilder.AppendLine("5. **Quinta tentativa**: Reinstalação/reset de configurações");
        promptBuilder.AppendLine("6. **Após 5 tentativas**: Escalar para N1");
        promptBuilder.AppendLine();
        promptBuilder.AppendLine("📝 *Importante:* Este é um ambiente demonstrativo. Todas as informações aqui simuladas são **fictícias e não representam dados reais de clientes, usuários ou operações da NeoPharma.*");
        promptBuilder.AppendLine();

        // Histórico de mensagens
        if (request.Historico != null && request.Historico.Count > 0)
        {
            promptBuilder.AppendLine("**Histórico da conversa:**");
            foreach (var message in request.Historico)
            {
                var role = message.Role == "user" ? "Usuário" : "IA";
                promptBuilder.AppendLine($"{role}: {message.Content}");
            }
            promptBuilder.AppendLine();
        }

        promptBuilder.AppendLine("**Responda de forma natural, seguindo as regras acima. Seja útil e empático.**");

        return promptBuilder.ToString();
    }

    private string GenerateFallbackResponse(PublicChatRequest request)
    {
        // Pegar a última mensagem do usuário
        var lastUserMessage = request.Historico
            .Where(m => m.Role == "user")
            .LastOrDefault();

        if (lastUserMessage == null)
        {
            return "Olá! Sou o assistente virtual do SAFI. Como posso ajudá-lo hoje?";
        }

        var messageContent = lastUserMessage.Content.ToLower();

        // Detecção de saudações
        if (messageContent.Contains("olá") || messageContent.Contains("ola") ||
            messageContent.Contains("oi") || messageContent.Contains("bom dia") ||
            messageContent.Contains("boa tarde") || messageContent.Contains("boa noite"))
        {
            return $"Olá, {request.Nome}! Sou o assistente virtual N0 do SAFI. Estou aqui para ajudar com problemas técnicos e dúvidas. Como posso auxiliá-lo hoje?";
        }

        // Detecção de agradecimento/confirmação de resolução
        if (messageContent.Contains("obrigado") || messageContent.Contains("obrigada") ||
            messageContent.Contains("resolveu") || messageContent.Contains("funcionou") ||
            messageContent.Contains("consegui"))
        {
            return "Que ótimo que conseguimos resolver! Vou encerrar esse chamado. Tem certeza que deseja encerrar?";
        }

        // Detecção de confirmação de encerramento
        if ((messageContent.Contains("sim") || messageContent.Contains("pode") ||
             messageContent.Contains("encerrar") || messageContent.Contains("fechar")) &&
            request.Historico.Count > 2)
        {
            return "Finalizando Chamado!";
        }

        // Resposta padrão para coleta de informações
        if (request.Historico.Count <= 1)
        {
            return $"Olá, {request.Nome}! Entendi que você está com um problema. Para que eu possa ajudá-lo da melhor forma possível, preciso de mais informações:\n\n" +
                   "- Qual sistema ou aplicação está apresentando o problema?\n" +
                   "- Quando esse problema começou a acontecer?\n" +
                   "- Há alguma mensagem de erro específica aparecendo?\n\n" +
                   "Com essas informações, poderei oferecer uma solução mais adequada.";
        }

        // Resposta genérica de continuação
        return "Entendo sua situação. Vou fazer o possível para ajudá-lo. Pode me fornecer mais detalhes sobre o problema que está enfrentando?";
    }
}
