using Microsoft.EntityFrameworkCore;
using Safi.Backend.Core.Entities;
using Safi.Backend.Core.Enums;
using Safi.Backend.Core.Interfaces;
using Safi.Backend.Infrastructure.Data.Context;

namespace Safi.Backend.Infrastructure.Data.Repositories;

/// <summary>
/// Implementação do repositório de tickets
/// </summary>
public class TicketRepository : Repository<Ticket>, ITicketRepository
{
    public TicketRepository(ApplicationDbContext context) : base(context)
    {
    }

    public async Task<IEnumerable<Ticket>> GetByStatusAsync(TicketStatus status)
    {
        return await _dbSet
            .Where(t => t.Status == status)
            .Include(t => t.User)
            .Include(t => t.AssignedTo)
            .Include(t => t.IssueType)
            .OrderByDescending(t => t.CreatedAt)
            .ToListAsync();
    }

    public async Task<IEnumerable<Ticket>> GetByPriorityAsync(TicketPriority priority)
    {
        return await _dbSet
            .Where(t => t.Priority == priority)
            .Include(t => t.User)
            .Include(t => t.AssignedTo)
            .Include(t => t.IssueType)
            .OrderByDescending(t => t.CreatedAt)
            .ToListAsync();
    }

    public async Task<IEnumerable<Ticket>> GetByUserIdAsync(int userId)
    {
        return await _dbSet
            .Where(t => t.UserId == userId)
            .Include(t => t.User)
            .Include(t => t.AssignedTo)
            .Include(t => t.IssueType)
            .OrderByDescending(t => t.CreatedAt)
            .ToListAsync();
    }

    public async Task<IEnumerable<Ticket>> GetByAssignedToAsync(int analystId)
    {
        return await _dbSet
            .Where(t => t.AssignedToId == analystId)
            .Include(t => t.User)
            .Include(t => t.AssignedTo)
            .Include(t => t.IssueType)
            .OrderByDescending(t => t.CreatedAt)
            .ToListAsync();
    }

    public async Task<IEnumerable<Ticket>> GetByIssueTypeAsync(int issueTypeId)
    {
        return await _dbSet
            .Where(t => t.IssueTypeId == issueTypeId)
            .Include(t => t.User)
            .Include(t => t.AssignedTo)
            .Include(t => t.IssueType)
            .OrderByDescending(t => t.CreatedAt)
            .ToListAsync();
    }

    public async Task<IEnumerable<Ticket>> GetFilteredAsync(
        TicketStatus? status = null,
        TicketPriority? priority = null,
        int? userId = null,
        int? assignedTo = null,
        int? issueTypeId = null)
    {
        var query = _dbSet.AsQueryable();

        if (status.HasValue)
            query = query.Where(t => t.Status == status.Value);

        if (priority.HasValue)
            query = query.Where(t => t.Priority == priority.Value);

        if (userId.HasValue)
            query = query.Where(t => t.UserId == userId.Value);

        if (assignedTo.HasValue)
            query = query.Where(t => t.AssignedToId == assignedTo.Value);

        if (issueTypeId.HasValue)
            query = query.Where(t => t.IssueTypeId == issueTypeId.Value);

        return await query
            .Include(t => t.User)
            .Include(t => t.AssignedTo)
            .Include(t => t.IssueType)
            .OrderByDescending(t => t.CreatedAt)
            .ToListAsync();
    }

    public async Task<(IEnumerable<Ticket> Tickets, int TotalCount)> GetPaginatedAsync(
        int pageNumber,
        int pageSize,
        TicketStatus? status = null,
        TicketPriority? priority = null,
        int? userId = null,
        int? assignedTo = null,
        int? issueTypeId = null)
    {
        var query = _dbSet.AsQueryable();

        if (status.HasValue)
            query = query.Where(t => t.Status == status.Value);

        if (priority.HasValue)
            query = query.Where(t => t.Priority == priority.Value);

        if (userId.HasValue)
            query = query.Where(t => t.UserId == userId.Value);

        if (assignedTo.HasValue)
            query = query.Where(t => t.AssignedToId == assignedTo.Value);

        if (issueTypeId.HasValue)
            query = query.Where(t => t.IssueTypeId == issueTypeId.Value);

        var totalCount = await query.CountAsync();

        var tickets = await query
            .Include(t => t.User)
            .Include(t => t.AssignedTo)
            .Include(t => t.IssueType)
            .OrderByDescending(t => t.CreatedAt)
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return (tickets, totalCount);
    }

    public async Task<TicketStatistics> GetStatisticsAsync()
    {
        var tickets = await _dbSet.ToListAsync();

        var statistics = new TicketStatistics
        {
            TotalTickets = tickets.Count,
            OpenTickets = tickets.Count(t => t.Status == TicketStatus.Open),
            InProgressTickets = tickets.Count(t => t.Status == TicketStatus.InProgress),
            PendingTickets = tickets.Count(t => t.Status == TicketStatus.Pending),
            ResolvedTickets = tickets.Count(t => t.Status == TicketStatus.Resolved),
            ClosedTickets = tickets.Count(t => t.Status == TicketStatus.Closed),
            LowPriorityTickets = tickets.Count(t => t.Priority == TicketPriority.Low),
            MediumPriorityTickets = tickets.Count(t => t.Priority == TicketPriority.Medium),
            HighPriorityTickets = tickets.Count(t => t.Priority == TicketPriority.High),
            UrgentTickets = tickets.Count(t => t.Priority == TicketPriority.Urgent)
        };

        // Calcular tempo médio de resolução
        var resolvedTickets = tickets.Where(t => t.ResolvedAt.HasValue).ToList();
        if (resolvedTickets.Any())
        {
            var totalResolutionTime = resolvedTickets.Sum(t => 
                (t.ResolvedAt!.Value - t.CreatedAt).TotalHours);
            statistics.AverageResolutionTimeHours = totalResolutionTime / resolvedTickets.Count;
        }

        // Calcular tickets em atraso (SLA de 24 horas para urgente, 72 para alta, etc.)
        var now = DateTime.UtcNow;
        statistics.TicketsOverSla = tickets.Count(t => 
            t.Status != TicketStatus.Resolved && 
            t.Status != TicketStatus.Closed &&
            (t.Priority == TicketPriority.Urgent && (now - t.CreatedAt).TotalHours > 24) ||
            (t.Priority == TicketPriority.High && (now - t.CreatedAt).TotalHours > 72) ||
            (t.Priority == TicketPriority.Medium && (now - t.CreatedAt).TotalHours > 168) ||
            (t.Priority == TicketPriority.Low && (now - t.CreatedAt).TotalHours > 336));

        return statistics;
    }

    public async Task<bool> AssignTicketAsync(int ticketId, int analystId)
    {
        var ticket = await _dbSet.FindAsync(ticketId);
        if (ticket == null)
            return false;

        ticket.AssignedToId = analystId;
        ticket.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> UpdateStatusAsync(int ticketId, TicketStatus status, int userId)
    {
        var ticket = await _dbSet.FindAsync(ticketId);
        if (ticket == null)
            return false;

        var oldStatus = ticket.Status;
        ticket.Status = status;
        ticket.UpdatedAt = DateTime.UtcNow;

        if (status == TicketStatus.Resolved || status == TicketStatus.Closed)
        {
            ticket.ResolvedAt = DateTime.UtcNow;
        }

        // Adicionar entrada no histórico
        var history = new TicketHistory
        {
            TicketId = ticketId,
            ChangedById = userId,
            ChangeDescription = $"Status alterado de {oldStatus} para {status}",
            ChangeType = "status_change",
            OldValue = oldStatus.ToString(),
            NewValue = status.ToString(),
            ChangedAt = DateTime.UtcNow
        };

        _context.TicketHistory.Add(history);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<IEnumerable<Ticket>> GetTicketsNearSlaAsync(int hoursBeforeSla = 24)
    {
        var now = DateTime.UtcNow;
        var cutoffTime = now.AddHours(-hoursBeforeSla);

        return await _dbSet
            .Where(t => 
                t.Status != TicketStatus.Resolved && 
                t.Status != TicketStatus.Closed &&
                t.CreatedAt <= cutoffTime &&
                ((t.Priority == TicketPriority.Urgent && (now - t.CreatedAt).TotalHours > 24) ||
                 (t.Priority == TicketPriority.High && (now - t.CreatedAt).TotalHours > 72) ||
                 (t.Priority == TicketPriority.Medium && (now - t.CreatedAt).TotalHours > 168) ||
                 (t.Priority == TicketPriority.Low && (now - t.CreatedAt).TotalHours > 336)))
            .Include(t => t.User)
            .Include(t => t.AssignedTo)
            .Include(t => t.IssueType)
            .OrderBy(t => t.Priority)
            .ThenBy(t => t.CreatedAt)
            .ToListAsync();
    }
}
