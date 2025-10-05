using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Safi.Backend.Modules.Tickets.DTOs;
using Safi.Backend.Modules.Tickets.Services;
using Safi.Backend.Shared.Attributes;

namespace Safi.Backend.Modules.Tickets.Controllers;

/// <summary>
/// Controller para gerenciamento de tickets
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class TicketsController : ControllerBase
{
    private readonly ITicketService _ticketService;
    private readonly ILogger<TicketsController> _logger;

    public TicketsController(ITicketService ticketService, ILogger<TicketsController> logger)
    {
        _ticketService = ticketService;
        _logger = logger;
    }

    /// <summary>
    /// Criar ticket público (sem autenticação)
    /// </summary>
    /// <param name="request">Dados do ticket público</param>
    /// <returns>Ticket criado com ID</returns>
    [HttpPost("public")]
    [IsPublic]
    public async Task<IActionResult> CreatePublicTicket([FromBody] PublicTicketRequest request)
    {
        try
        {
            _logger.LogInformation("Tentativa de criação de ticket público para: {Email}", request.RequesterEmail);

            var ticket = await _ticketService.CreatePublicTicketAsync(request);
            if (ticket == null)
            {
                _logger.LogWarning("Falha ao criar ticket público para: {Email}", request.RequesterEmail);
                return BadRequest(new { message = "Erro ao criar ticket público" });
            }

            _logger.LogInformation("Ticket público criado com sucesso: {TicketId}", ticket.Id);
            return Ok(new
            {
                ticketId = ticket.Id,
                message = "Ticket criado com sucesso e enviado para análise da IA",
                status = ticket.Status.ToString(),
                priority = ticket.Priority.ToString(),
                createdAt = ticket.CreatedAt
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao criar ticket público para: {Email}", request.RequesterEmail);
            return StatusCode(500, new { message = "Erro interno do servidor" });
        }
    }

    /// <summary>
    /// Listar tickets para analista
    /// </summary>
    /// <param name="request">Filtros de busca</param>
    /// <returns>Lista paginada de tickets</returns>
    [HttpGet]
    [IsPublic]
    public async Task<IActionResult> GetTickets([FromQuery] TicketListRequest request)
    {
        try
        {
            _logger.LogInformation("Listagem de tickets solicitada com filtros: {Filters}", request);

            var (tickets, totalCount) = await _ticketService.GetTicketsPaginatedAsync(request);

            var response = new
            {
                tickets = tickets.Select(t => new
                {
                    id = t.Id,
                    title = t.Title,
                    status = t.Status.ToString(),
                    priority = t.Priority.ToString(),
                    userName = t.User?.Name ?? "N/A",
                    assignedTo = t.AssignedTo?.Name ?? "Não atribuído",
                    createdAt = t.CreatedAt,
                    updatedAt = t.UpdatedAt
                }),
                pagination = new
                {
                    currentPage = request.PageNumber,
                    pageSize = request.PageSize,
                    totalCount = totalCount,
                    totalPages = (int)Math.Ceiling((double)totalCount / request.PageSize)
                }
            };

            _logger.LogInformation("Listagem de tickets retornada: {Count} tickets", tickets.Count());
            return Ok(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao listar tickets");
            return StatusCode(500, new { message = "Erro interno do servidor" });
        }
    }

    /// <summary>
    /// Obter detalhes de um ticket específico
    /// </summary>
    /// <param name="id">ID do ticket</param>
    /// <returns>Detalhes completos do ticket</returns>
    [HttpGet("{id}")]
    [IsPublic]
    [Microsoft.AspNetCore.Authorization.Authorize]
    public async Task<IActionResult> GetTicket(int id)
    {
        try
        {
            _logger.LogInformation("Detalhes do ticket solicitado: {TicketId}", id);

            var ticket = await _ticketService.GetTicketByIdAsync(id);
            if (ticket == null)
            {
                _logger.LogWarning("Ticket não encontrado: {TicketId}", id);
                return NotFound(new { message = "Ticket não encontrado" });
            }

            var response = new
            {
                id = ticket.Id,
                title = ticket.Title,
                detailing = ticket.Detailing,
                status = ticket.Status.ToString(),
                priority = ticket.Priority.ToString(),
                issueType = ticket.IssueType?.Name ?? "N/A",
                user = new
                {
                    id = ticket.User.Id,
                    name = ticket.User.Name,
                    email = ticket.User.Email
                },
                assignedTo = ticket.AssignedTo != null ? new
                {
                    id = ticket.AssignedTo.Id,
                    name = ticket.AssignedTo.Name,
                    email = ticket.AssignedTo.Email
                } : null,
                createdAt = ticket.CreatedAt,
                updatedAt = ticket.UpdatedAt,
                resolvedAt = ticket.ResolvedAt
            };

            _logger.LogInformation("Detalhes do ticket retornados: {TicketId}", id);
            return Ok(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao obter detalhes do ticket: {TicketId}", id);
            return StatusCode(500, new { message = "Erro interno do servidor" });
        }
    }

    /// <summary>
    /// Atualizar ticket
    /// </summary>
    /// <param name="id">ID do ticket</param>
    /// <param name="request">Dados de atualização</param>
    /// <returns>Ticket atualizado</returns>
    [HttpPut("{id}")]
    [IsPublic]
    [Microsoft.AspNetCore.Authorization.Authorize]
    public async Task<IActionResult> UpdateTicket(int id, [FromBody] UpdateTicketRequest request)
    {
        try
        {
            // TODO: Obter userId do token JWT
            var userId = 1; // Mock para desenvolvimento

            _logger.LogInformation("Atualização do ticket solicitada: {TicketId}", id);

            var ticket = await _ticketService.UpdateTicketAsync(id, request, userId);
            if (ticket == null)
            {
                _logger.LogWarning("Ticket não encontrado para atualização: {TicketId}", id);
                return NotFound(new { message = "Ticket não encontrado" });
            }

            _logger.LogInformation("Ticket atualizado com sucesso: {TicketId}", id);
            return Ok(new
            {
                id = ticket.Id,
                title = ticket.Title,
                status = ticket.Status.ToString(),
                priority = ticket.Priority.ToString(),
                updatedAt = ticket.UpdatedAt,
                message = "Ticket atualizado com sucesso"
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao atualizar ticket: {TicketId}", id);
            return StatusCode(500, new { message = "Erro interno do servidor" });
        }
    }

    /// <summary>
    /// Endpoint protegido para teste de autenticação
    /// </summary>
    /// <returns>Informações do usuário autenticado</returns>
    [HttpGet("me")]
    [IsPublic]
    [Microsoft.AspNetCore.Authorization.Authorize]
    public IActionResult GetCurrentUser()
    {
        var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        var userName = User.FindFirst(System.Security.Claims.ClaimTypes.Name)?.Value;
        var userEmail = User.FindFirst(System.Security.Claims.ClaimTypes.Email)?.Value;
        var userType = User.FindFirst("UserType")?.Value;

        return Ok(new
        {
            message = "Usuário autenticado com sucesso!",
            userId = userId,
            userName = userName,
            userEmail = userEmail,
            userType = userType,
            timestamp = DateTime.UtcNow
        });
    }

    /// <summary>
    /// Obter estatísticas de tickets
    /// </summary>
    /// <returns>Estatísticas dos tickets</returns>
    [HttpGet("statistics")]
    [IsPublic]
    [Microsoft.AspNetCore.Authorization.Authorize]
    public async Task<IActionResult> GetStatistics()
    {
        try
        {
            _logger.LogInformation("Estatísticas de tickets solicitadas");

            var statistics = await _ticketService.GetTicketStatisticsAsync();

            var response = new
            {
                totalTickets = statistics.TotalTickets,
                openTickets = statistics.OpenTickets,
                inProgressTickets = statistics.InProgressTickets,
                pendingTickets = statistics.PendingTickets,
                resolvedTickets = statistics.ResolvedTickets,
                closedTickets = statistics.ClosedTickets,
                priorityBreakdown = new
                {
                    low = statistics.LowPriorityTickets,
                    medium = statistics.MediumPriorityTickets,
                    high = statistics.HighPriorityTickets,
                    urgent = statistics.UrgentTickets
                },
                averageResolutionTimeHours = statistics.AverageResolutionTimeHours,
                ticketsOverSla = statistics.TicketsOverSla
            };

            _logger.LogInformation("Estatísticas de tickets retornadas");
            return Ok(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao obter estatísticas de tickets");
            return StatusCode(500, new { message = "Erro interno do servidor" });
        }
    }
}