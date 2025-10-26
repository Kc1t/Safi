using Safi.Backend.Modules.FAQ.DTOs;

namespace Safi.Backend.Core.Interfaces;

/// <summary>
/// Interface para serviço de geração de FAQ com IA
/// </summary>
public interface IFaqService
{
    /// <summary>
    /// Gera FAQ geral do sistema SAFI usando IA
    /// </summary>
    /// <param name="numberOfQuestions">Quantidade de perguntas a gerar</param>
    /// <returns>Response com FAQ gerado</returns>
    Task<GenerateFaqResponseDto> GenerateGeneralFaqAsync(int numberOfQuestions);

    /// <summary>
    /// Gera FAQ baseado em análise de tickets reais do banco de dados
    /// </summary>
    /// <param name="numberOfQuestions">Quantidade de perguntas a gerar</param>
    /// <param name="daysToAnalyze">Período em dias para análise de tickets</param>
    /// <param name="minOccurrences">Mínimo de ocorrências para considerar frequente</param>
    /// <returns>Response com FAQ gerado baseado em tickets</returns>
    Task<GenerateFaqFromTicketsResponseDto> GenerateFaqFromTicketsAsync(
        int numberOfQuestions,
        int daysToAnalyze,
        int minOccurrences);
}
