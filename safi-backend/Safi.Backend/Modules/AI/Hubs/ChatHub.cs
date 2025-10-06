using Microsoft.AspNetCore.SignalR;
using Microsoft.AspNetCore.Authorization;
using Safi.Backend.Modules.AI.Services;
using Safi.Backend.Modules.Tickets.DTOs;
using System.Security.Claims;

namespace Safi.Backend.Modules.AI.Hubs;

/// <summary>
/// Hub do SignalR para chat em tempo real
/// </summary>
[Authorize]
public class ChatHub : Hub
{
    private readonly IChatService _chatService;
    private readonly ILogger<ChatHub> _logger;

    public ChatHub(IChatService chatService, ILogger<ChatHub> logger)
    {
        _chatService = chatService;
        _logger = logger;
    }

    /// <summary>
    /// Conecta o usuário a um grupo de chat específico do ticket
    /// </summary>
    public async Task JoinTicketChat(int ticketId)
    {
        try
        {
            var userId = GetUserId();
            var groupName = $"ticket-{ticketId}";
            
            await Groups.AddToGroupAsync(Context.ConnectionId, groupName);
            
            _logger.LogInformation("Usuário {UserId} conectado ao chat do ticket {TicketId}", userId, ticketId);
            
            // Notificar outros usuários no grupo
            await Clients.Group(groupName).SendAsync("UserJoined", new
            {
                userId = userId,
                ticketId = ticketId,
                message = "Usuário conectado ao chat"
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao conectar usuário ao chat do ticket {TicketId}", ticketId);
        }
    }

    /// <summary>
    /// Desconecta o usuário do grupo de chat
    /// </summary>
    public async Task LeaveTicketChat(int ticketId)
    {
        try
        {
            var userId = GetUserId();
            var groupName = $"ticket-{ticketId}";
            
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, groupName);
            
            _logger.LogInformation("Usuário {UserId} desconectado do chat do ticket {TicketId}", userId, ticketId);
            
            // Notificar outros usuários no grupo
            await Clients.Group(groupName).SendAsync("UserLeft", new
            {
                userId = userId,
                ticketId = ticketId,
                message = "Usuário desconectado do chat"
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao desconectar usuário do chat do ticket {TicketId}", ticketId);
        }
    }

    /// <summary>
    /// Envia uma mensagem para o chat do ticket
    /// </summary>
    public async Task SendMessage(int ticketId, string message)
    {
        try
        {
            var userId = GetUserId();
            var groupName = $"ticket-{ticketId}";
            
            _logger.LogInformation("Mensagem recebida via WebSocket para ticket {TicketId}: {Message}", ticketId, message);

            // Processar mensagem através do ChatService
            var aiResponse = await _chatService.SendMessageAsync(ticketId.ToString(), message, userId);
            
            if (aiResponse != null)
            {
                // Enviar mensagem do usuário para todos no grupo
                await Clients.Group(groupName).SendAsync("ReceiveMessage", new
                {
                    type = "user",
                    userId = userId,
                    message = message,
                    timestamp = DateTime.UtcNow,
                    ticketId = ticketId
                });

                // Enviar resposta da IA para todos no grupo
                await Clients.Group(groupName).SendAsync("ReceiveMessage", new
                {
                    type = "ai",
                    userId = userId,
                    message = aiResponse.Message,
                    timestamp = DateTime.UtcNow,
                    ticketId = ticketId
                });

                _logger.LogInformation("Mensagem processada e enviada via WebSocket para ticket {TicketId}", ticketId);
            }
            else
            {
                // Enviar erro para o usuário que enviou
                await Clients.Caller.SendAsync("ReceiveError", new
                {
                    message = "Erro ao processar mensagem",
                    timestamp = DateTime.UtcNow
                });
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao enviar mensagem via WebSocket para ticket {TicketId}", ticketId);
            
            await Clients.Caller.SendAsync("ReceiveError", new
            {
                message = "Erro interno do servidor",
                timestamp = DateTime.UtcNow
            });
        }
    }

    /// <summary>
    /// Solicita o histórico de chat do ticket
    /// </summary>
    public async Task GetChatHistory(int ticketId)
    {
        try
        {
            var userId = GetUserId();
            
            _logger.LogInformation("Histórico de chat solicitado via WebSocket para ticket {TicketId}", ticketId);

            var history = await _chatService.GetTicketChatHistoryAsync(ticketId);
            
            await Clients.Caller.SendAsync("ReceiveChatHistory", new
            {
                ticketId = ticketId,
                history = history,
                totalMessages = history.Count()
            });

            _logger.LogInformation("Histórico de chat enviado via WebSocket para ticket {TicketId}", ticketId);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao obter histórico de chat via WebSocket para ticket {TicketId}", ticketId);
            
            await Clients.Caller.SendAsync("ReceiveError", new
            {
                message = "Erro ao obter histórico",
                timestamp = DateTime.UtcNow
            });
        }
    }

    /// <summary>
    /// Notifica sobre mudanças no status do ticket
    /// </summary>
    public async Task NotifyTicketStatusChange(int ticketId, string newStatus, string message)
    {
        try
        {
            var groupName = $"ticket-{ticketId}";
            
            await Clients.Group(groupName).SendAsync("TicketStatusChanged", new
            {
                ticketId = ticketId,
                newStatus = newStatus,
                message = message,
                timestamp = DateTime.UtcNow
            });

            _logger.LogInformation("Notificação de mudança de status enviada para ticket {TicketId}", ticketId);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao notificar mudança de status para ticket {TicketId}", ticketId);
        }
    }

    /// <summary>
    /// Notifica sobre escalonamento do ticket
    /// </summary>
    public async Task NotifyTicketEscalation(int ticketId, string newLevel, string message)
    {
        try
        {
            var groupName = $"ticket-{ticketId}";
            
            await Clients.Group(groupName).SendAsync("TicketEscalated", new
            {
                ticketId = ticketId,
                newLevel = newLevel,
                message = message,
                timestamp = DateTime.UtcNow
            });

            _logger.LogInformation("Notificação de escalonamento enviada para ticket {TicketId}", ticketId);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao notificar escalonamento para ticket {TicketId}", ticketId);
        }
    }

    /// <summary>
    /// Evento quando um cliente se conecta
    /// </summary>
    public override async Task OnConnectedAsync()
    {
        var userId = GetUserId();
        _logger.LogInformation("Cliente conectado: {ConnectionId}, Usuário: {UserId}", Context.ConnectionId, userId);
        
        await base.OnConnectedAsync();
    }

    /// <summary>
    /// Evento quando um cliente se desconecta
    /// </summary>
    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        var userId = GetUserId();
        _logger.LogInformation("Cliente desconectado: {ConnectionId}, Usuário: {UserId}", Context.ConnectionId, userId);
        
        if (exception != null)
        {
            _logger.LogError(exception, "Erro na desconexão do cliente {ConnectionId}", Context.ConnectionId);
        }
        
        await base.OnDisconnectedAsync(exception);
    }

    /// <summary>
    /// Obtém o ID do usuário do contexto de autenticação
    /// </summary>
    private int GetUserId()
    {
        var userIdClaim = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return int.TryParse(userIdClaim, out var userId) ? userId : 0;
    }
}
