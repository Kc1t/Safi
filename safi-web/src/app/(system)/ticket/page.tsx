"use client"

import { Topbar } from "@/components/tobar"
import { Card, CardContent } from "@/components/ui/card"
import { TicketHeader } from "@/components/ticket/ticket-header"
import { CustomerInfo } from "@/components/ticket/customer-info"
import { PriorityStatus } from "@/components/ticket/priority-status"
import { TicketSummary } from "@/components/ticket/ticket-summary"
import { TicketChat } from "@/components/ticket/ticket-chat"
import { TicketTimeline } from "@/components/ticket/ticket-timeline"

export default function Ticket() {
  return (
    <div className="min-h-screen flex flex-col items-start justify-start bg-white">
      <Topbar />
      <main className="flex-1 px-4">
        <Card className="w-full mx-auto shadow-none bg-transparent border-none">
          <CardContent className="p-4">
            <TicketHeader ticketNumber="2025-CS123" department="RH" />
            
            {/* Main Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Left Column - Customer Info & Priority */}
              <div className="space-y-6">
                <CustomerInfo
                  name="Leticia Rocha"
                  phone="(11) 485950-9393"
                  email="leticiarocha@unipharma.com"
                  initials="LR"
                />
                <PriorityStatus />
              </div>

              {/* Middle Column - Summary & Chat */}
              <div className="lg:col-span-2 space-y-6">
                <TicketSummary
                  title="Erro no Sistema"
                  description='O usuário "JohnDoe123" está com dificuldades para acessar sua conta de e-mail. Ao tentar fazer login usando suas credenciais, eles encontram um erro mensagem informando "Nome de usuário ou senha inválidos..."'
                  createdAt="23/03/2025 (1 Dias)"
                />
                <TicketChat />
              </div>

              {/* Right Column - Timeline */}
              <div>
                <TicketTimeline />
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
