using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Safi.Backend.Core.Entities;

/// <summary>
/// Entidade que representa um departamento da empresa
/// </summary>
[Table("DEPARTMENTS")]
public class Department
{
    /// <summary>
    /// Identificador único do departamento
    /// </summary>
    [Key]
    [Column("ID_DEPARTMENTS")]
    public int Id { get; set; }

    /// <summary>
    /// Nome do departamento
    /// </summary>
    [Required]
    [MaxLength(100)]
    [Column("NAME")]
    public string Name { get; set; } = string.Empty;

    /// <summary>
    /// Descrição do departamento
    /// </summary>
    [MaxLength(500)]
    [Column("DESCRIPTION")]
    public string? Description { get; set; }

    /// <summary>
    /// Se o departamento está ativo
    /// </summary>
    [Column("IS_ACTIVE")]
    public bool IsActive { get; set; } = true;

    /// <summary>
    /// Data de criação do departamento
    /// </summary>
    [Column("CREATED_AT")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation Properties
    /// <summary>
    /// Usuários do departamento
    /// </summary>
    public virtual ICollection<User> Users { get; set; } = new List<User>();
}
