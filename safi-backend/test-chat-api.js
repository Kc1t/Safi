const BASE_URL = 'http://localhost:5080';

async function testChatAPI() {
    try {
        console.log('🚀 Testando Chat API com Gemini...\n');
        
        // 1. Login
        console.log('🔐 Fazendo login...');
        const loginResponse = await fetch(`${BASE_URL}/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                email: 'admin@safi.com',
                password: 'admin123'
            })
        });
        
        const loginData = await loginResponse.json();
        const token = loginData.token;
        console.log('✅ Login realizado!\n');
        
        // 2. Iniciar conversa
        console.log('💬 Iniciando nova conversa...');
        const startResponse = await fetch(`${BASE_URL}/api/ai/chat/start`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
            }
        });
        
        const startData = await startResponse.json();
        const conversationId = startData.conversationId;
        console.log(`✅ Conversa iniciada: ${conversationId}\n`);
        
        // 3. Enviar primeira mensagem
        console.log('📝 Enviando primeira mensagem...');
        const message1Response = await fetch(`${BASE_URL}/api/ai/chat/${conversationId}/message`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                message: 'Olá! Meu nome é João e preciso de ajuda com meu computador.'
            })
        });
        
        const message1Data = await message1Response.json();
        console.log('👤 Usuário:', message1Data.userMessage);
        console.log('🤖 IA:', message1Data.aiResponse);
        console.log(`📊 Total de mensagens: ${message1Data.messageCount}\n`);
        
        // 4. Enviar segunda mensagem (com contexto)
        console.log('📝 Enviando segunda mensagem...');
        const message2Response = await fetch(`${BASE_URL}/api/ai/chat/${conversationId}/message`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                message: 'Ele não está ligando mais. O que posso fazer?'
            })
        });
        
        const message2Data = await message2Response.json();
        console.log('👤 Usuário:', message2Data.userMessage);
        console.log('🤖 IA:', message2Data.aiResponse);
        console.log(`📊 Total de mensagens: ${message2Data.messageCount}\n`);
        
        // 5. Ver histórico completo
        console.log('📚 Obtendo histórico da conversa...');
        const historyResponse = await fetch(`${BASE_URL}/api/ai/chat/${conversationId}/history`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
            }
        });
        
        const historyData = await historyResponse.json();
        console.log('📋 Histórico completo:');
        historyData.messages.forEach((msg, index) => {
            const role = msg.role === 'user' ? '👤' : '🤖';
            console.log(`${role} ${msg.content}`);
        });
        
        // 6. Listar conversas ativas
        console.log('\n📋 Listando conversas ativas...');
        const conversationsResponse = await fetch(`${BASE_URL}/api/ai/chat/conversations`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
            }
        });
        
        const conversationsData = await conversationsResponse.json();
        console.log(`✅ Total de conversas ativas: ${conversationsData.totalConversations}`);
        
    } catch (error) {
        console.error('❌ Erro:', error.message);
    }
}

testChatAPI();
