export type Mensagem = {
    role: 'user' | 'ai';
    content: string;
};

export interface ChatInput {
    nome: string;
    email: string;
    setor: string;
    historico: Mensagem[];
}

export function generateSupportPrompt(input: ChatInput): string {
    const header = `
Gere um report do tipo para um analistas de suporte desse tipo de forma aleatória = Você iniciou o expediente com boa responsividade às solicitações de atendimento. 

O tempo médio de resposta nos primeiros tickets foi satisfatório (média de 3m20s), porém observou-se uma leve queda de rendimento a partir das 10h15, possivelmente devido à sobrecarga momentânea de chamados simultâneos.

Seu índice de resolução no primeiro contato está em 76%, o que está dentro da meta mínima, mas ainda há margem para otimização. 
  `;
    const historico = input.historico
        .map((msg) => `${msg.role === 'user' ? 'Usuário' : 'IA'}: ${msg.content}`)
        .join('\n');

    return `${header}\n\nHistórico:\n${historico}\n\nIA:`;
}
