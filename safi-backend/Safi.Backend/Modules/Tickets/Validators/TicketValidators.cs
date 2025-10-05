using FluentValidation;
using Safi.Backend.Modules.Tickets.DTOs;

namespace Safi.Backend.Modules.Tickets.Validators;

/// <summary>
/// Validador para PublicTicketRequest
/// </summary>
public class PublicTicketRequestValidator : AbstractValidator<PublicTicketRequest>
{
    public PublicTicketRequestValidator()
    {
        RuleFor(x => x.Title)
            .NotEmpty().WithMessage("Título é obrigatório")
            .MinimumLength(5).WithMessage("Título deve ter no mínimo 5 caracteres")
            .MaximumLength(255).WithMessage("Título deve ter no máximo 255 caracteres");

        RuleFor(x => x.Description)
            .NotEmpty().WithMessage("Descrição é obrigatória")
            .MinimumLength(10).WithMessage("Descrição deve ter no mínimo 10 caracteres")
            .MaximumLength(2000).WithMessage("Descrição deve ter no máximo 2000 caracteres");

        RuleFor(x => x.RequesterName)
            .NotEmpty().WithMessage("Nome do solicitante é obrigatório")
            .MinimumLength(2).WithMessage("Nome deve ter no mínimo 2 caracteres")
            .MaximumLength(100).WithMessage("Nome deve ter no máximo 100 caracteres");

        RuleFor(x => x.RequesterEmail)
            .NotEmpty().WithMessage("Email do solicitante é obrigatório")
            .EmailAddress().WithMessage("Email deve ter formato válido")
            .MaximumLength(150).WithMessage("Email deve ter no máximo 150 caracteres");
    }
}

/// <summary>
/// Validador para CreateTicketRequest
/// </summary>
public class CreateTicketRequestValidator : AbstractValidator<CreateTicketRequest>
{
    public CreateTicketRequestValidator()
    {
        RuleFor(x => x.Title)
            .NotEmpty().WithMessage("Título é obrigatório")
            .MinimumLength(5).WithMessage("Título deve ter no mínimo 5 caracteres")
            .MaximumLength(255).WithMessage("Título deve ter no máximo 255 caracteres");

        RuleFor(x => x.Description)
            .NotEmpty().WithMessage("Descrição é obrigatória")
            .MinimumLength(10).WithMessage("Descrição deve ter no mínimo 10 caracteres")
            .MaximumLength(2000).WithMessage("Descrição deve ter no máximo 2000 caracteres");

        RuleFor(x => x.Priority)
            .NotEmpty().WithMessage("Prioridade é obrigatória")
            .Must(BeValidPriority).WithMessage("Prioridade deve ser: Low, Medium, High ou Urgent");

        RuleFor(x => x.IssueTypeId)
            .GreaterThan(0).WithMessage("Tipo de problema é obrigatório");
    }

    private bool BeValidPriority(string priority)
    {
        return !string.IsNullOrEmpty(priority) && 
               (priority.Equals("Low", StringComparison.OrdinalIgnoreCase) ||
                priority.Equals("Medium", StringComparison.OrdinalIgnoreCase) ||
                priority.Equals("High", StringComparison.OrdinalIgnoreCase) ||
                priority.Equals("Urgent", StringComparison.OrdinalIgnoreCase));
    }
}

/// <summary>
/// Validador para UpdateTicketRequest
/// </summary>
public class UpdateTicketRequestValidator : AbstractValidator<UpdateTicketRequest>
{
    public UpdateTicketRequestValidator()
    {
        RuleFor(x => x.Title)
            .NotEmpty().WithMessage("Título é obrigatório")
            .MinimumLength(5).WithMessage("Título deve ter no mínimo 5 caracteres")
            .MaximumLength(255).WithMessage("Título deve ter no máximo 255 caracteres");

        RuleFor(x => x.Description)
            .NotEmpty().WithMessage("Descrição é obrigatória")
            .MinimumLength(10).WithMessage("Descrição deve ter no mínimo 10 caracteres")
            .MaximumLength(2000).WithMessage("Descrição deve ter no máximo 2000 caracteres");

        RuleFor(x => x.Status)
            .NotEmpty().WithMessage("Status é obrigatório")
            .Must(BeValidStatus).WithMessage("Status deve ser: Open, InProgress, Pending, Resolved ou Closed");

        RuleFor(x => x.Priority)
            .NotEmpty().WithMessage("Prioridade é obrigatória")
            .Must(BeValidPriority).WithMessage("Prioridade deve ser: Low, Medium, High ou Urgent");

        RuleFor(x => x.IssueTypeId)
            .GreaterThan(0).WithMessage("Tipo de problema é obrigatório");
    }

    private bool BeValidStatus(string status)
    {
        return !string.IsNullOrEmpty(status) && 
               (status.Equals("Open", StringComparison.OrdinalIgnoreCase) ||
                status.Equals("InProgress", StringComparison.OrdinalIgnoreCase) ||
                status.Equals("Pending", StringComparison.OrdinalIgnoreCase) ||
                status.Equals("Resolved", StringComparison.OrdinalIgnoreCase) ||
                status.Equals("Closed", StringComparison.OrdinalIgnoreCase));
    }

    private bool BeValidPriority(string priority)
    {
        return !string.IsNullOrEmpty(priority) && 
               (priority.Equals("Low", StringComparison.OrdinalIgnoreCase) ||
                priority.Equals("Medium", StringComparison.OrdinalIgnoreCase) ||
                priority.Equals("High", StringComparison.OrdinalIgnoreCase) ||
                priority.Equals("Urgent", StringComparison.OrdinalIgnoreCase));
    }
}

/// <summary>
/// Validador para TicketListRequest
/// </summary>
public class TicketListRequestValidator : AbstractValidator<TicketListRequest>
{
    public TicketListRequestValidator()
    {
        RuleFor(x => x.PageNumber)
            .GreaterThan(0).WithMessage("Número da página deve ser maior que 0");

        RuleFor(x => x.PageSize)
            .GreaterThan(0).WithMessage("Tamanho da página deve ser maior que 0")
            .LessThanOrEqualTo(100).WithMessage("Tamanho da página deve ser no máximo 100");

        RuleFor(x => x.Status)
            .Must(BeValidStatusOrEmpty).WithMessage("Status deve ser: Open, InProgress, Pending, Resolved ou Closed")
            .When(x => !string.IsNullOrEmpty(x.Status));

        RuleFor(x => x.Priority)
            .Must(BeValidPriorityOrEmpty).WithMessage("Prioridade deve ser: Low, Medium, High ou Urgent")
            .When(x => !string.IsNullOrEmpty(x.Priority));
    }

    private bool BeValidStatusOrEmpty(string? status)
    {
        return string.IsNullOrEmpty(status) || 
               status.Equals("Open", StringComparison.OrdinalIgnoreCase) ||
               status.Equals("InProgress", StringComparison.OrdinalIgnoreCase) ||
               status.Equals("Pending", StringComparison.OrdinalIgnoreCase) ||
               status.Equals("Resolved", StringComparison.OrdinalIgnoreCase) ||
               status.Equals("Closed", StringComparison.OrdinalIgnoreCase);
    }

    private bool BeValidPriorityOrEmpty(string? priority)
    {
        return string.IsNullOrEmpty(priority) || 
               priority.Equals("Low", StringComparison.OrdinalIgnoreCase) ||
               priority.Equals("Medium", StringComparison.OrdinalIgnoreCase) ||
               priority.Equals("High", StringComparison.OrdinalIgnoreCase) ||
               priority.Equals("Urgent", StringComparison.OrdinalIgnoreCase);
    }
}
