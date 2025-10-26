"use client"

import { useState, useEffect } from "react"
import {
    ChevronDown,
    Search,
    Sparkles,
    Bot,
    Loader2,
    AlertCircle,
    CheckCircle2,
    Clock,
    BarChart3
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface FAQItem {
    pergunta: string
    resposta: string
    category?: string
    ticketCount?: number
}

interface FAQGeneralResponse {
    success: boolean
    data: FAQItem[]
    generatedAt: string
    totalQuestions: number
    message: string | null
}

interface FAQTicketsResponse extends FAQGeneralResponse {
    analysisMetadata?: {
        ticketsAnalyzed: number
        dateRangeStart: string
        dateRangeEnd: string
        categoriesFound: number
    }
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5080"

// Dados de fallback quando API estiver offline
const FALLBACK_GENERAL_FAQ: FAQItem[] = [
    {
        pergunta: "Como criar um ticket no SAFI?",
        resposta: "Para criar um ticket, acesse a seção 'Novo Ticket' na plataforma SAFI. Preencha os campos obrigatórios como título, descrição detalhada do problema e, se aplicável, anexe arquivos relevantes. Após o preenchimento, clique em 'Enviar' para que o ticket seja registrado e direcionado ao nível de suporte adequado."
    },
    {
        pergunta: "Como funciona a escalação automática de tickets no SAFI?",
        resposta: "A escalação automática ocorre quando um ticket não é resolvido dentro do prazo estabelecido em um determinado nível de suporte. O SAFI, baseado em regras pré-definidas e no tempo de resposta, move o ticket para o próximo nível (N1 para N2, N2 para N3), garantindo que o problema seja tratado por analistas com maior especialização."
    },
    {
        pergunta: "Quais as diferenças entre os níveis de suporte N1, N2 e N3?",
        resposta: "O nível N1 é o primeiro ponto de contato, focado em resolver problemas comuns e coletar informações. O nível N2 trata de questões mais complexas que exigem conhecimento técnico aprofundado. O nível N3 é reservado para os casos mais críticos e que demandam expertise especializada, muitas vezes envolvendo desenvolvimento ou engenharia."
    },
    {
        pergunta: "Como utilizar o chat em tempo real com os analistas do SAFI?",
        resposta: "Para iniciar um chat, acesse seu ticket aberto e procure pelo botão 'Chat ao Vivo' ou similar. Ao clicar, você será conectado a um analista disponível para uma conversa em tempo real, facilitando a resolução rápida de dúvidas e a troca de informações."
    },
    {
        pergunta: "O SAFI é seguro? Como funciona a autenticação?",
        resposta: "Sim, o SAFI utiliza autenticação segura via JWT (JSON Web Tokens). Isso garante que apenas usuários autorizados acessem a plataforma e seus dados, protegendo suas informações e o histórico de tickets contra acessos não autorizados."
    },
    {
        pergunta: "Como a inteligência artificial (IA) ajuda na análise dos tickets?",
        resposta: "A IA do SAFI analisa o conteúdo dos tickets, identificando padrões, categorizando problemas e extraindo informações relevantes. Isso auxilia os analistas a entenderem mais rapidamente a natureza do chamado e a encontrarem soluções mais eficientes."
    },
    {
        pergunta: "Como o SAFI prioriza automaticamente os chamados?",
        resposta: "A priorização automática é baseada em fatores como a urgência reportada pelo usuário, a criticidade do serviço afetado e o histórico de problemas similares. O SAFI utiliza algoritmos para atribuir uma prioridade (alta, média, baixa) que orienta a ordem de atendimento."
    },
    {
        pergunta: "Posso acompanhar o status do meu ticket no SAFI?",
        resposta: "Sim, você pode acompanhar o status do seu ticket a qualquer momento. Acesse a área de 'Meus Tickets' na plataforma SAFI, onde estará visível o progresso atual, quem é o analista responsável e as últimas atualizações sobre a resolução do seu chamado."
    }
]

const FALLBACK_TICKETS_FAQ: FAQItem[] = [
    {
        pergunta: "Como resolver problemas de acesso ao sistema?",
        resposta: "Problemas de acesso são uma das questões mais comuns. Primeiro, verifique suas credenciais e tente limpar o cache do navegador. Se o problema persistir, entre em contato com o suporte técnico informando seu setor e o horário da tentativa de acesso.",
        category: "Acesso ao Sistema",
        ticketCount: 45
    },
    {
        pergunta: "O que fazer quando o sistema está lento?",
        resposta: "Sistemas lentos podem ser causados por vários fatores. Verifique sua conexão com a internet, feche outras abas pesadas do navegador e tente acessar novamente. Se a lentidão persistir, registre um ticket informando o horário e as ações realizadas.",
        category: "Performance",
        ticketCount: 38
    },
    {
        pergunta: "Como recuperar senha esquecida?",
        resposta: "Para recuperar sua senha, acesse a página de login e clique em 'Esqueci minha senha'. Um e-mail será enviado com as instruções para redefinir sua senha. Se não receber o e-mail, verifique a pasta de spam ou entre em contato com o suporte.",
        category: "Autenticação",
        ticketCount: 32
    },
    {
        pergunta: "Como anexar arquivos em um ticket?",
        resposta: "Ao criar ou editar um ticket, você encontrará uma área específica para anexar arquivos. Clique em 'Anexar' e selecione os arquivos desejados. Formatos aceitos incluem PDF, DOC, DOCX, PNG, JPG e ZIP, com limite de tamanho de 10MB por arquivo.",
        category: "Funcionalidades",
        ticketCount: 28
    },
    {
        pergunta: "Como acompanhar o status de meu ticket?",
        resposta: "Para acompanhar seu ticket, acesse a área 'Meus Tickets' no painel principal. Lá você verá uma lista com todos os seus chamados abertos, incluindo status atual, prioridade e o analista responsável. Clique em um ticket específico para ver detalhes completos.",
        category: "Acompanhamento",
        ticketCount: 25
    },
    {
        pergunta: "O que significa cada status de ticket?",
        resposta: "Aberto: ticket registrado aguardando análise. Em Andamento: analista atribuído trabalhando na resolução. Aguardando Usuário: necessidade de informações adicionais. Resolvido: problema solucionado. Fechado: ticket finalizado após confirmação do usuário.",
        category: "Informações Gerais",
        ticketCount: 22
    },
    {
        pergunta: "Como priorizar corretamente meu ticket?",
        resposta: "A prioridade deve refletir o impacto no seu trabalho. Urgente: sistema inoperante impedindo trabalho essencial. Alta: problema significativo afetando produtividade. Média: problema moderado com contorno disponível. Baixa: melhoria ou dúvida operacional não urgente.",
        category: "Priorização",
        ticketCount: 19
    },
    {
        pergunta: "Posso reabrir um ticket já fechado?",
        resposta: "Sim, você pode reabrir um ticket fechado se o problema não foi completamente resolvido ou retornou. Acesse 'Meus Tickets', encontre o ticket fechado e clique em 'Reabrir'. Descreva a situação para que o analista possa retomar o atendimento.",
        category: "Gestão de Tickets",
        ticketCount: 16
    }
]

export default function FAQSection() {
    const [activeTab, setActiveTab] = useState<'general' | 'tickets'>('general')
    const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())
    const [searchQuery, setSearchQuery] = useState('')
    const [loading, setLoading] = useState(false)
    const [loadingGeneral, setLoadingGeneral] = useState(false)
    const [loadingTickets, setLoadingTickets] = useState(false)
    const [generalFAQ, setGeneralFAQ] = useState<FAQItem[]>([])
    const [ticketsFAQ, setTicketsFAQ] = useState<FAQItem[]>([])
    const [error, setError] = useState<string | null>(null)
    const [hasGeneratedGeneral, setHasGeneratedGeneral] = useState(false)
    const [hasGeneratedTickets, setHasGeneratedTickets] = useState(false)
    const [analysisMetadata, setAnalysisMetadata] = useState<FAQTicketsResponse['analysisMetadata'] | null>(null)

    const loadGeneralFAQ = async () => {
        if (hasGeneratedGeneral) return // Já carregado

        setLoadingGeneral(true)
        setError(null)

        try {
            const response = await fetch(`${API_BASE_URL}/api/faq/generate-general`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ numberOfQuestions: 8 })
            })

            if (!response.ok) {
                if (response.status === 0) {
                    throw new Error(`Servidor não disponível. Verifique se o backend está rodando em ${API_BASE_URL}`)
                }
                throw new Error('Erro ao gerar FAQ geral')
            }

            const data: FAQGeneralResponse = await response.json()

            if (data.success && data.data) {
                setGeneralFAQ(data.data)
                setHasGeneratedGeneral(true)
            } else {
                throw new Error(data.message || 'Erro desconhecido')
            }
        } catch (err: any) {
            console.error('Erro ao carregar FAQ geral:', err)
            
            // Usar dados de fallback em caso de erro
            setGeneralFAQ(FALLBACK_GENERAL_FAQ)
            setHasGeneratedGeneral(true)
            
            if (err.message?.includes('CORS') || err.message?.includes('network')) {
                setError('Usando dados offline. Verifique sua conexão e se o backend está rodando.')
            } else {
                setError(err.message || 'Usando dados de fallback.')
            }
        } finally {
            setLoadingGeneral(false)
        }
    }

    const loadTicketsFAQ = async () => {
        if (hasGeneratedTickets) return // Já carregado

        setLoadingTickets(true)
        setError(null)

        try {
            const response = await fetch(`${API_BASE_URL}/api/faq/generate-from-tickets`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    numberOfQuestions: 8,
                    daysToAnalyze: 30,
                    minOccurrences: 2
                })
            })

            if (!response.ok) {
                if (response.status === 0) {
                    throw new Error(`Servidor não disponível. Verifique se o backend está rodando em ${API_BASE_URL}`)
                }

                const errorData = await response.json().catch(() => ({}))
                throw new Error(errorData.message || 'Erro ao gerar FAQ de tickets')
            }

            const data: FAQTicketsResponse = await response.json()

            if (data.success && data.data) {
                setTicketsFAQ(data.data)
                setHasGeneratedTickets(true)
                setAnalysisMetadata(data.analysisMetadata || null)
            } else {
                throw new Error(data.message || 'Erro desconhecido')
            }
        } catch (err: any) {
            console.error('Erro ao carregar FAQ de tickets:', err)
            
            // Usar dados de fallback em caso de erro
            setTicketsFAQ(FALLBACK_TICKETS_FAQ)
            setHasGeneratedTickets(true)
            
            if (err.message?.includes('CORS') || err.message?.includes('network')) {
                setError('Usando dados offline. Verifique sua conexão e se o backend está rodando.')
            } else if (err.message?.includes('tickets')) {
                setError('Usando dados de fallback para análise de tickets.')
            } else {
                setError(err.message || 'Usando dados de fallback.')
            }
        } finally {
            setLoadingTickets(false)
        }
    }

    const currentFAQ = activeTab === 'general' ? generalFAQ : ticketsFAQ

    const filteredFAQ = searchQuery.trim()
        ? currentFAQ.filter(
            item =>
                item.pergunta.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.resposta.toLowerCase().includes(searchQuery.toLowerCase())
        )
        : currentFAQ

    const toggleExpand = (index: number) => {
        setExpandedItems(prev => {
            const newSet = new Set(prev)
            const key = `${activeTab}-${index}`
            if (newSet.has(key)) {
                newSet.delete(key)
            } else {
                newSet.add(key)
            }
            return newSet
        })
    }

    const isExpanded = (index: number) => expandedItems.has(`${activeTab}-${index}`)

    // Prefetch: carregar ambas as FAQs ao montar o componente
    useEffect(() => {
        // Carregar ambas em paralelo
        if (!hasGeneratedGeneral && !loadingGeneral) {
            loadGeneralFAQ()
        }
        if (!hasGeneratedTickets && !loadingTickets) {
            loadTicketsFAQ()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // Atualizar loading geral baseado nas loadings individuais
    useEffect(() => {
        setLoading(loadingGeneral || loadingTickets)
    }, [loadingGeneral, loadingTickets])

    return (
        <section className="w-full relative" id="faq">
            <div className="container mx-auto max-w-6xl px-4">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <div className="p-2 bg-gradient-to-br from-[#DF1463] to-pink-600 rounded-xl shadow-lg">
                            <Bot className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-sm font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#DF1463] to-pink-600">
                            Safi AI
                        </span>
                    </div>
                    <h2 className="text-3xl md:text-5xl font-bold mb-3 text-gray-900">
                        Perguntas Frequentes
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Encontre respostas rápidas sobre o sistema SAFI
                    </p>
                </div>

                {/* Search Bar */}
                <div className="mb-8 max-w-2xl mx-auto">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Buscar no FAQ..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#DF1463] focus:border-transparent transition-all"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                ✕
                            </button>
                        )}
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex justify-center mb-6 gap-2 flex-wrap">
                    <button
                        onClick={() => setActiveTab('general')}
                        className={`
              flex items-center gap-2 px-6 py-3 font-semibold rounded-lg transition-all duration-200
              ${activeTab === 'general'
                                ? 'bg-gradient-to-r from-[#DF1463] to-pink-600 text-white shadow-lg transform scale-105'
                                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                            }
            `}
                    >
                        <Sparkles className="w-4 h-4" />
                        <span>FAQ Geral</span>
                        {generalFAQ.length > 0 && (
                            <span className={`ml-1 px-2 py-0.5 text-xs rounded-full ${activeTab === 'general'
                                ? 'bg-white/20 text-white'
                                : 'bg-gray-100 text-gray-600'
                                }`}>
                                {generalFAQ.length}
                            </span>
                        )}
                    </button>

                    <button
                        onClick={() => setActiveTab('tickets')}
                        className={`
              flex items-center gap-2 px-6 py-3 font-semibold rounded-lg transition-all duration-200
              ${activeTab === 'tickets'
                                ? 'bg-gradient-to-r from-[#DF1463] to-pink-600 text-white shadow-lg transform scale-105'
                                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                            }
            `}
                    >
                        <BarChart3 className="w-4 h-4" />
                        <span>FAQ de Tickets</span>
                        {ticketsFAQ.length > 0 && (
                            <span className={`ml-1 px-2 py-0.5 text-xs rounded-full ${activeTab === 'tickets'
                                ? 'bg-white/20 text-white'
                                : 'bg-gray-100 text-gray-600'
                                }`}>
                                {ticketsFAQ.length}
                            </span>
                        )}
                    </button>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="flex flex-col items-center justify-center py-16">
                        <Loader2 className="w-12 h-12 text-[#DF1463] animate-spin mb-4" />
                        <p className="text-gray-600">IA está gerando as buscando perguntas frequentes...</p>
                    </div>
                )}

                {/* Error State */}
                {error && !loading && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-6 flex items-start gap-3">
                        <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                            <h3 className="font-semibold text-red-900 mb-1">Erro ao carregar FAQ</h3>
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                        <button
                            onClick={() => activeTab === 'general' ? loadGeneralFAQ() : loadTicketsFAQ()}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                        >
                            Tentar novamente
                        </button>
                    </div>
                )}

                {/* FAQ Items */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-4"
                    >
                        {filteredFAQ.length > 0 ? (
                            filteredFAQ.map((item, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: index * 0.05 }}
                                    className={`
                    bg-white rounded-xl border transition-all duration-300
                    ${isExpanded(index)
                                            ? 'shadow-lg border-pink-200'
                                            : 'hover:shadow-md border-gray-200 hover:border-pink-300'
                                        }
                  `}
                                >
                                    <button
                                        onClick={() => toggleExpand(index)}
                                        className="w-full px-6 py-5 flex items-start justify-between text-left"
                                    >
                                        <div className="flex-1 pr-4">
                                            <div className="flex items-center gap-2 mb-2">
                                                <h3 className={`font-semibold transition-colors ${isExpanded(index)
                                                    ? 'text-transparent bg-clip-text bg-gradient-to-r from-[#DF1463] to-pink-600'
                                                    : 'text-gray-900'
                                                    }`}>
                                                    {item.pergunta}
                                                </h3>

                                            </div>
                                            {!isExpanded(index) && (
                                                <p className="text-sm text-gray-600 line-clamp-1">
                                                    {item.resposta}
                                                </p>
                                            )}
                                        </div>
                                        <ChevronDown
                                            className={`
                        w-5 h-5 transition-all duration-300 flex-shrink-0 mt-0.5
                        ${isExpanded(index)
                                                    ? 'rotate-180 text-[#DF1463]'
                                                    : 'text-gray-400'
                                                }
                      `}
                                        />
                                    </button>

                                    {/* Expanded Content */}
                                    <AnimatePresence>
                                        {isExpanded(index) && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.3 }}
                                                className="overflow-hidden"
                                            >
                                                <div className="px-6 pb-5 border-t border-gray-100 pt-4">
                                                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                                                        {item.resposta}
                                                    </p>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            ))
                        ) : (
                            !loading && (
                                <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
                                    <AlertCircle className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                                    <p className="text-gray-900 font-semibold text-lg">
                                        {searchQuery ? 'Nenhuma pergunta encontrada' : 'Nenhuma pergunta gerada'}
                                    </p>
                                    <p className="text-sm text-gray-600 mt-2">
                                        {searchQuery
                                            ? 'Tente ajustar sua busca'
                                            : activeTab === 'general'
                                                ? 'FAQ geral em breve...'
                                                : 'FAQ de tickets em breve...'
                                        }
                                    </p>
                                </div>
                            )
                        )}
                    </motion.div>
                </AnimatePresence>

                {/* Analysis Metadata */}
                {analysisMetadata && activeTab === 'tickets' && ticketsFAQ.length > 0 && (
                    <div className="mt-8 bg-gradient-to-br from-white via-pink-50/50 to-blue-50/50 rounded-xl border border-pink-200/50 p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <CheckCircle2 className="w-5 h-5 text-green-600" />
                            <h3 className="font-bold text-gray-900">Análise Completa</h3>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                                <p className="text-gray-600">Tickets analisados</p>
                                <p className="text-xl font-bold text-[#DF1463]">{analysisMetadata.ticketsAnalyzed}</p>
                            </div>
                            <div>
                                <p className="text-gray-600">Período</p>
                                <p className="text-xl font-bold text-gray-900">
                                    {new Date(analysisMetadata.dateRangeStart).toLocaleDateString('pt-BR')}
                                </p>
                            </div>
                            <div>
                                <p className="text-gray-600">Até</p>
                                <p className="text-xl font-bold text-gray-900">
                                    {new Date(analysisMetadata.dateRangeEnd).toLocaleDateString('pt-BR')}
                                </p>
                            </div>
                            <div>
                                <p className="text-gray-600">Categorias</p>
                                <p className="text-xl font-bold text-[#DF1463]">{analysisMetadata.categoriesFound}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Footer Stats */}
                <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm">
                    <div className="flex items-center gap-2 px-4 py-2 bg-[#DF1463]/5 rounded-full border border-[#DF1463]/20">
                        <Sparkles className="w-4 h-4 text-[#DF1463]/70" />
                        <span>
                            <strong className="text-gray-900">{currentFAQ.length}</strong>
                            <span className="text-gray-500"> perguntas</span>
                        </span>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 bg-[#DF1463]/5 rounded-full border border-[#DF1463]/20">
                        <Bot className="w-4 h-4 text-[#DF1463]/70" />
                        <span>
                            <strong className="text-gray-900">IA</strong>
                            <span className="text-gray-500"> Powered</span>
                        </span>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 bg-[#DF1463]/5 rounded-full border border-[#DF1463]/20">
                        <CheckCircle2 className="w-4 h-4 text-[#DF1463]/70" />
                        <span>
                            <strong className="text-gray-900">LGPD</strong>
                            <span className="text-gray-500"> Compliant</span>
                        </span>
                    </div>
                </div>
            </div>
        </section>
    )
}

