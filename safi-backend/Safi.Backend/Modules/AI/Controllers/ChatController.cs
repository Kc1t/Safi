using Safi.Backend.Modules.AI.DTOs;
using Safi.Backend.Modules.AI.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Text;

namespace Safi.Backend.Modules.AI.Controllers;

[ApiController]
[Route("api/ai/chat")]
public class ChatController : ControllerBase
{
    private readonly IAIService _aiService;
    private readonly ILogger<ChatController> _logger;
    private static readonly Dictionary<string, List<ChatMessage>> _conversations = new();

    public ChatController(IAIService aiService, ILogger<ChatController> logger)
    {
        _aiService = aiService;
        _logger = logger;
    }

    /// <summary>
    /// Iniciar uma nova conversa
    /// </summary>
    [HttpPost("start")]
    [Authorize]
    public IActionResult StartConversation()
    {
        try
        {
            var conversationId = Guid.NewGuid().ToString();
            _conversations[conversationId] = new List<ChatMessage>();
            
            _logger.LogInformation("Nova conversa iniciada: {ConversationId}", conversationId);
            
            return Ok(new
            {
                conversationId = conversationId,
                message = "Conversa iniciada com sucesso",
                timestamp = DateTime.UtcNow
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao iniciar conversa");
            return StatusCode(500, new { message = "Erro interno do servidor" });
        }
    }

    /// <summary>
    /// Enviar mensagem para a conversa
    /// </summary>
    [HttpPost("{conversationId}/message")]
    [Authorize]
    public async Task<IActionResult> SendMessage(string conversationId, [FromBody] ChatMessageRequest request)
    {
        try
        {
            if (!_conversations.ContainsKey(conversationId))
            {
                return NotFound(new { message = "Conversa não encontrada" });
            }

            var conversation = _conversations[conversationId];
            
            // Adicionar mensagem do usuário
            var userMessage = new ChatMessage
            {
                Role = "user",
                Content = request.Message,
                Timestamp = DateTime.UtcNow
            };
            conversation.Add(userMessage);

            // Preparar contexto para a IA
            var context = BuildContextFromHistory(conversation);
            
            // Chamar IA
            var aiRequest = new AIResponseRequest
            {
                TicketId = 0, // Chat não tem ticket específico
                IssueType = "Chat",
                UserMessage = request.Message
            };
            var aiResponse = await _aiService.GenerateResponseSuggestionAsync(aiRequest);
            
            // Adicionar resposta da IA
            var aiMessage = new ChatMessage
            {
                Role = "assistant",
                Content = aiResponse?.SuggestedResponse ?? "Desculpe, não consegui processar sua mensagem.",
                Timestamp = DateTime.UtcNow
            };
            conversation.Add(aiMessage);

            _logger.LogInformation("Mensagem processada para conversa: {ConversationId}", conversationId);
            
            return Ok(new
            {
                conversationId = conversationId,
                userMessage = request.Message,
                aiResponse = aiMessage.Content,
                timestamp = DateTime.UtcNow,
                messageCount = conversation.Count
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao processar mensagem para conversa: {ConversationId}", conversationId);
            return StatusCode(500, new { message = "Erro interno do servidor" });
        }
    }

    /// <summary>
    /// Obter histórico da conversa
    /// </summary>
    [HttpGet("{conversationId}/history")]
    [Authorize]
    public IActionResult GetHistory(string conversationId)
    {
        try
        {
            if (!_conversations.ContainsKey(conversationId))
            {
                return NotFound(new { message = "Conversa não encontrada" });
            }

            var conversation = _conversations[conversationId];
            
            return Ok(new
            {
                conversationId = conversationId,
                messages = conversation,
                messageCount = conversation.Count,
                timestamp = DateTime.UtcNow
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao obter histórico da conversa: {ConversationId}", conversationId);
            return StatusCode(500, new { message = "Erro interno do servidor" });
        }
    }

    /// <summary>
    /// Listar conversas ativas
    /// </summary>
    [HttpGet("conversations")]
    [Authorize]
    public IActionResult GetActiveConversations()
    {
        try
        {
            var conversations = _conversations.Select(kvp => new
            {
                conversationId = kvp.Key,
                messageCount = kvp.Value.Count,
                lastMessage = kvp.Value.LastOrDefault()?.Timestamp
            }).ToList();
            
            return Ok(new
            {
                conversations = conversations,
                totalConversations = conversations.Count,
                timestamp = DateTime.UtcNow
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao listar conversas");
            return StatusCode(500, new { message = "Erro interno do servidor" });
        }
    }

    private string BuildContextFromHistory(List<ChatMessage> history)
    {
        var context = new StringBuilder();
        context.AppendLine("Contexto da conversa:");
        
        foreach (var message in history.TakeLast(10)) // Últimas 10 mensagens
        {
            context.AppendLine($"{message.Role}: {message.Content}");
        }
        
        return context.ToString();
    }
}

/// <summary>
/// Mensagem de chat
/// </summary>
public class ChatMessage
{
    public string Role { get; set; } = string.Empty; // "user" ou "assistant"
    public string Content { get; set; } = string.Empty;
    public DateTime Timestamp { get; set; }
}

/// <summary>
/// Request para enviar mensagem
/// </summary>
public class ChatMessageRequest
{
    public string Message { get; set; } = string.Empty;
}
