const BASE_URL = 'http://localhost:5080';
let authToken = '';

async function login() {
    console.log('🔐 Fazendo login...');
    const response = await fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'admin@safi.com', password: 'admin123' })
    });
    const data = await response.json();
    if (response.ok) {
        authToken = data.token;
        console.log('✅ Login realizado com sucesso!');
    } else {
        throw new Error(`Login falhou: ${data.message || response.status}`);
    }
}

async function getTicketsWithFilter(supportLevel) {
    console.log(`\n📋 Obtendo tickets com nível: ${supportLevel}`);
    const response = await fetch(`${BASE_URL}/api/tickets?supportLevel=${supportLevel}`, {
        headers: { 'Authorization': `Bearer ${authToken}` }
    });
    const data = await response.json();
    if (response.ok) {
        console.log(`✅ Tickets encontrados: ${data.totalCount || 0}`);
        if (data.tickets && data.tickets.length > 0) {
            data.tickets.forEach(ticket => {
                console.log(`   - Ticket ${ticket.id}: ${ticket.title} (Nível: ${ticket.supportLevel})`);
            });
        }
        return data.tickets || [];
    } else {
        throw new Error(`Falha ao obter tickets: ${data.message || response.status}`);
    }
}

async function escalateTicket(ticketId, newLevel, comment) {
    console.log(`\n⬆️ Escalonando ticket ${ticketId} para ${newLevel}`);
    const response = await fetch(`${BASE_URL}/api/tickets/${ticketId}/escalate`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            supportLevel: newLevel,
            comment: comment
        })
    });
    const data = await response.json();
    if (response.ok) {
        console.log(`✅ Ticket escalonado com sucesso!`);
        console.log(`   Novo nível: ${data.newSupportLevel}`);
        console.log(`   Escalonado em: ${data.escalatedAt}`);
    } else {
        throw new Error(`Falha ao escalonar ticket: ${data.message || response.status}`);
    }
}

async function createTestTicket() {
    console.log('\n🎫 Criando ticket de teste...');
    const response = await fetch(`${BASE_URL}/api/tickets`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            title: 'Teste de Escalonamento',
            description: 'Ticket criado para testar funcionalidade de escalonamento',
            priority: 'Medium',
            issueTypeId: 1
        })
    });
    const data = await response.json();
    if (response.ok) {
        console.log(`✅ Ticket criado com sucesso! ID: ${data.ticketId}`);
        return data.ticketId;
    } else {
        throw new Error(`Falha ao criar ticket: ${data.message || response.status}`);
    }
}

async function runEscalationTest() {
    try {
        await login();
        
        // Criar ticket de teste
        const ticketId = await createTestTicket();
        
        // Testar filtros por nível
        await getTicketsWithFilter('Level1');
        await getTicketsWithFilter('Level2');
        await getTicketsWithFilter('Level3');
        
        // Testar escalonamento
        await escalateTicket(ticketId, 'Level2', 'Problema mais complexo, precisa de especialista');
        
        // Verificar se o filtro funciona após escalonamento
        await getTicketsWithFilter('Level2');
        
        console.log('\n🎉 Teste de escalonamento concluído com sucesso!');
    } catch (error) {
        console.error('❌ Erro no teste de escalonamento:', error.message);
    }
}

runEscalationTest();
