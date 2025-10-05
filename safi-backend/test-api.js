const axios = require('axios');

// Configurações
const BASE_URL = 'http://localhost:5080';
const LOGIN_EMAIL = 'admin@safi.com';
const LOGIN_PASSWORD = '123456';

// Função para fazer login
async function login() {
    try {
        console.log('🔐 Fazendo login...');
        
        const response = await axios.post(`${BASE_URL}/api/auth/login`, {
            email: LOGIN_EMAIL,
            password: LOGIN_PASSWORD
        });
        
        if (response.data && response.data.token) {
            console.log('✅ Login realizado com sucesso!');
            console.log('👤 Usuário:', response.data.user.name);
            console.log('📧 Email:', response.data.user.email);
            console.log('🔑 Token:', response.data.token.substring(0, 50) + '...');
            console.log('⏰ Expira em:', response.data.expiresAt);
            
            return response.data.token;
        } else {
            throw new Error('Token não encontrado na resposta');
        }
    } catch (error) {
        console.error('❌ Erro no login:', error.response?.data || error.message);
        throw error;
    }
}

// Função para testar rota protegida
async function testProtectedRoute(token) {
    try {
        console.log('\n🎯 Testando rota protegida...');
        
        const response = await axios.get(`${BASE_URL}/api/tickets/me`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
            }
        });
        
        console.log('✅ Rota protegida acessada com sucesso!');
        console.log('📊 Resposta:', JSON.stringify(response.data, null, 2));
        
        return response.data;
    } catch (error) {
        console.error('❌ Erro ao acessar rota protegida:', error.response?.data || error.message);
        throw error;
    }
}

// Função para listar tickets
async function listTickets(token) {
    try {
        console.log('\n📋 Listando tickets...');
        
        const response = await axios.get(`${BASE_URL}/api/tickets`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
            }
        });
        
        console.log('✅ Tickets listados com sucesso!');
        console.log('📊 Total de tickets:', response.data.tickets?.length || 0);
        
        if (response.data.tickets && response.data.tickets.length > 0) {
            console.log('🎫 Primeiros tickets:');
            response.data.tickets.slice(0, 3).forEach((ticket, index) => {
                console.log(`  ${index + 1}. ${ticket.title} (${ticket.status})`);
            });
        }
        
        return response.data;
    } catch (error) {
        console.error('❌ Erro ao listar tickets:', error.response?.data || error.message);
        throw error;
    }
}

// Função para testar endpoint individual
async function testIndividualTicket(token) {
    try {
        console.log('\n🎯 Testando endpoint individual...');
        
        const response = await axios.get(`${BASE_URL}/api/tickets/1`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
            }
        });
        
        console.log('✅ Endpoint individual acessado com sucesso!');
        console.log('📊 Resposta:', JSON.stringify(response.data, null, 2));
         y7
        return response.data;
    } catch (error) {
        console.error('❌ Erro ao acessar endpoint individual:', error.response?.data || error.message);
        throw error;
    }
}

// Função para criar um ticket
async function createTicket(token) {
    try {
        console.log('\n🎫 Criando ticket...');
        
        const ticketData = {
            title: 'Teste via Script Node.js',
            description: 'Este ticket foi criado automaticamente pelo script de teste.',
            priority: 'Medium',
            issueTypeId: 1
        };
        
        const response = await axios.post(`${BASE_URL}/api/tickets`, ticketData, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
        
        console.log('✅ Ticket criado com sucesso!');
        console.log('📊 Resposta:', JSON.stringify(response.data, null, 2));
        
        return response.data;
    } catch (error) {
        console.error('❌ Erro ao criar ticket:', error.response?.data || error.message);
        throw error;
    }
}

// Função principal
async function main() {
    try {
        console.log('🚀 Iniciando script de teste da API SAFI...\n');
        
        // 1. Fazer login
        const token = await login();
        
        // 2. Testar rota protegida
        await testProtectedRoute(token);
        
        // 3. Listar tickets
        await listTickets(token);
        
        // 4. Testar endpoint individual
        await testIndividualTicket(token);
        
        // 5. Criar ticket (opcional)
        // await createTicket(token);
        
        console.log('\n🎉 Script executado com sucesso!');
        
    } catch (error) {
        console.error('\n💥 Erro na execução do script:', error.message);
        process.exit(1);
    }
}

// Executar script
if (require.main === module) {
    main();
}

module.exports = {
    login,
    testProtectedRoute,
    listTickets,
    testIndividualTicket,
    createTicket
};
