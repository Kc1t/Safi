// lib/db.js
import sql from 'mssql';

const config = {
    user: 'sa',
    password: 'admin123!',
    server: 'localhost', // Aqui se conecta ao SQL Server no Docker
    port: 1433,           // Porta padrão do SQL Server
    database: 'MyAppDb',  // Nome do banco
    options: {
        trustServerCertificate: true, // necessário em desenvolvimento
    },
};

let pool: sql.ConnectionPool | undefined;

export async function getDbConnection() {
    if (!pool) {
        pool = await sql.connect(config);
    }
    return pool;
}
