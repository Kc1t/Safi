using System.ComponentModel.DataAnnotations;

namespace Safi.Backend.Modules.Tickets.DTOs;

/// <summary>
/// DTO para criação de ticket público
/// </summary>
public class PublicTicketRequest
{
    /// <summary>
    /// Nome do usuário
    /// </summary>
    /// <example>João Silva</example>
    [Required(ErrorMessage = "Nome é obrigatório")]
    [MinLength(2, ErrorMessage = "Nome deve ter pelo menos 2 caracteres")]
    public string RequesterName { get; set; } = string.Empty;

    /// <summary>
    /// Email do usuário
    /// </summary>
    /// <example>joao.silva@empresa.com</example>
    [Required(ErrorMessage = "Email é obrigatório")]
    [EmailAddress(ErrorMessage = "Email deve ter formato válido")]
    public string RequesterEmail { get; set; } = string.Empty;

    /// <summary>
    /// Nome do departamento do usuário
    /// </summary>
    /// <example>TI</example>
    [Required(ErrorMessage = "Departamento é obrigatório")]
    [MinLength(2, ErrorMessage = "Departamento deve ter pelo menos 2 caracteres")]
    public string DepartmentName { get; set; } = string.Empty;

    /// <summary>
    /// Título do ticket
    /// </summary>
    /// <example>Problema de acesso ao sistema</example>
    [Required(ErrorMessage = "Título é obrigatório")]
    [MinLength(5, ErrorMessage = "Título deve ter pelo menos 5 caracteres")]
    public string Title { get; set; } = string.Empty;

    /// <summary>
    /// Descrição detalhada do problema
    /// </summary>
    /// <example>Estou tentando acessar o sistema mas recebo erro 500. Já tentei limpar o cache do navegador mas o problema persiste.</example>
    [Required(ErrorMessage = "Descrição é obrigatória")]
    [MinLength(10, ErrorMessage = "Descrição deve ter pelo menos 10 caracteres")]
    public string Description { get; set; } = string.Empty;
}

/// <summary>
/// DTO para criação de ticket autenticado
/// </summary>
public class CreateTicketRequest
{
    /// <summary>
    /// Título do ticket
    /// </summary>
    /// <example>Erro ao imprimir documentos</example>
    [Required(ErrorMessage = "Título é obrigatório")]
    [MinLength(5, ErrorMessage = "Título deve ter pelo menos 5 caracteres")]
    public string Title { get; set; } = string.Empty;

    /// <summary>
    /// Descrição detalhada do problema
    /// </summary>
    /// <example>A impressora não está respondendo. Testei com outros documentos e o problema persiste. Já reiniciei a impressora mas não resolveu.</example>
    [Required(ErrorMessage = "Descrição é obrigatória")]
    [MinLength(10, ErrorMessage = "Descrição deve ter pelo menos 10 caracteres")]
    public string Description { get; set; } = string.Empty;

    /// <summary>
    /// Prioridade do ticket
    /// </summary>
    /// <example>High</example>
    public string Priority { get; set; } = "Medium";

    /// <summary>
    /// ID do tipo de problema
    /// </summary>
    /// <example>2</example>
    [Required(ErrorMessage = "Tipo de problema é obrigatório")]
    public int IssueTypeId { get; set; }
}

/// <summary>
/// DTO para adicionar mensagem ao ticket
/// </summary>
public class AddMessageRequest
{
    /// <summary>
    /// Conteúdo da mensagem
    /// </summary>
    [Required(ErrorMessage = "Mensagem é obrigatória")]
    [MinLength(1, ErrorMessage = "Mensagem não pode estar vazia")]
    public string Message { get; set; } = string.Empty;

    /// <summary>
    /// Se a mensagem é interna (apenas para analistas)
    /// </summary>
    public bool IsInternal { get; set; } = false;

    /// <summary>
    /// Se a mensagem foi enviada pela IA
    /// </summary>
    public bool IsAiMessage { get; set; } = false;

    /// <summary>
    /// Tipo da mensagem
    /// </summary>
    public string? MessageType { get; set; } = "text";
}

/// <summary>
/// DTO para atualização de ticket
/// </summary>
public class UpdateTicketRequest
{
    /// <summary>
    /// Título do ticket
    /// </summary>
    [Required(ErrorMessage = "Título é obrigatório")]
    [MinLength(5, ErrorMessage = "Título deve ter pelo menos 5 caracteres")]
    public string Title { get; set; } = string.Empty;

    /// <summary>
    /// Descrição detalhada do problema
    /// </summary>
    [Required(ErrorMessage = "Descrição é obrigatória")]
    [MinLength(10, ErrorMessage = "Descrição deve ter pelo menos 10 caracteres")]
    public string Description { get; set; } = string.Empty;

    /// <summary>
    /// Status do ticket
    /// </summary>
    [Required(ErrorMessage = "Status é obrigatório")]
    public string Status { get; set; } = string.Empty;

    /// <summary>
    /// Prioridade do ticket
    /// </summary>
    [Required(ErrorMessage = "Prioridade é obrigatória")]
    public string Priority { get; set; } = string.Empty;

    /// <summary>
    /// ID do tipo de problema
    /// </summary>
    [Required(ErrorMessage = "Tipo de problema é obrigatório")]
    public int IssueTypeId { get; set; }

    /// <summary>
    /// ID do analista atribuído
    /// </summary>
    public int? AssignedToId { get; set; }
}

/// <summary>
/// DTO para lista de tickets com filtros
/// </summary>
public class TicketListRequest
{
    /// <summary>
    /// Status do ticket
    /// </summary>
    public string? Status { get; set; }

    /// <summary>
    /// Prioridade do ticket
    /// </summary>
    public string? Priority { get; set; }

    /// <summary>
    /// ID do usuário
    /// </summary>
    public int? UserId { get; set; }

    /// <summary>
    /// ID do analista atribuído
    /// </summary>
    public int? AssignedTo { get; set; }

    /// <summary>
    /// ID do tipo de problema
    /// </summary>
    public int? IssueTypeId { get; set; }

    /// <summary>
    /// Nível de suporte (N1, N2, N3)
    /// </summary>
    public string? SupportLevel { get; set; }

    /// <summary>
    /// Termo de busca
    /// </summary>
    public string? SearchTerm { get; set; }

    /// <summary>
    /// Número da página
    /// </summary>
    public int PageNumber { get; set; } = 1;

    /// <summary>
    /// Tamanho da página
    /// </summary>
    public int PageSize { get; set; } = 10;
}

/// <summary>
/// DTO para atualização de status do ticket
/// </summary>
public class UpdateTicketStatusRequest
{
    /// <summary>
    /// Novo status do ticket
    /// </summary>
    [Required(ErrorMessage = "Status é obrigatório")]
    public string Status { get; set; } = string.Empty;

    /// <summary>
    /// Comentário sobre a mudança de status
    /// </summary>
    public string? Comment { get; set; }
}

/// <summary>
/// DTO para atribuição de ticket
/// </summary>
public class AssignTicketRequest
{
    /// <summary>
    /// ID do analista
    /// </summary>
    [Required(ErrorMessage = "ID do analista é obrigatório")]
    public int AnalystId { get; set; }

    /// <summary>
    /// Comentário sobre a atribuição
    /// </summary>
    public string? Comment { get; set; }
}

/// <summary>
/// DTO para escalonamento de ticket
/// </summary>
public class EscalateTicketRequest
{
    /// <summary>
    /// Novo nível de suporte (N1, N2, N3)
    /// </summary>
    [Required(ErrorMessage = "Nível de suporte é obrigatório")]
    public string SupportLevel { get; set; } = string.Empty;

    /// <summary>
    /// Comentário sobre o escalonamento
    /// </summary>
    public string? Comment { get; set; }

    /// <summary>
    /// ID do analista para atribuir (opcional)
    /// </summary>
    public int? AssignToAnalystId { get; set; }
}

/// <summary>
/// DTO para resposta de ticket criado
/// </summary>
public class TicketCreatedResponse
{
    /// <summary>
    /// ID do ticket criado
    /// </summary>
    public int TicketId { get; set; }

    /// <summary>
    /// Número do ticket
    /// </summary>
    public string TicketNumber { get; set; } = string.Empty;

    /// <summary>
    /// Status inicial do ticket
    /// </summary>
    public string Status { get; set; } = string.Empty;

    /// <summary>
    /// Prioridade atribuída pela IA
    /// </summary>
    public string Priority { get; set; } = string.Empty;

    /// <summary>
    /// Data de criação
    /// </summary>
    public DateTime CreatedAt { get; set; }

    /// <summary>
    /// Mensagem de confirmação
    /// </summary>
    public string Message { get; set; } = string.Empty;
}

/// <summary>
/// DTO para resposta de lista de tickets
/// </summary>
public class TicketListResponse
{
    /// <summary>
    /// Lista de tickets
    /// </summary>
    public List<TicketSummary> Tickets { get; set; } = new();

    /// <summary>
    /// Informações de paginação
    /// </summary>
    public PaginationInfo Pagination { get; set; } = new();

    /// <summary>
    /// Total de tickets encontrados
    /// </summary>
    public int TotalCount { get; set; }
}

/// <summary>
/// DTO para resumo de ticket
/// </summary>
public class TicketSummary
{
    /// <summary>
    /// ID do ticket
    /// </summary>
    public int Id { get; set; }

    /// <summary>
    /// Número do ticket
    /// </summary>
    public string TicketNumber { get; set; } = string.Empty;

    /// <summary>
    /// Título do ticket
    /// </summary>
    public string Title { get; set; } = string.Empty;

    /// <summary>
    /// Status atual
    /// </summary>
    public string Status { get; set; } = string.Empty;

    /// <summary>
    /// Prioridade
    /// </summary>
    public string Priority { get; set; } = string.Empty;

    /// <summary>
    /// Nível de suporte
    /// </summary>
    public string SupportLevel { get; set; } = string.Empty;

    /// <summary>
    /// Nome do usuário
    /// </summary>
    public string UserName { get; set; } = string.Empty;

    /// <summary>
    /// Email do usuário
    /// </summary>
    public string UserEmail { get; set; } = string.Empty;

    /// <summary>
    /// Departamento do usuário
    /// </summary>
    public string? UserDepartment { get; set; }

    /// <summary>
    /// Data de criação
    /// </summary>
    public DateTime CreatedAt { get; set; }

    /// <summary>
    /// Data da última atualização
    /// </summary>
    public DateTime? UpdatedAt { get; set; }
}

/// <summary>
/// DTO para informações de paginação
/// </summary>
public class PaginationInfo
{
    /// <summary>
    /// Página atual
    /// </summary>
    public int CurrentPage { get; set; }

    /// <summary>
    /// Tamanho da página
    /// </summary>
    public int PageSize { get; set; }

    /// <summary>
    /// Total de páginas
    /// </summary>
    public int TotalPages { get; set; }

    /// <summary>
    /// Tem próxima página
    /// </summary>
    public bool HasNextPage { get; set; }

    /// <summary>
    /// Tem página anterior
    /// </summary>
    public bool HasPreviousPage { get; set; }
}
