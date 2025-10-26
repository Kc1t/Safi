"use client"

import { useState, useEffect, useRef } from 'react'

export interface Message {
  id: string
  role: 'user' | 'assistant' | 'analyst' | 'system'
  content: string
}

interface TicketInfo {
  nome: string
  email: string
  setor: string
  descricao: string
}

export function useClientWebSocketChat(ticketInfo: TicketInfo, ticketId: number | null) {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const hubConnectionRef = useRef<any>(null)
  const [initialMessageSent, setInitialMessageSent] = useState(false)

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5080'

  useEffect(() => {
    if (!ticketId) return

    const loadSignalR = async () => {
      if (typeof window === 'undefined') return

      try {
        const { HubConnectionBuilder } = await import('@microsoft/signalr')

        const connection = new HubConnectionBuilder()
          .withUrl(`${API_BASE_URL}/chatHub`)
          .withAutomaticReconnect()
          .build()

        hubConnectionRef.current = connection

        // Event listeners
        connection.on('ReceiveMessage', (data: any) => {
          const newMessage: Message = {
            id: Date.now().toString(),
            role: data.type || 'system',
            content: data.message
          }
          setMessages(prev => [...prev, newMessage])
          setIsLoading(false)
        })

        connection.on('ReceiveChatHistory', (data: any) => {
          if (data.history && Array.isArray(data.history)) {
            const historyMessages: Message[] = data.history.map((msg: any, index: number) => ({
              id: index.toString(),
              role: msg.messageType === 'user' ? 'user' : msg.messageType === 'ai' ? 'assistant' : msg.messageType === 'analyst' ? 'analyst' : 'system',
              content: msg.message
            }))
            setMessages(historyMessages)
          }
        })

        connection.on('UserJoined', (data: any) => {
          const systemMessage: Message = {
            id: Date.now().toString(),
            role: 'system',
            content: '👨‍💼 Analista conectado ao chat!'
          }
          setMessages(prev => [...prev, systemMessage])
        })

        connection.on('UserLeft', (data: any) => {
          const systemMessage: Message = {
            id: Date.now().toString(),
            role: 'system',
            content: '👨‍💼 Analista desconectou do chat'
          }
          setMessages(prev => [...prev, systemMessage])
        })

        connection.on('AIStatusChanged', (data: any) => {
          const systemMessage: Message = {
            id: Date.now().toString(),
            role: 'system',
            content: data.aiEnabled 
              ? '🤖 IA Assistente foi ativada' 
              : '🚫 IA Assistente foi desativada'
          }
          setMessages(prev => [...prev, systemMessage])
        })

        connection.on('ReceiveError', (data: any) => {
          const errorMessage: Message = {
            id: Date.now().toString(),
            role: 'system',
            content: `❌ Erro: ${data.message || 'Erro desconhecido'}`
          }
          setMessages(prev => [...prev, errorMessage])
        })

        connection.onclose(() => {
          setIsConnected(false)
        })

        connection.onreconnecting(() => {
          setIsConnected(false)
        })

        connection.onreconnected(() => {
          setIsConnected(true)
        })

        await connection.start()
        setIsConnected(true)

        // Entrar no chat do ticket
        await connection.invoke('JoinTicketChat', ticketId)
        await connection.invoke('GetChatHistory', ticketId)

      } catch (error) {
        console.error('Erro ao conectar WebSocket:', error)
      }
    }

    void loadSignalR()

    return () => {
      if (hubConnectionRef.current) {
        hubConnectionRef.current.stop()
      }
    }
  }, [ticketId])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const messageToSend = input.trim()
    if (!messageToSend || isLoading || !hubConnectionRef.current || !ticketId) return

    // Limpar input e mostrar loading
    setInput('')
    setIsLoading(true)

    try {
      // Enviar mensagem - o backend vai retornar via ReceiveMessage
      await hubConnectionRef.current.invoke('SendMessage', ticketId, messageToSend)
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error)
      setIsLoading(false)
    }
  }

  // Corrigir dependências do useEffect
  const ticketInfoString = JSON.stringify(ticketInfo)
  
  // Enviar mensagem inicial automaticamente
  useEffect(() => {
    if (isConnected && ticketInfo.descricao && !initialMessageSent && ticketId) {
      setInitialMessageSent(true)
      setIsLoading(true)
      
      const sendInitialMessage = async () => {
        if (!hubConnectionRef.current) return
        
        try {
          await hubConnectionRef.current.invoke('SendMessage', ticketId, ticketInfo.descricao)
        } catch (error) {
          console.error('Erro ao enviar mensagem inicial:', error)
          setIsLoading(false)
        }
      }
      
      setTimeout(() => {
        sendInitialMessage()
      }, 500)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected, initialMessageSent, ticketId, ticketInfoString])

  return {
    input,
    messages,
    isLoading,
    isConnected,
    handleInputChange,
    handleSubmit,
    setInput
  }
}

