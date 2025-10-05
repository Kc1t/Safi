using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Safi.Backend.Core.Enums;

namespace Safi.Backend.Core.Entities;

/// <summary>
/// Entidade que representa um usuário do sistema
/// </summary>
[Table("USERS")]
public class User
{
    /// <summary>
    /// Identificador único do usuário
    /// </summary>
    [Key]
    [Column("ID_USERS")]
    public int Id { get; set; }

    /// <summary>
    /// Nome completo do usuário
    /// </summary>
    [Required]
    [MaxLength(100)]
    [Column("NAME")]
    public string Name { get; set; } = string.Empty;

    /// <summary>
    /// Email do usuário (único)
    /// </summary>
    [Required]
    [MaxLength(150)]
    [EmailAddress]
    [Column("EMAIL")]
    public string Email { get; set; } = string.Empty;

    /// <summary>
    /// Tipo do usuário (Common, Analyst, Admin)
    /// </summary>
    [Column("ID_USER_TYPES")]
    public UserType UserType { get; set; }

    /// <summary>
    /// Nível do analista (se for analista)
    /// </summary>
    [Column("ID_ANALYST_LEVELS")]
    public AnalystLevel? AnalystLevel { get; set; }

    /// <summary>
    /// Departamento do usuário
    /// </summary>
    [Column("ID_DEPARTMENTS")]
    public int? DepartmentId { get; set; }

    /// <summary>
    /// Data de criação do usuário
    /// </summary>
    [Column("CREATED_AT")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation Properties
    /// <summary>
    /// Departamento do usuário
    /// </summary>
    [ForeignKey(nameof(DepartmentId))]
    public virtual Department? Department { get; set; }

    /// <summary>
    /// Tickets criados pelo usuário
    /// </summary>
    public virtual ICollection<Ticket> CreatedTickets { get; set; } = new List<Ticket>();

    /// <summary>
    /// Tickets atribuídos ao usuário
    /// </summary>
    public virtual ICollection<Ticket> AssignedTickets { get; set; } = new List<Ticket>();

    /// <summary>
    /// Mensagens enviadas pelo usuário
    /// </summary>
    public virtual ICollection<TicketMessage> Messages { get; set; } = new List<TicketMessage>();

    /// <summary>
    /// Histórico de alterações feitas pelo usuário
    /// </summary>
    public virtual ICollection<TicketHistory> HistoryEntries { get; set; } = new List<TicketHistory>();
}
