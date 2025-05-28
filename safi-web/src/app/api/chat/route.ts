import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';
import { generateSupportPrompt, Mensagem } from '@/lib/prompts/ai-chat';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

interface InputPayload {
    nome: string;
    telefone: string;
    email: string;
    setor: string;
    historico: Mensagem[];
}

export async function POST(request: Request) {
    try {
        const data = await request.json() as InputPayload;

        const historicoLimpo = data.historico;
        const prompt = generateSupportPrompt({ ...data, historico: historicoLimpo });

        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text().trim();

        const novaResposta: Mensagem = { role: 'ai', content: text };
        const novoHistorico = [...historicoLimpo, novaResposta];

        return NextResponse.json({ result: text, historico: novoHistorico });
    } catch (error) {
        console.error('Erro na IA:', error);
        return NextResponse.json(
            { error: 'Erro ao processar a requisição' },
            { status: 500 }
        );
    }
}
