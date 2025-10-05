using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Safi.Backend.Core.Entities;

/// <summary>
/// Entidade que representa o histórico de alterações de um ticket
/// </summary>
[Table("TICKET_HISTORY")]
public class TicketHistory
{
    /// <summary>
    /// Identificador único do histórico
    /// </summary>
    [Key]
    [Column("ID")]
    public int Id { get; set; }

    /// <summary>
    /// Ticket ao qual o histórico pertence
    /// </summary>
    [Column("ID_TICKETS")]
    public int TicketId { get; set; }

    /// <summary>
    /// Usuário que fez a alteração
    /// </summary>
    [Column("CHANGED_BY")]
    public int ChangedById { get; set; }

    /// <summary>
    /// Descrição da alteração
    /// </summary>
    [Required]
    [Column("CHANGE_DESCRIPTION")]
    public string ChangeDescription { get; set; } = string.Empty;

    /// <summary>
    /// Data da alteração
    /// </summary>
    [Column("CHANGED_AT")]
    public DateTime ChangedAt { get; set; } = DateTime.UtcNow;

    /// <summary>
    /// Tipo da alteração (status, prioridade, atribuição, etc.)
    /// </summary>
    [MaxLength(50)]
    [Column("CHANGE_TYPE")]
    public string ChangeType { get; set; } = "general";

    /// <summary>
    /// Valor anterior (para auditoria)
    /// </summary>
    [MaxLength(500)]
    [Column("OLD_VALUE")]
    public string? OldValue { get; set; }

    /// <summary>
    /// Novo valor (para auditoria)
    /// </summary>
    [MaxLength(500)]
    [Column("NEW_VALUE")]
    public string? NewValue { get; set; }

    // Navigation Properties
    /// <summary>
    /// Ticket ao qual o histórico pertence
    /// </summary>
    [ForeignKey(nameof(TicketId))]
    public virtual Ticket Ticket { get; set; } = null!;

    /// <summary>
    /// Usuário que fez a alteração
    /// </summary>
    [ForeignKey(nameof(ChangedById))]
    public virtual User ChangedBy { get; set; } = null!;
}
