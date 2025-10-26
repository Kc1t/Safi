using Microsoft.AspNetCore.Mvc;
using Safi.Backend.Core.Interfaces;
using Safi.Backend.Modules.FAQ.DTOs;

namespace Safi.Backend.Modules.FAQ.Controllers;

/// <summary>
/// Controller para geração de FAQ com IA
/// </summary>
[ApiController]
[Route("api/faq")]
[Produces("application/json")]
public class FaqController : ControllerBase
{
    private readonly IFaqService _faqService;
    private readonly ILogger<FaqController> _logger;

    public FaqController(IFaqService faqService, ILogger<FaqController> logger)
    {
        _faqService = faqService;
        _logger = logger;
    }

    /// <summary>
    /// Gera FAQ geral do sistema SAFI usando IA
    /// </summary>
    /// <param name="request">Parâmetros da requisição (opcional)</param>
    /// <returns>FAQ gerado com perguntas e respostas</returns>
    /// <response code="200">FAQ gerado com sucesso</response>
    /// <response code="400">Requisição inválida (parâmetros fora dos limites)</response>
    /// <response code="500">Erro interno ao gerar FAQ</response>
    /// <remarks>
    /// Exemplo de requisição:
    ///
    ///     POST /api/faq/generate-general
    ///     {
    ///         "numberOfQuestions": 10
    ///     }
    ///
    /// Esta requisição pode demorar até 30 segundos dependendo da carga da API Gemini.
    ///
    /// O número de perguntas deve estar entre 1 e 50. Se não informado, o padrão é 10.
    /// </remarks>
    [HttpPost("generate-general")]
    [ProducesResponseType(typeof(GenerateFaqResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<GenerateFaqResponseDto>> GenerateGeneralFaq(
        [FromBody] GenerateFaqRequestDto? request = null)
    {
        try
        {
            // Usar valores padrão se request for null
            request ??= new GenerateFaqRequestDto();

            // Validar número de perguntas
            var numberOfQuestions = request.NumberOfQuestions ?? 10;

            if (numberOfQuestions < 1 || numberOfQuestions > 50)
            {
                _logger.LogWarning("Número de perguntas inválido: {NumberOfQuestions}", numberOfQuestions);
                return BadRequest(new ProblemDetails
                {
                    Title = "Parâmetro inválido",
                    Detail = "O número de perguntas deve estar entre 1 e 50",
                    Status = StatusCodes.Status400BadRequest
                });
            }

            _logger.LogInformation("Requisição para gerar FAQ com {NumberOfQuestions} perguntas", numberOfQuestions);

            // Chamar serviço
            var result = await _faqService.GenerateGeneralFaqAsync(numberOfQuestions);

            // Verificar se houve sucesso
            if (!result.Success)
            {
                _logger.LogWarning("Falha ao gerar FAQ: {Message}", result.Message);
                return StatusCode(StatusCodes.Status500InternalServerError, result);
            }

            _logger.LogInformation("FAQ gerado com sucesso: {TotalQuestions} perguntas", result.TotalQuestions);
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro inesperado ao processar requisição de FAQ");

            var errorResponse = new GenerateFaqResponseDto
            {
                Success = false,
                Message = "Erro interno ao processar requisição. Por favor, tente novamente.",
                GeneratedAt = DateTime.UtcNow,
                TotalQuestions = 0
            };

            return StatusCode(StatusCodes.Status500InternalServerError, errorResponse);
        }
    }

    /// <summary>
    /// Gera FAQ baseado em análise de tickets reais do banco de dados
    /// </summary>
    /// <param name="request">Parâmetros da requisição (opcional)</param>
    /// <returns>FAQ gerado com perguntas e respostas baseadas em dados reais</returns>
    /// <response code="200">FAQ gerado com sucesso</response>
    /// <response code="400">Requisição inválida (parâmetros fora dos limites)</response>
    /// <response code="404">Não há tickets suficientes para análise</response>
    /// <response code="500">Erro interno ao gerar FAQ</response>
    /// <remarks>
    /// Exemplo de requisição:
    ///
    ///     POST /api/faq/generate-from-tickets
    ///     {
    ///         "numberOfQuestions": 10,
    ///         "daysToAnalyze": 30,
    ///         "minOccurrences": 2
    ///     }
    ///
    /// ATENÇÃO: Esta requisição pode demorar até 60 segundos devido à análise de banco de dados e processamento de IA.
    ///
    /// Parâmetros:
    /// - numberOfQuestions: 1-30 (padrão: 10)
    /// - daysToAnalyze: 1-365 (padrão: 30)
    /// - minOccurrences: 1-100 (padrão: 2)
    ///
    /// A análise considera apenas tickets resolvidos (ResolvedAt != null) dentro do período especificado.
    /// </remarks>
    [HttpPost("generate-from-tickets")]
    [ProducesResponseType(typeof(GenerateFaqFromTicketsResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(GenerateFaqFromTicketsResponseDto), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<GenerateFaqFromTicketsResponseDto>> GenerateFaqFromTickets(
        [FromBody] GenerateFaqFromTicketsRequestDto? request = null)
    {
        try
        {
            // Usar valores padrão se request for null
            request ??= new GenerateFaqFromTicketsRequestDto();

            // Extrair e validar parâmetros
            var numberOfQuestions = request.NumberOfQuestions ?? 10;
            var daysToAnalyze = request.DaysToAnalyze ?? 30;
            var minOccurrences = request.MinOccurrences ?? 2;

            // Validar limites
            if (numberOfQuestions < 1 || numberOfQuestions > 30)
            {
                _logger.LogWarning("Número de perguntas inválido: {NumberOfQuestions}", numberOfQuestions);
                return BadRequest(new ProblemDetails
                {
                    Title = "Parâmetro inválido",
                    Detail = "O número de perguntas deve estar entre 1 e 30",
                    Status = StatusCodes.Status400BadRequest
                });
            }

            if (daysToAnalyze < 1 || daysToAnalyze > 365)
            {
                _logger.LogWarning("Período de análise inválido: {DaysToAnalyze}", daysToAnalyze);
                return BadRequest(new ProblemDetails
                {
                    Title = "Parâmetro inválido",
                    Detail = "O período de análise deve estar entre 1 e 365 dias",
                    Status = StatusCodes.Status400BadRequest
                });
            }

            if (minOccurrences < 1 || minOccurrences > 100)
            {
                _logger.LogWarning("Mínimo de ocorrências inválido: {MinOccurrences}", minOccurrences);
                return BadRequest(new ProblemDetails
                {
                    Title = "Parâmetro inválido",
                    Detail = "O mínimo de ocorrências deve estar entre 1 e 100",
                    Status = StatusCodes.Status400BadRequest
                });
            }

            _logger.LogInformation(
                "Requisição para gerar FAQ de tickets: {Questions} perguntas, {Days} dias, mínimo {MinOccurrences} ocorrências",
                numberOfQuestions, daysToAnalyze, minOccurrences);

            // Chamar serviço
            var result = await _faqService.GenerateFaqFromTicketsAsync(
                numberOfQuestions,
                daysToAnalyze,
                minOccurrences);

            // Verificar se houve sucesso
            if (!result.Success)
            {
                // Se não há tickets suficientes, retornar 404
                if (result.TotalTicketsAnalyzed == 0 ||
                    result.Message?.Contains("suficientes") == true)
                {
                    _logger.LogWarning("Tickets insuficientes para análise: {Message}", result.Message);
                    return NotFound(result);
                }

                // Outros erros retornam 500
                _logger.LogWarning("Falha ao gerar FAQ de tickets: {Message}", result.Message);
                return StatusCode(StatusCodes.Status500InternalServerError, result);
            }

            _logger.LogInformation(
                "FAQ de tickets gerado com sucesso: {TotalQuestions} perguntas baseadas em {TotalTickets} tickets",
                result.TotalQuestions, result.TotalTicketsAnalyzed);

            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro inesperado ao processar requisição de FAQ de tickets");

            var errorResponse = new GenerateFaqFromTicketsResponseDto
            {
                Success = false,
                Message = "Erro interno ao processar requisição. Por favor, tente novamente.",
                GeneratedAt = DateTime.UtcNow,
                TotalQuestions = 0,
                TotalTicketsAnalyzed = 0,
                AnalyzedPeriod = "N/A"
            };

            return StatusCode(StatusCodes.Status500InternalServerError, errorResponse);
        }
    }
}
