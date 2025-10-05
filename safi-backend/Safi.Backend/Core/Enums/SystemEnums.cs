namespace Safi.Backend.Core.Enums;

/// <summary>
/// Tipos de usuário no sistema
/// </summary>
public enum UserType
{
    /// <summary>
    /// Usuário comum (requerente de tickets)
    /// </summary>
    Common = 1,
    
    /// <summary>
    /// Analista de suporte
    /// </summary>
    Analyst = 2,
    
    /// <summary>
    /// Administrador do sistema
    /// </summary>
    Admin = 3
}

/// <summary>
/// Níveis de analista de suporte
/// </summary>
public enum AnalystLevel
{
    /// <summary>
    /// Nível 1 - Suporte básico
    /// </summary>
    Level1 = 1,
    
    /// <summary>
    /// Nível 2 - Suporte intermediário
    /// </summary>
    Level2 = 2,
    
    /// <summary>
    /// Nível 3 - Suporte avançado
    /// </summary>
    Level3 = 3
}

/// <summary>
/// Status dos tickets
/// </summary>
public enum TicketStatus
{
    /// <summary>
    /// Ticket aberto
    /// </summary>
    Open = 1,
    
    /// <summary>
    /// Ticket em progresso
    /// </summary>
    InProgress = 2,
    
    /// <summary>
    /// Ticket pendente
    /// </summary>
    Pending = 3,
    
    /// <summary>
    /// Ticket resolvido
    /// </summary>
    Resolved = 4,
    
    /// <summary>
    /// Ticket fechado
    /// </summary>
    Closed = 5
}

/// <summary>
/// Prioridades dos tickets
/// </summary>
public enum TicketPriority
{
    /// <summary>
    /// Prioridade baixa
    /// </summary>
    Low = 1,
    
    /// <summary>
    /// Prioridade média
    /// </summary>
    Medium = 2,
    
    /// <summary>
    /// Prioridade alta
    /// </summary>
    High = 3,
    
    /// <summary>
    /// Prioridade urgente
    /// </summary>
    Urgent = 4
}
