# 🎫 SAFI Dashboard - Interface Web Completa

Interface web moderna para o sistema SAFI com login, listagem de tickets e modal de detalhes.

## 🚀 Funcionalidades

### ✅ **Autenticação**
- Login com email e senha
- Token JWT armazenado no localStorage
- Logout seguro
- Persistência de sessão

### ✅ **Dashboard de Tickets**
- Listagem de todos os tickets
- Cards visuais com informações resumidas
- Status coloridos (Aberto, Em Progresso, Pendente, Resolvido, Fechado)
- Prioridades coloridas (Baixa, Média, Alta, Urgente)
- Layout responsivo em grid

### ✅ **Modal de Detalhes**
- Informações completas do ticket
- Dados do usuário solicitante
- Informações do analista atribuído
- Histórico de datas (criação, atualização, resolução)
- Design moderno e responsivo

### ✅ **Interface Moderna**
- Design responsivo (mobile-friendly)
- Animações suaves
- Cores do tema SAFI (roxo/violeta)
- Ícones Font Awesome
- Loading states
- Tratamento de erros

## 🛠️ Como Usar

### **1. Preparação**
```bash
# Certifique-se que a API está rodando
cd Safi.Backend
dotnet run
```

### **2. Acessar a Interface**
- Abra o arquivo `safi-dashboard.html` no navegador
- Ou sirva via servidor local:
```bash
# Python
python -m http.server 8000

# Node.js
npx serve .

# Acesse: http://localhost:8000/safi-dashboard.html
```

### **3. Login**
- **Email**: `admin@safi.com`
- **Senha**: `123456`
- Ou use qualquer usuário criado via registro

### **4. Navegação**
- **Dashboard**: Visualiza todos os tickets em cards
- **Card de Ticket**: Clique para abrir modal com detalhes
- **Modal**: Mostra informações completas do ticket
- **Logout**: Botão no canto superior direito

## 📱 Responsividade

### **Desktop**
- Grid de 3-4 colunas
- Cards grandes com informações completas
- Modal centralizado

### **Tablet**
- Grid de 2 colunas
- Cards médios
- Modal adaptado

### **Mobile**
- Grid de 1 coluna
- Cards otimizados para toque
- Modal em tela cheia

## 🎨 Design System

### **Cores**
- **Primária**: `#7c3aed` (Roxo)
- **Secundária**: `#a855f7` (Violeta)
- **Sucesso**: `#16a34a` (Verde)
- **Erro**: `#dc2626` (Vermelho)
- **Aviso**: `#d97706` (Laranja)

### **Status dos Tickets**
- **Aberto**: Azul (`#dbeafe`)
- **Em Progresso**: Amarelo (`#fef3c7`)
- **Pendente**: Roxo (`#f3e8ff`)
- **Resolvido**: Verde (`#d1fae5`)
- **Fechado**: Cinza (`#f3f4f6`)

### **Prioridades**
- **Baixa**: Verde (`#d1fae5`)
- **Média**: Amarelo (`#fef3c7`)
- **Alta**: Vermelho (`#fed7d7`)
- **Urgente**: Rosa (`#fbb6ce`)

## 🔧 Configuração

### **API Base URL**
```javascript
const API_BASE = 'http://localhost:5080';
```

### **Endpoints Utilizados**
- `POST /api/auth/login` - Login
- `GET /api/tickets` - Listar tickets
- `GET /api/tickets/{id}` - Detalhes do ticket

### **Headers**
```javascript
headers: {
    'Authorization': `Bearer ${authToken}`,
    'Accept': 'application/json'
}
```

## 🐛 Troubleshooting

### **Erro de CORS**
- Certifique-se que a API está configurada para aceitar requisições do frontend
- Verifique se o `Program.cs` tem CORS habilitado

### **Erro 401 (Unauthorized)**
- Token expirado - faça login novamente
- Token inválido - limpe o localStorage

### **Erro 404 (Not Found)**
- API não está rodando
- URL incorreta

### **Tickets não carregam**
- Verifique se há tickets no banco
- Confirme se o usuário tem permissão
- Verifique logs da API

## 📁 Estrutura de Arquivos

```
safi-dashboard.html    # Interface principal
README-dashboard.md    # Este arquivo
```

## 🚀 Próximos Passos

### **Funcionalidades Futuras**
- [ ] Filtros por status/prioridade
- [ ] Busca de tickets
- [ ] Paginação
- [ ] Atualização de status
- [ ] Comentários nos tickets
- [ ] Notificações em tempo real
- [ ] Gráficos e estatísticas
- [ ] Exportação de relatórios

### **Melhorias Técnicas**
- [ ] Framework JavaScript (React/Vue)
- [ ] PWA (Progressive Web App)
- [ ] Service Workers
- [ ] Cache offline
- [ ] Testes automatizados

## 📞 Suporte

Para dúvidas ou problemas:
1. Verifique os logs da API
2. Teste os endpoints com Postman/Insomnia
3. Verifique o console do navegador (F12)
4. Confirme se a API está rodando na porta 5080
