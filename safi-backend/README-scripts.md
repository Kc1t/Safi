# 🚀 Script de Teste da API SAFI

Scripts Node.js para testar a API SAFI com autenticação JWT.

## 📋 Pré-requisitos

- Node.js instalado
- API SAFI rodando em `http://localhost:5080`

## 🛠️ Instalação

```bash
# Instalar dependências
npm install

# Ou instalar apenas o axios
npm install axios
```

## 🎯 Como Usar

### Script Simples (Recomendado)
```bash
node simple-test.js
```

### Script Completo
```bash
node test-api.js
```

### Scripts Específicos
```bash
# Apenas login
npm run test:login

# Apenas rota protegida
npm run test:protected

# Apenas listar tickets
npm run test:tickets
```

## 📊 O que o Script Faz

1. **🔐 Login**: Faz login com `admin@safi.com`
2. **🎯 Rota Protegida**: Testa `/api/tickets/me`
3. **📋 Listar Tickets**: Busca todos os tickets
4. **🎫 Criar Ticket**: Cria um novo ticket

## 🔧 Configuração

Edite as variáveis no início dos arquivos:

```javascript
const BASE_URL = 'http://localhost:5080';
const LOGIN_EMAIL = 'admin@safi.com';
const LOGIN_PASSWORD = '123456';
```

## 📝 Exemplo de Saída

```
🚀 Testando API SAFI...

1️⃣ Fazendo login...
✅ Login OK! Token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

2️⃣ Testando rota protegida...
✅ Rota protegida OK!
👤 Usuário: Administrador SAFI
📧 Email: admin@safi.com
🏷️ Tipo: Admin
⏰ Timestamp: 2025-10-05T17:30:00Z

3️⃣ Listando tickets...
✅ Tickets OK!
📊 Total: 5

4️⃣ Criando ticket...
✅ Ticket criado!
🎫 ID: 6
📝 Título: Teste via Script
⚡ Status: Open

🎉 Todos os testes passaram!
```

## 🐛 Troubleshooting

### Erro de Conexão
- Verifique se a API está rodando
- Confirme a URL e porta

### Erro 401 (Unauthorized)
- Verifique se o usuário existe
- Confirme email e senha

### Erro 404 (Not Found)
- Verifique se as rotas existem
- Confirme se o servidor está atualizado

## 📁 Arquivos

- `simple-test.js` - Script simples e direto
- `test-api.js` - Script completo com funções modulares
- `package.json` - Configuração do projeto Node.js
