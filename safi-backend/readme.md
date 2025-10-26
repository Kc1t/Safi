# SAFI Backend - Sistema de Atendimento e Feedback Inteligente

Backend da plataforma SAFI desenvolvido em .NET 9 com ASP.NET Core, Entity Framework Core, SignalR e integração com IA.

---

## Índice

- [Pré-requisitos](#pré-requisitos)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Configuração do Ambiente](#configuração-do-ambiente)
- [Como Rodar o Projeto](#como-rodar-o-projeto)
- [Configurações](#configurações)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [API Endpoints](#api-endpoints)
- [Solução de Problemas](#solução-de-problemas)

---

## Pré-requisitos

Antes de começar, certifique-se de ter instalado:

### Obrigatórios

1. **.NET 9 SDK**
   - Download: https://dotnet.microsoft.com/download/dotnet/9.0
   - Verifique a instalação: `dotnet --version`

2. **Docker Desktop**
   - Download: https://www.docker.com/products/docker-desktop
   - Necessário para SQL Server e Redis
   - No Windows: habilite WSL2

3. **Git**
   - Download: https://git-scm.com/downloads

### Recomendados

- **Visual Studio 2022** (17.8+) ou **Visual Studio Code** com extensão C# Dev Kit
- **Postman** ou **Insomnia** para testar APIs

---

## Tecnologias Utilizadas

- **Framework:** ASP.NET Core 9.0
- **Linguagem:** C# com Nullable Reference Types
- **Banco de Dados:** SQL Server 2022
- **Cache:** Redis 7
- **ORM:** Entity Framework Core 9.0
- **Autenticação:** JWT (JSON Web Tokens)
- **Real-time:** SignalR
- **Logging:** Serilog
- **Validação:** FluentValidation
- **Mapeamento:** AutoMapper
- **IA:** Google Gemini API
- **Documentação API:** OpenAPI/Scalar

---

## Configuração do Ambiente

### 1. Clonar o Repositório

```bash
git clone <url-do-repositorio>
cd safi-backend
```

### 2. Iniciar Infraestrutura (Docker)

O projeto precisa de SQL Server e Redis. Use Docker Compose:

```bash
# Iniciar SQL Server e Redis
docker-compose up -d

# Verificar se os containers estão rodando
docker ps
```

Você deve ver dois containers:
- `safi-sqlserver` - Porta 1433
- `safi-redis` - Porta 6379

**Aguarde cerca de 30 segundos** para o SQL Server inicializar completamente.

### 3. Configurar appsettings

O arquivo `appsettings.Development.json` já está configurado com valores padrão:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost,1433;Database=SAFIDB;User Id=sa;Password=admin123!;TrustServerCertificate=true;",
    "Redis": "localhost:6379"
  },
  "JwtSettings": {
    "SecretKey": "YourSuperSecretKeyThatIsAtLeast32CharactersLong!",
    "Issuer": "SAFI-Backend",
    "Audience": "SAFI-Users",
    "ExpiryMinutes": 15,
    "RefreshTokenExpiryDays": 7
  },
  "ExternalServices": {
    "GeminiApi": {
      "BaseUrl": "https://generativelanguage.googleapis.com/v1beta",
      "ApiKey": "AIzaSyA6RkYnKugw6uakuHvgL1G6J4Wwz2gcFVc",
      "ModelId": "gemini-2.5-flash-lite"
    }
  }
}
```

**IMPORTANTE:** Em produção, use variáveis de ambiente para dados sensíveis.

---

## Como Rodar o Projeto

### Opção 1: Visual Studio 2022

1. Abra `Safi.Backend.sln`
2. Pressione `F5` ou clique em "Start Debugging"

### Opção 2: Linha de Comando

```bash
# Navegar para a pasta do projeto
cd Safi.Backend

# Restaurar dependências
dotnet restore

# Compilar o projeto
dotnet build

# Executar a aplicação
dotnet run
```

### Opção 3: Visual Studio Code

```bash
# Abrir no VS Code
code .

# Pressione F5 para debug ou Ctrl+F5 para executar sem debug
```

---

## Acessando a Aplicação

Após iniciar, a aplicação estará disponível em:

- **HTTPS:** https://localhost:7001
- **HTTP:** http://localhost:5000

### Documentação Interativa da API

Acesse a documentação Scalar (OpenAPI):

- **Scalar:** https://localhost:7001/scalar/v1
- **OpenAPI JSON:** https://localhost:7001/openapi/v1.json

---

## Inicialização Automática

A aplicação cria automaticamente:

1. **Banco de dados** SAFIDB (se não existir)
2. **Tabelas** via Entity Framework
3. **Dados iniciais** (seed data):
   - 2 usuários (admin e cliente)
   - 3 analistas
   - 5 tickets de exemplo
   - 2 categorias de problemas

Veja o código em `Program.cs:156-165` e `Infrastructure/Data/SeedData.cs`

---

## Estrutura do Projeto

```
Safi.Backend/
├── Controllers/           # Endpoints da API
│   ├── AuthController.cs
│   ├── TicketsController.cs
│   ├── ChatController.cs
│   └── DatabaseController.cs
├── Core/                  # Camada de domínio
│   ├── Entities/         # Modelos de dados
│   └── Interfaces/       # Contratos (repositórios/serviços)
├── Infrastructure/        # Camada de infraestrutura
│   ├── Data/
│   │   ├── Context/      # DbContext
│   │   ├── Repositories/ # Implementação de repositórios
│   │   └── SeedData.cs   # Dados iniciais
│   └── Middleware/       # Middlewares customizados
├── Modules/               # Módulos funcionais
│   ├── Authentication/   # Login, JWT, Refresh Token
│   ├── Tickets/          # Sistema de tickets
│   ├── AI/               # Integração Gemini AI
│   └── Chat/             # Chat em tempo real (SignalR)
├── appsettings.json      # Configurações base
└── Program.cs            # Entry point e configuração
```

---

## API Endpoints

### Autenticação

```http
POST /api/auth/login
POST /api/auth/refresh-token
POST /api/auth/logout
```

### Tickets

```http
GET    /api/tickets              # Listar tickets
GET    /api/tickets/{id}         # Buscar ticket
POST   /api/tickets              # Criar ticket
PUT    /api/tickets/{id}         # Atualizar ticket
DELETE /api/tickets/{id}         # Deletar ticket
POST   /api/tickets/{id}/escalate # Escalar ticket
POST   /api/tickets/public       # Criar ticket público (sem auth)
```

### Chat (SignalR)

```http
Hub: /chatHub

Métodos:
- SendMessage(sessionId, user, message)
- JoinSession(sessionId)
- LeaveSession(sessionId)
```

### Database (Desenvolvimento)

```http
GET  /api/database/seed          # Popular dados
POST /api/database/reset         # Resetar banco
```

---

## Configurações

### Autenticação JWT

Tokens são gerados com validade de 15 minutos. Refresh tokens duram 7 dias.

### CORS

Configurado para aceitar requisições de:
- `http://localhost:5500`
- `http://127.0.0.1:5500`
- `http://localhost:3000`

Para adicionar mais origens, edite `Program.cs:115-119`

### Logging

Logs são salvos em `logs/safi-backend-{data}.txt` (rotação diária)

### Cache Redis

Usado para:
- Sessões de chat
- Cache de análises de IA
- Tokens de refresh

---

## Comandos Úteis

### Docker

```bash
# Ver logs dos containers
docker-compose logs -f

# Parar os serviços
docker-compose down

# Parar e remover dados (CUIDADO!)
docker-compose down -v

# Conectar ao SQL Server
docker exec -it safi-sqlserver /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P admin123!

# Conectar ao Redis
docker exec -it safi-redis redis-cli
```

### .NET CLI

```bash
# Limpar build
dotnet clean

# Rebuild completo
dotnet build --no-incremental

# Executar com hot reload
dotnet watch run

# Executar testes (se houver)
dotnet test
```

---

## Solução de Problemas

### Erro: "Cannot connect to SQL Server"

1. Verifique se o container está rodando: `docker ps`
2. Aguarde 30-60 segundos após `docker-compose up`
3. Teste a conexão:
   ```bash
   docker exec -it safi-sqlserver /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P admin123!
   ```

### Erro: "Port 1433 already in use"

Outro SQL Server está rodando. Opções:
- Pare o outro SQL Server
- Mude a porta no `docker-compose.yml` e `appsettings.Development.json`

### Erro: "Redis connection failed"

```bash
# Verificar Redis
docker exec -it safi-redis redis-cli ping
# Deve retornar: PONG
```

### Erro de compilação

```bash
# Limpar e restaurar
dotnet clean
dotnet restore
dotnet build
```

### Erro de permissão Docker (Windows)

- Execute Docker Desktop como Administrador
- Verifique WSL2: `wsl --status`

---

## Credenciais Padrão (Desenvolvimento)

Após seed data:

**Admin:**
- Email: `admin@safi.com`
- Senha: `Admin@123`

**Cliente:**
- Email: `cliente@test.com`
- Senha: `Cliente@123`

**Analistas:**
- `ana.silva@safi.com` - Senha: `Analyst@123`
- `carlos.santos@safi.com` - Senha: `Analyst@123`
- `maria.oliveira@safi.com` - Senha: `Analyst@123`

---

## Próximos Passos

1. Explore a documentação Scalar em `/scalar/v1`
2. Teste os endpoints de autenticação
3. Crie tickets via API
4. Teste o chat em tempo real
5. Consulte `docs/` para arquitetura detalhada

---

## Recursos Adicionais

- [Documentação Completa](docs/README.md)
- [Guia de Testes de Rotas](docs/guia-teste-rotas.md)
- [Docker Setup](docs/docker-setup.md)
- [Estrutura Modular](docs/estrutura-modular.md)

---

## Suporte

Para problemas ou dúvidas, consulte:
- Issues do repositório
- Documentação em `docs/`
- Logs em `logs/`