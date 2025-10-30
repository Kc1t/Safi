# 📘 Documentação de Rotas da API - SAFI

## 🔐 Autenticação vs Rotas Públicas

### Por que diferentes tipos de rotas?

A API do SAFI implementa dois níveis de acesso:

#### 🌍 **Rotas Públicas** (`[IsPublic]`)
- **Finalidade**: Permitir acesso sem autenticação para usuários externos
- **Casos de uso**:
  - Abertura de chamados por clientes/usuários finais
  - Chat público com assistente IA
  - Listagem básica de tickets (para compatibilidade legacy)
- **Segurança**: Dados sensíveis limitados, rate limiting aplicado
- **Header necessário**: Apenas `Content-Type: application/json`

#### 🔒 **Rotas Autenticadas** (`[Authorize]`)
- **Finalidade**: Acesso restrito a analistas e usuários internos autenticados
- **Casos de uso**:
  - Gerenciamento completo de tickets
  - Estatísticas e relatórios
  - Operações administrativas
  - Chat interno com histórico
- **Segurança**: Token JWT necessário, validação de permissões
- **Header necessário**:
  ```http
  Authorization: Bearer {jwt_token}
  Content-Type: application/json
  ```

---

## 🎫 FLUXO 1: Abertura de Chamado (Público)

### Objetivo
Permitir que **qualquer usuário** (não autenticado) abra um chamado de suporte sem precisar fazer login.

### Passo a Passo

#### 1️⃣ Criar Ticket Público

**Endpoint**: `POST /api/tickets/public`
**Autenticação**: ❌ Não necessária (rota pública)

**Request Body**:
```json
{
  "requesterName": "João Silva",
  "requesterEmail": "joao.silva@exemplo.com",
  "requesterPhone": "(11) 98765-4321",
  "title": "Impressora não está funcionando",
  "detailing": "A impressora do setor de vendas não imprime documentos desde ontem. Aparece erro de conexão.",
  "issueTypeId": 3
}
```

**Response** (Sucesso - 200 OK):
```json
{
  "ticketId": 42,
  "message": "Ticket criado com sucesso e enviado para análise da IA",
  "status": "Open",
  "priority": "Medium",
  "createdAt": "2025-10-30T14:23:45Z"
}
```

**Response** (Erro - 400 Bad Request):
```json
{
  "message": "Erro ao criar ticket público"
}
```

### 📊 Diagrama do Fluxo

```
┌─────────────┐
│   Usuário   │
│ (Anônimo)   │
└──────┬──────┘
       │
       │ POST /api/tickets/public
       │ {name, email, title, detailing}
       ▼
┌──────────────────┐
│  API Backend     │
│  - Valida dados  │
│  - Cria ticket   │
│  - Análise IA    │
└────────┬─────────┘
         │
         │ Response
         ▼
┌──────────────────┐
│  Ticket Criado   │
│  ID: 42          │
│  Status: Open    │
└──────────────────┘
```

### 🔥 Exemplo Completo de Requisição HTTP

```http
POST /api/tickets/public HTTP/1.1
Host: localhost:5080
Content-Type: application/json
Content-Length: 245

{
  "requesterName": "João Silva",
  "requesterEmail": "joao.silva@exemplo.com",
  "requesterPhone": "(11) 98765-4321",
  "title": "Impressora não está funcionando",
  "detailing": "A impressora do setor de vendas não imprime documentos desde ontem. Aparece erro de conexão.",
  "issueTypeId": 3
}
```

**Resposta HTTP Completa**:
```http
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
Date: Wed, 30 Oct 2025 14:23:45 GMT
Server: Kestrel
Content-Length: 156

{
  "ticketId": 42,
  "message": "Ticket criado com sucesso e enviado para análise da IA",
  "status": "Open",
  "priority": "Medium",
  "createdAt": "2025-10-30T14:23:45Z"
}
```

### 📱 Exemplo com JavaScript (Fetch API)

```javascript
// Exemplo de abertura de chamado público
async function criarChamadoPublico() {
  try {
    const response = await fetch('https://localhost:5080/api/tickets/public', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        requesterName: 'João Silva',
        requesterEmail: 'joao.silva@exemplo.com',
        requesterPhone: '(11) 98765-4321',
        title: 'Impressora não está funcionando',
        detailing: 'A impressora do setor de vendas não imprime documentos desde ontem. Aparece erro de conexão.',
        issueTypeId: 3
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Ticket criado com sucesso!', data);
    console.log('ID do ticket:', data.ticketId);

    return data;
  } catch (error) {
    console.error('Erro ao criar ticket:', error);
    throw error;
  }
}

// Uso
criarChamadoPublico()
  .then(ticket => {
    alert(`Seu chamado #${ticket.ticketId} foi criado com sucesso!`);
  })
  .catch(error => {
    alert('Erro ao criar chamado. Tente novamente.');
  });
```

### 🐍 Exemplo com Python (Requests)

```python
import requests
import json

def criar_chamado_publico():
    """Cria um chamado público no sistema SAFI"""

    url = "https://localhost:5080/api/tickets/public"

    headers = {
        "Content-Type": "application/json"
    }

    payload = {
        "requesterName": "João Silva",
        "requesterEmail": "joao.silva@exemplo.com",
        "requesterPhone": "(11) 98765-4321",
        "title": "Impressora não está funcionando",
        "detailing": "A impressora do setor de vendas não imprime documentos desde ontem. Aparece erro de conexão.",
        "issueTypeId": 3
    }

    try:
        response = requests.post(url, headers=headers, json=payload)
        response.raise_for_status()  # Levanta exceção para status 4xx/5xx

        data = response.json()
        print(f"✅ Ticket criado com sucesso!")
        print(f"📋 ID: {data['ticketId']}")
        print(f"📊 Status: {data['status']}")
        print(f"⚡ Prioridade: {data['priority']}")

        return data

    except requests.exceptions.HTTPError as err:
        print(f"❌ Erro HTTP: {err}")
        raise
    except requests.exceptions.RequestException as err:
        print(f"❌ Erro na requisição: {err}")
        raise

# Uso
if __name__ == "__main__":
    ticket = criar_chamado_publico()
```

### 💡 Observações Importantes

1. **IA Automática**: O sistema automaticamente envia o ticket para análise da IA que sugere:
   - Categoria apropriada
   - Nível de prioridade
   - Possíveis soluções

2. **Email de Confirmação**: O sistema pode enviar email de confirmação para o endereço informado (se configurado)

3. **Sem Login**: O usuário **não precisa** criar conta ou fazer login

4. **Rastreamento**: O usuário pode usar o `ticketId` retornado para acompanhar o chamado

5. **Validações**:
   - Email deve ser válido
   - Nome é obrigatório
   - Title e detailing não podem estar vazios
   - issueTypeId deve existir no sistema

---

## 📋 FLUXO 2: Listagem de Chamados (Analista)

### Objetivo
Permitir que **analistas autenticados** visualizem e gerenciem todos os chamados do sistema.

### Passo a Passo

#### 1️⃣ Fazer Login (Obter Token JWT)

**Endpoint**: `POST /api/auth/login`
**Autenticação**: ❌ Não necessária (endpoint de login)

**Request Body**:
```json
{
  "email": "analista@safi.com",
  "password": "SenhaSegura123!"
}
```

**Response** (Sucesso - 200 OK):
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "refresh_token_aqui",
  "user": {
    "id": 5,
    "name": "Maria Analista",
    "email": "analista@safi.com",
    "userType": "Analyst",
    "department": "Suporte Técnico"
  },
  "expiresAt": "2025-10-30T18:23:45Z"
}
```

#### 2️⃣ Listar Tickets (Com Paginação e Filtros)

**Endpoint**: `GET /api/tickets`
**Autenticação**: ⚠️ **Opcional** (rota marcada como `[IsPublic]` mas benefícios com auth)

**Query Parameters**:
```
?pageNumber=1
&pageSize=20
&status=Open
&priority=High
&search=impressora
&sortBy=createdAt
&sortOrder=desc
```

**Parâmetros Disponíveis**:
| Parâmetro | Tipo | Descrição | Exemplo |
|-----------|------|-----------|---------|
| `pageNumber` | int | Número da página (começa em 1) | `1` |
| `pageSize` | int | Itens por página (max: 100) | `20` |
| `status` | string | Filtro por status | `Open`, `InProgress`, `Resolved` |
| `priority` | string | Filtro por prioridade | `Low`, `Medium`, `High`, `Urgent` |
| `search` | string | Busca em título/descrição | `"impressora"` |
| `sortBy` | string | Campo de ordenação | `createdAt`, `priority`, `status` |
| `sortOrder` | string | Ordem de classificação | `asc`, `desc` |

**Request Headers**:
```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

**Response** (Sucesso - 200 OK):
```json
{
  "tickets": [
    {
      "id": 42,
      "title": "Impressora não está funcionando",
      "status": "Open",
      "priority": "Medium",
      "userName": "João Silva",
      "userEmail": "joao.silva@exemplo.com",
      "userDepartment": "Vendas",
      "assignedTo": "Não atribuído",
      "createdAt": "2025-10-30T14:23:45Z",
      "updatedAt": "2025-10-30T14:23:45Z"
    },
    {
      "id": 41,
      "title": "Senha de email expirada",
      "status": "InProgress",
      "priority": "High",
      "userName": "Ana Costa",
      "userEmail": "ana.costa@exemplo.com",
      "userDepartment": "Marketing",
      "assignedTo": "Carlos Técnico",
      "createdAt": "2025-10-30T10:15:30Z",
      "updatedAt": "2025-10-30T13:45:12Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "pageSize": 20,
    "totalCount": 87,
    "totalPages": 5
  }
}
```

#### 3️⃣ Obter Detalhes de Ticket Específico

**Endpoint**: `GET /api/tickets/{id}`
**Autenticação**: ✅ **Obrigatória** (`[Authorize]`)

**Request**:
```http
GET /api/tickets/42
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response** (Sucesso - 200 OK):
```json
{
  "id": 42,
  "title": "Impressora não está funcionando",
  "detailing": "A impressora do setor de vendas não imprime documentos desde ontem. Aparece erro de conexão.",
  "status": "Open",
  "priority": "Medium",
  "issueType": "Hardware",
  "user": {
    "id": 123,
    "name": "João Silva",
    "email": "joao.silva@exemplo.com"
  },
  "assignedTo": null,
  "createdAt": "2025-10-30T14:23:45Z",
  "updatedAt": "2025-10-30T14:23:45Z",
  "resolvedAt": null
}
```

#### 4️⃣ Obter Estatísticas de Tickets

**Endpoint**: `GET /api/tickets/statistics`
**Autenticação**: ✅ **Obrigatória** (`[Authorize]`)

**Request**:
```http
GET /api/tickets/statistics
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response** (Sucesso - 200 OK):
```json
{
  "totalTickets": 347,
  "openTickets": 42,
  "inProgressTickets": 28,
  "pendingTickets": 15,
  "resolvedTickets": 234,
  "closedTickets": 28,
  "priorityBreakdown": {
    "low": 87,
    "medium": 156,
    "high": 89,
    "urgent": 15
  },
  "averageResolutionTimeHours": 18.5,
  "ticketsOverSla": 7
}
```

### 📊 Diagrama do Fluxo Completo (Analista)

```
┌─────────────┐
│  Analista   │
└──────┬──────┘
       │
       │ 1. POST /api/auth/login
       │    {email, password}
       ▼
┌──────────────────┐
│  Autenticação    │
│  - Valida creds  │
│  - Gera JWT      │
└────────┬─────────┘
         │
         │ JWT Token
         ▼
┌──────────────────┐
│  Operações       │
│  Autenticadas:   │
│                  │
│  GET /tickets    │◄── Lista tickets
│  GET /tickets/42 │◄── Detalhes
│  PUT /tickets/42 │◄── Atualiza
│  POST /{id}/chat │◄── Chat
│  POST /{id}/close│◄── Encerra
└──────────────────┘
```

### 🔥 Exemplo Completo: Fluxo End-to-End do Analista

#### Passo 1: Login e Obtenção do Token

```http
POST /api/auth/login HTTP/1.1
Host: localhost:5080
Content-Type: application/json

{
  "email": "analista@safi.com",
  "password": "SenhaSegura123!"
}
```

**Resposta HTTP**:
```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1IiwibmFtZSI6Ik1hcmlhIEFuYWxpc3RhIiwiZW1haWwiOiJhbmFsaXN0YUBzYWZpLmNvbSIsIlVzZXJUeXBlIjoiQW5hbHlzdCIsIm5iZiI6MTczMDMwNDIyNSwiZXhwIjoxNzMwMzkwNjI1LCJpYXQiOjE3MzAzMDQyMjV9.K7H9_example_signature",
  "refreshToken": "refresh_abc123xyz789",
  "user": {
    "id": 5,
    "name": "Maria Analista",
    "email": "analista@safi.com",
    "userType": "Analyst",
    "department": "Suporte Técnico"
  },
  "expiresAt": "2025-10-31T14:23:45Z"
}
```

#### Passo 2: Listar Tickets com Filtros

```http
GET /api/tickets?pageNumber=1&pageSize=10&status=Open&priority=High HTTP/1.1
Host: localhost:5080
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

**Resposta HTTP**:
```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "tickets": [
    {
      "id": 42,
      "title": "Impressora não está funcionando",
      "status": "Open",
      "priority": "High",
      "userName": "João Silva",
      "userEmail": "joao.silva@exemplo.com",
      "userDepartment": "Vendas",
      "assignedTo": "Não atribuído",
      "createdAt": "2025-10-30T14:23:45Z",
      "updatedAt": "2025-10-30T14:23:45Z"
    },
    {
      "id": 38,
      "title": "Sistema lento após atualização",
      "status": "Open",
      "priority": "High",
      "userName": "Carlos Mendes",
      "userEmail": "carlos.m@exemplo.com",
      "userDepartment": "Produção",
      "assignedTo": "Não atribuído",
      "createdAt": "2025-10-30T09:15:22Z",
      "updatedAt": "2025-10-30T09:15:22Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "pageSize": 10,
    "totalCount": 2,
    "totalPages": 1
  }
}
```

#### Passo 3: Obter Detalhes de um Ticket Específico

```http
GET /api/tickets/42 HTTP/1.1
Host: localhost:5080
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Resposta HTTP**:
```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "id": 42,
  "title": "Impressora não está funcionando",
  "detailing": "A impressora do setor de vendas não imprime documentos desde ontem. Aparece erro de conexão.",
  "status": "Open",
  "priority": "High",
  "issueType": "Hardware",
  "user": {
    "id": 123,
    "name": "João Silva",
    "email": "joao.silva@exemplo.com"
  },
  "assignedTo": null,
  "createdAt": "2025-10-30T14:23:45Z",
  "updatedAt": "2025-10-30T14:23:45Z",
  "resolvedAt": null
}
```

#### Passo 4: Assumir o Ticket e Atualizar Status

```http
PUT /api/tickets/42 HTTP/1.1
Host: localhost:5080
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "status": "InProgress",
  "priority": "High",
  "assignedToId": 5
}
```

**Resposta HTTP**:
```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "id": 42,
  "title": "Impressora não está funcionando",
  "status": "InProgress",
  "priority": "High",
  "updatedAt": "2025-10-30T15:30:12Z",
  "message": "Ticket atualizado com sucesso"
}
```

#### Passo 5: Adicionar Mensagem no Chat

```http
POST /api/tickets/42/chat HTTP/1.1
Host: localhost:5080
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "message": "Olá João! Estou verificando o problema da impressora. Qual o modelo exato?",
  "messageType": "analyst",
  "isInternal": false
}
```

**Resposta HTTP**:
```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "id": 1,
  "ticketId": 42,
  "userId": 5,
  "message": "Olá João! Estou verificando o problema da impressora. Qual o modelo exato?",
  "messageType": "analyst",
  "userName": "Maria Analista",
  "createdAt": "2025-10-30T15:32:00Z",
  "isInternal": false
}
```

#### Passo 6: Encerrar o Ticket

```http
POST /api/tickets/42/close HTTP/1.1
Host: localhost:5080
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "resolution": "Problema resolvido: Cabo de rede estava desconectado. Reconectado e testado com sucesso. Impressora voltou a funcionar normalmente.",
  "resolutionType": "Resolved"
}
```

**Resposta HTTP**:
```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "message": "Ticket encerrado com sucesso",
  "ticketId": 42,
  "resolution": "Problema resolvido: Cabo de rede estava desconectado. Reconectado e testado com sucesso. Impressora voltou a funcionar normalmente.",
  "resolutionType": "Resolved"
}
```

### 📱 Exemplo Completo em JavaScript (Cliente Analista)

```javascript
class SafiApiClient {
  constructor(baseUrl = 'http://localhost:5080') {
    this.baseUrl = baseUrl;
    this.token = null;
  }

  // 1. Login e armazenamento do token
  async login(email, password) {
    const response = await fetch(`${this.baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
      throw new Error('Falha no login');
    }

    const data = await response.json();
    this.token = data.token;

    // Armazenar no localStorage
    localStorage.setItem('safi_token', data.token);
    localStorage.setItem('safi_user', JSON.stringify(data.user));

    return data;
  }

  // 2. Listar tickets com filtros
  async listarTickets(filtros = {}) {
    const params = new URLSearchParams(filtros);

    const response = await fetch(`${this.baseUrl}/api/tickets?${params}`, {
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Erro ao listar tickets');
    }

    return await response.json();
  }

  // 3. Obter detalhes de um ticket
  async obterTicket(ticketId) {
    const response = await fetch(`${this.baseUrl}/api/tickets/${ticketId}`, {
      headers: {
        'Authorization': `Bearer ${this.token}`
      }
    });

    if (!response.ok) {
      throw new Error('Ticket não encontrado');
    }

    return await response.json();
  }

  // 4. Atualizar ticket
  async atualizarTicket(ticketId, dados) {
    const response = await fetch(`${this.baseUrl}/api/tickets/${ticketId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dados)
    });

    if (!response.ok) {
      throw new Error('Erro ao atualizar ticket');
    }

    return await response.json();
  }

  // 5. Adicionar mensagem ao chat
  async adicionarMensagem(ticketId, mensagem) {
    const response = await fetch(`${this.baseUrl}/api/tickets/${ticketId}/chat`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(mensagem)
    });

    if (!response.ok) {
      throw new Error('Erro ao adicionar mensagem');
    }

    return await response.json();
  }

  // 6. Encerrar ticket
  async encerrarTicket(ticketId, resolucao) {
    const response = await fetch(`${this.baseUrl}/api/tickets/${ticketId}/close`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(resolucao)
    });

    if (!response.ok) {
      throw new Error('Erro ao encerrar ticket');
    }

    return await response.json();
  }

  // 7. Obter estatísticas
  async obterEstatisticas() {
    const response = await fetch(`${this.baseUrl}/api/tickets/statistics`, {
      headers: {
        'Authorization': `Bearer ${this.token}`
      }
    });

    if (!response.ok) {
      throw new Error('Erro ao obter estatísticas');
    }

    return await response.json();
  }
}

// EXEMPLO DE USO COMPLETO
async function fluxoAnalistaCompleto() {
  const api = new SafiApiClient();

  try {
    // 1. Login
    console.log('1️⃣ Fazendo login...');
    const loginData = await api.login('analista@safi.com', 'SenhaSegura123!');
    console.log('✅ Login realizado:', loginData.user.name);

    // 2. Listar tickets em aberto com prioridade alta
    console.log('\n2️⃣ Listando tickets...');
    const tickets = await api.listarTickets({
      pageNumber: 1,
      pageSize: 10,
      status: 'Open',
      priority: 'High'
    });
    console.log(`✅ Encontrados ${tickets.tickets.length} tickets`);

    // 3. Selecionar primeiro ticket
    const primeiroTicket = tickets.tickets[0];
    console.log(`\n3️⃣ Selecionando ticket #${primeiroTicket.id}`);

    // 4. Obter detalhes completos
    const detalhes = await api.obterTicket(primeiroTicket.id);
    console.log('✅ Detalhes carregados:', detalhes.title);

    // 5. Assumir o ticket
    console.log('\n4️⃣ Assumindo ticket...');
    await api.atualizarTicket(primeiroTicket.id, {
      status: 'InProgress',
      assignedToId: loginData.user.id
    });
    console.log('✅ Ticket assumido');

    // 6. Adicionar mensagem
    console.log('\n5️⃣ Enviando mensagem...');
    await api.adicionarMensagem(primeiroTicket.id, {
      message: 'Estou analisando o problema. Em breve retorno com uma solução.',
      messageType: 'analyst',
      isInternal: false
    });
    console.log('✅ Mensagem enviada');

    // 7. Encerrar ticket (simulando resolução)
    console.log('\n6️⃣ Encerrando ticket...');
    await api.encerrarTicket(primeiroTicket.id, {
      resolution: 'Problema resolvido com sucesso!',
      resolutionType: 'Resolved'
    });
    console.log('✅ Ticket encerrado');

    // 8. Ver estatísticas atualizadas
    console.log('\n7️⃣ Obtendo estatísticas...');
    const stats = await api.obterEstatisticas();
    console.log('✅ Estatísticas:', {
      total: stats.totalTickets,
      abertos: stats.openTickets,
      resolvidos: stats.resolvedTickets
    });

  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
}

// Executar o fluxo completo
fluxoAnalistaCompleto();
```

### 🐍 Exemplo Completo em Python (Cliente Analista)

```python
import requests
from typing import Dict, List, Optional
from datetime import datetime

class SafiApiClient:
    """Cliente Python para API SAFI"""

    def __init__(self, base_url: str = "http://localhost:5080"):
        self.base_url = base_url
        self.token: Optional[str] = None
        self.user: Optional[Dict] = None

    def login(self, email: str, password: str) -> Dict:
        """1. Fazer login e obter token JWT"""
        url = f"{self.base_url}/api/auth/login"
        payload = {"email": email, "password": password}

        response = requests.post(url, json=payload)
        response.raise_for_status()

        data = response.json()
        self.token = data["token"]
        self.user = data["user"]

        return data

    def _get_headers(self) -> Dict[str, str]:
        """Retorna headers com autenticação"""
        if not self.token:
            raise Exception("Usuário não autenticado. Faça login primeiro.")

        return {
            "Authorization": f"Bearer {self.token}",
            "Content-Type": "application/json"
        }

    def listar_tickets(self, filtros: Optional[Dict] = None) -> Dict:
        """2. Listar tickets com filtros opcionais"""
        url = f"{self.base_url}/api/tickets"

        response = requests.get(
            url,
            headers=self._get_headers(),
            params=filtros or {}
        )
        response.raise_for_status()

        return response.json()

    def obter_ticket(self, ticket_id: int) -> Dict:
        """3. Obter detalhes de um ticket específico"""
        url = f"{self.base_url}/api/tickets/{ticket_id}"

        response = requests.get(url, headers=self._get_headers())
        response.raise_for_status()

        return response.json()

    def atualizar_ticket(self, ticket_id: int, dados: Dict) -> Dict:
        """4. Atualizar dados de um ticket"""
        url = f"{self.base_url}/api/tickets/{ticket_id}"

        response = requests.put(
            url,
            headers=self._get_headers(),
            json=dados
        )
        response.raise_for_status()

        return response.json()

    def adicionar_mensagem(self, ticket_id: int, mensagem: Dict) -> Dict:
        """5. Adicionar mensagem ao chat do ticket"""
        url = f"{self.base_url}/api/tickets/{ticket_id}/chat"

        response = requests.post(
            url,
            headers=self._get_headers(),
            json=mensagem
        )
        response.raise_for_status()

        return response.json()

    def encerrar_ticket(self, ticket_id: int, resolucao: Dict) -> Dict:
        """6. Encerrar um ticket"""
        url = f"{self.base_url}/api/tickets/{ticket_id}/close"

        response = requests.post(
            url,
            headers=self._get_headers(),
            json=resolucao
        )
        response.raise_for_status()

        return response.json()

    def obter_estatisticas(self) -> Dict:
        """7. Obter estatísticas gerais dos tickets"""
        url = f"{self.base_url}/api/tickets/statistics"

        response = requests.get(url, headers=self._get_headers())
        response.raise_for_status()

        return response.json()

    def escalonar_ticket(self, ticket_id: int, dados: Dict) -> Dict:
        """Escalonar ticket para outro nível"""
        url = f"{self.base_url}/api/tickets/{ticket_id}/escalate"

        response = requests.post(
            url,
            headers=self._get_headers(),
            json=dados
        )
        response.raise_for_status()

        return response.json()


# EXEMPLO DE USO COMPLETO
def fluxo_analista_completo():
    """Demonstra o fluxo completo de um analista"""

    api = SafiApiClient()

    try:
        # 1. Login
        print("1️⃣ Fazendo login...")
        login_data = api.login("analista@safi.com", "SenhaSegura123!")
        print(f"✅ Login realizado: {login_data['user']['name']}")
        print(f"   Token expira em: {login_data['expiresAt']}")

        # 2. Listar tickets em aberto com alta prioridade
        print("\n2️⃣ Listando tickets prioritários...")
        tickets_response = api.listar_tickets({
            "pageNumber": 1,
            "pageSize": 10,
            "status": "Open",
            "priority": "High"
        })

        tickets = tickets_response["tickets"]
        print(f"✅ Encontrados {len(tickets)} tickets")

        for i, ticket in enumerate(tickets, 1):
            print(f"   {i}. #{ticket['id']} - {ticket['title']} ({ticket['userEmail']})")

        if not tickets:
            print("❌ Nenhum ticket encontrado")
            return

        # 3. Selecionar e obter detalhes do primeiro ticket
        primeiro_ticket = tickets[0]
        ticket_id = primeiro_ticket["id"]

        print(f"\n3️⃣ Analisando ticket #{ticket_id}...")
        detalhes = api.obter_ticket(ticket_id)
        print(f"✅ Detalhes carregados:")
        print(f"   Título: {detalhes['title']}")
        print(f"   Usuário: {detalhes['user']['name']}")
        print(f"   Problema: {detalhes['detailing'][:100]}...")

        # 4. Assumir o ticket
        print(f"\n4️⃣ Assumindo ticket #{ticket_id}...")
        api.atualizar_ticket(ticket_id, {
            "status": "InProgress",
            "priority": "High",
            "assignedToId": login_data["user"]["id"]
        })
        print("✅ Ticket assumido e movido para 'Em Progresso'")

        # 5. Enviar mensagem inicial
        print("\n5️⃣ Enviando mensagem inicial ao usuário...")
        api.adicionar_mensagem(ticket_id, {
            "message": "Olá! Recebi seu chamado e estou analisando o problema. Em breve retornarei com uma solução.",
            "messageType": "analyst",
            "isInternal": False
        })
        print("✅ Mensagem enviada")

        # Simulação: trabalho sendo realizado...
        print("\n⏳ Trabalhando na solução...")

        # 6. Enviar mensagem de resolução
        print("\n6️⃣ Informando solução...")
        api.adicionar_mensagem(ticket_id, {
            "message": "Identifiquei o problema! O cabo de rede estava desconectado. Reconectei e testei - está funcionando perfeitamente agora.",
            "messageType": "analyst",
            "isInternal": False
        })
        print("✅ Solução comunicada")

        # 7. Encerrar o ticket
        print(f"\n7️⃣ Encerrando ticket #{ticket_id}...")
        api.encerrar_ticket(ticket_id, {
            "resolution": "Problema resolvido: Cabo de rede estava desconectado. Reconectado e testado com sucesso.",
            "resolutionType": "Resolved"
        })
        print("✅ Ticket encerrado com sucesso")

        # 8. Visualizar estatísticas atualizadas
        print("\n8️⃣ Obtendo estatísticas do sistema...")
        stats = api.obter_estatisticas()
        print("✅ Estatísticas atuais:")
        print(f"   📊 Total de tickets: {stats['totalTickets']}")
        print(f"   🟢 Abertos: {stats['openTickets']}")
        print(f"   🔵 Em progresso: {stats['inProgressTickets']}")
        print(f"   ✅ Resolvidos: {stats['resolvedTickets']}")
        print(f"   ⏱️  Tempo médio de resolução: {stats['averageResolutionTimeHours']:.1f}h")
        print(f"   ⚠️  Tickets acima do SLA: {stats['ticketsOverSla']}")

        print("\n🎉 Fluxo completo executado com sucesso!")

    except requests.exceptions.HTTPError as e:
        print(f"❌ Erro HTTP: {e}")
        if e.response is not None:
            print(f"   Resposta: {e.response.text}")
    except Exception as e:
        print(f"❌ Erro: {e}")


if __name__ == "__main__":
    fluxo_analista_completo()
```

### 💻 Exemplo de Output do Script Python

```
1️⃣ Fazendo login...
✅ Login realizado: Maria Analista
   Token expira em: 2025-10-31T14:23:45Z

2️⃣ Listando tickets prioritários...
✅ Encontrados 2 tickets
   1. #42 - Impressora não está funcionando (joao.silva@exemplo.com)
   2. #38 - Sistema lento após atualização (carlos.m@exemplo.com)

3️⃣ Analisando ticket #42...
✅ Detalhes carregados:
   Título: Impressora não está funcionando
   Usuário: João Silva
   Problema: A impressora do setor de vendas não imprime documentos desde ontem. Aparece erro de conexão...

4️⃣ Assumindo ticket #42...
✅ Ticket assumido e movido para 'Em Progresso'

5️⃣ Enviando mensagem inicial ao usuário...
✅ Mensagem enviada

⏳ Trabalhando na solução...

6️⃣ Informando solução...
✅ Solução comunicada

7️⃣ Encerrando ticket #42...
✅ Ticket encerrado com sucesso

8️⃣ Obtendo estatísticas do sistema...
✅ Estatísticas atuais:
   📊 Total de tickets: 347
   🟢 Abertos: 41
   🔵 Em progresso: 27
   ✅ Resolvidos: 235
   ⏱️  Tempo médio de resolução: 18.5h
   ⚠️  Tickets acima do SLA: 7

🎉 Fluxo completo executado com sucesso!
```

---

## 🔄 Operações Adicionais (Analista)

### Atualizar Ticket

**Endpoint**: `PUT /api/tickets/{id}`
**Autenticação**: ✅ **Obrigatória**

**Request**:
```json
{
  "title": "Impressora HP LaserJet não imprime",
  "status": "InProgress",
  "priority": "High",
  "assignedToId": 5
}
```

### Encerrar Ticket

**Endpoint**: `POST /api/tickets/{id}/close`
**Autenticação**: ✅ **Obrigatória**

**Request**:
```json
{
  "resolution": "Cabo de rede estava desconectado. Reconectado e testado com sucesso.",
  "resolutionType": "Resolved"
}
```

### Escalonar Ticket

**Endpoint**: `POST /api/tickets/{id}/escalate`
**Autenticação**: ✅ **Obrigatória**

**Request**:
```json
{
  "supportLevel": "N2",
  "comment": "Problema requer expertise em configuração de rede avançada"
}
```

### Adicionar Mensagem ao Chat

**Endpoint**: `POST /api/tickets/{id}/chat`
**Autenticação**: ✅ **Obrigatória**

**Request**:
```json
{
  "message": "Já verificamos a configuração. Pode testar novamente?",
  "messageType": "analyst",
  "isInternal": false
}
```

### Obter Histórico de Chat

**Endpoint**: `GET /api/tickets/{id}/chat`
**Autenticação**: ✅ **Obrigatória**

**Response**:
```json
{
  "ticketId": 42,
  "messages": [
    {
      "id": 1,
      "message": "Qual é o modelo da impressora?",
      "messageType": "analyst",
      "userName": "Maria Analista",
      "createdAt": "2025-10-30T14:30:00Z"
    },
    {
      "id": 2,
      "message": "É uma HP LaserJet Pro M404",
      "messageType": "user",
      "userName": "João Silva",
      "createdAt": "2025-10-30T14:32:15Z"
    }
  ],
  "totalMessages": 2
}
```

---

## 🔐 Sistema de Autenticação JWT

### Como Funciona

1. **Login**: Usuário envia email/senha
2. **Validação**: Sistema valida credenciais no banco
3. **Geração de Token**: JWT é gerado com claims do usuário
4. **Uso do Token**: Token é enviado em todas as requisições autenticadas
5. **Validação**: Middleware valida token em cada request
6. **Expiração**: Token expira após período configurado
7. **Refresh**: Cliente pode renovar token com refresh token

### Estrutura do JWT Token

```json
{
  "sub": "5",                           // User ID
  "name": "Maria Analista",             // Nome do usuário
  "email": "analista@safi.com",         // Email
  "UserType": "Analyst",                // Tipo de usuário
  "nbf": 1730304225,                    // Not Before (timestamp)
  "exp": 1730390625,                    // Expiration (timestamp)
  "iat": 1730304225                     // Issued At (timestamp)
}
```

### Endpoints de Autenticação

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "analista@safi.com",
  "password": "SenhaSegura123!"
}
```

#### Registro
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "Novo Analista",
  "email": "novo@safi.com",
  "password": "SenhaSegura123!",
  "userType": "Analyst",
  "departmentId": 2
}
```

#### Refresh Token
```http
POST /api/auth/refresh
Content-Type: application/json

{
  "refreshToken": "refresh_token_aqui"
}
```

#### Logout
```http
POST /api/auth/logout
Authorization: Bearer {token}
```

#### Verificar Usuário Atual
```http
GET /api/tickets/me
Authorization: Bearer {token}
```

**Response**:
```json
{
  "message": "Usuário autenticado com sucesso!",
  "userId": "5",
  "userName": "Maria Analista",
  "userEmail": "analista@safi.com",
  "userType": "Analyst",
  "timestamp": "2025-10-30T15:45:30Z"
}
```

---

## 📝 Resumo Comparativo

| Aspecto | Rota Pública | Rota Autenticada |
|---------|--------------|------------------|
| **Autenticação** | ❌ Não necessária | ✅ JWT obrigatório |
| **Quem usa** | Usuários externos/clientes | Analistas/Admins |
| **Header** | `Content-Type: application/json` | `Authorization: Bearer {token}` |
| **Operações** | Criar ticket, listar (básico) | CRUD completo, estatísticas, chat |
| **Dados retornados** | Limitados (proteção) | Completos (sensíveis) |
| **Rate Limiting** | Mais restritivo | Menos restritivo |
| **Uso principal** | Abertura de chamados | Gestão completa |

---

## ⚙️ Códigos de Status HTTP

| Código | Significado | Quando Ocorre |
|--------|-------------|---------------|
| `200 OK` | Sucesso | Operação bem-sucedida |
| `201 Created` | Criado | Recurso criado com sucesso |
| `400 Bad Request` | Requisição inválida | Dados mal formatados ou incompletos |
| `401 Unauthorized` | Não autorizado | Token ausente, inválido ou expirado |
| `403 Forbidden` | Proibido | Usuário sem permissão para ação |
| `404 Not Found` | Não encontrado | Recurso não existe |
| `500 Internal Server Error` | Erro interno | Erro no servidor |

---

## 🚀 Exemplos de Uso com cURL

### Criar Ticket Público
```bash
curl -X POST https://localhost:5080/api/tickets/public \
  -H "Content-Type: application/json" \
  -d '{
    "requesterName": "João Silva",
    "requesterEmail": "joao@exemplo.com",
    "title": "Problema com impressora",
    "detailing": "Não imprime documentos",
    "issueTypeId": 3
  }'
```

### Login
```bash
curl -X POST https://localhost:5080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "analista@safi.com",
    "password": "SenhaSegura123!"
  }'
```

### Listar Tickets (Autenticado)
```bash
curl -X GET "https://localhost:5080/api/tickets?pageNumber=1&pageSize=20" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### Obter Detalhes de Ticket
```bash
curl -X GET https://localhost:5080/api/tickets/42 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

## 📖 Documentação Interativa

A documentação completa da API está disponível em:

- **Scalar UI**: `https://localhost:5080/scalar/v1`
- **OpenAPI JSON**: `https://localhost:5080/openapi/v1.json`

---

**Última atualização**: 30 de Outubro de 2025
**Versão da API**: v1.0
**Contato**: suporte@safi.com
