using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Safi.Backend.Infrastructure.Data.Context;

namespace Safi.Backend.Controllers;

/// <summary>
/// Controller temporário para criar tabelas no banco
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class DatabaseController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly ILogger<DatabaseController> _logger;

    public DatabaseController(ApplicationDbContext context, ILogger<DatabaseController> logger)
    {
        _context = context;
        _logger = logger;
    }

    /// <summary>
    /// Criar tabela TICKET_CHAT_HISTORY
    /// </summary>
    [HttpPost("create-chat-table")]
    public async Task<IActionResult> CreateChatTable()
    {
        try
        {
            _logger.LogInformation("Criando tabela TICKET_CHAT_HISTORY...");

            var sql = @"
                IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='TICKET_CHAT_HISTORY' AND xtype='U')
                BEGIN
                    CREATE TABLE TICKET_CHAT_HISTORY (
                        ID_CHAT_HISTORY INT IDENTITY(1,1) PRIMARY KEY,
                        ID_TICKETS INT NOT NULL,
                        ID_USERS INT NOT NULL,
                        MESSAGE NVARCHAR(2000) NOT NULL,
                        MESSAGE_TYPE NVARCHAR(50) NOT NULL DEFAULT 'user',
                        CREATED_AT DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
                        IS_INTERNAL BIT NOT NULL DEFAULT 0,
                        
                        CONSTRAINT FK_TICKET_CHAT_HISTORY_TICKETS 
                            FOREIGN KEY (ID_TICKETS) REFERENCES TICKETS(ID_TICKETS),
                        CONSTRAINT FK_TICKET_CHAT_HISTORY_USERS 
                            FOREIGN KEY (ID_USERS) REFERENCES USERS(ID_USERS)
                    );
                    
                    CREATE INDEX IX_TICKET_CHAT_HISTORY_TICKET_ID 
                        ON TICKET_CHAT_HISTORY(ID_TICKETS);
                    
                    CREATE INDEX IX_TICKET_CHAT_HISTORY_CREATED_AT 
                        ON TICKET_CHAT_HISTORY(CREATED_AT);
                    
                    CREATE INDEX IX_TICKET_CHAT_HISTORY_USER_ID 
                        ON TICKET_CHAT_HISTORY(ID_USERS);
                    
                    SELECT 'Tabela TICKET_CHAT_HISTORY criada com sucesso!' as Result;
                END
                ELSE
                BEGIN
                    SELECT 'Tabela TICKET_CHAT_HISTORY já existe.' as Result;
                END
            ";

            var result = await _context.Database.ExecuteSqlRawAsync(sql);
            
            _logger.LogInformation("Tabela TICKET_CHAT_HISTORY criada/verificada com sucesso");

            return Ok(new
            {
                message = "Tabela TICKET_CHAT_HISTORY criada/verificada com sucesso",
                timestamp = DateTime.UtcNow
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao criar tabela TICKET_CHAT_HISTORY");
            return StatusCode(500, new
            {
                message = "Erro ao criar tabela",
                error = ex.Message
            });
        }
    }

    /// <summary>
    /// Verificar se a tabela existe
    /// </summary>
    [HttpGet("check-chat-table")]
    public async Task<IActionResult> CheckChatTable()
    {
        try
        {
            var sql = @"
                SELECT 
                    CASE 
                        WHEN EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'TICKET_CHAT_HISTORY')
                        THEN 'Tabela existe'
                        ELSE 'Tabela não existe'
                    END as Status,
                    COUNT(*) as ColumnCount
                FROM INFORMATION_SCHEMA.COLUMNS 
                WHERE TABLE_NAME = 'TICKET_CHAT_HISTORY'
            ";

            var result = await _context.Database.SqlQueryRaw<dynamic>(sql).FirstOrDefaultAsync();
            
            return Ok(new
            {
                status = result?.Status ?? "Erro ao verificar",
                columnCount = result?.ColumnCount ?? 0,
                timestamp = DateTime.UtcNow
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao verificar tabela");
            return StatusCode(500, new
            {
                message = "Erro ao verificar tabela",
                error = ex.Message
            });
        }
    }
}


