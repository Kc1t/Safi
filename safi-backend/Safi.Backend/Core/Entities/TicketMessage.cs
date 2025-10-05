using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Safi.Backend.Core.Entities;

/// <summary>
/// Entidade que representa uma mensagem em um ticket
/// </summary>
[Table("TICKET_MESSAGES")]
public class TicketMessage
{
    /// <summary>
    /// Identificador único da mensagem
    /// </summary>
    [Key]
    [Column("ID")]
    public int Id { get; set; }

    /// <summary>
    /// Ticket ao qual a mensagem pertence
    /// </summary>
    [Column("ID_TICKETS")]
    public int TicketId { get; set; }

    /// <summary>
    /// Usuário que enviou a mensagem
    /// </summary>
    [Column("ID_SENDER")]
    public int SenderId { get; set; }

    /// <summary>
    /// Conteúdo da mensagem
    /// </summary>
    [Required]
    [Column("MESSAGE")]
    public string Message { get; set; } = string.Empty;

    /// <summary>
    /// Data de criação da mensagem
    /// </summary>
    [Column("CREATED_AT")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    /// <summary>
    /// Se a mensagem é interna (apenas para analistas)
    /// </summary>
    [Column("IS_INTERNAL")]
    public bool IsInternal { get; set; } = false;

    /// <summary>
    /// Se a mensagem foi enviada pela IA
    /// </summary>
    [Column("IS_AI_MESSAGE")]
    public bool IsAiMessage { get; set; } = false;

    /// <summary>
    /// Tipo da mensagem (texto, imagem, arquivo, etc.)
    /// </summary>
    [MaxLength(50)]
    [Column("MESSAGE_TYPE")]
    public string MessageType { get; set; } = "text";

    // Navigation Properties
    /// <summary>
    /// Ticket ao qual a mensagem pertence
    /// </summary>
    [ForeignKey(nameof(TicketId))]
    public virtual Ticket Ticket { get; set; } = null!;

    /// <summary>
    /// Usuário que enviou a mensagem
    /// </summary>
    [ForeignKey(nameof(SenderId))]
    public virtual User Sender { get; set; } = null!;
}
