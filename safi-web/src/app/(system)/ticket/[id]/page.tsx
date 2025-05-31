"use client"

import { Topbar } from "@/components/topbar"
import { Card, CardContent } from "@/components/ui/card"
import { TicketHeader } from "@/components/ticket/ticket-header"
import { CustomerInfo } from "@/components/ticket/customer-info"
import { PriorityStatus } from "@/components/ticket/priority-status"
import { TicketSummary } from "@/components/ticket/ticket-summary"
import { TicketChat } from "@/components/ticket/ticket-chat"
import { TicketTimeline } from "@/components/ticket/ticket-timeline"
import { ticketsData } from "@/data/tickets-data"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Ticket() {
    const params = useParams()
    const id = params.id as string

    const ticket = ticketsData.find(t => t.id === id)

    console.log(JSON.stringify(ticket), "aqui")

    return (
        <div className="min-h-screen flex flex-col items-start justify-start bg-white">
            <Topbar />
            <main className="flex-1 px-4">
                <Card className="w-full mx-auto shadow-none bg-transparent border-none">
                    <CardContent className="px-4 flex flex-col gap-1">
                  
                        <TicketHeader ticketNumber={ticket?.number || ""} department={ticket?.department || ""} />

                        {/* Main Grid Layout */}
                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                            {/* Left Column - Customer Info & Priority */}
                            <div className="space-y-6">
                                <CustomerInfo
                                    name={ticket?.assignedTo?.name || ""}
                                    phone={ticket?.assignedTo?.cellphone || ""}
                                    email={ticket?.assignedTo?.email || ""}
                                    initials={ticket?.assignedTo?.initials || ""}
                                />
                                <PriorityStatus />
                            </div>

                            {/* Middle Column - Summary & Chat */}
                            <div className="lg:col-span-2 space-y-6">
                                <TicketSummary
                                    title={ticket?.title || "Erro no Sistema"}
                                    description={ticket?.description || ''}
                                    createdAt={ticket?.timeLine?.[ticket.timeLine.length - 1]?.date ?? ""}
                                />
                                {ticket && <TicketChat ticket={ticket} />}
                            </div>

                            {/* Right Column - Timeline */}
                            <div>
                                <TicketTimeline timelineItems={ticket?.timeLine || []} />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </main>
        </div>
    )
}
