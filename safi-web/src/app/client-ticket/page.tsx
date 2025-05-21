"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, SmilePlus } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface Message {
  id: string
  sender: "user" | "support"
  content: string
  timestamp: Date
  analyst?: string
  resolved?: boolean
}

export function ClientTicket() {
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "user",
      content:
        'Estou enfrentando um problema com o sistema de geração de relatórios da nossa aplicação. Sempre que tento gerar um relatório em PDF usando o filtro de datas personalizado, o sistema retorna um erro genérico de "Falha na geração do documento". Já revisei os parâmetros e mesmo usando dados padrão, o erro persiste. Isso começou a acontecer depois da última atualização. Preciso de uma solução urgente, pois impacta diretamente a operação do tema de compliance.',
      timestamp: new Date(2025, 4, 10, 14, 30),
    },
    {
      id: "2",
      sender: "support",
      content:
        "Entendi. Isso geralmente ocorre quando há inconsistência entre os parâmetros enviados para o gerador de PDF e o formato esperado pelo backend. Tente limpar o cache do navegador e redefinir os filtros para os valores padrão. Em seguida, gere novamente o relatório. Se possível, use o intervalo de datas padrão da aplicação para validar se o erro persiste.",
      timestamp: new Date(2025, 4, 10, 14, 45),
      analyst: "Analista N0",
    },
    {
      id: "3",
      sender: "support",
      content:
        "Compreendido. Vou escalar esse caso para um analista N1 para análise mais aprofundada, já que os passos iniciais não solucionaram. Um momento.",
      timestamp: new Date(2025, 4, 10, 15, 10),
      analyst: "Analista N0",
    },
    {
      id: "4",
      sender: "support",
      content:
        "Olá, quem fala é o Felipe, analista N1. Agradeço por relatar o problema com detalhes. Fizemos uma varredura nos logs do serviço de geração de relatórios e identificamos que a falha está relacionada a um conflito entre o novo formato de datas implementado na atualização e a configuração regional do seu perfil. Já aplicamos um ajuste temporário no backend que força o formato esperado. Por favor, tente gerar o relatório novamente agora. Me avise se o erro persistir.",
      timestamp: new Date(2025, 4, 10, 15, 30),
      analyst: "Analista N1",
    },
  ])
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const newMessage: Message = {
      id: Date.now().toString(),
      sender: "user",
      content: input,
      timestamp: new Date(),
    }

    setMessages([...messages, newMessage])
    setInput("")
  }

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)] max-w-3xl mx-auto">
      <div className="border-b p-4">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-medium">Ticket# 2025-CS123</h2>
          <Badge className="bg-pink-100 text-pink-800 hover:bg-pink-100">RH</Badge>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.map((message) => (
          <div key={message.id} className="flex flex-col gap-2">
            {message.sender === "user" ? (
              <div className="bg-[#e91e63] text-white p-4 rounded-lg max-w-[80%] self-start">
                <p>{message.content}</p>
              </div>
            ) : (
              <div className="space-y-2 max-w-[80%] self-end">
                <div className="flex items-center gap-2 justify-end">
                  <span className="text-sm text-gray-500">{message.analyst}</span>
                </div>
                <div className="bg-gray-100 p-4 rounded-lg">
                  <p className="text-gray-800">{message.content}</p>
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-pink-600 border-pink-200 hover:bg-pink-50 hover:text-pink-700"
                  >
                    Não Resolveu
                  </Button>
                  <Button size="sm" className="bg-[#e91e63] hover:bg-[#d81b60]">
                    Resolveu Meu Problema
                  </Button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="border-t p-4">
        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
          <Button type="button" variant="ghost" size="icon">
            <SmilePlus className="h-5 w-5 text-gray-500" />
          </Button>
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Escreva suas Dúvidas"
            className="flex-1"
          />
          <Button type="submit" size="icon" className="bg-[#e91e63] hover:bg-[#d81b60]">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  )
}
