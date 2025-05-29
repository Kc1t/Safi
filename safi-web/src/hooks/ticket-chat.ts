import { useState } from "react"
import { v4 as uuidv4 } from "uuid"

type Message = {
  id: string
  role: "user" | "assistant"
  content: string
}

type ApiMessage = {
  role: "user" | "ai"
  content: string
}

export function useTicketChat(userInfo: {
  nome: string
  email: string
  setor: string
}) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage: Message = {
      id: uuidv4(),
      role: "user",
      content: input,
    }

    const historicoApi: ApiMessage[] = [...messages, userMessage].map((msg) => ({
      role: msg.role === "assistant" ? "ai" : "user",
      content: msg.content,
    }))

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...userInfo,
          historico: historicoApi,
        }),
      })

      if (!res.ok) throw new Error("Erro na resposta da API")

      const data = await res.json()

      const botMessage: Message = {
        id: uuidv4(),
        role: "assistant",
        content: data.result,
      }

      setMessages((prev) => [...prev, botMessage])
    } catch (err) {
      console.error("Erro ao obter resposta:", err)
      const errorMessage: Message = {
        id: uuidv4(),
        role: "assistant",
        content: "Desculpe, houve um erro ao processar sua mensagem.",
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const sendMessage = async (messageContent: string) => {
    if (!messageContent.trim()) return

    const userMessage: Message = {
      id: uuidv4(),
      role: "user",
      content: messageContent,
    }

    const historicoApi: ApiMessage[] = [...messages, userMessage].map((msg) => ({
      role: msg.role === "assistant" ? "ai" : "user",
      content: msg.content,
    }))

    setMessages((prev) => [...prev, userMessage])
    setIsLoading(true)

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...userInfo,
          historico: historicoApi,
        }),
      })

      if (!res.ok) throw new Error("Erro na resposta da API")

      const data = await res.json()

      const botMessage: Message = {
        id: uuidv4(),
        role: "assistant",
        content: data.result,
      }

      setMessages((prev) => [...prev, botMessage])
    } catch (err) {
      console.error("Erro ao obter resposta:", err)
      const errorMessage: Message = {
        id: uuidv4(),
        role: "assistant",
        content: "Desculpe, houve um erro ao processar sua mensagem.",
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  return {
    messages,
    input,
    isLoading,
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value),
    handleSubmit,
    sendMessage,
    setInput,
  }
}
