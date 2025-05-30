


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
        date: string
        time: string
        status: string
        description?: string
        solved?: boolean
        assignedTo?: {
            name: string
            initials: string
        }
    }
    aiDescription?: string
    chatHistory?: {
        role: 'user' | 'ai' | 'analyst'
        content: string
    }
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
        },
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
            name: "João Pedro",
            initials: "JP",
        },
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
            name: "Carla Mendes",
            initials: "CM",
        },
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
        },
    },
]
