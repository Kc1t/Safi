using Safi.Backend.Core.Entities;
using Safi.Backend.Core.Interfaces;
using Safi.Backend.Modules.AI.DTOs;
using Safi.Backend.Modules.Tickets.DTOs;
using Microsoft.Extensions.Logging;
using Microsoft.EntityFrameworkCore;

namespace Safi.Backend.Modules.AI.Services;

/// <summary>
/// Interface para serviço de chat persistente
/// </summary>
public interface IChatService
{
    /// <summary>
    /// Inicia uma nova conversa de chat para um ticket
    /// </summary>
    /// <param name="ticketId">ID do ticket</param>
    /// <param name="userId">ID do usuário</param>
    /// <returns>ID da sessão de chat</returns>
    Task<string> StartChatSessionAsync(int ticketId, int userId);

    /// <summary>
    /// Envia uma mensagem no chat
    /// </summary>
    /// <param name="sessionId">ID da sessão</param>
    /// <param name="message">Mensagem do usuário</param>
    /// <param name="userId">ID do usuário</param>
    /// <returns>Resposta da IA</returns>
    Task<ChatMessageResponse?> SendMessageAsync(string sessionId, string message, int userId);

    /// <summary>
    /// Obtém o histórico de chat de uma sessão
    /// </summary>
    /// <param name="sessionId">ID da sessão</param>
    /// <returns>Histórico de mensagens</returns>
    Task<IEnumerable<ChatMessageResponse>> GetChatHistoryAsync(string sessionId);

    /// <summary>
    /// Obtém o histórico de chat de um ticket
    /// </summary>
    /// <param name="ticketId">ID do ticket</param>
    /// <returns>Histórico de mensagens</returns>
    Task<IEnumerable<ChatMessageResponse>> GetTicketChatHistoryAsync(int ticketId);

    /// <summary>
    /// Obtém todas as salas de chat ativas
    /// </summary>
    /// <returns>Lista de salas ativas</returns>
    Task<IEnumerable<ActiveChatRoom>> GetActiveChatRoomsAsync();

    /// <summary>
    /// Salva uma mensagem de analista no histórico do chat
    /// </summary>
    /// <param name="ticketId">ID do ticket</param>
    /// <param name="message">Mensagem do analista</param>
    /// <param name="userId">ID do analista</param>
    /// <returns>Resposta da mensagem salva</returns>
    Task<ChatMessageResponse?> SaveAnalystMessageAsync(int ticketId, string message, int userId);
}

/// <summary>
/// Implementação do serviço de chat persistente
/// </summary>
public class ChatService : IChatService
{
    private readonly IRepository<TicketChatHistory> _chatRepository;
    private readonly IRepository<Ticket> _ticketRepository;
    private readonly IRepository<User> _userRepository;
    private readonly IAIService _aiService;
    private readonly ILogger<ChatService> _logger;

    public ChatService(
        IRepository<TicketChatHistory> chatRepository,
        IRepository<Ticket> ticketRepository,
        IRepository<User> userRepository,
        IAIService aiService,
        ILogger<ChatService> logger)
    {
        _chatRepository = chatRepository;
        _ticketRepository = ticketRepository;
        _userRepository = userRepository;
        _aiService = aiService;
        _logger = logger;
    }

    public async Task<string> StartChatSessionAsync(int ticketId, int userId)
    {
        try
        {
            // Verificar se o ticket existe
            var ticket = await _ticketRepository.GetByIdAsync(ticketId);
            if (ticket == null)
            {
                _logger.LogWarning("Ticket não encontrado: {TicketId}", ticketId);
                throw new ArgumentException("Ticket não encontrado");
            }

            // Verificar se o usuário existe
            var user = await _userRepository.GetByIdAsync(userId);
            if (user == null)
            {
                _logger.LogWarning("Usuário não encontrado: {UserId}", userId);
                throw new ArgumentException("Usuário não encontrado");
            }

            // Gerar ID da sessão
            var sessionId = Guid.NewGuid().ToString();
            
            // Adicionar mensagem de boas-vindas
            var welcomeMessage = new TicketChatHistory
            {
                TicketId = ticketId,
                UserId = userId,
                Message = "Conversa iniciada com a IA",
                MessageType = "system",
                CreatedAt = DateTime.UtcNow,
                IsInternal = false
            };

            await _chatRepository.AddAsync(welcomeMessage);

            _logger.LogInformation("Sessão de chat iniciada: {SessionId} para ticket: {TicketId}", sessionId, ticketId);
            return sessionId;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao iniciar sessão de chat para ticket: {TicketId}", ticketId);
            throw;
        }
    }

    public async Task<ChatMessageResponse?> SendMessageAsync(string sessionId, string message, int userId)
    {
        try
        {
            // Por enquanto, vamos usar o ticketId como parte do sessionId
            // Em uma implementação mais robusta, teríamos uma tabela de sessões
            if (!int.TryParse(sessionId.Split('-')[0], out int ticketId))
            {
                throw new ArgumentException("SessionId inválido");
            }

            // Verificar se o ticket existe
            var ticket = await _ticketRepository.GetByIdAsync(ticketId);
            if (ticket == null)
            {
                _logger.LogWarning("Ticket não encontrado: {TicketId}", ticketId);
                return null;
            }

            // Verificar se o usuário existe
            var user = await _userRepository.GetByIdAsync(userId);
            if (user == null)
            {
                _logger.LogWarning("Usuário não encontrado: {UserId}", userId);
                return null;
            }

            // Salvar mensagem do usuário
            var userMessage = new TicketChatHistory
            {
                TicketId = ticketId,
                UserId = userId,
                Message = message,
                MessageType = "user",
                CreatedAt = DateTime.UtcNow,
                IsInternal = false
            };

            await _chatRepository.AddAsync(userMessage);

            // Obter contexto do histórico de chat
            var chatHistory = await GetTicketChatHistoryAsync(ticketId);
            var context = BuildContextFromHistory(chatHistory);

            // Chamar IA para gerar resposta
            var aiRequest = new AIResponseRequest
            {
                TicketId = ticketId,
                IssueType = ticket.IssueType?.Name ?? "Geral",
                UserMessage = message
            };

            var aiResponse = await _aiService.GenerateResponseSuggestionAsync(aiRequest);

            if (aiResponse != null)
            {
                // Salvar resposta da IA
                var aiMessage = new TicketChatHistory
                {
                    TicketId = ticketId,
                    UserId = userId, // Ou um usuário sistema específico
                    Message = aiResponse.SuggestedResponse,
                    MessageType = "ai",
                    CreatedAt = DateTime.UtcNow,
                    IsInternal = false
                };

                await _chatRepository.AddAsync(aiMessage);

                _logger.LogInformation("Mensagem processada para sessão: {SessionId}", sessionId);

                return new ChatMessageResponse
                {
                    Id = aiMessage.Id,
                    TicketId = ticketId,
                    UserId = userId,
                    UserName = user.Name,
                    UserEmail = user.Email,
                    UserType = "AI",
                    Message = aiResponse.SuggestedResponse,
                    MessageType = "ai",
                    CreatedAt = aiMessage.CreatedAt,
                    IsInternal = false
                };
            }

            return null;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao enviar mensagem para sessão: {SessionId}", sessionId);
            return null;
        }
    }

    public async Task<IEnumerable<ChatMessageResponse>> GetChatHistoryAsync(string sessionId)
    {
        try
        {
            if (!int.TryParse(sessionId.Split('-')[0], out int ticketId))
            {
                return Enumerable.Empty<ChatMessageResponse>();
            }

            return await GetTicketChatHistoryAsync(ticketId);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao obter histórico de chat para sessão: {SessionId}", sessionId);
            return Enumerable.Empty<ChatMessageResponse>();
        }
    }

    public async Task<IEnumerable<ChatMessageResponse>> GetTicketChatHistoryAsync(int ticketId)
    {
        try
        {
            var chatHistory = await _chatRepository.GetAllAsync();
            var ticketChats = chatHistory
                .Where(ch => ch.TicketId == ticketId)
                .OrderBy(ch => ch.CreatedAt)
                .ToList();

            var result = new List<ChatMessageResponse>();
            var seenMessages = new HashSet<string>();

            foreach (var chat in ticketChats)
            {
                // Criar uma chave única baseada em timestamp, tipo e mensagem para evitar duplicatas
                var messageKey = $"{chat.CreatedAt:yyyy-MM-dd HH:mm:ss}_{chat.MessageType}_{chat.Message}";

                // Pular mensagens duplicadas (mesmo timestamp, tipo e conteúdo)
                if (seenMessages.Contains(messageKey))
                {
                    _logger.LogDebug("Mensagem duplicada ignorada para ticket {TicketId}: {MessageKey}", ticketId, messageKey);
                    continue;
                }

                seenMessages.Add(messageKey);

                var user = await _userRepository.GetByIdAsync(chat.UserId);
                result.Add(new ChatMessageResponse
                {
                    Id = chat.Id,
                    TicketId = chat.TicketId,
                    UserId = chat.UserId,
                    UserName = user?.Name ?? "Sistema",
                    UserEmail = user?.Email ?? "sistema@safi.com",
                    UserType = chat.MessageType == "ai" ? "AI" : user?.UserType.ToString() ?? "Sistema",
                    Message = chat.Message,
                    MessageType = chat.MessageType,
                    CreatedAt = chat.CreatedAt,
                    IsInternal = chat.IsInternal
                });
            }

            return result;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao obter histórico de chat do ticket: {TicketId}", ticketId);
            return Enumerable.Empty<ChatMessageResponse>();
        }
    }

    public async Task<IEnumerable<ActiveChatRoom>> GetActiveChatRoomsAsync()
    {
        try
        {
            // Obter todos os tickets que têm mensagens de chat recentes (últimas 24 horas)
            var recentChats = await _chatRepository.GetAllAsync();
            var recentTickets = recentChats
                .Where(ch => ch.CreatedAt >= DateTime.UtcNow.AddHours(-24))
                .Select(ch => ch.TicketId)
                .Distinct()
                .ToList();

            var activeRooms = new List<ActiveChatRoom>();

            foreach (var ticketId in recentTickets)
            {
                var ticket = await _ticketRepository.GetByIdAsync(ticketId);
                if (ticket == null) continue;

                var user = await _userRepository.GetByIdAsync(ticket.UserId);
                var assignedUser = ticket.AssignedToId.HasValue ? 
                    await _userRepository.GetByIdAsync(ticket.AssignedToId.Value) : null;

                // Obter última mensagem
                var lastMessage = recentChats
                    .Where(ch => ch.TicketId == ticketId)
                    .OrderByDescending(ch => ch.CreatedAt)
                    .FirstOrDefault();

                // Contar mensagens não lidas (simplificado - todas as mensagens da IA são "não lidas")
                var unreadCount = recentChats
                    .Where(ch => ch.TicketId == ticketId && ch.MessageType == "ai")
                    .Count();

                activeRooms.Add(new ActiveChatRoom
                {
                    TicketId = ticketId,
                    TicketTitle = ticket.Title,
                    TicketStatus = ticket.Status.ToString(),
                    TicketPriority = ticket.Priority.ToString(),
                    SupportLevel = ticket.SupportLevel.ToString(),
                    UserName = user?.Name ?? "Usuário Desconhecido",
                    UserEmail = user?.Email ?? "",
                    AssignedToName = assignedUser?.Name ?? "Não atribuído",
                    LastMessage = lastMessage?.Message ?? "Nenhuma mensagem",
                    LastMessageType = lastMessage?.MessageType ?? "system",
                    LastMessageTime = lastMessage?.CreatedAt ?? ticket.CreatedAt,
                    UnreadCount = unreadCount,
                    CreatedAt = ticket.CreatedAt,
                    UpdatedAt = ticket.UpdatedAt ?? ticket.CreatedAt
                });
            }

            return activeRooms.OrderByDescending(r => r.LastMessageTime);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao obter salas de chat ativas");
            return Enumerable.Empty<ActiveChatRoom>();
        }
    }

    public async Task<ChatMessageResponse?> SaveAnalystMessageAsync(int ticketId, string message, int userId)
    {
        try
        {
            var user = await _userRepository.GetByIdAsync(userId);
            if (user == null)
            {
                _logger.LogWarning("Usuário não encontrado para salvar mensagem de analista: {UserId}", userId);
                return null;
            }

            var analystMessage = new TicketChatHistory
            {
                TicketId = ticketId,
                UserId = userId,
                Message = message,
                MessageType = "analyst",
                CreatedAt = DateTime.UtcNow,
                IsInternal = false
            };

            await _chatRepository.AddAsync(analystMessage);

            _logger.LogInformation("Mensagem de analista salva para ticket: {TicketId}", ticketId);

            return new ChatMessageResponse
            {
                Id = analystMessage.Id,
                TicketId = ticketId,
                UserId = userId,
                UserName = user.Name,
                UserEmail = user.Email,
                UserType = "Analyst",
                Message = message,
                MessageType = "analyst",
                CreatedAt = analystMessage.CreatedAt,
                IsInternal = false
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao salvar mensagem de analista para ticket: {TicketId}", ticketId);
            return null;
        }
    }

    private string BuildContextFromHistory(IEnumerable<ChatMessageResponse> history)
    {
        var context = new System.Text.StringBuilder();
        foreach (var msg in history.TakeLast(10)) // Últimas 10 mensagens para contexto
        {
            context.AppendLine($"{msg.UserType}: {msg.Message}");
        }
        return context.ToString();
    }
}

/// <summary>
/// DTO para sala de chat ativa
/// </summary>
public class ActiveChatRoom
{
    public int TicketId { get; set; }
    public string TicketTitle { get; set; } = string.Empty;
    public string TicketStatus { get; set; } = string.Empty;
    public string TicketPriority { get; set; } = string.Empty;
    public string SupportLevel { get; set; } = string.Empty;
    public string UserName { get; set; } = string.Empty;
    public string UserEmail { get; set; } = string.Empty;
    public string AssignedToName { get; set; } = string.Empty;
    public string LastMessage { get; set; } = string.Empty;
    public string LastMessageType { get; set; } = string.Empty;
    public DateTime LastMessageTime { get; set; }
    public int UnreadCount { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}
