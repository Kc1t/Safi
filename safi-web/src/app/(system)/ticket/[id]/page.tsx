"use client"

import { useEffect, useState } from "react"
import { Topbar } from "@/components/topbar"
import { Card, CardContent } from "@/components/ui/card"
import { TicketHeader } from "@/components/ticket/ticket-header"
import { CustomerInfo } from "@/components/ticket/customer-info"
import { PriorityStatus } from "@/components/ticket/priority-status"
import { TicketSummary } from "@/components/ticket/ticket-summary"
import { TicketChat } from "@/components/ticket/ticket-chat"
import { TicketTimeline } from "@/components/ticket/ticket-timeline"
import { useParams } from "next/navigation"
import { Loader2 } from "lucide-react"

interface ApiTicket {
    id: number
    title: string
    detailing?: string
    status: string
    priority: string
    issueType?: string
    user?: {
        name: string
        email: string
        department?: {
            name: string
        }
    }
    assignedTo?: {
        name: string
    } | null
    createdAt: string
    updatedAt?: string | null
}

interface TimelineItem {
    id: string
    user: string
    action: string
    date: string
    avatar?: string
    initials: string
    type: "user" | "ai" | "analyst"
    avatarNumber?: number
}

export default function Ticket() {
    const params = useParams()
    const id = params.id as string
    const [ticket, setTicket] = useState<ApiTicket | null>(null)
    const [timelineItems, setTimelineItems] = useState<TimelineItem[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const loadTicket = async () => {
            try {
                const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5080'
                const response = await fetch(`${API_BASE_URL}/api/tickets/${id}`)
                
                if (!response.ok) {
                    throw new Error('Ticket não encontrado')
                }

                const data = await response.json()
                console.log('📊 Dados do ticket retornados pela API:', data)
                setTicket(data)
                
                // Criar timeline com base nos dados do ticket
                const timeline: TimelineItem[] = [
                    {
                        id: '1',
                        user: data.user?.name || 'Usuário',
                        action: `Ticket criado: ${data.title}`,
                        date: new Date(data.createdAt).toLocaleDateString('pt-BR'),
                        initials: data.user?.name ? data.user.name.substring(0, 2).toUpperCase() : 'U',
                        type: 'user'
                    }
                ]
                
                // Adicionar atualizações se houver
                if (data.updatedAt) {
                    timeline.push({
                        id: '2',
                        user: 'Sistema',
                        action: 'Ticket atualizado',
                        date: new Date(data.updatedAt).toLocaleDateString('pt-BR'),
                        initials: 'S',
                        type: 'analyst'
                    })
                }
                
                setTimelineItems(timeline)
            } catch (error) {
                console.error('Erro ao carregar ticket:', error)
            } finally {
                setLoading(false)
            }
        }

        if (id) {
            loadTicket()
        }
    }, [id])

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-pink-600" />
            </div>
        )
    }

    if (!ticket) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-gray-500">Ticket não encontrado</p>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex flex-col items-start justify-start bg-white">
            <Topbar />
            <main className="flex-1 w-full px-2 sm:px-4">
                <Card className="w-full mx-auto shadow-none bg-transparent border-none">
                    <CardContent className="px-2 sm:px-4 flex flex-col gap-4">

                        <TicketHeader ticketNumber={`#${ticket.id}`} department={ticket.user?.department?.name || 'N/A'} />

                        {/* Main Grid Layout */}
                        <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 lg:gap-6">
                            {/* Left Column - Customer Info & Priority */}
                            <div className="xl:order-1 space-y-4 lg:space-y-6">
                                <CustomerInfo
                                    name={ticket.user?.name || 'Usuário'}
                                    phone=""
                                    email={ticket.user?.email || 'N/A'}
                                    department={ticket.user?.department?.name}
                                    initials={ticket.user?.name ? ticket.user.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2) : 'U'}
                                    avatar={0}
                                />
                                <PriorityStatus 
                                    status={ticket.status}
                                    priority={ticket.priority}
                                    issueType={ticket.issueType}
                                />
                            </div>

                            {/* Middle Column - Summary & Chat */}
                            <div className="xl:col-span-2 xl:order-2 space-y-4 lg:space-y-6">
                                <TicketSummary
                                    title={ticket.title || 'Sem título'}
                                    description={ticket.detailing || ticket.title || ''}
                                    createdAt={ticket.createdAt ? new Date(ticket.createdAt).toLocaleDateString('pt-BR') : 'N/A'}
                                />
                                <TicketChat ticketId={id} />
                            </div>

                            {/* Right Column - Timeline */}
                            <div className="xl:order-3">
                                <TicketTimeline timelineItems={timelineItems} />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </main>
        </div>
    )
}
