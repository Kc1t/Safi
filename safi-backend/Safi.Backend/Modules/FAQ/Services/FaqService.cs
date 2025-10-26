using System.Text;
using System.Text.Json;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.EntityFrameworkCore;
using Safi.Backend.Core.Interfaces;
using Safi.Backend.Modules.FAQ.DTOs;
using Safi.Backend.Infrastructure.Data.Context;

namespace Safi.Backend.Modules.FAQ.Services;

/// <summary>
/// Serviço para geração de FAQ usando IA Gemini
/// </summary>
public class FaqService : IFaqService
{
    private readonly HttpClient _httpClient;
    private readonly ILogger<FaqService> _logger;
    private readonly IConfiguration _configuration;
    private readonly ApplicationDbContext _dbContext;

    public FaqService(
        HttpClient httpClient,
        ILogger<FaqService> _logger,
        IConfiguration configuration,
        ApplicationDbContext dbContext)
    {
        _httpClient = httpClient;
        this._logger = _logger;
        _configuration = configuration;
        _dbContext = dbContext;

        // Configurar timeout de 60 segundos para ambas rotas
        _httpClient.Timeout = TimeSpan.FromSeconds(60);
    }

    public async Task<GenerateFaqResponseDto> GenerateGeneralFaqAsync(int numberOfQuestions)
    {
        var startTime = DateTime.UtcNow;

        try
        {
            _logger.LogInformation("Iniciando geração de FAQ geral com {NumberOfQuestions} perguntas", numberOfQuestions);

            // Construir prompt contextualizado
            var prompt = BuildFaqPrompt(numberOfQuestions);

            // Chamar Gemini API
            var faqItems = await CallGeminiApiAsync(prompt);

            if (faqItems == null || faqItems.Count == 0)
            {
                _logger.LogWarning("Gemini retornou resposta vazia ou inválida");
                return new GenerateFaqResponseDto
                {
                    Success = false,
                    Message = "Não foi possível gerar o FAQ. Por favor, tente novamente.",
                    GeneratedAt = DateTime.UtcNow,
                    TotalQuestions = 0
                };
            }

            var response = new GenerateFaqResponseDto
            {
                Success = true,
                Data = faqItems,
                GeneratedAt = DateTime.UtcNow,
                TotalQuestions = faqItems.Count
            };

            var processingTime = (DateTime.UtcNow - startTime).TotalMilliseconds;
            _logger.LogInformation("FAQ gerado com sucesso em {ProcessingTime}ms. Total: {Count} perguntas",
                processingTime, faqItems.Count);

            return response;
        }
        catch (TaskCanceledException ex)
        {
            _logger.LogError(ex, "Timeout ao gerar FAQ (30 segundos)");
            return new GenerateFaqResponseDto
            {
                Success = false,
                Message = "A requisição excedeu o tempo limite. Por favor, tente novamente.",
                GeneratedAt = DateTime.UtcNow,
                TotalQuestions = 0
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao gerar FAQ geral");
            return new GenerateFaqResponseDto
            {
                Success = false,
                Message = "Erro interno ao gerar FAQ. Por favor, tente novamente mais tarde.",
                GeneratedAt = DateTime.UtcNow,
                TotalQuestions = 0
            };
        }
    }

    private string BuildFaqPrompt(int numberOfQuestions)
    {
        return $@"Você é um assistente especializado no sistema SAFI (Sistema de Atendimento e Feedback Inteligente).

O SAFI é uma plataforma de suporte técnico com as seguintes funcionalidades:
- Criação e gerenciamento de tickets de suporte
- Escalação automática entre níveis N1, N2 e N3
- Chat em tempo real entre clientes e analistas
- Autenticação segura com JWT
- Análise inteligente de tickets com IA
- Priorização automática de chamados

Gere {numberOfQuestions} perguntas frequentes (FAQ) em português brasileiro sobre o sistema SAFI, cobrindo:
- Como criar tickets
- Como funciona a escalação
- Diferenças entre níveis de suporte
- Como usar o chat em tempo real
- Questões sobre segurança e autenticação
- Funcionalidades de IA

Para cada pergunta, forneça uma resposta clara e objetiva (2-4 frases).

Formato de saída: JSON array com objetos contendo ""pergunta"" e ""resposta"".

Exemplo:
[
  {{
    ""pergunta"": ""Como criar um ticket no SAFI?"",
    ""resposta"": ""Para criar um ticket, acesse a seção 'Novo Ticket', preencha o título, descrição do problema, selecione a categoria e prioridade. O sistema atribuirá automaticamente um analista disponível do nível N1.""
  }}
]

IMPORTANTE: Responda APENAS com o JSON array, sem texto adicional antes ou depois.";
    }

    private async Task<List<FaqItemDto>?> CallGeminiApiAsync(string prompt)
    {
        try
        {
            var apiKey = _configuration["ExternalServices:GeminiApi:ApiKey"];
            var baseUrl = _configuration["ExternalServices:GeminiApi:BaseUrl"];
            var modelId = _configuration["ExternalServices:GeminiApi:ModelId"] ?? "gemini-2.5-flash-lite";

            if (string.IsNullOrEmpty(apiKey) || apiKey == "YOUR_GEMINI_API_KEY_HERE")
            {
                _logger.LogWarning("Chave da API Gemini não configurada");
                return null;
            }

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
                    temperature = 0.7,
                    topK = 40,
                    topP = 0.95,
                    maxOutputTokens = 2048
                }
            };

            var jsonContent = JsonSerializer.Serialize(geminiRequest);
            var content = new StringContent(jsonContent, Encoding.UTF8, "application/json");

            _httpClient.DefaultRequestHeaders.Clear();

            var url = $"{baseUrl}/models/{modelId}:generateContent?key={apiKey}";
            _logger.LogInformation("Chamando Gemini API: {Url}", url);

            var response = await _httpClient.PostAsync(url, content);

            if (!response.IsSuccessStatusCode)
            {
                var errorContent = await response.Content.ReadAsStringAsync();
                _logger.LogError("Erro na API Gemini: {StatusCode} - {Error}",
                    response.StatusCode, errorContent);
                return null;
            }

            var responseContent = await response.Content.ReadAsStringAsync();
            _logger.LogDebug("Resposta da API Gemini: {ResponseContent}", responseContent);

            // Parsear resposta
            return ParseGeminiResponse(responseContent);
        }
        catch (HttpRequestException ex)
        {
            _logger.LogError(ex, "Erro de conexão ao chamar Gemini API");
            return null;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao chamar Gemini API");
            return null;
        }
    }

    private List<FaqItemDto>? ParseGeminiResponse(string responseContent)
    {
        try
        {
            using var jsonDoc = JsonDocument.Parse(responseContent);
            var root = jsonDoc.RootElement;

            if (!root.TryGetProperty("candidates", out var candidates) ||
                candidates.GetArrayLength() == 0)
            {
                _logger.LogWarning("Resposta do Gemini não contém candidates");
                return null;
            }

            var firstCandidate = candidates[0];
            if (!firstCandidate.TryGetProperty("content", out var content) ||
                !content.TryGetProperty("parts", out var parts) ||
                parts.GetArrayLength() == 0)
            {
                _logger.LogWarning("Resposta do Gemini não contém content/parts");
                return null;
            }

            var textContent = parts[0].GetProperty("text").GetString();
            if (string.IsNullOrEmpty(textContent))
            {
                _logger.LogWarning("Texto da resposta Gemini está vazio");
                return null;
            }

            _logger.LogDebug("Texto extraído do Gemini: {Text}", textContent);

            // Extrair JSON do texto (pode vir com markdown)
            var jsonText = ExtractJsonFromText(textContent);
            if (string.IsNullOrEmpty(jsonText))
            {
                _logger.LogWarning("Não foi possível extrair JSON da resposta: {Text}", textContent);
                return null;
            }

            // Parsear array de FAQ
            var faqItems = JsonSerializer.Deserialize<List<FaqItemDto>>(jsonText, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });

            return faqItems;
        }
        catch (JsonException ex)
        {
            _logger.LogError(ex, "Erro ao parsear resposta JSON do Gemini");
            return null;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao processar resposta do Gemini");
            return null;
        }
    }

    private string? ExtractJsonFromText(string text)
    {
        try
        {
            // Remover markdown code blocks se existirem
            text = text.Trim();

            if (text.StartsWith("```json"))
            {
                text = text.Substring(7); // Remove ```json
            }
            else if (text.StartsWith("```"))
            {
                text = text.Substring(3); // Remove ```
            }

            if (text.EndsWith("```"))
            {
                text = text.Substring(0, text.Length - 3); // Remove ```
            }

            text = text.Trim();

            // Verificar se começa com [ (array JSON)
            var startIndex = text.IndexOf('[');
            var endIndex = text.LastIndexOf(']');

            if (startIndex >= 0 && endIndex > startIndex)
            {
                return text.Substring(startIndex, endIndex - startIndex + 1);
            }

            _logger.LogWarning("Texto não contém um array JSON válido");
            return null;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao extrair JSON do texto");
            return null;
        }
    }

    public async Task<GenerateFaqFromTicketsResponseDto> GenerateFaqFromTicketsAsync(
        int numberOfQuestions,
        int daysToAnalyze,
        int minOccurrences)
    {
        var startTime = DateTime.UtcNow;

        try
        {
            _logger.LogInformation(
                "Iniciando geração de FAQ de tickets: {Questions} perguntas, {Days} dias, mínimo {MinOccurrences} ocorrências",
                numberOfQuestions, daysToAnalyze, minOccurrences);

            // 1. Análise de tickets resolvidos
            var cutoffDate = DateTime.UtcNow.AddDays(-daysToAnalyze);
            var queryStartTime = DateTime.UtcNow;

            var tickets = await _dbContext.Tickets
                .Where(t => t.ResolvedAt != null && t.ResolvedAt >= cutoffDate)
                .Include(t => t.IssueType)
                .ToListAsync();

            var queryTime = (DateTime.UtcNow - queryStartTime).TotalMilliseconds;
            _logger.LogInformation("Query concluída em {QueryTime}ms. Tickets encontrados: {Count}",
                queryTime, tickets.Count);

            if (tickets.Count == 0)
            {
                _logger.LogWarning("Nenhum ticket resolvido encontrado no período de {Days} dias", daysToAnalyze);
                return new GenerateFaqFromTicketsResponseDto
                {
                    Success = false,
                    Message = $"Não há tickets resolvidos suficientes para análise. Total encontrado: 0. Tente aumentar o período de análise.",
                    GeneratedAt = DateTime.UtcNow,
                    TotalTicketsAnalyzed = 0,
                    AnalyzedPeriod = $"Últimos {daysToAnalyze} dias"
                };
            }

            // 2. Agrupamento por tipo de problema
            var groupedIssues = tickets
                .GroupBy(t => t.IssueTypeId)
                .Select(g => new
                {
                    IssueType = g.First().IssueType,
                    Count = g.Count(),
                    Examples = g.Take(5).Select(t => new { t.Title, t.Detailing }).ToList()
                })
                .Where(g => g.Count >= minOccurrences)
                .OrderByDescending(g => g.Count)
                .ToList();

            _logger.LogInformation("Grupos identificados: {GroupCount}. Após filtro minOccurrences: {FilteredCount}",
                tickets.GroupBy(t => t.IssueTypeId).Count(), groupedIssues.Count);

            if (groupedIssues.Count == 0)
            {
                _logger.LogWarning("Nenhum problema frequente identificado com mínimo {MinOccurrences} ocorrências", minOccurrences);
                return new GenerateFaqFromTicketsResponseDto
                {
                    Success = false,
                    Message = $"Não há tickets resolvidos suficientes para análise. Total encontrado: {tickets.Count}. Tente reduzir o mínimo de ocorrências ou aumentar o período.",
                    GeneratedAt = DateTime.UtcNow,
                    TotalTicketsAnalyzed = tickets.Count,
                    AnalyzedPeriod = $"Últimos {daysToAnalyze} dias"
                };
            }

            // 3. Construir prompt com dados reais
            var prompt = BuildTicketFaqPrompt(numberOfQuestions, daysToAnalyze, tickets.Count, groupedIssues);

            // 4. Chamar Gemini API
            var geminiStartTime = DateTime.UtcNow;
            var faqItemsRaw = await CallGeminiApiAsync(prompt);
            var geminiTime = (DateTime.UtcNow - geminiStartTime).TotalMilliseconds;
            _logger.LogInformation("Chamada ao Gemini concluída em {GeminiTime}ms", geminiTime);

            if (faqItemsRaw == null || faqItemsRaw.Count == 0)
            {
                _logger.LogWarning("Gemini retornou resposta vazia ou inválida para FAQ de tickets");
                return new GenerateFaqFromTicketsResponseDto
                {
                    Success = false,
                    Message = "Não foi possível gerar o FAQ. Por favor, tente novamente.",
                    GeneratedAt = DateTime.UtcNow,
                    TotalTicketsAnalyzed = tickets.Count,
                    AnalyzedPeriod = $"Últimos {daysToAnalyze} dias"
                };
            }

            // 5. Mapear para FaqTicketItemDto e adicionar metadata
            var faqItems = faqItemsRaw.Select(item =>
            {
                // Tentar encontrar a categoria nos dados agrupados
                var matchingGroup = groupedIssues.FirstOrDefault(g =>
                    g.IssueType.Name.Equals(item.Pergunta.Contains(g.IssueType.Name) ? g.IssueType.Name : null,
                        StringComparison.OrdinalIgnoreCase));

                return new FaqTicketItemDto
                {
                    Pergunta = item.Pergunta,
                    Resposta = item.Resposta,
                    Category = matchingGroup?.IssueType.Name ?? "Geral",
                    TicketCount = matchingGroup?.Count ?? 0
                };
            }).ToList();

            var totalTime = (DateTime.UtcNow - startTime).TotalMilliseconds;
            _logger.LogInformation("FAQ de tickets gerado com sucesso em {TotalTime}ms. Total: {Count} perguntas",
                totalTime, faqItems.Count);

            return new GenerateFaqFromTicketsResponseDto
            {
                Success = true,
                Data = faqItems,
                GeneratedAt = DateTime.UtcNow,
                TotalQuestions = faqItems.Count,
                AnalyzedPeriod = $"Últimos {daysToAnalyze} dias",
                TotalTicketsAnalyzed = tickets.Count
            };
        }
        catch (TaskCanceledException ex)
        {
            _logger.LogError(ex, "Timeout ao gerar FAQ de tickets (60 segundos)");
            return new GenerateFaqFromTicketsResponseDto
            {
                Success = false,
                Message = "A requisição excedeu o tempo limite. Por favor, tente novamente.",
                GeneratedAt = DateTime.UtcNow,
                TotalTicketsAnalyzed = 0,
                AnalyzedPeriod = $"Últimos {daysToAnalyze} dias"
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao gerar FAQ de tickets");
            return new GenerateFaqFromTicketsResponseDto
            {
                Success = false,
                Message = "Erro interno ao gerar FAQ. Por favor, tente novamente mais tarde.",
                GeneratedAt = DateTime.UtcNow,
                TotalTicketsAnalyzed = 0,
                AnalyzedPeriod = $"Últimos {daysToAnalyze} dias"
            };
        }
    }

    private string BuildTicketFaqPrompt(int numberOfQuestions, int daysToAnalyze, int totalTickets, dynamic groupedIssues)
    {
        var promptBuilder = new StringBuilder();

        promptBuilder.AppendLine($@"Você é um assistente especializado em criar FAQs baseados em dados reais de um sistema de suporte.

CONTEXTO:
Você está analisando tickets do SAFI (Sistema de Atendimento e Feedback Inteligente) dos últimos {daysToAnalyze} dias.
Total de tickets resolvidos analisados: {totalTickets}

PROBLEMAS MAIS FREQUENTES IDENTIFICADOS:
");

        int issueNumber = 1;
        foreach (var group in groupedIssues)
        {
            promptBuilder.AppendLine($@"
{issueNumber}. {group.IssueType.Name} ({group.Count} ocorrências)
   Descrição: {group.IssueType.Description ?? "N/A"}
   Exemplos de tickets:");

            foreach (var example in group.Examples)
            {
                promptBuilder.AppendLine($"   - \"{example.Title}\": {example.Detailing ?? "Sem detalhes"}");
            }

            issueNumber++;
        }

        promptBuilder.AppendLine($@"

TAREFA:
Gere {numberOfQuestions} perguntas frequentes (FAQ) em português brasileiro baseadas nesses dados reais.

REGRAS:
- Priorize problemas com maior número de ocorrências
- Use linguagem clara e acessível
- Respostas devem ser práticas e acionáveis (2-4 frases)
- Inclua informações sobre como resolver ou evitar o problema
- Mencione se há processos específicos no SAFI (escalação, prioridades, etc.)

FORMATO DE SAÍDA: JSON array com objetos contendo ""pergunta"" e ""resposta"".

Exemplo:
[
  {{
    ""pergunta"": ""Por que o sistema está lento?"",
    ""resposta"": ""Lentidão pode ocorrer por sobrecarga de processamento ou conexão de rede instável. Tente limpar o cache do navegador e reiniciar a aplicação. Se persistir, abra um ticket para análise técnica pelo suporte N2.""
  }}
]

IMPORTANTE: Responda APENAS com o JSON array, sem texto adicional antes ou depois.");

        return promptBuilder.ToString();
    }
}
