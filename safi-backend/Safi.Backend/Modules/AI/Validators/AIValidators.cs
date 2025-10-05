using FluentValidation;
using Safi.Backend.Modules.AI.DTOs;

namespace Safi.Backend.Modules.AI.Validators;

/// <summary>
/// Validador para AIAnalysisRequest
/// </summary>
public class AIAnalysisRequestValidator : AbstractValidator<AIAnalysisRequest>
{
    public AIAnalysisRequestValidator()
    {
        RuleFor(x => x.Title)
            .NotEmpty().WithMessage("Título é obrigatório")
            .MinimumLength(5).WithMessage("Título deve ter no mínimo 5 caracteres")
            .MaximumLength(255).WithMessage("Título deve ter no máximo 255 caracteres");

        RuleFor(x => x.Description)
            .NotEmpty().WithMessage("Descrição é obrigatória")
            .MinimumLength(10).WithMessage("Descrição deve ter no mínimo 10 caracteres")
            .MaximumLength(2000).WithMessage("Descrição deve ter no máximo 2000 caracteres");

        RuleFor(x => x.UserEmail)
            .NotEmpty().WithMessage("Email do usuário é obrigatório")
            .EmailAddress().WithMessage("Email deve ter formato válido")
            .MaximumLength(150).WithMessage("Email deve ter no máximo 150 caracteres");
    }
}

/// <summary>
/// Validador para AIResponseRequest
/// </summary>
public class AIResponseRequestValidator : AbstractValidator<AIResponseRequest>
{
    public AIResponseRequestValidator()
    {
        RuleFor(x => x.TicketId)
            .GreaterThan(0).WithMessage("ID do ticket deve ser maior que 0");

        RuleFor(x => x.IssueType)
            .NotEmpty().WithMessage("Tipo do problema é obrigatório")
            .MaximumLength(100).WithMessage("Tipo do problema deve ter no máximo 100 caracteres");

        RuleFor(x => x.UserMessage)
            .NotEmpty().WithMessage("Mensagem do usuário é obrigatória")
            .MinimumLength(5).WithMessage("Mensagem deve ter no mínimo 5 caracteres")
            .MaximumLength(1000).WithMessage("Mensagem deve ter no máximo 1000 caracteres");

        RuleFor(x => x.MessageHistory)
            .Must(BeValidMessageHistory).WithMessage("Histórico de mensagens inválido")
            .When(x => x.MessageHistory != null);
    }

    private bool BeValidMessageHistory(List<string>? messageHistory)
    {
        if (messageHistory == null) return true;
        
        return messageHistory.All(msg => 
            !string.IsNullOrEmpty(msg) && 
            msg.Length >= 1 && 
            msg.Length <= 1000);
    }
}
