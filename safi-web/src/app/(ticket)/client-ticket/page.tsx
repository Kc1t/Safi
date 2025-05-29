"use client"

import type React from "react"
import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Topbar } from "@/components/tobar"
import ReactMarkdown from "react-markdown"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useTicketChat } from "@/hooks/ticket-chat"
import { useTicketStore } from "@/store/ticketStore"

export const areas: Record<string, string> = {
  "recursos-humanos": "RH",
  ti: "TI",
  financeiro: "Financeiro",
  comercial: "Comercial",
  operacoes: "Operações",
}

function ClientTicket() {
  const ticket = useTicketStore((state) => state.ticket)

  const { input, messages, isLoading, handleInputChange, handleSubmit, setInput } = useTicketChat({
    nome: ticket.nome,
    email: ticket.contato,
    setor: ticket.setor,
  })

  const [awaitingFeedback, setAwaitingFeedback] = useState(false)
  const [autoSubmitReady, setAutoSubmitReady] = useState(false)

  // Preenche o input com a descrição do ticket, se não houver mensagens
  useEffect(() => {
    if (messages.length === 0 && ticket.descricao && !input) {
      setInput(ticket.descricao)
      setAutoSubmitReady(true)
    }
  }, [ticket, messages.length, input, setInput])

  // Envia automaticamente após setInput (quando estiver pronto)
  useEffect(() => {
    if (autoSubmitReady && input) {
      handleSubmit({ preventDefault: () => {} } as React.FormEvent<HTMLFormElement>)
      setAutoSubmitReady(false)
    }
  }, [autoSubmitReady, input, handleSubmit])

  // Verifica se o assistente pediu feedback
  useEffect(() => {
    if (messages.length > 0 && messages[messages.length - 1].role === "assistant") {
      const lastContent = messages[messages.length - 1].content.trim().toLowerCase()
      if (lastContent.endsWith("resolveu")) {
        setAwaitingFeedback(true)
      } else {
        setAwaitingFeedback(false)
      }
    } else {
      setAwaitingFeedback(false)
    }
  }, [messages])

  const handleFeedback = (resolved: boolean) => {
    setAwaitingFeedback(false)
    // Exemplo: fetch('/api/feedback', { method: 'POST', body: JSON.stringify({ resolved }) })
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Topbar />
      <div
        className="flex flex-col w-full max-w-3xl mx-auto border rounded-lg my-2 bg-white overflow-hidden"
        style={{
          height: "calc(100vh - 60px)",
          maxHeight: "90vh",
        }}
      >
        {/* Header */}
        <div className="border-b p-2 sm:p-3 flex-shrink-0">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-medium">Ticket# 2025-CS123</h2>
            <Badge className="bg-pink-100 text-pink-800 hover:bg-pink-100 text-xs">
              {areas[ticket.setor] ?? ticket.setor}
            </Badge>
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-3 space-y-3 overflow-y-auto">
          {messages.map((message, idx) => (
            <div key={message.id} className="flex flex-col gap-1">
              {message.role === "user" ? (
                <div className="flex w-full justify-end">
                  <div className="rounded-lg bg-[#e91e63] text-white px-3 py-2 max-w-[80%]">
                    <p className="text-sm break-words">{message.content}</p>
                  </div>
                </div>
              ) : (
                <div className="flex w-full flex-col items-start gap-1">
                  <div className="rounded-lg bg-gray-100 text-[#252525] px-3 py-2 max-w-[80%]">
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
                  </div>
                  {idx === messages.length - 1 && awaitingFeedback && (
                    <div className="flex flex-wrap justify-start gap-1 mt-1">
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
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex w-full flex-col items-start gap-1">
              <div className="rounded-lg bg-gray-100 text-[#252525] px-3 py-2 max-w-[80%] shadow-sm opacity-70">
                <p className="text-sm">...</p>
              </div>
            </div>
          )}
        </ScrollArea>

        {/* Input */}
        <div className="border-t p-2 bg-white flex-shrink-0">
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
              className="bg-[#e91e63] hover:bg-[#d81b60] text-white border-0 rounded-full h-9 w-9 p-0 shadow-md hover:shadow-lg transition-all duration-200 flex-shrink-0"
              disabled={isLoading || !input.trim() || awaitingFeedback}
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ClientTicket
