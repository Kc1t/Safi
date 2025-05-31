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

export default function Ticket() {
    const params = useParams()
    const id = params.id as string

    const ticket = ticketsData.find(t => t.id === id)

    return (
        <div className="min-h-screen flex flex-col items-start justify-start bg-white">
            <Topbar />
            <main className="flex-1 w-full px-2 sm:px-4">
                <Card className="w-full mx-auto shadow-none bg-transparent border-none">
                    <CardContent className="px-2 sm:px-4 flex flex-col gap-4">

                        <TicketHeader ticketNumber={ticket?.number || ""} department={ticket?.department || ""} />

                        {/* Main Grid Layout */}
                        <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 lg:gap-6">
                            {/* Left Column - Customer Info & Priority */}
                            <div className="xl:order-1 space-y-4 lg:space-y-6">
                                <CustomerInfo
                                    name={ticket?.requester?.name || ""}
                                    phone={ticket?.requester?.cellphone || ""}
                                    email={ticket?.requester?.email || ""}
                                    initials={ticket?.requester?.initials || ""}
                                    avatar={ticket?.requester?.avatarNumber || 0}
                                />
                                <PriorityStatus />
                            </div>

                            {/* Middle Column - Summary & Chat */}
                            <div className="xl:col-span-2 xl:order-2 space-y-4 lg:space-y-6">
                                <TicketSummary
                                    title={ticket?.title || "Erro no Sistema"}
                                    description={ticket?.description || ''}
                                    createdAt={ticket?.timeLine?.[ticket.timeLine.length - 1]?.date ?? ""}
                                
                                />
                                {ticket && <TicketChat ticket={ticket} />}
                            </div>

                            {/* Right Column - Timeline */}
                            <div className="xl:order-3">
                                <TicketTimeline timelineItems={ticket?.timeLine || []} />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </main>
        </div>
    )
}
