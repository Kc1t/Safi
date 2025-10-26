using FluentValidation;

namespace Safi.Backend.Modules.FAQ.DTOs;

/// <summary>
/// Item individual de FAQ baseado em tickets com metadata
/// </summary>
public class FaqTicketItemDto
{
    /// <summary>
    /// Pergunta do FAQ
    /// </summary>
    public string Pergunta { get; set; } = string.Empty;

    /// <summary>
    /// Resposta para a pergunta
    /// </summary>
    public string Resposta { get; set; } = string.Empty;

    /// <summary>
    /// Categoria/tipo do problema (nome do IssueType)
    /// </summary>
    public string Category { get; set; } = string.Empty;

    /// <summary>
    /// Quantidade de tickets analisados dessa categoria
    /// </summary>
    public int TicketCount { get; set; }
}

/// <summary>
/// Request para gerar FAQ baseado em tickets do banco
/// </summary>
public class GenerateFaqFromTicketsRequestDto
{
    /// <summary>
    /// Número de perguntas a serem geradas (padrão: 10, máximo: 30)
    /// </summary>
    public int? NumberOfQuestions { get; set; } = 10;

    /// <summary>
    /// Período em dias para analisar tickets (padrão: 30, máximo: 365)
    /// </summary>
    public int? DaysToAnalyze { get; set; } = 30;

    /// <summary>
    /// Mínimo de ocorrências para considerar um problema como frequente (padrão: 2)
    /// </summary>
    public int? MinOccurrences { get; set; } = 2;
}

/// <summary>
/// Response com FAQ gerado baseado em tickets
/// </summary>
public class GenerateFaqFromTicketsResponseDto
{
    /// <summary>
    /// Indica se a geração foi bem-sucedida
    /// </summary>
    public bool Success { get; set; }

    /// <summary>
    /// Lista de perguntas e respostas geradas com metadata
    /// </summary>
    public List<FaqTicketItemDto> Data { get; set; } = new();

    /// <summary>
    /// Data e hora de geração do FAQ
    /// </summary>
    public DateTime GeneratedAt { get; set; }

    /// <summary>
    /// Total de questões geradas
    /// </summary>
    public int TotalQuestions { get; set; }

    /// <summary>
    /// Período analisado (ex: "Últimos 30 dias")
    /// </summary>
    public string AnalyzedPeriod { get; set; } = string.Empty;

    /// <summary>
    /// Total de tickets resolvidos analisados
    /// </summary>
    public int TotalTicketsAnalyzed { get; set; }

    /// <summary>
    /// Mensagem de erro (caso Success = false)
    /// </summary>
    public string? Message { get; set; }
}

/// <summary>
/// Validador para GenerateFaqFromTicketsRequestDto
/// </summary>
public class GenerateFaqFromTicketsRequestValidator : AbstractValidator<GenerateFaqFromTicketsRequestDto>
{
    public GenerateFaqFromTicketsRequestValidator()
    {
        RuleFor(x => x.NumberOfQuestions)
            .InclusiveBetween(1, 30)
            .WithMessage("O número de perguntas deve estar entre 1 e 30");

        RuleFor(x => x.DaysToAnalyze)
            .InclusiveBetween(1, 365)
            .WithMessage("O período de análise deve estar entre 1 e 365 dias");

        RuleFor(x => x.MinOccurrences)
            .InclusiveBetween(1, 100)
            .WithMessage("O mínimo de ocorrências deve estar entre 1 e 100");
    }
}
