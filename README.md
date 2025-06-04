<a id="readme-top"></a>

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/kc1t/Safi">
    <img src="./safi-assets/logo.png" alt="Logo" width="180" >
  </a>

  <h3 align="center">SAFI – Sistema de Apoio Farmacêutico Inteligente</h3>


  <p align="center">
    Sistema de suporte técnico farmacêutico com integração de IA desenvolvido para o PIM III - UNIP.
    <br />
    <a href="#sobre-o-projeto" target="_blank">Ver Documentação Completa</a>
    ·
    <a href="https://github.com/kc1t/Safi/issues" target="_blank">Reportar Erro</a>
    ·
    <a href="https://github.com/kc1t/Safi/issues" target="_blank">Solicitar Features</a>
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Sumário</summary>
  <ol>
    <li>
      <a href="#sobre-o-projeto">Sobre o Projeto</a>
      <ul>
        <li><a href="#funcionalidades">Funcionalidades</a></li>
        <li><a href="#feito-com">Tecnologias Utilizadas</a></li>
      </ul>
    </li>
    <li>
      <a href="#começando">Começando</a>
      <ul>
        <li><a href="#pré-requisitos">Pré-requisitos</a></li>
        <li><a href="#instalação">Instalação</a></li>
      </ul>
    </li>
    <li><a href="#tutorial-do-sistema">Tutorial do Sistema</a></li>
    <li><a href="#equipe">Equipe</a></li>
    <li><a href="#licença">Licença</a></li>
    <li><a href="#contato">Contato</a></li>
  </ol>
</details>



https://github.com/user-attachments/assets/5205a0b7-9034-4199-8cb9-10e348b84811



## Sobre o Projeto

<div id="sobre-o-projeto"></div>

O SAFI (Sistema de Apoio Farmacêutico Inteligente) é um projeto acadêmico desenvolvido como parte do Projeto Integrado Multidisciplinar III (PIM III) do curso de Análise e Desenvolvimento de Sistemas da Universidade Paulista (UNIP).

O sistema centraliza a gestão de chamados técnicos em ambientes farmacêuticos, utilizando Inteligência Artificial para automatizar processos de triagem, categorização e priorização de incidentes. Com foco em modernização do suporte técnico, o projeto atende aos requisitos de escalabilidade, segurança (LGPD) e usabilidade multiplataforma.

### Objetivos do Projeto

**Objetivo Geral:** Planejar e desenvolver um sistema de suporte interno com foco em sustentabilidade, escalabilidade e eficiência organizacional.

**Objetivos Específicos:**
- Levantamento e modelagem de requisitos
- Criação de artefatos UML (caso de uso, classe, sequência)
- Prototipação de interfaces multiplataforma
- Integração com serviços de IA para triagem automática
- Estruturação de banco de dados robusto
- Garantia de conformidade com a LGPD

### Hospedagem

O sistema está distribuído em múltiplas plataformas:
- **Frontend Web:** Hospedado na Vercel
- **API Backend:** Hospedado em EC2 (AWS)
- **Banco de Dados:** MS SQL Server via RDS (AWS)

<div id="funcionalidades"></div>

### Funcionalidades

**Principais Features**
- [x] Registro e categorização de chamados
- [x] Triagem automatizada com IA (Gemini API)
- [x] Priorização por criticidade e origem
- [x] Sugestão de soluções baseada em base de conhecimento
- [x] Interface administrativa completa
- [x] Controle de SLA e monitoramento em tempo real

**Recursos Avançados**
- [x] Análise automática de conformidade LGPD
- [x] Roteamento dinâmico de chamados
- [x] Feedback do usuário e reabertura
- [x] Criptografia de dados sensíveis
- [x] Monitoramento com CloudWatch

<div id="feito-com"></div>

### Feito com

**Frontend (PIM III - Atual):**
- HTML/CSS/JavaScript (NextJs)
- Prototipação de interfaces multiplataforma

**Backend e Infraestrutura (A desenvolver no próximo PIM):**
- C# (Windows Forms/WPF) para Desktop
- Android (Mobile)
- API RESTful
- MS SQL Server via RDS (AWS)
- Hospedagem: EC2 (AWS)
- Google Gemini API para triagem e categorização
- Monitoramento: Amazon CloudWatch

**Arquitetura Planejada:**
Cloud-native com alta disponibilidade e escalabilidade

<p align="right">(<a href="#readme-top">Voltar ao Topo</a>)</p>

## Começando

### Pré-requisitos

**Para visualizar o projeto atual:**
- Navegador moderno com suporte a HTML5

**Para desenvolvimento futuro (próximo PIM):**
- .NET Framework 4.7.2 ou superior
- Visual Studio 2019+
- SQL Server Management Studio
- Conta AWS (para serviços cloud)
- Android Studio (para desenvolvimento mobile)

### Instalação

Clone o repositório:
```bash
git clone https://github.com/kc1t/Safi.git
```

#### Frontend Web (Atual)
```bash
cd web-frontend
# npm i
# npm run dev 
```

#### Desenvolvimentos Futuros (Próximo PIM)
```bash
# Backend API
cd backend
# Configurar connection string no appsettings.json
# Executar migrations do banco de dados
dotnet ef database update
dotnet run

# Frontend Desktop
cd desktop-app
# Abrir no Visual Studio
# Configurar endpoints da API
# Build e executar
```

<p align="right">(<a href="#readme-top">Voltar ao Topo</a>)</p>

## Tutorial do Sistema

O SAFI oferece interfaces intuitivas para diferentes perfis de usuário:

- **Usuários:** Abertura e acompanhamento de chamados
- **Técnicos:** Gestão e resolução de incidentes  
- **Administradores:** Controle completo do sistema e relatórios

*Documentação detalhada e vídeos tutoriais em desenvolvimento.*

<p align="right">(<a href="#readme-top">Voltar ao Topo</a>)</p>

## Equipe

Este projeto foi desenvolvido pelos seguintes estudantes da UNIP:

- **Eduardo Pires Ferreira da Silva**
- **Felippe Alves Reder**
- **Giovanna Pereira de Oliveira**
- **Kauã Miguel da Cunha**
- **Paulo Henrique do Santos Miliano**
- **Raphael de Lima Feitosa**

<p align="right">(<a href="#readme-top">Voltar ao Topo</a>)</p>

## Licença

Projeto acadêmico sem fins comerciais desenvolvido para a Universidade Paulista (UNIP). Uso restrito à apresentação institucional e avaliação acadêmica.

<p align="right">(<a href="#readme-top">Voltar ao Topo</a>)</p>

## Contato

**Projeto SAFI** - Universidade Paulista (UNIP)
PIM III - Análise e Desenvolvimento de Sistemas

Repositório: [https://github.com/kc1t/Safi](https://github.com/kc1t/Safi)

<p align="right">(<a href="#readme-top">Voltar ao Topo</a>)</p>

