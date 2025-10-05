using System.ComponentModel.DataAnnotations;

namespace Safi.Backend.Modules.Tickets.DTOs;

/// <summary>
/// DTO para escalonamento de ticket
/// </summary>
public class EscalateTicketRequest
{
    [Required]
    [StringLength(500)]
    public string Reason { get; set; } = string.Empty;

    [Required]
    public int TargetLevel { get; set; } // 1, 2, 3 (N1, N2, N3)

    public int? AssignedToUserId { get; set; } // Opcional, se não especificado, será atribuído automaticamente
}

/// <summary>
/// DTO para encerramento de ticket
/// </summary>
public class CloseTicketRequest
{
    [Required]
    [StringLength(1000)]
    public string Resolution { get; set; } = string.Empty;

    [Required]
    [StringLength(50)]
    public string ResolutionType { get; set; } = "resolved"; // resolved, closed, cancelled

    public string? Notes { get; set; }
}

/// <summary>
/// DTO para mensagem de chat
/// </summary>
public class ChatMessageRequest
{
    [Required]
    [StringLength(2000)]
    public string Message { get; set; } = string.Empty;

    [StringLength(50)]
    public string MessageType { get; set; } = "user"; // user, analyst, system, ai

    public bool IsInternal { get; set; } = false;
}

/// <summary>
/// DTO para resposta de chat
/// </summary>
public class ChatMessageResponse
{
    public int Id { get; set; }
    public int TicketId { get; set; }
    public int UserId { get; set; }
    public string UserName { get; set; } = string.Empty;
    public string UserEmail { get; set; } = string.Empty;
    public string UserType { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public string MessageType { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public bool IsInternal { get; set; }
}
