"use client"

import type React from "react"
import { useEffect, useState, useRef } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Topbar } from "@/components/topbar"
import ReactMarkdown from "react-markdown"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useTicketChat } from "@/hooks/ticket-chat"
import { useTicketStore } from "@/store/ticketStore"
import { useAutoSubmitMessage } from "@/hooks/use-auto-submit-message"
import { AnimatePresence, motion } from "framer-motion"
import SafiBubble from "@/assets/ai/safi-bubble.png"
import BlobBg from "@/assets/backgrounds/blob-bg.png"
import Image from "next/image"

export default function ClientTicket() {
  const areas: Record<string, string> = {
    "recursos-humanos": "RH",
    ti: "TI",
    financeiro: "Financeiro",
    comercial: "Comercial",
    operacoes: "Operações",
  }

  const ticket = useTicketStore((state) => state.ticket)
  const messagesEndRef = useRef<HTMLDivElement | null>(null)

  const { input, messages, isLoading, handleInputChange, handleSubmit, setInput } = useTicketChat({
    nome: ticket.nome,
    email: ticket.contato,
    setor: ticket.setor,
  })

  const [awaitingFeedback, setAwaitingFeedback] = useState(false)

  // mensagem inicial
  useAutoSubmitMessage({
    messages,
    input,
    initialMessage: ticket.descricao,
    setInput,
    handleSubmit,
  })

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
        <div className="border-b p-2 sm:p-3 flex-shrink-0">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-medium">Ticket# 2025-CS123</h2>
            <Badge className="bg-pink-100 text-pink-800 hover:bg-pink-100 text-xs">
              {areas[ticket.setor] ?? ticket.setor}
            </Badge>
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-3 overflow-y-auto">
          <div className="space-y-6">
            <AnimatePresence>
              {messages.map((message, index) => (
                <motion.div
                  key={message.id}
                  className={`flex gap-3 w-full ${message.role === "user" ? "justify-end" : "justify-start"}`}
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
                      className={`rounded-2xl px-4 py-3 ${message.role === "user"
                        ? "bg-[#e91e63] text-white ml-auto"
                        : "bg-white text-[#252525] border border-[#252525]/10"
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
                                className="text-[#DF1463] underline hover:opacity-80 transition"
                              >
                                {children}
                              </a>
                            ),
                          }}
                        >
                          {message.content}
                        </ReactMarkdown>
                      </motion.div>
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
                        >
                          Não Resolveu
                        </Button>
                        <Button
                          size="sm"
                          className="bg-[#e91e63] hover:bg-[#d81b60] text-xs h-7"
                          onClick={() => handleFeedback(true)}
                        >
                          Resolveu Meu Problema
                        </Button>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </ScrollArea>

        {/* Input */}
        <motion.div
          className="border-t p-2 bg-white flex-shrink-0"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <Input
              value={input}
              onChange={handleInputChange}
              placeholder="Escreva suas Dúvidas"
              className="flex-1 bg-white focus:ring-0 focus:outline-none text-[#252525] placeholder:text-[#475569] py-2 px-4 rounded-full border-[#CBD5E1] h-9 text-sm"
              disabled={isLoading || awaitingFeedback}
            />
            <Button
              type="submit"
              size="icon"
              className="bg-[#e91e63] hover:bg-[#d81b60] text-white border-0 rounded-full h-9 w-9 p-0 shadow-md hover:shadow-lg transition-all duration-200 flex-shrink-0 disabled:opacity-50"
              disabled={isLoading || !input.trim() || awaitingFeedback}
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </motion.div>
      </div>
    </div>
  )
}

