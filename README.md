# SAFI – Sistema de Apoio Farmacêutico Inteligente

Sistema de suporte técnico farmacêutico com integração de Inteligência Artificial (IA), desenvolvido como parte do Projeto Integrado Multidisciplinar (PIM III) do curso de Análise e Desenvolvimento de Sistemas – Universidade Paulista (UNIP).

## 📌 Descrição do Projeto

O SAFI visa centralizar a gestão de chamados técnicos em uma empresa farmacêutica, aplicando IA para triagem, categorização, priorização e resposta automatizada a incidentes. Além de modernizar o suporte técnico, o sistema atende aos requisitos de escalabilidade, segurança (LGPD) e usabilidade em ambientes multiplataforma (desktop, web, mobile).

## 🎯 Objetivos

### Objetivo Geral
Planejar e desenvolver um sistema de suporte interno com foco em sustentabilidade, escalabilidade e eficiência organizacional.

### Objetivos Específicos
- Levantamento e modelagem de requisitos.
- Criação de artefatos UML (caso de uso, classe, sequência).
- Prototipação de interfaces (desktop, web, mobile).
- Integração com serviços de IA para triagem/classificação.
- Estruturação do banco de dados (MS SQL Server).
- Garantia de conformidade com a LGPD.

## 🧠 Tecnologias

- **Frontend Web**: HTML + hospedagem na Vercel
- **Frontend Desktop**: C# com Windows Forms/WPF
- **Frontend Mobile**: Android
- **Backend**: API RESTful em EC2 (AWS)
- **Banco de Dados**: MS SQL Server via RDS (AWS)
- **IA**: Gemini (Google) via API
- **Monitoramento**: Amazon CloudWatch (migrando para Grafana/Prometheus)
- **Arquitetura**: Cloud-native (multiplataforma + alta disponibilidade)

## 🧱 Principais Funcionalidades

- Registro e categorização de chamados
- Triagem automatizada com IA (N0)
- Priorização por criticidade e origem (N1/N2/N3)
- Sugestão de soluções baseada em base de conhecimento
- Interface administrativa completa
- Feedback do usuário e reabertura de chamados
- Roteamento dinâmico e controle de SLA

## 🔒 LGPD & Segurança

- Análise automática de termos sensíveis
- Criptografia de dados sensíveis
- Controle de acesso por perfis
- Monitoramento de logs e rastreabilidade
- Coleta mínima e validação automática de conteúdo

## 📊 Requisitos Funcionais Essenciais (RF)

- [RF001] Registro de Chamados
- [RF002] Triagem com IA
- [RF003] Categorização Automática
- [RF004] Sugestão de Soluções
- [RF005] Encaminhamento por Nível
- [RF009] Acompanhamento em Tempo Real
- [RF014] Controle de SLA

## ⚙️ Requisitos Não Funcionais (NF)

- [NF001] Interface Desktop em C#
- [NF002] Banco MS SQL Server
- [NF003] Conformidade LGPD
- [NF006] Desempenho (< 3s)
- [NF007] Escalabilidade para 600+ usuários
- [NF010] Multiplataforma
- [NF013] Uptime ≥ 99,5%

## 🛠️ Execução Técnica

- Scripts de criação e povoamento do banco no diretório `/database/scripts`
- Diagrama ER e UML disponíveis em `/docs/diagrams`
- Protótipos de UI em `/ui/prototypes`
- Integração com IA documentada em `/docs/ia-integration.md`

## 🧪 Testes

- Plano de testes detalhado disponível em `/tests/test-plan.md`
- Cobertura de casos críticos e validação de regras de negócio

## 👥 Equipe

- Eduardo Pires Ferreira da Silva
- Felippe Alves Reder
- Giovanna Pereira de Oliveira
- Kauã Miguel da Cunha
- Paulo Henrique do Santos Miliano
- Raphael de Lima Feitosa

## 📄 Licença

Projeto acadêmico sem fins comerciais. Uso restrito à apresentação institucional da UNIP.

---

