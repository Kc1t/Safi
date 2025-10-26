"use client"

import type React from "react"
import { useEffect, useState, useRef } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, TicketIcon, Clock, User, MessageSquare, CheckCircle2, ArrowLeft, Paperclip, Zap, Building2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Topbar } from "@/components/topbar"
import ReactMarkdown from "react-markdown"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useClientWebSocketChat } from "@/hooks/use-client-websocket-chat"
import { useTicketStore } from "@/store/ticketStore"
import { AnimatePresence, motion } from "framer-motion"
import SafiBubble from "@/assets/ai/safi-bubble.png"
import BlobBg from "@/assets/backgrounds/blob-bg.png"
import Image from "next/image"
import { TicketWelcome } from "@/components/ticket-chat/ticket-welcome"
import { useRouter } from "next/navigation"

export default function ClientTicket() {
  const router = useRouter()
  const areas: Record<string, string> = {
    "recursos-humanos": "RH",
    ti: "TI",
    financeiro: "Financeiro",
    comercial: "Comercial",
    operacoes: "Operações",
  }

  const ticket = useTicketStore((state) => state.ticket)
  const messagesEndRef = useRef<HTMLDivElement | null>(null)

  // Buscar ticketId do localStorage
  const [ticketId, setTicketId] = useState<number | null>(null)
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const savedTicketId = localStorage.getItem('currentTicketId')
    if (savedTicketId) {
      setTicketId(parseInt(savedTicketId))
    }

    // Atualizar relógio a cada minuto
    const interval = setInterval(() => setCurrentTime(new Date()), 60000)
    return () => clearInterval(interval)
  }, [])

  const { input, messages, isLoading, handleInputChange, handleSubmit, setInput, isConnected } = useClientWebSocketChat(
    {
      nome: ticket.nome,
      email: ticket.contato,
      setor: ticket.setor,
      descricao: ticket.descricao
    },
    ticketId
  )

  const [awaitingFeedback, setAwaitingFeedback] = useState(false)

  // Verifica feedback
  useEffect(() => {
    if (messages.length > 0 && messages[messages.length - 1].role === "assistant") {
      const lastContent = messages[messages.length - 1].content.trim().toLowerCase()
      const feedbackPhrases = ["resolvido?", "**resolvido?**", "*resolvido?*", "isso resolveu seu problema?", "problema resolvido?"];
      if (feedbackPhrases.some(phrase => lastContent.toLowerCase().endsWith(phrase))) {
        setAwaitingFeedback(true)
      } else {
        setAwaitingFeedback(false)
      }
    } else {
      setAwaitingFeedback(false)
    }
  }, [messages])

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages, isLoading])


  const handleFeedback = (resolved: boolean) => {
    setAwaitingFeedback(false)

    if (!resolved) {
      setInput("Não resolveu meu problema, preciso de mais ajuda.")

      setTimeout(() => {
        const form = document.querySelector('form') as HTMLFormElement
        if (form) {
          const submitEvent = new Event('submit', { bubbles: true, cancelable: true })
          form.dispatchEvent(submitEvent)
        }
      }, 50)
    }

    if (resolved) {
      setInput("Resolveu meu problema, obrigado!")

      setTimeout(() => {
        const form = document.querySelector('form') as HTMLFormElement
        if (form) {
          const submitEvent = new Event('submit', { bubbles: true, cancelable: true })
          form.dispatchEvent(submitEvent)
        }
      }, 50)
    }

    // Exemplo: fetch('/api/feedback', { method: 'POST', body: JSON.stringify({ resolved }) })
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Topbar />
      <Image
        src={BlobBg || "/placeholder.svg"}
        className="object-fit absolute w-full h-full"
        alt="Blob Background"
      />
      <div
        className="relative z-[10] flex flex-col w-full max-w-3xl mx-auto border-0 md:border-1 rounded-lg my-2 bg-white overflow-hidden"
        style={{
          height: "calc(100vh - 60px)",
          maxHeight: "90vh",
        }}
      >
        {/* Enhanced Header */}
        <div className="border-b bg-white flex-shrink-0 shadow-sm">
          <div className="p-3 sm:p-4 space-y-3">
            {/* Top row - Back button + Ticket info */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push('/open-ticket')}
                  className="text-gray-600 hover:text-gray-900"
                >
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Voltar
                </Button>
                <div className="w-px h-5 bg-gray-300" />
                <div className="flex items-center gap-2">
                  <TicketIcon className="h-5 w-5 text-pink-600" />
                  <h2 className="text-lg font-semibold text-gray-900">
                    {ticketId ? `Ticket #${ticketId}` : 'Ticket #2025-CS123'}
                  </h2>
                </div>
              </div>
              
              {isConnected && (
                <div className="flex items-center gap-2 px-3 py-1 bg-green-50 rounded-full">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-xs font-medium text-green-700">Conectado</span>
                </div>
              )}
            </div>

            {/* Context row - Department, Status, Time */}
            <div className="flex items-center gap-3 flex-wrap">
              <Badge className="bg-pink-600 text-white border-0 hover:opacity-90">
                <Building2 className="h-3 w-3 mr-1" />
                {areas[ticket.setor] ?? ticket.setor}
              </Badge>
              <div className="flex items-center gap-1 text-xs text-gray-600">
                <Clock className="h-3 w-3" />
                <span>{currentTime.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                <Zap className="h-3 w-3" />
                <span className="font-medium">Aguardando resposta...</span>
              </div>
            </div>

            {/* Summary row - Ticket description */}
            <div className="bg-white/60 rounded-lg p-2 px-3 border border-gray-200">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-gray-500" />
                <p className="text-sm text-gray-700 line-clamp-1">
                  <span className="font-medium">Assunto:</span> {ticket.descricao.substring(0, 80)}...
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-3 overflow-y-auto">
          <div className="space-y-6">
            {messages.length === 0 ? (
              <TicketWelcome />
            ) : (
              <AnimatePresence>
                {messages.map((message, index) => (
                  <motion.div
                    key={message.id}
                    className={`flex gap-3 w-full ${message.role === "system" ? "justify-center" : message.role === "user" ? "justify-end" : "justify-start"}`}
                    initial={{ opacity: 0, y: 20, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.8 }}
                    transition={{
                      type: "spring",
                      stiffness: 500,
                      damping: 30,
                      delay: index * 0.1,
                    }}
                  >
                    {message.role === "system" ? (
                      <div className="flex flex-col items-center w-full">
                        <motion.div className="rounded-2xl px-4 py-2 bg-gray-100 text-gray-600 text-sm italic text-center max-w-[90%]">
                          {message.content}
                        </motion.div>
                      </div>
                    ) : (
                      <>
                        {message.role === "assistant" && (
                          <motion.div
                            className="flex-shrink-0 self-start mt-1"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2 }}
                          >
                            <div className="relative w-8 h-8 cursor-pointer transition-all duration-300 hover:scale-95">
                              <Image
                                src={SafiBubble || "/placeholder.svg"}
                                className="object-cover w-full h-full"
                                alt="Safi Bubble"
                              />
                            </div>
                          </motion.div>
                        )}

                        <div className="flex flex-col max-w-[85%] sm:max-w-[75%]">
                          <motion.div
                            className={`rounded-2xl px-4 py-3 shadow-sm ${
                              message.role === "user"
                                ? "bg-[#e91e63] text-white ml-auto"
                                : message.role === "assistant"
                                ? "bg-white text-gray-900 border border-gray-200"
                                : message.role === "analyst"
                                ? "bg-amber-50 text-amber-900 border-2 border-amber-200"
                                : "bg-gray-50 text-gray-700 border border-gray-200"
                            }`}
                          >
                            <motion.div
                              className="prose prose-sm max-w-none text-sm leading-relaxed"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.1 }}
                            >
                              <ReactMarkdown
                                components={{
                                  a: ({ href, children }) => (
                                    <a
                                      href={href}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className={message.role === "user" ? "text-white/90 underline" : "text-[#DF1463] underline hover:opacity-80 transition"}
                                    >
                                      {children}
                                    </a>
                                  ),
                                }}
                              >
                                {message.content}
                              </ReactMarkdown>
                            </motion.div>
                            <div className={`flex items-center justify-between mt-2 text-xs ${message.role === "user" ? "text-white/70" : "text-gray-500"}`}>
                              <span className="font-medium">
                                {message.role === "user" 
                                  ? "Você" 
                                  : message.role === "assistant" 
                                    ? "🤖 Safi Assistente" 
                                    : message.role === "analyst"
                                      ? "👨‍💼 Analista"
                                      : "ℹ️ Sistema"}
                              </span>
                              <span className="ml-2">{new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                          </motion.div>

                      {message.role === "assistant" && index === messages.length - 1 && awaitingFeedback && (
                        <motion.div
                          className="flex flex-wrap gap-1 mt-2"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                        >
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-pink-600 border-pink-200 hover:bg-pink-50 hover:text-pink-700 text-xs h-7"
                            onClick={() => handleFeedback(false)}
                            id="ticket-feedback-no"
                          >
                            Não Resolveu
                          </Button>
                          <Button
                            size="sm"
                            className="bg-[#e91e63] hover:bg-[#d81b60] text-xs h-7"
                            onClick={() => handleFeedback(true)}
                            id="ticket-feedback-yes"
                          >
                            Resolveu Meu Problema
                          </Button>
                        </motion.div>
                      )}
                    </div>
                      </>
                    )}
                </motion.div>
                ))}
              </AnimatePresence>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Enhanced Input Area */}
        <motion.div
          className="border-t bg-white p-3 flex-shrink-0 shadow-lg"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {!awaitingFeedback && (
            <div className="mb-2 flex items-center gap-2 text-xs text-gray-500">
              <User className="h-3 w-3" />
              <span>Conectado como: {ticket.nome}</span>
            </div>
          )}
          <form onSubmit={handleSubmit} className="flex items-end gap-2">
            <div className="flex-1 relative">
              <Input
                value={input}
                onChange={handleInputChange}
                placeholder={awaitingFeedback ? "Aguardando sua resposta..." : "Digite sua mensagem aqui..."}
                className="min-h-[44px] pr-12 bg-white border-2 border-gray-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-100 rounded-xl text-[#252525] placeholder:text-gray-400 py-3 text-sm resize-none"
                disabled={isLoading || awaitingFeedback}
                id="ticket-input"
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 text-gray-400 hover:text-pink-600"
                disabled={awaitingFeedback}
              >
                <Paperclip className="h-4 w-4" />
              </Button>
            </div>
            <Button
              type="submit"
              size="lg"
              id="ticket-submit-button"
              className="bg-[#e91e63] hover:bg-[#d81b60] text-white border-0 rounded-xl h-11 px-6 shadow-lg hover:shadow-xl transition-all duration-200 flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              disabled={isLoading || !input.trim() || awaitingFeedback}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Enviando...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Send className="h-4 w-4" />
                  <span>Enviar</span>
                </div>
              )}
            </Button>
          </form>
        </motion.div>
      </div>
    </div>
  )
}

