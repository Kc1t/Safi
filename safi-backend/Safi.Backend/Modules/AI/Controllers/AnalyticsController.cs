using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Safi.Backend.Modules.AI.Services;
using Safi.Backend.Core.Interfaces;
using Safi.Backend.Core.Entities;
using Microsoft.EntityFrameworkCore;

namespace Safi.Backend.Modules.AI.Controllers;

/// <summary>
/// Controller para análises e relatórios com IA
/// </summary>
[ApiController]
[Route("api/ai/analytics")]
public class AnalyticsController : ControllerBase
{
    private readonly ITicketRepository _ticketRepository;
    private readonly IAIService _aiService;
    private readonly ILogger<AnalyticsController> _logger;

    public AnalyticsController(
        ITicketRepository ticketRepository,
        IAIService aiService,
        ILogger<AnalyticsController> logger)
    {
        _ticketRepository = ticketRepository;
        _aiService = aiService;
        _logger = logger;
    }

    /// <summary>
    /// Gera resumo analítico do dia com base nos últimos 20 tickets
    /// </summary>
    /// <returns>Análise textual gerada pela IA</returns>
    [HttpGet("daily-summary")]
    [AllowAnonymous]
    public async Task<IActionResult> GetDailySummary()
    {
        try
        {
            _logger.LogInformation("Gerando resumo analítico diário");

            // Buscar últimos 20 tickets do dia atual
            var today = DateTime.UtcNow.Date;
            var tickets = await _ticketRepository
                .GetAllAsync()
                .ContinueWith(async t =>
                {
                    var allTickets = await t;
                    return allTickets
                        .Where(ticket => ticket.CreatedAt.Date == today)
                        .OrderByDescending(ticket => ticket.CreatedAt)
                        .Take(20)
                        .ToList();
                });

            var ticketList = await tickets;

            if (!ticketList.Any())
            {
                return Ok(new
                {
                    summary = "Nenhum ticket foi registrado hoje ainda. O expediente está tranquilo até o momento.",
                    ticketsAnalyzed = 0,
                    date = today.ToString("dd/MM/yyyy")
                });
            }

            // Preparar dados para análise
            var ticketData = PrepareTicketDataForAnalysis(ticketList);

            // Gerar prompt para IA
            var prompt = $@"Você é um analista de performance de help desk. Analise os dados abaixo e gere um relatório de desempenho do dia para o analista.

DADOS DO DIA ({today:dd/MM/yyyy}):
- Total de tickets analisados: {ticketList.Count}
- Tickets por status: {ticketData.StatusBreakdown}
- Tickets por prioridade: {ticketData.PriorityBreakdown}
- Horário do primeiro ticket: {ticketData.FirstTicketTime}
- Horário do último ticket: {ticketData.LastTicketTime}
- Intervalo de tempo: {ticketData.TimeSpan}

DETALHES DOS TICKETS:
{ticketData.TicketDetails}

INSTRUÇÕES:
1. Escreva um relatório em português brasileiro, tom profissional mas amigável
2. Comente sobre:
   - Como iniciou o expediente
   - Padrões de volume de tickets ao longo do dia
   - Distribuição de prioridades
   - Possíveis picos de demanda
   - Índice aproximado de resolução
3. Use dados concretos (horários, quantidades, porcentagens)
4. Seja específico mas conciso (máximo 4 parágrafos)
5. Dê feedback construtivo e motivacional
6. NÃO use markdown, apenas texto simples

Exemplo do tom desejado:
""Você iniciou o expediente com boa responsabilidade às solicitações de atendimento. O tempo médio de resposta nos primeiros tickets foi satisfatório (média de 3m20s), porém observou-se uma leve queda de rendimento a partir das 10h15...""";

            // Chamar IA para gerar análise
            var analysisResponse = await _aiService.SendMessageAsync(prompt);

            _logger.LogInformation("Resumo analítico gerado com sucesso: {TicketCount} tickets analisados", ticketList.Count);

            return Ok(new
            {
                summary = analysisResponse,
                ticketsAnalyzed = ticketList.Count,
                date = today.ToString("dd/MM/yyyy"),
                breakdown = new
                {
                    byStatus = ticketData.StatusCounts,
                    byPriority = ticketData.PriorityCounts
                },
                timeRange = new
                {
                    first = ticketData.FirstTicketTime,
                    last = ticketData.LastTicketTime,
                    span = ticketData.TimeSpan
                }
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao gerar resumo analítico diário");
            return StatusCode(500, new { message = "Erro ao gerar análise", error = ex.Message });
        }
    }

    /// <summary>
    /// Prepara dados dos tickets para análise
    /// </summary>
    private TicketAnalysisData PrepareTicketDataForAnalysis(List<Ticket> tickets)
    {
        var statusCounts = tickets.GroupBy(t => t.Status.ToString())
            .ToDictionary(g => g.Key, g => g.Count());

        var priorityCounts = tickets.GroupBy(t => t.Priority.ToString())
            .ToDictionary(g => g.Key, g => g.Count());

        var statusBreakdown = string.Join(", ", statusCounts.Select(kv => $"{kv.Key}: {kv.Value}"));
        var priorityBreakdown = string.Join(", ", priorityCounts.Select(kv => $"{kv.Key}: {kv.Value}"));

        var firstTicket = tickets.OrderBy(t => t.CreatedAt).First();
        var lastTicket = tickets.OrderByDescending(t => t.CreatedAt).First();

        var timeSpan = lastTicket.CreatedAt - firstTicket.CreatedAt;
        var timeSpanText = $"{(int)timeSpan.TotalHours}h {timeSpan.Minutes}m";

        var ticketDetails = string.Join("\n", tickets.Select((t, index) =>
            $"{index + 1}. [{t.CreatedAt:HH:mm}] {t.Status} - {t.Priority} - {t.Title}"
        ));

        return new TicketAnalysisData
        {
            StatusCounts = statusCounts,
            PriorityCounts = priorityCounts,
            StatusBreakdown = statusBreakdown,
            PriorityBreakdown = priorityBreakdown,
            FirstTicketTime = firstTicket.CreatedAt.ToString("HH:mm"),
            LastTicketTime = lastTicket.CreatedAt.ToString("HH:mm"),
            TimeSpan = timeSpanText,
            TicketDetails = ticketDetails
        };
    }
}

/// <summary>
/// Dados preparados para análise de tickets
/// </summary>
public class TicketAnalysisData
{
    public Dictionary<string, int> StatusCounts { get; set; } = new();
    public Dictionary<string, int> PriorityCounts { get; set; } = new();
    public string StatusBreakdown { get; set; } = string.Empty;
    public string PriorityBreakdown { get; set; } = string.Empty;
    public string FirstTicketTime { get; set; } = string.Empty;
    public string LastTicketTime { get; set; } = string.Empty;
    public string TimeSpan { get; set; } = string.Empty;
    public string TicketDetails { get; set; } = string.Empty;
}
