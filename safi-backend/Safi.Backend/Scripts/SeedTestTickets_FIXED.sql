-- =====================================================
-- Script: Seed Test Tickets for FAQ Generator Testing
-- Descrição: Popula o banco com tickets de teste para
--            validar a API de FAQ baseado em tickets
-- =====================================================

-- Limpar tickets de teste existentes (opcional - comentar se não quiser limpar)
-- DELETE FROM TICKETS WHERE TITLE LIKE '%lento%' OR TITLE LIKE '%login%';

-- =====================================================
-- 1. INSERIR ISSUE TYPES (Categorias de Problemas)
-- =====================================================

-- Verificar se já existem, senão inserir
IF NOT EXISTS (SELECT 1 FROM ISSUE_TYPES WHERE NAME = 'Problema de Performance')
BEGIN
    INSERT INTO ISSUE_TYPES (NAME, DESCRIPTION, IS_ACTIVE, CREATED_AT)
    VALUES ('Problema de Performance', 'Sistema lento ou travando', 1, GETDATE());
END

IF NOT EXISTS (SELECT 1 FROM ISSUE_TYPES WHERE NAME = 'Erro de Autenticação')
BEGIN
    INSERT INTO ISSUE_TYPES (NAME, DESCRIPTION, IS_ACTIVE, CREATED_AT)
    VALUES ('Erro de Autenticação', 'Problemas com login ou acesso', 1, GETDATE());
END

IF NOT EXISTS (SELECT 1 FROM ISSUE_TYPES WHERE NAME = 'Bug no Sistema')
BEGIN
    INSERT INTO ISSUE_TYPES (NAME, DESCRIPTION, IS_ACTIVE, CREATED_AT)
    VALUES ('Bug no Sistema', 'Erros inesperados ou comportamento incorreto', 1, GETDATE());
END

IF NOT EXISTS (SELECT 1 FROM ISSUE_TYPES WHERE NAME = 'Dúvida sobre Funcionalidade')
BEGIN
    INSERT INTO ISSUE_TYPES (NAME, DESCRIPTION, IS_ACTIVE, CREATED_AT)
    VALUES ('Dúvida sobre Funcionalidade', 'Como usar recursos do sistema', 1, GETDATE());
END

IF NOT EXISTS (SELECT 1 FROM ISSUE_TYPES WHERE NAME = 'Solicitação de Suporte')
BEGIN
    INSERT INTO ISSUE_TYPES (NAME, DESCRIPTION, IS_ACTIVE, CREATED_AT)
    VALUES ('Solicitação de Suporte', 'Ajuda geral e suporte técnico', 1, GETDATE());
END

PRINT 'Issue Types criados/verificados com sucesso!';

-- =====================================================
-- 2. OBTER IDs DOS ISSUE TYPES E USUÁRIOS
-- =====================================================

DECLARE @IssuePerformance INT = (SELECT TOP 1 ID_ISSUE_TYPES FROM ISSUE_TYPES WHERE NAME = 'Problema de Performance');
DECLARE @IssueAuth INT = (SELECT TOP 1 ID_ISSUE_TYPES FROM ISSUE_TYPES WHERE NAME = 'Erro de Autenticação');
DECLARE @IssueBug INT = (SELECT TOP 1 ID_ISSUE_TYPES FROM ISSUE_TYPES WHERE NAME = 'Bug no Sistema');
DECLARE @IssueDuvida INT = (SELECT TOP 1 ID_ISSUE_TYPES FROM ISSUE_TYPES WHERE NAME = 'Dúvida sobre Funcionalidade');
DECLARE @IssueSuporte INT = (SELECT TOP 1 ID_ISSUE_TYPES FROM ISSUE_TYPES WHERE NAME = 'Solicitação de Suporte');

-- Pegar primeiro usuário como criador dos tickets
DECLARE @UserId INT = (SELECT TOP 1 ID_USERS FROM USERS);
DECLARE @AnalystId INT = (SELECT TOP 1 ID_USERS FROM USERS WHERE ID_USERS != @UserId);

-- Se não houver analista, usar o mesmo usuário
IF @AnalystId IS NULL
    SET @AnalystId = @UserId;

PRINT 'IDs obtidos: Performance=' + CAST(@IssuePerformance AS VARCHAR(10)) +
      ', Auth=' + CAST(@IssueAuth AS VARCHAR(10)) +
      ', User=' + CAST(@UserId AS VARCHAR(10));

-- =====================================================
-- 3. INSERIR TICKETS RESOLVIDOS (Últimos 60 dias)
-- =====================================================
-- IMPORTANTE: SUPPORT_LEVEL usa valores numéricos:
-- 1 = Level1, 2 = Level2, 3 = Level3
-- STATUS usa valores numéricos:
-- 1 = Open, 2 = InProgress, 3 = Pending, 4 = Resolved, 5 = Closed
-- PRIORITY usa valores numéricos:
-- 1 = Low, 2 = Medium, 3 = High, 4 = Urgent
-- =====================================================

-- Problema de Performance (15 tickets)
INSERT INTO TICKETS (TITLE, DETAILING, STATUS, PRIORITY, ID_ISSUE_TYPES, ID_USERS, ASSIGNED_TO, SUPPORT_LEVEL, CREATED_AT, RESOLVED_AT)
VALUES
('Sistema muito lento ao carregar', 'A página demora mais de 30 segundos para carregar', 4, 3, @IssuePerformance, @UserId, @AnalystId, 1, DATEADD(DAY, -5, GETDATE()), DATEADD(DAY, -4, GETDATE())),
('Lentidão ao abrir tickets', 'Quando clico em um ticket, demora muito', 4, 2, @IssuePerformance, @UserId, @AnalystId, 1, DATEADD(DAY, -8, GETDATE()), DATEADD(DAY, -7, GETDATE())),
('Dashboard não carrega', 'O dashboard fica em loading infinito', 4, 3, @IssuePerformance, @UserId, @AnalystId, 2, DATEADD(DAY, -10, GETDATE()), DATEADD(DAY, -9, GETDATE())),
('Sistema trava ao gerar relatório', 'Ao tentar exportar relatório, o sistema congela', 4, 2, @IssuePerformance, @UserId, @AnalystId, 1, DATEADD(DAY, -12, GETDATE()), DATEADD(DAY, -11, GETDATE())),
('Pesquisa de tickets muito lenta', 'A busca demora mais de 1 minuto', 4, 2, @IssuePerformance, @UserId, @AnalystId, 1, DATEADD(DAY, -15, GETDATE()), DATEADD(DAY, -14, GETDATE())),
('Performance ruim no mobile', 'App no celular está muito lento', 4, 1, @IssuePerformance, @UserId, @AnalystId, 1, DATEADD(DAY, -18, GETDATE()), DATEADD(DAY, -17, GETDATE())),
('Lentidão na criação de ticket', 'Demora para criar um novo chamado', 4, 2, @IssuePerformance, @UserId, @AnalystId, 1, DATEADD(DAY, -20, GETDATE()), DATEADD(DAY, -19, GETDATE())),
('Sistema lento após atualização', 'Depois da última versão ficou mais lento', 4, 3, @IssuePerformance, @UserId, @AnalystId, 2, DATEADD(DAY, -22, GETDATE()), DATEADD(DAY, -21, GETDATE())),
('Chat em tempo real com delay', 'Mensagens demoram para aparecer', 4, 2, @IssuePerformance, @UserId, @AnalystId, 1, DATEADD(DAY, -25, GETDATE()), DATEADD(DAY, -24, GETDATE())),
('Upload de arquivo muito lento', 'Anexos demoram muito para subir', 4, 1, @IssuePerformance, @UserId, @AnalystId, 1, DATEADD(DAY, -28, GETDATE()), DATEADD(DAY, -27, GETDATE())),
('Listagem de tickets lenta', 'A página de lista de tickets demora', 4, 2, @IssuePerformance, @UserId, @AnalystId, 1, DATEADD(DAY, -30, GETDATE()), DATEADD(DAY, -29, GETDATE())),
('Sistema congela ao abrir múltiplos tickets', 'Quando abro várias abas, trava tudo', 4, 3, @IssuePerformance, @UserId, @AnalystId, 2, DATEADD(DAY, -35, GETDATE()), DATEADD(DAY, -34, GETDATE())),
('Lentidão nos filtros', 'Ao aplicar filtros, demora muito', 4, 2, @IssuePerformance, @UserId, @AnalystId, 1, DATEADD(DAY, -40, GETDATE()), DATEADD(DAY, -39, GETDATE())),
('Performance ruim em horário de pico', 'Entre 14h-16h fica muito lento', 4, 3, @IssuePerformance, @UserId, @AnalystId, 2, DATEADD(DAY, -45, GETDATE()), DATEADD(DAY, -44, GETDATE())),
('Sistema lento ao carregar histórico', 'Histórico de tickets demora para carregar', 4, 1, @IssuePerformance, @UserId, @AnalystId, 1, DATEADD(DAY, -50, GETDATE()), DATEADD(DAY, -49, GETDATE()));

-- Erro de Autenticação (12 tickets)
INSERT INTO TICKETS (TITLE, DETAILING, STATUS, PRIORITY, ID_ISSUE_TYPES, ID_USERS, ASSIGNED_TO, SUPPORT_LEVEL, CREATED_AT, RESOLVED_AT)
VALUES
('Não consigo fazer login', 'Mensagem de erro "Credenciais inválidas"', 4, 3, @IssueAuth, @UserId, @AnalystId, 1, DATEADD(DAY, -3, GETDATE()), DATEADD(DAY, -2, GETDATE())),
('Senha não é aceita', 'Tenho certeza que a senha está correta', 4, 2, @IssueAuth, @UserId, @AnalystId, 1, DATEADD(DAY, -7, GETDATE()), DATEADD(DAY, -6, GETDATE())),
('Sessão expira muito rápido', 'Sou deslogado a cada 5 minutos', 4, 2, @IssueAuth, @UserId, @AnalystId, 2, DATEADD(DAY, -11, GETDATE()), DATEADD(DAY, -10, GETDATE())),
('Erro ao redefinir senha', 'Link de redefinição não funciona', 4, 3, @IssueAuth, @UserId, @AnalystId, 1, DATEADD(DAY, -14, GETDATE()), DATEADD(DAY, -13, GETDATE())),
('Token expirado constantemente', 'Erro 401 - Token expired', 4, 2, @IssueAuth, @UserId, @AnalystId, 2, DATEADD(DAY, -19, GETDATE()), DATEADD(DAY, -18, GETDATE())),
('Login não funciona no mobile', 'No celular sempre dá erro', 4, 2, @IssueAuth, @UserId, @AnalystId, 1, DATEADD(DAY, -23, GETDATE()), DATEADD(DAY, -22, GETDATE())),
('Erro "Usuário não encontrado"', 'Meu usuário sumiu do sistema', 4, 3, @IssueAuth, @UserId, @AnalystId, 2, DATEADD(DAY, -27, GETDATE()), DATEADD(DAY, -26, GETDATE())),
('Não recebo email de recuperação', 'Clico em "Esqueci minha senha" mas não chega', 4, 2, @IssueAuth, @UserId, @AnalystId, 1, DATEADD(DAY, -32, GETDATE()), DATEADD(DAY, -31, GETDATE())),
('Acesso negado após login', 'Faço login mas sou redirecionado para página de erro', 4, 3, @IssueAuth, @UserId, @AnalystId, 2, DATEADD(DAY, -37, GETDATE()), DATEADD(DAY, -36, GETDATE())),
('2FA não está funcionando', 'Código de autenticação não é aceito', 4, 2, @IssueAuth, @UserId, @AnalystId, 2, DATEADD(DAY, -42, GETDATE()), DATEADD(DAY, -41, GETDATE())),
('Erro ao trocar senha', 'Sistema não aceita nova senha', 4, 2, @IssueAuth, @UserId, @AnalystId, 1, DATEADD(DAY, -48, GETDATE()), DATEADD(DAY, -47, GETDATE())),
('Login trava na tela de loading', 'Após clicar em Entrar, fica carregando infinito', 4, 3, @IssueAuth, @UserId, @AnalystId, 1, DATEADD(DAY, -55, GETDATE()), DATEADD(DAY, -54, GETDATE()));

-- Bug no Sistema (10 tickets)
INSERT INTO TICKETS (TITLE, DETAILING, STATUS, PRIORITY, ID_ISSUE_TYPES, ID_USERS, ASSIGNED_TO, SUPPORT_LEVEL, CREATED_AT, RESOLVED_AT)
VALUES
('Erro 500 ao salvar ticket', 'Mensagem de erro interno ao tentar salvar', 4, 3, @IssueBug, @UserId, @AnalystId, 2, DATEADD(DAY, -4, GETDATE()), DATEADD(DAY, -3, GETDATE())),
('Botão de enviar não funciona', 'Clico no botão mas nada acontece', 4, 2, @IssueBug, @UserId, @AnalystId, 1, DATEADD(DAY, -9, GETDATE()), DATEADD(DAY, -8, GETDATE())),
('Dados não são salvos', 'Preencho formulário mas não salva', 4, 3, @IssueBug, @UserId, @AnalystId, 2, DATEADD(DAY, -13, GETDATE()), DATEADD(DAY, -12, GETDATE())),
('Anexos desaparecem', 'Arquivos que anexei sumiram', 4, 2, @IssueBug, @UserId, @AnalystId, 2, DATEADD(DAY, -17, GETDATE()), DATEADD(DAY, -16, GETDATE())),
('Notificações duplicadas', 'Recebo a mesma notificação várias vezes', 4, 1, @IssueBug, @UserId, @AnalystId, 1, DATEADD(DAY, -24, GETDATE()), DATEADD(DAY, -23, GETDATE())),
('Erro ao deletar ticket', 'Não consigo excluir ticket antigo', 4, 2, @IssueBug, @UserId, @AnalystId, 1, DATEADD(DAY, -29, GETDATE()), DATEADD(DAY, -28, GETDATE())),
('Filtros não funcionam', 'Ao filtrar por data, retorna resultados errados', 4, 2, @IssueBug, @UserId, @AnalystId, 2, DATEADD(DAY, -36, GETDATE()), DATEADD(DAY, -35, GETDATE())),
('Status do ticket não atualiza', 'Marco como resolvido mas continua aberto', 4, 3, @IssueBug, @UserId, @AnalystId, 2, DATEADD(DAY, -43, GETDATE()), DATEADD(DAY, -42, GETDATE())),
('Página em branco ao abrir ticket', 'Alguns tickets não abrem, fica tela branca', 4, 3, @IssueBug, @UserId, @AnalystId, 2, DATEADD(DAY, -51, GETDATE()), DATEADD(DAY, -50, GETDATE())),
('Contador de tickets errado', 'Dashboard mostra números incorretos', 4, 1, @IssueBug, @UserId, @AnalystId, 1, DATEADD(DAY, -58, GETDATE()), DATEADD(DAY, -57, GETDATE()));

-- Dúvida sobre Funcionalidade (8 tickets)
INSERT INTO TICKETS (TITLE, DETAILING, STATUS, PRIORITY, ID_ISSUE_TYPES, ID_USERS, ASSIGNED_TO, SUPPORT_LEVEL, CREATED_AT, RESOLVED_AT)
VALUES
('Como criar um novo ticket?', 'Não encontro onde criar chamado', 4, 1, @IssueDuvida, @UserId, @AnalystId, 1, DATEADD(DAY, -6, GETDATE()), DATEADD(DAY, -5, GETDATE())),
('Como funciona a escalação?', 'Não entendi o processo de escalação N1/N2/N3', 4, 1, @IssueDuvida, @UserId, @AnalystId, 1, DATEADD(DAY, -16, GETDATE()), DATEADD(DAY, -15, GETDATE())),
('Onde vejo meus tickets?', 'Queria ver histórico de chamados', 4, 1, @IssueDuvida, @UserId, @AnalystId, 1, DATEADD(DAY, -21, GETDATE()), DATEADD(DAY, -20, GETDATE())),
('Como usar o chat em tempo real?', 'Não consigo falar com analista', 4, 2, @IssueDuvida, @UserId, @AnalystId, 1, DATEADD(DAY, -26, GETDATE()), DATEADD(DAY, -25, GETDATE())),
('Como alterar prioridade?', 'Posso mudar a prioridade do meu ticket?', 4, 1, @IssueDuvida, @UserId, @AnalystId, 1, DATEADD(DAY, -33, GETDATE()), DATEADD(DAY, -32, GETDATE())),
('Como anexar arquivos?', 'Não encontro opção de anexar', 4, 1, @IssueDuvida, @UserId, @AnalystId, 1, DATEADD(DAY, -41, GETDATE()), DATEADD(DAY, -40, GETDATE())),
('Como funciona a IA do sistema?', 'Vi que tem IA mas não entendi', 4, 1, @IssueDuvida, @UserId, @AnalystId, 1, DATEADD(DAY, -52, GETDATE()), DATEADD(DAY, -51, GETDATE())),
('Como fechar um ticket?', 'Meu problema foi resolvido, como fecho?', 4, 1, @IssueDuvida, @UserId, @AnalystId, 1, DATEADD(DAY, -59, GETDATE()), DATEADD(DAY, -58, GETDATE()));

-- Solicitação de Suporte (5 tickets)
INSERT INTO TICKETS (TITLE, DETAILING, STATUS, PRIORITY, ID_ISSUE_TYPES, ID_USERS, ASSIGNED_TO, SUPPORT_LEVEL, CREATED_AT, RESOLVED_AT)
VALUES
('Preciso de ajuda urgente', 'Sistema crítico parado, preciso suporte', 4, 4, @IssueSuporte, @UserId, @AnalystId, 3, DATEADD(DAY, -2, GETDATE()), DATEADD(DAY, -1, GETDATE())),
('Solicitação de treinamento', 'Equipe nova precisa de treinamento', 4, 1, @IssueSuporte, @UserId, @AnalystId, 1, DATEADD(DAY, -31, GETDATE()), DATEADD(DAY, -30, GETDATE())),
('Configuração de novo usuário', 'Preciso adicionar usuários ao sistema', 4, 2, @IssueSuporte, @UserId, @AnalystId, 1, DATEADD(DAY, -38, GETDATE()), DATEADD(DAY, -37, GETDATE())),
('Suporte para integração', 'Preciso integrar com outro sistema', 4, 2, @IssueSuporte, @UserId, @AnalystId, 2, DATEADD(DAY, -46, GETDATE()), DATEADD(DAY, -45, GETDATE())),
('Ajuda com relatórios', 'Como gerar relatórios personalizados?', 4, 1, @IssueSuporte, @UserId, @AnalystId, 1, DATEADD(DAY, -56, GETDATE()), DATEADD(DAY, -55, GETDATE()));

PRINT '✅ Total de 50 tickets resolvidos inseridos com sucesso!';
PRINT '';
PRINT '📊 Distribuição:';
PRINT '   - Problema de Performance: 15 tickets';
PRINT '   - Erro de Autenticação: 12 tickets';
PRINT '   - Bug no Sistema: 10 tickets';
PRINT '   - Dúvida sobre Funcionalidade: 8 tickets';
PRINT '   - Solicitação de Suporte: 5 tickets';
PRINT '';
PRINT '✅ Script executado com sucesso!';
PRINT '🎯 Agora você pode testar o endpoint POST /api/faq/generate-from-tickets';
