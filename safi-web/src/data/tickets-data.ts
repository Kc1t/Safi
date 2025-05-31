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
        avatarNumber?: number
    }
    requester?: {
        name?: string
        initials?: string
        cellphone?: string
        email?: string
        avatarNumber?: number
    }
    timeLine?: {
        id: string
        user: string
        action: string
        date: string
        initials: string
        type: 'user' | 'ai' | 'analyst'
        avatarNumber?: number
    }[]
    aiDescription?: string
    chatHistory?: {
        role: 'user' | 'ai' | 'analyst'
        name?: string
        department?: string
        content?: string
        time?: string
        avatarNumber?: number
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
            email: "leticia.rocha@empresa.com",
            avatarNumber: 1
        },
        requester: {
            name: "Giovanna Silva",
            initials: "GS",
            cellphone: "(11) 91234-5678",
            email: "giovanna.silva@empresa.com",
            avatarNumber: 2
        },
        timeLine: [
            {
                id: "1",
                user: "Leticia Rocha",
                action: "Em Análise",
                date: "15 Jan",
                initials: "LR",
                type: "analyst",
                avatarNumber: 1
            },
            {
                id: "2",
                user: "Analista N0 - IA",
                action: "Escalou para N1 - Após 5 tentativas",
                date: "15 Jan",
                initials: "IA",
                type: "ai"
            },
            {
                id: "3",
                user: "Analista N0 - IA",
                action: "5ª Tentativa - Falhou",
                date: "15 Jan",
                initials: "IA",
                type: "ai"
            },
            {
                id: "4",
                user: "Analista N0 - IA",
                action: "4ª Tentativa - Falhou",
                date: "15 Jan",
                initials: "IA",
                type: "ai"
            },
            {
                id: "5",
                user: "Analista N0 - IA",
                action: "3ª Tentativa - Falhou",
                date: "15 Jan",
                initials: "IA",
                type: "ai"
            },
            {
                id: "6",
                user: "Analista N0 - IA",
                action: "2ª Tentativa - Falhou",
                date: "15 Jan",
                initials: "IA",
                type: "ai"
            },
            {
                id: "7",
                user: "Analista N0 - IA",
                action: "1ª Tentativa - Falhou",
                date: "15 Jan",
                initials: "IA",
                type: "ai"
            },
            {
                id: "8",
                user: "Analista N0 - IA",
                action: "Recebeu Chamado",
                date: "15 Jan",
                initials: "IA",
                type: "ai"
            },
            {
                id: "9",
                user: "Giovanna Silva",
                action: "Abriu o Chamado",
                date: "15 Jan",
                initials: "MS",
                type: "user",
                avatarNumber: 2
            }
        ],
        chatHistory: [
            {
                role: "user",
                name: "Giovanna Silva",
                department: "RH",
                content: "Olá, meu computador não liga após a atualização de ontem. Aparece uma tela azul.",
                avatarNumber: 2
            },
            {
                role: "ai",
                content: "Olá Giovanna! Entendi que seu computador apresenta tela azul após a atualização. Vou conectar você com nossa analista Leticia. Enquanto isso, você pode tentar desligar completamente o equipamento por 30 segundos?",
            },
            {
                role: "user",
                name: "Giovanna Silva",
                department: "RH",
                content: "Tentei isso mas não funcionou. O problema persiste.",
            },
            {
                role: "analyst",
                name: "Leticia Rocha",
                content: "Olá Giovanna, recebi seu chamado. Vou analisar o problema da tela azul após a atualização.",
                avatarNumber: 1
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
        requester: {
            name: "Carlos Pereira",
            initials: "CP",
            cellphone: "(11) 92345-6789",
            email: "carlos.pereira@empresa.com",
            avatarNumber: 3
        },
        timeLine: [
            {
                id: "1",
                user: "Analista N0 - IA",
                action: "Resolveu Chamado - 2ª Tentativa",
                date: "14 Jan",
                initials: "IA",
                type: "ai"
            },
            {
                id: "2",
                user: "Analista N0 - IA",
                action: "1ª Tentativa - Falhou",
                date: "14 Jan",
                initials: "IA",
                type: "ai"
            },
            {
                id: "3",
                user: "Analista N0 - IA",
                action: "Recebeu Chamado",
                date: "14 Jan",
                initials: "IA",
                type: "ai"
            },
            {
                id: "4",
                user: "Carlos Pereira",
                action: "Abriu o Chamado",
                date: "14 Jan",
                initials: "CP",
                type: "user",
                avatarNumber: 3
            }
        ],
        chatHistory: [
            {
                role: "user",
                name: "Carlos Pereira",
                department: "Financeiro",
                content: "O CRM está muito lento hoje, demora mais de 2 minutos para carregar.",
                avatarNumber: 3
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
                avatarNumber: 3
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
        requester: {
            name: "Roberto Santos",
            initials: "RS",
            cellphone: "(11) 93456-7890",
            email: "roberto.santos@empresa.com",
            avatarNumber: 4
        },
        timeLine: [
            {
                id: "1",
                user: "Analista N0 - IA",
                action: "Resolveu Chamado - 1ª Tentativa",
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
                type: "user",
                avatarNumber: 4
            }
        ],
        chatHistory: [
            {
                role: "user",
                name: "Roberto Santos",
                department: "Logística",
                content: "As ordens de envio não estão chegando na transportadora. Há algum problema na integração?",
                avatarNumber: 4
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
                avatarNumber: 4
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
            email: "rodrigo.campos@empresa.com",
            avatarNumber: 5
        },
        requester: {
            name: "Ana Costa",
            initials: "AC",
            cellphone: "(11) 97654-3210",
            email: "ana.costa@empresa.com",
            avatarNumber: 1
        },
        timeLine: [
            {
                id: "1",
                user: "Rodrigo Campos",
                action: "Em Investigação",
                date: "15 Jan",
                initials: "RC",
                type: "analyst",
                avatarNumber: 5
            },
            {
                id: "2",
                user: "Analista N0 - IA",
                action: "Escalou para N1 - Após 5 tentativas",
                date: "15 Jan",
                initials: "IA",
                type: "ai"
            },
            {
                id: "3",
                user: "Analista N0 - IA",
                action: "5ª Tentativa - Falhou",
                date: "15 Jan",
                initials: "IA",
                type: "ai"
            },
            {
                id: "4",
                user: "Analista N0 - IA",
                action: "4ª Tentativa - Falhou",
                date: "15 Jan",
                initials: "IA",
                type: "ai"
            },
            {
                id: "5",
                user: "Analista N0 - IA",
                action: "3ª Tentativa - Falhou",
                date: "15 Jan",
                initials: "IA",
                type: "ai"
            },
            {
                id: "6",
                user: "Analista N0 - IA",
                action: "2ª Tentativa - Falhou",
                date: "15 Jan",
                initials: "IA",
                type: "ai"
            },
            {
                id: "7",
                user: "Analista N0 - IA",
                action: "1ª Tentativa - Falhou",
                date: "15 Jan",
                initials: "IA",
                type: "ai"
            },
            {
                id: "8",
                user: "Analista N0 - IA",
                action: "Recebeu Chamado",
                date: "15 Jan",
                initials: "IA",
                type: "ai"
            },
            {
                id: "9",
                user: "Ana Costa",
                action: "Abriu o Chamado",
                date: "15 Jan",
                initials: "AC",
                type: "user",
                avatarNumber: 1
            }
        ],
        chatHistory: [
            {
                role: "user",
                name: "Ana Costa",
                department: "RH",
                content: "Vários funcionários estão com problema para acessar o portal. Aparece 'acesso negado'.",
                avatarNumber: 1
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
                avatarNumber: 1
            },
            {
                role: "ai",
                content: "Estamos investigando as configurações do servidor. Previsão de resolução em até 2 horas. Manteremos você informada sobre o progresso.",
            }
        ]
    },
]
