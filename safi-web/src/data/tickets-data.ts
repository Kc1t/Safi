export interface Ticket {
    id: string
    number: string
    department: string
    title: string
    description: string
    openedAt: string
    triage: string
    complexity: string
    assignedTo: {
        name: string
        avatar?: string
        initials: string
        cellphone?: string
        email?: string
    }
    timeLine?: {
        id: string
        user: string
        action: string
        date: string
        initials: string
        type: 'user' | 'ai' | 'analyst'
    }[]
    aiDescription?: string
    chatHistory?: {
        role: 'user' | 'ai' | 'analyst'
        name?: string
        department?: string
        content?: string
        time?: string
    }[]
}


export const ticketsData: Ticket[] = [
    {
        id: "1",
        number: "2025-CS123",
        department: "RH",
        title: "Computador não liga após atualização",
        description: "Após a última atualização do sistema, o computador não inicia corretamente e exibe tela azul.",
        openedAt: "12:45",
        triage: "Não Resolvido",
        complexity: "N1",
        assignedTo: {
            name: "Leticia Rocha",
            initials: "LR",
            cellphone: "(11) 99876-5432",
            email: "leticia.rocha@empresa.com"
        },
        timeLine: [
            {
                id: "1",
                user: "Leticia Rocha",
                action: "Em Análise",
                date: "15 Jan",
                initials: "LR",
                type: "analyst"
            },
            {
                id: "2",
                user: "Analista N0 - IA",
                action: "Escalou para N1",
                date: "15 Jan",
                initials: "IA",
                type: "ai"
            },
            {
                id: "3",
                user: "Analista N0 - IA",
                action: "Recebeu Chamado",
                date: "15 Jan",
                initials: "IA",
                type: "ai"
            },
            {
                id: "4",
                user: "Maria Silva",	
                action: "Abriu o Chamado",
                date: "15 Jan",
                initials: "MS",
                type: "user"
            }
        ],
        chatHistory: [
            {
                role: "user",
                name: "Maria Silva",
                department: "RH",
                content: "Olá, meu computador não liga após a atualização de ontem. Aparece uma tela azul.",
            },
            {
                role: "ai",
                content: "Olá Maria! Entendi que seu computador apresenta tela azul após a atualização. Vou conectar você com nossa analista Leticia. Enquanto isso, você pode tentar desligar completamente o equipamento por 30 segundos?",
            },
            {
                role: "user",
                name: "Maria Silva",
                department: "RH",
                content: "Tentei isso mas não funcionou. O problema persiste.",
            },
            {
                role: "analyst",
                name: "Leticia Rocha",
                content: "Olá Maria, recebi seu chamado. Vou analisar o problema da tela azul após a atualização.",
            },
        ]
    },
    {
        id: "2",
        number: "2025-CS124",
        department: "Financeiro",
        title: "Lentidão no sistema de CRM",
        description: "O sistema está levando mais de 2 minutos para carregar os dados dos clientes.",
        openedAt: "10:33",
        triage: "Resolvido",
        complexity: "N0",
        assignedTo: {
            name: "Analista N0 - IA",
            initials: "IA",
        },
        timeLine: [
            {
                id: "1",
                user: "Analista N0 - IA",
                action: "Resolveu Chamado",
                date: "14 Jan",
                initials: "IA",
                type: "ai"
            },
            {
                id: "2",
                user: "Analista N0 - IA",
                action: "Recebeu Chamado",
                date: "14 Jan",
                initials: "IA",
                type: "ai"
            },
            {
                id: "3",
                user: "Carlos Pereira",
                action: "Abriu o Chamado",
                date: "14 Jan",
                initials: "CP",
                type: "user"
            }
        ],
        chatHistory: [
            {
                role: "user",
                name: "Carlos Pereira",
                department: "Financeiro",
                content: "O CRM está muito lento hoje, demora mais de 2 minutos para carregar.",
            },
            {
                role: "ai",
                content: "Olá Carlos! Vou verificar o status do servidor CRM. Parece que há sobrecarga no cache. Vou encaminhar para limpeza imediata.",
            },
            {
                role: "user",
                name: "Carlos Pereira",
                department: "Financeiro",
                content: "Perfeito! Agora está funcionando normalmente. Obrigado!",
            }
        ]
    },
    {
        id: "3",
        number: "2025-CS127",
        department: "Logística",
        title: "Lentidão no sistema de CRM",
        description: "As ordens de envio não estão sendo sincronizadas com o sistema da transportadora.",
        openedAt: "08:25",
        triage: "Resolvido",
        complexity: "N0",
        assignedTo: {
            name: "Analista N0 - IA",
            initials: "IA",
        },
        timeLine: [
            {
                id: "1",
                user: "Analista N0 - IA",
                action: "Resolveu Chamado",
                date: "13 Jan",
                initials: "IA",
                type: "ai"
            },
            {
                id: "2",
                user: "Analista N0 - IA",
                action: "Recebeu Chamado",
                date: "13 Jan",
                initials: "IA",
                type: "ai"
            },
            {
                id: "3",
                user: "Roberto Santos",
                action: "Abriu o Chamado",
                date: "13 Jan",
                initials: "RS",
                type: "user"
            }
        ],
        chatHistory: [
            {
                role: "user",
                name: "Roberto Santos",
                department: "Logística",
                content: "As ordens de envio não estão chegando na transportadora. Há algum problema na integração?",
            },
            {
                role: "ai",
                content: "Olá Roberto! Detectei uma falha na conexão com a API da transportadora. Vou reestabelecer a conexão imediatamente.",
            },
            {
                role: "user",
                name: "Roberto Santos",
                department: "Logística",
                content: "Ótimo! Agora as ordens estão sendo enviadas corretamente. Problema resolvido!",
            }
        ]
    },
    {
        id: "4",
        number: "2025-CS123",
        department: "RH",
        title: "Acesso negado ao portal do colaborador",
        description: "Vários funcionários estão relatando erro de permissão ao tentar acessar o portal.",
        openedAt: "12:45",
        triage: "Não Resolvido",
        complexity: "N1",
        assignedTo: {
            name: "Rodrigo Campos",
            initials: "RC",
            cellphone: "(11) 96543-2109",
            email: "rodrigo.campos@empresa.com"
        },
        timeLine: [
            {
                id: "1",
                user: "Rodrigo Campos",
                action: "Em Investigação",
                date: "15 Jan",
                initials: "RC",
                type: "analyst"
            },
            {
                id: "2",
                user: "Analista N0 - IA",
                action: "Escalou para N1",
                date: "15 Jan",
                initials: "IA",
                type: "ai"
            },
            {
                id: "3",
                user: "Analista N0 - IA",
                action: "Recebeu Chamado",
                date: "15 Jan",
                initials: "IA",
                type: "ai"
            },
            {
                id: "4",
                user: "Ana Costa",
                action: "Abriu o Chamado",
                date: "15 Jan",
                initials: "AC",
                type: "user"
            }
        ],
        chatHistory: [
            {
                role: "user",
                name: "Ana Costa",
                department: "RH",
                content: "Vários funcionários estão com problema para acessar o portal. Aparece 'acesso negado'.",
            },
            {
                role: "ai",
                content: "Olá Ana! Identifiquei que múltiplos usuários estão enfrentando o mesmo problema. Parece ser uma questão de configuração de permissões. Vou escalar para nossa equipe especializada.",
            },
            {
                role: "user",
                name: "Ana Costa",
                department: "RH",
                content: "Ok, é urgente pois afeta toda a equipe. Quando teremos uma previsão de resolução?",
            },
            {
                role: "ai",
                content: "Estamos investigando as configurações do servidor. Previsão de resolução em até 2 horas. Manteremos você informada sobre o progresso.",
            }
        ]
    },
]
