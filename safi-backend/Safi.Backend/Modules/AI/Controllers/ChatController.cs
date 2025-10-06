using Safi.Backend.Modules.AI.DTOs;
using Safi.Backend.Modules.AI.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Text;

namespace Safi.Backend.Modules.AI.Controllers;

[ApiController]
[Route("api/ai/chat")]
[Authorize]
public class ChatController : ControllerBase
{
    private readonly IChatService _chatService;
    private readonly ILogger<ChatController> _logger;

    public ChatController(IChatService chatService, ILogger<ChatController> logger)
    {
        _chatService = chatService;
        _logger = logger;
    }

    /// <summary>
    /// Inicia uma nova conversa de chat para um ticket específico
    /// </summary>
    [HttpPost("start/{ticketId}")]
    public async Task<IActionResult> StartChat(int ticketId)
    {
        try
        {
            var userId = int.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value ?? "0");
            
            var sessionId = await _chatService.StartChatSessionAsync(ticketId, userId);
            
            _logger.LogInformation("Nova sessão de chat iniciada: {SessionId} para ticket: {TicketId}", sessionId, ticketId);
            
            return Ok(new { 
                sessionId, 
                ticketId,
                message = "Nova conversa iniciada com a IA para este ticket!" 
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao iniciar chat para ticket: {TicketId}", ticketId);
            return BadRequest(new { message = "Erro ao iniciar conversa" });
        }
    }

    /// <summary>
    /// Envia uma mensagem para a IA e recebe uma resposta, mantendo o contexto da conversa.
    /// </summary>
    [HttpPost("{sessionId}/send")]
    public async Task<IActionResult> SendMessage(string sessionId, [FromBody] ChatMessageRequest request)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(request.Message))
            {
                return BadRequest(new { message = "A mensagem não pode ser vazia." });
            }

            var userId = int.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value ?? "0");
            
            _logger.LogInformation("Mensagem recebida para sessão {SessionId}: {Message}", sessionId, request.Message);

            var aiResponse = await _chatService.SendMessageAsync(sessionId, request.Message, userId);
            
            if (aiResponse != null)
            {
                _logger.LogInformation("Resposta da IA para sessão {SessionId}: {Response}", sessionId, aiResponse.Message);

                return Ok(new { 
                    sessionId, 
                    userMessage = request.Message,
                    aiResponse = aiResponse
                });
            }
            else
            {
                return BadRequest(new { message = "Erro ao processar mensagem" });
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao enviar mensagem para sessão: {SessionId}", sessionId);
            return StatusCode(500, new { message = "Erro interno do servidor" });
        }
    }

    /// <summary>
    /// Retorna o histórico completo de uma sessão de chat.
    /// </summary>
    [HttpGet("{sessionId}/history")]
    public async Task<IActionResult> GetChatHistory(string sessionId)
    {
        try
        {
            var history = await _chatService.GetChatHistoryAsync(sessionId);
            
            return Ok(new { 
                sessionId, 
                history = history,
                totalMessages = history.Count()
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao obter histórico para sessão: {SessionId}", sessionId);
            return StatusCode(500, new { message = "Erro interno do servidor" });
        }
    }

    /// <summary>
    /// Retorna o histórico de chat de um ticket específico
    /// </summary>
    [HttpGet("ticket/{ticketId}/history")]
    public async Task<IActionResult> GetTicketChatHistory(int ticketId)
    {
        try
        {
            var history = await _chatService.GetTicketChatHistoryAsync(ticketId);
            
            return Ok(new { 
                ticketId, 
                history = history,
                totalMessages = history.Count()
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao obter histórico de chat do ticket: {TicketId}", ticketId);
            return StatusCode(500, new { message = "Erro interno do servidor" });
        }
    }

    /// <summary>
    /// Lista todas as salas de chat ativas
    /// </summary>
    [HttpGet("rooms/active")]
    public async Task<IActionResult> GetActiveChatRooms()
    {
        try
        {
            var activeRooms = await _chatService.GetActiveChatRoomsAsync();
            
            _logger.LogInformation("Lista de {Count} salas ativas retornada", activeRooms.Count());
            
            return Ok(new { 
                rooms = activeRooms,
                totalRooms = activeRooms.Count(),
                timestamp = DateTime.UtcNow
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao obter lista de salas ativas");
            return StatusCode(500, new { message = "Erro interno do servidor" });
        }
    }
}

public class ChatMessageRequest
{
    public string Message { get; set; } = string.Empty;
}