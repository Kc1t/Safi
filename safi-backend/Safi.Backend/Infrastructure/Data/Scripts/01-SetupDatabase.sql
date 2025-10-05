-- Script de Setup do Banco de Dados SAFI
-- Este script cria o banco de dados e executa as migrations

-- Verificar se o banco de dados já existe e criar se não existir
IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = 'SAFIDB')
BEGIN
    CREATE DATABASE SAFIDB;
    PRINT 'Banco de dados SAFIDB criado com sucesso.';
END
ELSE
BEGIN
    PRINT 'Banco de dados SAFIDB já existe.';
END

-- Usar o banco de dados criado
USE SAFIDB;
GO

-- Verificar se as tabelas já existem
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'DEPARTMENTS')
BEGIN
    PRINT 'Executando migrations...';
    -- As migrations serão executadas automaticamente pelo Entity Framework
    -- quando a aplicação for iniciada
END
ELSE
BEGIN
    PRINT 'Tabelas já existem. Pulando criação.';
END

PRINT 'Setup do banco de dados concluído!';
PRINT 'Execute a aplicação para popular com dados iniciais.';
GO
