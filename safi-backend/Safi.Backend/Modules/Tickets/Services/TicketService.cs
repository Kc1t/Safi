using Safi.Backend.Core.Entities;
using Safi.Backend.Core.Enums;
using Safi.Backend.Core.Interfaces;
using Safi.Backend.Modules.Tickets.DTOs;
using Microsoft.Extensions.Logging;
using Safi.Backend.Infrastructure.Data.Context;
using Microsoft.EntityFrameworkCore;

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
    /// Encerra um ticket
    /// </summary>
    /// <param name="ticketId">ID do ticket</param>
    /// <param name="request">Dados do encerramento</param>
    /// <param name="userId">ID do usuário que está encerrando</param>
    /// <returns>True se encerrado com sucesso</returns>
    Task<bool> CloseTicketAsync(int ticketId, CloseTicketRequest request, int userId);

    /// <summary>
    /// Adiciona mensagem ao chat do ticket
    /// </summary>
    /// <param name="ticketId">ID do ticket</param>
    /// <param name="request">Dados da mensagem</param>
    /// <param name="userId">ID do usuário que está enviando</param>
    /// <returns>Mensagem criada</returns>
    Task<ChatMessageResponse?> AddChatMessageAsync(int ticketId, ChatMessageRequest request, int userId);

    /// <summary>
    /// Obtém histórico de chat do ticket
    /// </summary>
    /// <param name="ticketId">ID do ticket</param>
    /// <returns>Lista de mensagens</returns>
    Task<IEnumerable<ChatMessageResponse>> GetChatHistoryAsync(int ticketId);

    /// <summary>
    /// Atribui um ticket a um analista
    /// </summary>
    /// <param name="id">ID do ticket</param>
    /// <param name="analystId">ID do analista</param>
    /// <param name="userId">ID do usuário que está atribuindo</param>
    /// <returns>True se atribuído com sucesso</returns>
    Task<bool> AssignTicketAsync(int id, int analystId, int userId);

    /// <summary>
    /// Escalona um ticket para outro nível
    /// </summary>
    /// <param name="id">ID do ticket</param>
    /// <param name="request">Dados do escalonamento</param>
    /// <param name="userId">ID do usuário que está escalonando</param>
    /// <returns>True se escalonado com sucesso</returns>
    Task<bool> EscalateTicketAsync(int id, EscalateTicketRequest request, int userId);

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
    private readonly IRepository<Department> _departmentRepository;
    private readonly ILogger<TicketService> _logger;
    private readonly ApplicationDbContext _context;

    public TicketService(
        ITicketRepository ticketRepository,
        IRepository<User> userRepository,
        IRepository<IssueType> issueTypeRepository,
        IRepository<TicketMessage> messageRepository,
        IRepository<TicketHistory> historyRepository,
        IRepository<Department> departmentRepository,
        ILogger<TicketService> logger,
        ApplicationDbContext context)
    {
        _ticketRepository = ticketRepository;
        _userRepository = userRepository;
        _issueTypeRepository = issueTypeRepository;
        _messageRepository = messageRepository;
        _historyRepository = historyRepository;
        _departmentRepository = departmentRepository;
        _logger = logger;
        _context = context;
    }

    public async Task<Ticket?> CreatePublicTicketAsync(PublicTicketRequest request)
    {
        try
        {
            _logger.LogInformation("Criando ticket público para: {Email}", request.RequesterEmail);

            // Buscar ou criar departamento
            var department = await _departmentRepository.FirstOrDefaultAsync(d => d.Name == request.DepartmentName);
            if (department == null)
            {
                _logger.LogInformation("Criando novo departamento: {DepartmentName}", request.DepartmentName);
                department = new Department
                {
                    Name = request.DepartmentName,
                    Description = $"Departamento criado automaticamente via ticket público",
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                };
                department = await _departmentRepository.AddAsync(department);
            }

            // Buscar ou criar usuário público
            var user = await _userRepository.FirstOrDefaultAsync(u => u.Email == request.RequesterEmail);
            if (user == null)
            {
                _logger.LogInformation("Criando novo usuário: {Email} no departamento: {DepartmentName}", request.RequesterEmail, request.DepartmentName);
                user = new User
                {
                    Name = request.RequesterName,
                    Email = request.RequesterEmail,
                    UserType = UserType.Common,
                    DepartmentId = department.Id,
                    CreatedAt = DateTime.UtcNow
                };
                user = await _userRepository.AddAsync(user);
            }
            else if (user.DepartmentId != department.Id)
            {
                // Atualizar departamento do usuário caso tenha mudado
                _logger.LogInformation("Atualizando departamento do usuário {Email} para: {DepartmentName}", request.RequesterEmail, request.DepartmentName);
                user.DepartmentId = department.Id;
                await _userRepository.UpdateAsync(user);
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
        AnalystLevel? supportLevel = null;

        if (!string.IsNullOrEmpty(request.Status) && Enum.TryParse<TicketStatus>(request.Status, true, out var parsedStatus))
            status = parsedStatus;

        if (!string.IsNullOrEmpty(request.Priority) && Enum.TryParse<TicketPriority>(request.Priority, true, out var parsedPriority))
            priority = parsedPriority;

        if (!string.IsNullOrEmpty(request.SupportLevel) && Enum.TryParse<AnalystLevel>(request.SupportLevel, true, out var parsedSupportLevel))
            supportLevel = parsedSupportLevel;

        return await _ticketRepository.GetFilteredAsync(
            status: status,
            priority: priority,
            userId: request.UserId,
            assignedTo: request.AssignedTo,
            issueTypeId: request.IssueTypeId,
            supportLevel: supportLevel);
    }

    public async Task<(IEnumerable<Ticket> Tickets, int TotalCount)> GetTicketsPaginatedAsync(TicketListRequest request)
    {
        TicketStatus? status = null;
        TicketPriority? priority = null;
        AnalystLevel? supportLevel = null;

        if (!string.IsNullOrEmpty(request.Status) && Enum.TryParse<TicketStatus>(request.Status, true, out var parsedStatus))
            status = parsedStatus;

        if (!string.IsNullOrEmpty(request.Priority) && Enum.TryParse<TicketPriority>(request.Priority, true, out var parsedPriority))
            priority = parsedPriority;

        if (!string.IsNullOrEmpty(request.SupportLevel) && Enum.TryParse<AnalystLevel>(request.SupportLevel, true, out var parsedSupportLevel))
            supportLevel = parsedSupportLevel;

        return await _ticketRepository.GetPaginatedAsync(
            pageNumber: request.PageNumber,
            pageSize: request.PageSize,
            status: status,
            priority: priority,
            userId: request.UserId,
            assignedTo: request.AssignedTo,
            issueTypeId: request.IssueTypeId,
            supportLevel: supportLevel);
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

    public async Task<bool> EscalateTicketAsync(int id, EscalateTicketRequest request, int userId)
    {
        try
        {
            var ticket = await _ticketRepository.GetByIdAsync(id);
            if (ticket == null)
                return false;

            var newLevel = Enum.Parse<AnalystLevel>(request.SupportLevel);
            var oldLevel = ticket.SupportLevel;
            
            ticket.SupportLevel = newLevel;
            ticket.UpdatedAt = DateTime.UtcNow;

            // Se foi especificado um analista para atribuir
            if (request.AssignToAnalystId.HasValue)
            {
                ticket.AssignedToId = request.AssignToAnalystId.Value;
            }

            await _ticketRepository.UpdateAsync(ticket);

            // Adicionar mensagem de escalonamento
            var escalationMessage = new TicketMessage
            {
                TicketId = id,
                SenderId = userId,
                Message = $"Ticket escalonado de {oldLevel} para {newLevel}. {request.Comment ?? ""}",
                CreatedAt = DateTime.UtcNow,
                IsInternal = true,
                IsAiMessage = false,
                MessageType = "escalation"
            };
            await _messageRepository.AddAsync(escalationMessage);

            _logger.LogInformation("Ticket {TicketId} escalonado de {OldLevel} para {NewLevel}", id, oldLevel, newLevel);
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao escalonar ticket: {TicketId}", id);
            return false;
        }
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


    public async Task<bool> CloseTicketAsync(int ticketId, CloseTicketRequest request, int userId)
    {
        try
        {
            var ticket = await _ticketRepository.GetByIdAsync(ticketId);
            if (ticket == null)
                return false;

            // Atualizar status baseado no tipo de resolução
            switch (request.ResolutionType.ToLower())
            {
                case "resolved":
                    ticket.Status = TicketStatus.Resolved;
                    break;
                case "closed":
                    ticket.Status = TicketStatus.Closed;
                    break;
                case "cancelled":
                    ticket.Status = TicketStatus.Closed; // Pode criar um status específico se necessário
                    break;
                default:
                    ticket.Status = TicketStatus.Resolved;
                    break;
            }

            ticket.UpdatedAt = DateTime.UtcNow;
            ticket.ResolvedAt = DateTime.UtcNow;

            // Adicionar histórico
            var history = new TicketHistory
            {
                TicketId = ticketId,
                ChangedById = userId,
                ChangeDescription = $"Ticket encerrado: {request.Resolution}",
                ChangeType = "closure",
                OldValue = ticket.Status.ToString(),
                NewValue = request.ResolutionType,
                ChangedAt = DateTime.UtcNow
            };

            _context.TicketHistory.Add(history);
            await _context.SaveChangesAsync();

            _logger.LogInformation("Ticket {TicketId} encerrado por usuário {UserId}", ticketId, userId);

            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao encerrar ticket: {TicketId}", ticketId);
            return false;
        }
    }

    public async Task<ChatMessageResponse?> AddChatMessageAsync(int ticketId, ChatMessageRequest request, int userId)
    {
        try
        {
            var ticket = await _ticketRepository.GetByIdAsync(ticketId);
            if (ticket == null)
                return null;

            var user = await _context.Users.FindAsync(userId);
            if (user == null)
                return null;

            var chatMessage = new TicketChatHistory
            {
                TicketId = ticketId,
                UserId = userId,
                Message = request.Message,
                MessageType = request.MessageType,
                IsInternal = request.IsInternal,
                CreatedAt = DateTime.UtcNow
            };

            _context.TicketChatHistory.Add(chatMessage);
            await _context.SaveChangesAsync();

            _logger.LogInformation("Mensagem de chat adicionada ao ticket {TicketId} por usuário {UserId}", 
                ticketId, userId);

            return new ChatMessageResponse
            {
                Id = chatMessage.Id,
                TicketId = chatMessage.TicketId,
                UserId = chatMessage.UserId,
                UserName = user.Name,
                UserEmail = user.Email,
                UserType = user.UserType.ToString(),
                Message = chatMessage.Message,
                MessageType = chatMessage.MessageType,
                CreatedAt = chatMessage.CreatedAt,
                IsInternal = chatMessage.IsInternal
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao adicionar mensagem de chat ao ticket: {TicketId}", ticketId);
            return null;
        }
    }

    public async Task<IEnumerable<ChatMessageResponse>> GetChatHistoryAsync(int ticketId)
    {
        try
        {
            var chatHistory = await _context.TicketChatHistory
                .Where(ch => ch.TicketId == ticketId)
                .Include(ch => ch.User)
                .OrderBy(ch => ch.CreatedAt)
                .ToListAsync();

            return chatHistory.Select(ch => new ChatMessageResponse
            {
                Id = ch.Id,
                TicketId = ch.TicketId,
                UserId = ch.UserId,
                UserName = ch.User.Name,
                UserEmail = ch.User.Email,
                UserType = ch.User.UserType.ToString(),
                Message = ch.Message,
                MessageType = ch.MessageType,
                CreatedAt = ch.CreatedAt,
                IsInternal = ch.IsInternal
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao obter histórico de chat do ticket: {TicketId}", ticketId);
            return Enumerable.Empty<ChatMessageResponse>();
        }
    }
}
