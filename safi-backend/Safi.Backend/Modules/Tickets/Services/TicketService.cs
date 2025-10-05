using Safi.Backend.Core.Entities;
using Safi.Backend.Core.Enums;
using Safi.Backend.Core.Interfaces;
using Safi.Backend.Modules.Tickets.DTOs;
using Microsoft.Extensions.Logging;

namespace Safi.Backend.Modules.Tickets.Services;

/// <summary>
/// Interface para serviço de tickets
/// </summary>
public interface ITicketService
{
    /// <summary>
    /// Cria um ticket público (sem autenticação)
    /// </summary>
    /// <param name="request">Dados do ticket público</param>
    /// <returns>Ticket criado</returns>
    Task<Ticket?> CreatePublicTicketAsync(PublicTicketRequest request);

    /// <summary>
    /// Cria um ticket autenticado
    /// </summary>
    /// <param name="request">Dados do ticket</param>
    /// <param name="userId">ID do usuário</param>
    /// <returns>Ticket criado</returns>
    Task<Ticket?> CreateTicketAsync(CreateTicketRequest request, int userId);

    /// <summary>
    /// Obtém um ticket por ID
    /// </summary>
    /// <param name="id">ID do ticket</param>
    /// <returns>Ticket encontrado</returns>
    Task<Ticket?> GetTicketByIdAsync(int id);

    /// <summary>
    /// Obtém tickets com filtros
    /// </summary>
    /// <param name="request">Filtros de busca</param>
    /// <returns>Lista de tickets</returns>
    Task<IEnumerable<Ticket>> GetTicketsAsync(TicketListRequest request);

    /// <summary>
    /// Obtém tickets paginados
    /// </summary>
    /// <param name="request">Filtros de busca</param>
    /// <returns>Lista paginada de tickets</returns>
    Task<(IEnumerable<Ticket> Tickets, int TotalCount)> GetTicketsPaginatedAsync(TicketListRequest request);

    /// <summary>
    /// Atualiza um ticket
    /// </summary>
    /// <param name="id">ID do ticket</param>
    /// <param name="request">Dados de atualização</param>
    /// <param name="userId">ID do usuário que está atualizando</param>
    /// <returns>Ticket atualizado</returns>
    Task<Ticket?> UpdateTicketAsync(int id, UpdateTicketRequest request, int userId);

    /// <summary>
    /// Atualiza o status de um ticket
    /// </summary>
    /// <param name="id">ID do ticket</param>
    /// <param name="status">Novo status</param>
    /// <param name="userId">ID do usuário que está atualizando</param>
    /// <returns>True se atualizado com sucesso</returns>
    Task<bool> UpdateTicketStatusAsync(int id, TicketStatus status, int userId);

    /// <summary>
    /// Atribui um ticket a um analista
    /// </summary>
    /// <param name="id">ID do ticket</param>
    /// <param name="analystId">ID do analista</param>
    /// <param name="userId">ID do usuário que está atribuindo</param>
    /// <returns>True se atribuído com sucesso</returns>
    Task<bool> AssignTicketAsync(int id, int analystId, int userId);

    /// <summary>
    /// Adiciona uma mensagem a um ticket
    /// </summary>
    /// <param name="ticketId">ID do ticket</param>
    /// <param name="request">Dados da mensagem</param>
    /// <param name="userId">ID do usuário que está enviando</param>
    /// <returns>Mensagem criada</returns>
    Task<TicketMessage?> AddMessageAsync(int ticketId, AddMessageRequest request, int userId);

    /// <summary>
    /// Obtém mensagens de um ticket
    /// </summary>
    /// <param name="ticketId">ID do ticket</param>
    /// <param name="userId">ID do usuário solicitante</param>
    /// <returns>Lista de mensagens</returns>
    Task<IEnumerable<TicketMessage>> GetTicketMessagesAsync(int ticketId, int userId);

    /// <summary>
    /// Obtém histórico de um ticket
    /// </summary>
    /// <param name="ticketId">ID do ticket</param>
    /// <returns>Lista de histórico</returns>
    Task<IEnumerable<TicketHistory>> GetTicketHistoryAsync(int ticketId);

    /// <summary>
    /// Obtém estatísticas de tickets
    /// </summary>
    /// <returns>Estatísticas</returns>
    Task<TicketStatistics> GetTicketStatisticsAsync();

    /// <summary>
    /// Deleta um ticket
    /// </summary>
    /// <param name="id">ID do ticket</param>
    /// <param name="userId">ID do usuário que está deletando</param>
    /// <returns>True se deletado com sucesso</returns>
    Task<bool> DeleteTicketAsync(int id, int userId);
}

/// <summary>
/// Implementação do serviço de tickets
/// </summary>
public class TicketService : ITicketService
{
    private readonly ITicketRepository _ticketRepository;
    private readonly IRepository<User> _userRepository;
    private readonly IRepository<IssueType> _issueTypeRepository;
    private readonly IRepository<TicketMessage> _messageRepository;
    private readonly IRepository<TicketHistory> _historyRepository;
    private readonly ILogger<TicketService> _logger;

    public TicketService(
        ITicketRepository ticketRepository,
        IRepository<User> userRepository,
        IRepository<IssueType> issueTypeRepository,
        IRepository<TicketMessage> messageRepository,
        IRepository<TicketHistory> historyRepository,
        ILogger<TicketService> logger)
    {
        _ticketRepository = ticketRepository;
        _userRepository = userRepository;
        _issueTypeRepository = issueTypeRepository;
        _messageRepository = messageRepository;
        _historyRepository = historyRepository;
        _logger = logger;
    }

    public async Task<Ticket?> CreatePublicTicketAsync(PublicTicketRequest request)
    {
        try
        {
            _logger.LogInformation("Criando ticket público para: {Email}", request.RequesterEmail);

            // Buscar ou criar usuário público
            var user = await _userRepository.FirstOrDefaultAsync(u => u.Email == request.RequesterEmail);
            if (user == null)
            {
                user = new User
                {
                    Name = request.RequesterName,
                    Email = request.RequesterEmail,
                    UserType = UserType.Common,
                    CreatedAt = DateTime.UtcNow
                };
                user = await _userRepository.AddAsync(user);
            }

            // Buscar tipo de problema padrão
            var issueType = await _issueTypeRepository.FirstOrDefaultAsync(it => it.Name == "Outros");
            if (issueType == null)
            {
                _logger.LogError("Tipo de problema 'Outros' não encontrado");
                return null;
            }

            // Criar ticket
            var ticket = new Ticket
            {
                Title = request.Title,
                Detailing = request.Description,
                Status = TicketStatus.Open,
                Priority = TicketPriority.Medium, // Prioridade média para tickets públicos
                IssueTypeId = issueType.Id,
                UserId = user.Id,
                CreatedAt = DateTime.UtcNow
            };

            var createdTicket = await _ticketRepository.AddAsync(ticket);

            // Adicionar mensagem inicial
            var initialMessage = new TicketMessage
            {
                TicketId = createdTicket.Id,
                SenderId = user.Id,
                Message = $"Ticket criado automaticamente: {request.Description}",
                CreatedAt = DateTime.UtcNow,
                IsInternal = false,
                IsAiMessage = false,
                MessageType = "text"
            };
            await _messageRepository.AddAsync(initialMessage);

            _logger.LogInformation("Ticket público criado com sucesso: {TicketId}", createdTicket.Id);

            return createdTicket;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao criar ticket público para: {Email}", request.RequesterEmail);
            return null;
        }
    }

    public async Task<Ticket?> CreateTicketAsync(CreateTicketRequest request, int userId)
    {
        try
        {
            _logger.LogInformation("Criando ticket para usuário: {UserId}", userId);

            var ticket = new Ticket
            {
                Title = request.Title,
                Detailing = request.Description,
                Status = TicketStatus.Open,
                Priority = Enum.TryParse<TicketPriority>(request.Priority, true, out var priority) ? priority : TicketPriority.Medium,
                IssueTypeId = request.IssueTypeId,
                UserId = userId,
                CreatedAt = DateTime.UtcNow
            };

            var createdTicket = await _ticketRepository.AddAsync(ticket);

            _logger.LogInformation("Ticket criado com sucesso: {TicketId}", createdTicket.Id);

            return createdTicket;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao criar ticket para usuário: {UserId}", userId);
            return null;
        }
    }

    public async Task<Ticket?> GetTicketByIdAsync(int id)
    {
        return await _ticketRepository.GetByIdAsync(id);
    }

    public async Task<IEnumerable<Ticket>> GetTicketsAsync(TicketListRequest request)
    {
        TicketStatus? status = null;
        TicketPriority? priority = null;

        if (!string.IsNullOrEmpty(request.Status) && Enum.TryParse<TicketStatus>(request.Status, true, out var parsedStatus))
            status = parsedStatus;

        if (!string.IsNullOrEmpty(request.Priority) && Enum.TryParse<TicketPriority>(request.Priority, true, out var parsedPriority))
            priority = parsedPriority;

        return await _ticketRepository.GetFilteredAsync(
            status: status,
            priority: priority,
            userId: request.UserId,
            assignedTo: request.AssignedTo,
            issueTypeId: request.IssueTypeId);
    }

    public async Task<(IEnumerable<Ticket> Tickets, int TotalCount)> GetTicketsPaginatedAsync(TicketListRequest request)
    {
        TicketStatus? status = null;
        TicketPriority? priority = null;

        if (!string.IsNullOrEmpty(request.Status) && Enum.TryParse<TicketStatus>(request.Status, true, out var parsedStatus))
            status = parsedStatus;

        if (!string.IsNullOrEmpty(request.Priority) && Enum.TryParse<TicketPriority>(request.Priority, true, out var parsedPriority))
            priority = parsedPriority;

        return await _ticketRepository.GetPaginatedAsync(
            pageNumber: request.PageNumber,
            pageSize: request.PageSize,
            status: status,
            priority: priority,
            userId: request.UserId,
            assignedTo: request.AssignedTo,
            issueTypeId: request.IssueTypeId);
    }

    public async Task<Ticket?> UpdateTicketAsync(int id, UpdateTicketRequest request, int userId)
    {
        try
        {
            var ticket = await _ticketRepository.GetByIdAsync(id);
            if (ticket == null)
                return null;

            ticket.Title = request.Title;
            ticket.Detailing = request.Description;
            ticket.Status = Enum.Parse<TicketStatus>(request.Status);
            ticket.Priority = Enum.Parse<TicketPriority>(request.Priority);
            ticket.IssueTypeId = request.IssueTypeId;
            ticket.AssignedToId = request.AssignedToId;
            ticket.UpdatedAt = DateTime.UtcNow;

            return await _ticketRepository.UpdateAsync(ticket);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao atualizar ticket: {TicketId}", id);
            return null;
        }
    }

    public async Task<bool> UpdateTicketStatusAsync(int id, TicketStatus status, int userId)
    {
        return await _ticketRepository.UpdateStatusAsync(id, status, userId);
    }

    public async Task<bool> AssignTicketAsync(int id, int analystId, int userId)
    {
        return await _ticketRepository.AssignTicketAsync(id, analystId);
    }

    public async Task<TicketMessage?> AddMessageAsync(int ticketId, AddMessageRequest request, int userId)
    {
        try
        {
            var message = new TicketMessage
            {
                TicketId = ticketId,
                SenderId = userId,
                Message = request.Message,
                CreatedAt = DateTime.UtcNow,
                IsInternal = request.IsInternal,
                IsAiMessage = request.IsAiMessage,
                MessageType = request.MessageType ?? "text"
            };

            return await _messageRepository.AddAsync(message);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao adicionar mensagem ao ticket: {TicketId}", ticketId);
            return null;
        }
    }

    public async Task<IEnumerable<TicketMessage>> GetTicketMessagesAsync(int ticketId, int userId)
    {
        return await _messageRepository.FindAsync(m => m.TicketId == ticketId);
    }

    public async Task<IEnumerable<TicketHistory>> GetTicketHistoryAsync(int ticketId)
    {
        return await _historyRepository.FindAsync(h => h.TicketId == ticketId);
    }

    public async Task<TicketStatistics> GetTicketStatisticsAsync()
    {
        return await _ticketRepository.GetStatisticsAsync();
    }

    public async Task<bool> DeleteTicketAsync(int id, int userId)
    {
        try
        {
            var ticket = await _ticketRepository.GetByIdAsync(id);
            if (ticket == null)
                return false;

            return await _ticketRepository.RemoveAsync(ticket);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao deletar ticket: {TicketId}", id);
            return false;
        }
    }
}
