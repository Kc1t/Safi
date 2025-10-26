"use client"

import { useEffect, useState, useRef } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send } from "lucide-react"
import AvatarPlaceholder from "@/assets/placeholders/avatar-placeholder.png"
import SafiBubble from "@/assets/ai/safi-bubble.png"
import { Ticket } from "@/data/tickets-data"

interface TicketChatProps {
    ticketId: string
}

interface ChatMessage {
    messageType: string
    message: string
    createdAt: string
}

export function TicketChat({ ticketId }: TicketChatProps) {
    const [messages, setMessages] = useState<ChatMessage[]>([])
    const [input, setInput] = useState('')
    const [isConnected, setIsConnected] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [aiEnabled, setAiEnabled] = useState(true) // IA começa ativa
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const hubConnectionRef = useRef<any>(null)

    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5080'

    useEffect(() => {
        if (!ticketId) return

        // Carregar SignalR e conectar
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
                    setMessages(prev => [...prev, {
                        messageType: data.type || 'system',
                        message: data.message,
                        createdAt: data.timestamp || new Date().toISOString()
                    }])
                })

                connection.on('ReceiveChatHistory', (data: any) => {
                    if (data.history && Array.isArray(data.history)) {
                        setMessages(data.history)
                    }
                })

                connection.on('AIStatusChanged', (data: any) => {
                    setAiEnabled(data.aiEnabled)
                    const statusMessage: ChatMessage = {
                        messageType: 'system',
                        message: data.message || (data.aiEnabled ? '🤖 IA ativada' : '🚫 IA desativada'),
                        createdAt: new Date().toISOString()
                    }
                    setMessages(prev => [...prev, statusMessage])
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

                // Entrar no chat do ticket e carregar histórico
                await connection.invoke('JoinTicketChat', parseInt(ticketId))
                await connection.invoke('GetChatHistory', parseInt(ticketId))
                
                setIsLoading(false)

            } catch (error) {
                console.error('Erro ao conectar WebSocket:', error)
                setIsLoading(false)
            }
        }

        void loadSignalR()

        return () => {
            if (hubConnectionRef.current) {
                hubConnectionRef.current.stop()
            }
        }
    }, [ticketId])

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
        }
    }, [messages])

    const handleSendMessage = async () => {
        if (!input.trim() || !hubConnectionRef.current) return

        const message = input
        setInput('')

        try {
            await hubConnectionRef.current.invoke('SendAnalystMessage', parseInt(ticketId), message)
        } catch (error) {
            console.error('Erro ao enviar mensagem:', error)
        }
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSendMessage()
        }
    }

    const toggleAI = async () => {
        if (!hubConnectionRef.current || !ticketId) {
            console.warn('Não é possível alterar status da IA sem conexão ou ticket')
            return
        }

        try {
            const newStatus = !aiEnabled
            await hubConnectionRef.current.invoke('SetAIStatus', parseInt(ticketId), newStatus)
            console.log(`🤖 IA ${newStatus ? 'ativada' : 'desativada'} para ticket ${ticketId}`)
        } catch (error) {
            console.error('Erro ao alterar status da IA:', error)
        }
    }

    const getMessageStyle = (role: string) => {
        switch (role) {
            case 'user':
                return 'bg-gray-50 border'
            case 'ai':
                return 'border'
            case 'analyst':
                return 'bg-red-50 border'
            default:
                return 'bg-white'
        }
    }

    const getRoleLabel = (role: string) => {
        switch (role) {
            case 'user':
                return 'Usuário'
            case 'ai':
                return 'Safi Assistente'
            case 'analyst':
                return 'Analista'
            default:
                return role
        }
    }

    return (
        <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                    <h3 className="text-sm font-medium text-gray-900">Histórico de Chat</h3>
                    {/* Discreto botão de toggle da IA */}
                    <Button
                        onClick={toggleAI}
                        variant="ghost"
                        size="sm"
                        className={`h-7 px-2 text-xs ${
                            aiEnabled 
                                ? 'text-green-700 bg-green-50 hover:bg-green-100' 
                                : 'text-red-700 bg-red-50 hover:bg-red-100'
                        }`}
                        disabled={!isConnected}
                    >
                        <span className="flex items-center gap-1">
                            {aiEnabled ? '🤖 IA Ativa' : '🚫 IA Desativada'}
                        </span>
                    </Button>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                    <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
                    <span>{isConnected ? 'Conectado' : 'Desconectado'}</span>
                </div>
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center py-8">
                    <p className="text-gray-500">Carregando mensagens...</p>
                </div>
            ) : (
                <>
                    <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
                        {messages.map((message, index) => (
                            <div key={index} className={`flex gap-3 p-3 rounded-lg ${getMessageStyle(message.messageType)}`}>
                                <Avatar className="h-12 w-12">
                                    <AvatarImage src={message.messageType === 'ai' ? SafiBubble.src : AvatarPlaceholder.src} />
                                    <AvatarFallback className="bg-gray-600 text-white">
                                        {message.messageType[0].toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="font-medium text-sm flex items-center gap-1">
                                            {message.messageType === 'user' && '👤 '}
                                            {message.messageType === 'ai' && '🤖 '}
                                            {message.messageType === 'analyst' && '👨‍💼 '}
                                            {message.messageType === 'system' && 'ℹ️ '}
                                            {getRoleLabel(message.messageType)}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-700 leading-relaxed">
                                        {message.message}
                                    </p>
                                    <div className="text-xs text-gray-400 mt-2">
                                        {new Date(message.createdAt).toLocaleString('pt-BR')}
                                    </div>
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Response Input */}
                    <div className="border-t pt-4">
                        <div className="flex items-center gap-3">
                            <div className="flex-1 relative">
                                <Input 
                                    placeholder="Enviar Resposta" 
                                    className="pr-10 border-gray-300"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    disabled={!isConnected}
                                />
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 text-gray-600 hover:text-gray-800"
                                    onClick={handleSendMessage}
                                    disabled={!input.trim() || !isConnected}
                                >
                                    <Send className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}
