export type Mensagem = {
    role: 'user' | 'ai';
    content: string;
};

export interface ChatInput {
    nome: string;
    telefone: string;
    email: string;
    setor: string;
    historico: Mensagem[]; 
}

export function gerarPromptSafi(input: ChatInput): string {
    const header = `
Você é um atendente virtual especialista em suporte técnico da NeoPharma, utilizando o sistema SAFI.
Regras:
- Responda de forma clara e direta.
- Escalone para N1/N2/N3 se necessário.
- Priorize setores com base no peso: Qualidade (5), Pronto Atendimento (4), TI/Produção (3), Logística (2), Admin/Marketing/Comercial (1).
- Não repita mensagens antigas nem explique seu papel.

Solicitante:
Nome: ${input.nome}
Telefone: ${input.telefone}
Email: ${input.email}
Setor: ${input.setor}
`;

    const historico = input.historico
        .map((msg) => `${msg.role === 'user' ? 'Usuário' : 'IA'}: ${msg.content}`)
        .join('\n');

    return `${header}\n\nHistórico:\n${historico}\n\nIA:`;
}
