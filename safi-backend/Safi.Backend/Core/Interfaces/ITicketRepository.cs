using Safi.Backend.Core.Entities;
using Safi.Backend.Core.Enums;

namespace Safi.Backend.Core.Interfaces;

/// <summary>
/// Interface específica para repositório de tickets
/// </summary>
public interface ITicketRepository : IRepository<Ticket>
{
    /// <summary>
    /// Obtém tickets por status
    /// </summary>
    /// <param name="status">Status dos tickets</param>
    /// <returns>Lista de tickets com o status especificado</returns>
    Task<IEnumerable<Ticket>> GetByStatusAsync(TicketStatus status);

    /// <summary>
    /// Obtém tickets por prioridade
    /// </summary>
    /// <param name="priority">Prioridade dos tickets</param>
    /// <returns>Lista de tickets com a prioridade especificada</returns>
    Task<IEnumerable<Ticket>> GetByPriorityAsync(TicketPriority priority);

    /// <summary>
    /// Obtém tickets por usuário
    /// </summary>
    /// <param name="userId">ID do usuário</param>
    /// <returns>Lista de tickets do usuário</returns>
    Task<IEnumerable<Ticket>> GetByUserIdAsync(int userId);

    /// <summary>
    /// Obtém tickets atribuídos a um analista
    /// </summary>
    /// <param name="analystId">ID do analista</param>
    /// <returns>Lista de tickets atribuídos ao analista</returns>
    Task<IEnumerable<Ticket>> GetByAssignedToAsync(int analystId);

    /// <summary>
    /// Obtém tickets por tipo de problema
    /// </summary>
    /// <param name="issueTypeId">ID do tipo de problema</param>
    /// <returns>Lista de tickets do tipo especificado</returns>
    Task<IEnumerable<Ticket>> GetByIssueTypeAsync(int issueTypeId);

    /// <summary>
    /// Obtém tickets com filtros combinados
    /// </summary>
    /// <param name="status">Status (opcional)</param>
    /// <param name="priority">Prioridade (opcional)</param>
    /// <param name="userId">ID do usuário (opcional)</param>
    /// <param name="assignedTo">ID do analista atribuído (opcional)</param>
    /// <param name="issueTypeId">ID do tipo de problema (opcional)</param>
    /// <returns>Lista de tickets filtrados</returns>
    Task<IEnumerable<Ticket>> GetFilteredAsync(
        TicketStatus? status = null,
        TicketPriority? priority = null,
        int? userId = null,
        int? assignedTo = null,
        int? issueTypeId = null);

    /// <summary>
    /// Obtém tickets com paginação
    /// </summary>
    /// <param name="pageNumber">Número da página</param>
    /// <param name="pageSize">Tamanho da página</param>
    /// <param name="status">Status (opcional)</param>
    /// <param name="priority">Prioridade (opcional)</param>
    /// <param name="userId">ID do usuário (opcional)</param>
    /// <param name="assignedTo">ID do analista atribuído (opcional)</param>
    /// <param name="issueTypeId">ID do tipo de problema (opcional)</param>
    /// <returns>Lista paginada de tickets</returns>
    Task<(IEnumerable<Ticket> Tickets, int TotalCount)> GetPaginatedAsync(
        int pageNumber,
        int pageSize,
        TicketStatus? status = null,
        TicketPriority? priority = null,
        int? userId = null,
        int? assignedTo = null,
        int? issueTypeId = null);

    /// <summary>
    /// Obtém estatísticas de tickets
    /// </summary>
    /// <returns>Estatísticas dos tickets</returns>
    Task<TicketStatistics> GetStatisticsAsync();

    /// <summary>
    /// Atribui um ticket a um analista
    /// </summary>
    /// <param name="ticketId">ID do ticket</param>
    /// <param name="analystId">ID do analista</param>
    /// <returns>True se atribuído com sucesso</returns>
    Task<bool> AssignTicketAsync(int ticketId, int analystId);

    /// <summary>
    /// Atualiza o status de um ticket
    /// </summary>
    /// <param name="ticketId">ID do ticket</param>
    /// <param name="status">Novo status</param>
    /// <param name="userId">ID do usuário que fez a alteração</param>
    /// <returns>True se atualizado com sucesso</returns>
    Task<bool> UpdateStatusAsync(int ticketId, TicketStatus status, int userId);

    /// <summary>
    /// Obtém tickets próximos do SLA
    /// </summary>
    /// <param name="hoursBeforeSla">Horas antes do SLA</param>
    /// <returns>Lista de tickets próximos do SLA</returns>
    Task<IEnumerable<Ticket>> GetTicketsNearSlaAsync(int hoursBeforeSla = 24);
}

/// <summary>
/// Estatísticas de tickets
/// </summary>
public class TicketStatistics
{
    public int TotalTickets { get; set; }
    public int OpenTickets { get; set; }
    public int InProgressTickets { get; set; }
    public int PendingTickets { get; set; }
    public int ResolvedTickets { get; set; }
    public int ClosedTickets { get; set; }
    public int LowPriorityTickets { get; set; }
    public int MediumPriorityTickets { get; set; }
    public int HighPriorityTickets { get; set; }
    public int UrgentTickets { get; set; }
    public double AverageResolutionTimeHours { get; set; }
    public int TicketsOverSla { get; set; }
}
