-- Inserir dados iniciais para a tabela USER_TYPES
INSERT INTO dbo.USER_TYPES (NAMES) VALUES 
('Usuário'),
('Analista');
PRINT 'Dados inseridos na tabela USER_TYPES com sucesso.';
GO

-- Inserir dados iniciais para a tabela ANALYST_LEVELS
INSERT INTO dbo.ANALYST_LEVELS (NAME) VALUES 
('Nível 1'),
('Nível 2'),
('Nível 3');
PRINT 'Dados inseridos na tabela ANALYST_LEVELS com sucesso.';
GO

-- Inserir dados iniciais para a tabela DEPARTMENTS
INSERT INTO dbo.DEPARTMENTS (NAME) VALUES 
('Recursos Humanos'),
('Administração'),
('Financeiro'),
('Tecnologia da Informação'),
('Vendas'),
('Marketing');
PRINT 'Dados inseridos na tabela DEPARTMENTS com sucesso.';
GO

-- Inserir dados iniciais para a tabela USERS
INSERT INTO dbo.USERS (NAME, EMAIL, ID_USER_TYPES, ID_ANALYST_LEVELS, ID_DEPARTMENTS) VALUES 
('Carlos Silva', 'carlos.silva@empresa.com', 1, NULL, 1), -- Usuário em RH
('Ana Santos', 'ana.santos@empresa.com', 2, 1, 2),        -- Analista Nível 1 em Administração
('João Pereira', 'joao.pereira@empresa.com', 2, 2, 3),    -- Analista Nível 2 em Financeiro
('Maria Oliveira', 'maria.oliveira@empresa.com', 2, 3, 4),-- Analista Nível 3 em TI
('Luís Costa', 'luis.costa@empresa.com', 1, NULL, 5),     -- Usuário em Vendas
('Carla Dias', 'carla.dias@empresa.com', 1, NULL, 6);     -- Usuária em Marketing
PRINT 'Dados inseridos na tabela USERS com sucesso.';
GO

-- Inserir dados iniciais para a tabela ISSUE_TYPES
INSERT INTO dbo.ISSUE_TYPES (NAME) VALUES 
('Erro de Sistema'),
('Solicitação de Recurso'),
('Suporte Técnico'),
('Consulta Geral');
PRINT 'Dados inseridos na tabela ISSUE_TYPES com sucesso.';
GO

-- Inserir dados iniciais para a tabela TICKETS
INSERT INTO dbo.TICKETS (TITLE, DETAILING, STATUS, PRIORITY, ID_ISSUE_TYPES, ID_USERS, ASSIGNED_TO) VALUES 
('Erro no login', 'Usuário não consegue acessar a plataforma.', 'open', 'high', 1, 1, 4), -- RH
('Solicitação de Dashboard', 'Necessidade de dashboard para análises financeiras.', 'in_progress', 'medium', 2, 3, 4), -- Financeiro
('Sistema fora do ar', 'Sistema indisponível desde 10h.', 'pending', 'urgent', 1, 2, 4), -- Administração
('Atualização no portal', 'Revisão necessária na página inicial.', 'resolved', 'low', 2, 6, 4); -- Marketing
PRINT 'Dados inseridos na tabela TICKETS com sucesso.';
GO

-- Inserir dados iniciais para a tabela TICKET_MESSAGES
INSERT INTO dbo.TICKET_MESSAGES (ID_TICKETS, ID_SENDER, MESSAGE, IS_INTERNAL) VALUES 
(1, 1, 'Preciso de ajuda para acessar a plataforma.', 0),
(1, 4, 'Investigando o problema de login.', 1),
(2, 3, 'Dashboard ajudará na análise mensal.', 0),
(3, 4, 'Já estamos verificando o motivo da indisponibilidade.', 1),
(4, 6, 'Portal atualizado com sucesso.', 0);
PRINT 'Dados inseridos na tabela TICKET_MESSAGES com sucesso.';
GO

-- Inserir dados iniciais para a tabela TICKET_HISTORY
INSERT INTO dbo.TICKET_HISTORY (ID_TICKETS, CHANGED_BY, CHANGE_DESCRIPTION) VALUES 
(1, 4, 'Alterado status para in_progress.'),
(2, 4, 'Definido prioridade como média.'),
(3, 4, 'Encaminhado para análise crítica.'),
(4, 4, 'Status alterado para resolved.');
PRINT 'Dados inseridos na tabela TICKET_HISTORY com sucesso.';
GO
