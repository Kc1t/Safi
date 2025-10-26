"use client"

import { useState, useEffect, useRef, useCallback } from 'react'

export interface Message {
  type: 'user' | 'ai' | 'analyst' | 'system'
  content: string
  timestamp: Date
}

export function useTicketWebSocket(ticketId: number | null) {
  const [messages, setMessages] = useState<Message[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('disconnected')
  const hubConnectionRef = useRef<any>(null)

  useEffect(() => {
    if (!ticketId) return

    // Carregar SignalR dinamicamente
    const loadSignalR = async () => {
      if (typeof window !== 'undefined') {
        const { HubConnectionBuilder } = await import('@microsoft/signalr')

        const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5080'

        const connection = new HubConnectionBuilder()
          .withUrl(`${API_BASE_URL}/chatHub`)
          .withAutomaticReconnect()
          .build()

        hubConnectionRef.current = connection

        // Event listeners
        connection.on('ReceiveMessage', (data: any) => {
          setMessages(prev => [...prev, {
            type: data.type || 'system',
            content: data.message,
            timestamp: new Date(data.timestamp || Date.now())
          }])
        })

        connection.on('ReceiveChatHistory', (data: any) => {
          if (data.history && Array.isArray(data.history)) {
            const historyMessages: Message[] = data.history.map((msg: any) => ({
              type: msg.messageType as Message['type'],
              content: msg.message,
              timestamp: new Date(msg.createdAt)
            }))
            setMessages(historyMessages)
          }
        })

        connection.on('UserJoined', () => {
          setMessages(prev => [...prev, {
            type: 'system',
            content: 'Usuário conectado ao chat',
            timestamp: new Date()
          }])
        })

        connection.on('UserLeft', () => {
          setMessages(prev => [...prev, {
            type: 'system',
            content: 'Usuário desconectou',
            timestamp: new Date()
          }])
        })

        connection.onclose(() => {
          setIsConnected(false)
          setConnectionStatus('disconnected')
        })

        connection.onreconnecting(() => {
          setConnectionStatus('connecting')
        })

        connection.onreconnected(() => {
          setIsConnected(true)
          setConnectionStatus('connected')
        })

        try {
          await connection.start()
          setIsConnected(true)
          setConnectionStatus('connected')

          // Entrar no chat do ticket
          await connection.invoke('JoinTicketChat', ticketId)
          await connection.invoke('GetChatHistory', ticketId)

        } catch (error) {
          console.error('Erro ao conectar WebSocket:', error)
          setConnectionStatus('disconnected')
        }
      }
    }

    loadSignalR()

    return () => {
      if (hubConnectionRef.current) {
        hubConnectionRef.current.stop()
      }
    }
  }, [ticketId])

  const sendMessage = useCallback(async (message: string) => {
    if (!hubConnectionRef.current || !ticketId) return

    try {
      await hubConnectionRef.current.invoke('SendMessage', ticketId, message)
      
      // Adicionar mensagem do usuário imediatamente
      setMessages(prev => [...prev, {
        type: 'user',
        content: message,
        timestamp: new Date()
      }])
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error)
    }
  }, [ticketId])

  return {
    messages,
    sendMessage,
    isConnected,
    connectionStatus
  }
}

