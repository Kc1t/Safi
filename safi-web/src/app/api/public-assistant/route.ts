import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';
import { Mensagem } from '@/lib/prompts/ai-chat';
import { generateLandingPrompt } from '@/lib/prompts/ai-landing';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(request: Request) {
    try {
        const { historico }: { historico?: Mensagem[] } = await request.json();
        const prompt = generateLandingPrompt(historico ?? []);

        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text().trim();

        const novaResposta: Mensagem = { role: 'ai', content: text };
        const novoHistorico = [...(historico ?? []), novaResposta];

        return NextResponse.json({ result: text, historico: novoHistorico });
    } catch (error) {
        console.error('Erro na IA:', error);
        return NextResponse.json(
            { error: 'Erro ao processar a requisição' },
            { status: 500 }
        );
    }
}
