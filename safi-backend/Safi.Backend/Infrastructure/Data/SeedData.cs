using Microsoft.EntityFrameworkCore;
using Safi.Backend.Core.Entities;
using Safi.Backend.Core.Enums;
using Safi.Backend.Infrastructure.Data.Context;

namespace Safi.Backend.Infrastructure.Data;

/// <summary>
/// Classe responsável por popular o banco de dados com dados iniciais
/// </summary>
public static class SeedData
{
    /// <summary>
    /// Popula o banco de dados com dados iniciais
    /// </summary>
    /// <param name="context">Contexto do banco de dados</param>
    public static async Task SeedAsync(ApplicationDbContext context)
    {
        // Verificar se já existem dados
        if (await context.Departments.AnyAsync())
        {
            return; // Já existem dados, não precisa popular novamente
        }

        await SeedDepartmentsAsync(context);
        await SeedIssueTypesAsync(context);
        await SeedUsersAsync(context);
        
        await context.SaveChangesAsync();
    }

    /// <summary>
    /// Popula departamentos iniciais
    /// </summary>
    private static async Task SeedDepartmentsAsync(ApplicationDbContext context)
    {
        var departments = new List<Department>
        {
            new Department
            {
                Name = "TI - Tecnologia da Informação",
                Description = "Departamento responsável por suporte técnico e infraestrutura",
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            },
            new Department
            {
                Name = "RH - Recursos Humanos",
                Description = "Departamento responsável por gestão de pessoas",
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            },
            new Department
            {
                Name = "Financeiro",
                Description = "Departamento responsável por gestão financeira",
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            },
            new Department
            {
                Name = "Comercial",
                Description = "Departamento responsável por vendas e relacionamento com clientes",
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            },
            new Department
            {
                Name = "Operacional",
                Description = "Departamento responsável por operações do dia a dia",
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            }
        };

        await context.Departments.AddRangeAsync(departments);
        await context.SaveChangesAsync();
    }

    /// <summary>
    /// Popula tipos de problemas iniciais
    /// </summary>
    /// 

    private static async Task SeedIssueTypesAsync(ApplicationDbContext context)
    {
        var issueTypes = new List<IssueType>
        {
            new IssueType
            {
                Name = "Problema Técnico",
                Description = "Problemas relacionados a hardware, software ou infraestrutura",
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            },
            new IssueType
            {
                Name = "Dúvida sobre Sistema",
                Description = "Dúvidas sobre como usar funcionalidades do sistema",
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            },
            new IssueType
            {
                Name = "Solicitação de Acesso",
                Description = "Solicitações para acesso a sistemas ou funcionalidades",
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            },
            new IssueType
            {
                Name = "Bug Report",
                Description = "Relatórios de bugs ou comportamentos inesperados",
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            },
            new IssueType
            {
                Name = "Melhoria/Sugestão",
                Description = "Sugestões de melhorias ou novas funcionalidades",
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            },
            new IssueType
            {
                Name = "Treinamento",
                Description = "Solicitações de treinamento ou capacitação",
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            },
            new IssueType
            {
                Name = "Outros",
                Description = "Outros tipos de solicitações não categorizadas",
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            }
        };

        await context.IssueTypes.AddRangeAsync(issueTypes);
        await context.SaveChangesAsync();
    }

    /// <summary>
    /// Popula usuários iniciais
    /// </summary>
    private static async Task SeedUsersAsync(ApplicationDbContext context)
    {
        var tiDepartment = await context.Departments.FirstAsync(d => d.Name == "TI - Tecnologia da Informação");
        
        var users = new List<User>
        {
            // Administrador do sistema
            new User
            {
                Name = "Administrador SAFI",
                Email = "admin@safi.com",
                UserType = UserType.Admin,
                DepartmentId = tiDepartment.Id,
                CreatedAt = DateTime.UtcNow
            },
            // Analistas de suporte
            new User
            {
                Name = "João Silva - Analista N1",
                Email = "joao.silva@safi.com",
                UserType = UserType.Analyst,
                AnalystLevel = AnalystLevel.Level1,
                DepartmentId = tiDepartment.Id,
                CreatedAt = DateTime.UtcNow
            },
            new User
            {
                Name = "Maria Santos - Analista N2",
                Email = "maria.santos@safi.com",
                UserType = UserType.Analyst,
                AnalystLevel = AnalystLevel.Level2,
                DepartmentId = tiDepartment.Id,
                CreatedAt = DateTime.UtcNow
            },
            new User
            {
                Name = "Pedro Costa - Analista N3",
                Email = "pedro.costa@safi.com",
                UserType = UserType.Analyst,
                AnalystLevel = AnalystLevel.Level3,
                DepartmentId = tiDepartment.Id,
                CreatedAt = DateTime.UtcNow
            },
            // Usuários comuns para teste
            new User
            {
                Name = "Ana Oliveira",
                Email = "ana.oliveira@safi.com",
                UserType = UserType.Common,
                DepartmentId = context.Departments.First(d => d.Name == "RH - Recursos Humanos").Id,
                CreatedAt = DateTime.UtcNow
            },
            new User
            {
                Name = "Carlos Ferreira",
                Email = "carlos.ferreira@safi.com",
                UserType = UserType.Common,
                DepartmentId = context.Departments.First(d => d.Name == "Comercial").Id,
                CreatedAt = DateTime.UtcNow
            }
        };

        await context.Users.AddRangeAsync(users);
        await context.SaveChangesAsync();
    }
}
