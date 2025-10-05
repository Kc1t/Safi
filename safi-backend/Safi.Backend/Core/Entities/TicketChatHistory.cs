using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Safi.Backend.Core.Entities;

/// <summary>
/// Entidade para histórico de chat dos tickets
/// </summary>
[Table("TICKET_CHAT_HISTORY")]
public class TicketChatHistory
{
    [Key]
    [Column("ID_CHAT_HISTORY")]
    public int Id { get; set; }

    [Column("ID_TICKETS")]
    [Required]
    public int TicketId { get; set; }

    [Column("ID_USERS")]
    [Required]
    public int UserId { get; set; }

    [Column("MESSAGE")]
    [Required]
    [MaxLength(2000)]
    public string Message { get; set; } = string.Empty;

    [Column("MESSAGE_TYPE")]
    [Required]
    [MaxLength(50)]
    public string MessageType { get; set; } = "user"; // user, analyst, system, ai

    [Column("CREATED_AT")]
    [Required]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [Column("IS_INTERNAL")]
    public bool IsInternal { get; set; } = false; // Para mensagens internas entre analistas

    // Propriedades de navegação
    public virtual Ticket Ticket { get; set; } = null!;
    public virtual User User { get; set; } = null!;
}
