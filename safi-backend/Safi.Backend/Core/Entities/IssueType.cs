using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Safi.Backend.Core.Entities;

/// <summary>
/// Entidade que representa um tipo de problema/chamado
/// </summary>
[Table("ISSUE_TYPES")]
public class IssueType
{
    /// <summary>
    /// Identificador único do tipo de problema
    /// </summary>
    [Key]
    [Column("ID_ISSUE_TYPES")]
    public int Id { get; set; }

    /// <summary>
    /// Nome do tipo de problema
    /// </summary>
    [Required]
    [MaxLength(100)]
    [Column("NAME")]
    public string Name { get; set; } = string.Empty;

    /// <summary>
    /// Descrição do tipo de problema
    /// </summary>
    [MaxLength(500)]
    [Column("DESCRIPTION")]
    public string? Description { get; set; }

    /// <summary>
    /// Se o tipo está ativo
    /// </summary>
    [Column("IS_ACTIVE")]
    public bool IsActive { get; set; } = true;

    /// <summary>
    /// Data de criação do tipo
    /// </summary>
    [Column("CREATED_AT")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation Properties
    /// <summary>
    /// Tickets deste tipo
    /// </summary>
    public virtual ICollection<Ticket> Tickets { get; set; } = new List<Ticket>();
}
