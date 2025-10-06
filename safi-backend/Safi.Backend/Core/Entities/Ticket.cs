using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Safi.Backend.Core.Enums;

namespace Safi.Backend.Core.Entities;

/// <summary>
/// Entidade que representa um ticket/chamado
/// </summary>
[Table("TICKETS")]
public class Ticket
{
    /// <summary>
    /// Identificador único do ticket
    /// </summary>
    [Key]
    [Column("ID_TICKETS")]
    public int Id { get; set; }

    /// <summary>
    /// Título do ticket
    /// </summary>
    [Required]
    [MaxLength(255)]
    [Column("TITLE")]
    public string Title { get; set; } = string.Empty;

    /// <summary>
    /// Detalhamento do problema
    /// </summary>
    [Column("DETAILING")]
    public string? Detailing { get; set; }

    /// <summary>
    /// Status atual do ticket
    /// </summary>
    [Required]
    [Column("STATUS")]
    public TicketStatus Status { get; set; } = TicketStatus.Open;

    /// <summary>
    /// Prioridade do ticket
    /// </summary>
    [Required]
    [Column("PRIORITY")]
    public TicketPriority Priority { get; set; } = TicketPriority.Medium;

    /// <summary>
    /// Tipo do problema
    /// </summary>
    [Column("ID_ISSUE_TYPES")]
    public int IssueTypeId { get; set; }

    /// <summary>
    /// Usuário que criou o ticket
    /// </summary>
    [Column("ID_USERS")]
    public int UserId { get; set; }

    /// <summary>
    /// Analista atribuído ao ticket
    /// </summary>
    [Column("ASSIGNED_TO")]
    public int? AssignedToId { get; set; }

    /// <summary>
    /// Nível de suporte do ticket (N1, N2, N3)
    /// </summary>
    [Column("SUPPORT_LEVEL")]
    public AnalystLevel SupportLevel { get; set; } = AnalystLevel.Level1;

    /// <summary>
    /// Data de criação do ticket
    /// </summary>
    [Column("CREATED_AT")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    /// <summary>
    /// Data da última atualização
    /// </summary>
    [Column("UPDATED_AT")]
    public DateTime? UpdatedAt { get; set; }

    /// <summary>
    /// Data de resolução do ticket
    /// </summary>
    [Column("RESOLVED_AT")]
    public DateTime? ResolvedAt { get; set; }

    // Navigation Properties
    /// <summary>
    /// Tipo do problema
    /// </summary>
    [ForeignKey(nameof(IssueTypeId))]
    public virtual IssueType IssueType { get; set; } = null!;

    /// <summary>
    /// Usuário que criou o ticket
    /// </summary>
    [ForeignKey(nameof(UserId))]
    public virtual User User { get; set; } = null!;

    /// <summary>
    /// Analista atribuído ao ticket
    /// </summary>
    [ForeignKey(nameof(AssignedToId))]
    public virtual User? AssignedTo { get; set; }

    /// <summary>
    /// Mensagens do ticket
    /// </summary>
    public virtual ICollection<TicketMessage> Messages { get; set; } = new List<TicketMessage>();

    /// <summary>
    /// Histórico de alterações do ticket
    /// </summary>
    public virtual ICollection<TicketHistory> History { get; set; } = new List<TicketHistory>();
}
