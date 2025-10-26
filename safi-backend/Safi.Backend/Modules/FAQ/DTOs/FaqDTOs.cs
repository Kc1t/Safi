using FluentValidation;

namespace Safi.Backend.Modules.FAQ.DTOs;

/// <summary>
/// Item individual de FAQ contendo pergunta e resposta
/// </summary>
public class FaqItemDto
{
    /// <summary>
    /// Pergunta do FAQ
    /// </summary>
    public string Pergunta { get; set; } = string.Empty;

    /// <summary>
    /// Resposta para a pergunta
    /// </summary>
    public string Resposta { get; set; } = string.Empty;
}

/// <summary>
/// Request para gerar FAQ geral do sistema
/// </summary>
public class GenerateFaqRequestDto
{
    /// <summary>
    /// Número de perguntas a serem geradas (padrão: 10, máximo: 50)
    /// </summary>
    public int? NumberOfQuestions { get; set; } = 10;
}

/// <summary>
/// Response com FAQ gerado
/// </summary>
public class GenerateFaqResponseDto
{
    /// <summary>
    /// Indica se a geração foi bem-sucedida
    /// </summary>
    public bool Success { get; set; }

    /// <summary>
    /// Lista de perguntas e respostas geradas
    /// </summary>
    public List<FaqItemDto> Data { get; set; } = new();

    /// <summary>
    /// Data e hora de geração do FAQ
    /// </summary>
    public DateTime GeneratedAt { get; set; }

    /// <summary>
    /// Total de questões geradas
    /// </summary>
    public int TotalQuestions { get; set; }

    /// <summary>
    /// Mensagem de erro (caso Success = false)
    /// </summary>
    public string? Message { get; set; }
}

/// <summary>
/// Validador para GenerateFaqRequestDto
/// </summary>
public class GenerateFaqRequestValidator : AbstractValidator<GenerateFaqRequestDto>
{
    public GenerateFaqRequestValidator()
    {
        RuleFor(x => x.NumberOfQuestions)
            .InclusiveBetween(1, 50)
            .WithMessage("O número de perguntas deve estar entre 1 e 50");
    }
}
