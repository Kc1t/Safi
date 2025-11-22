"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

interface TicketHeaderProps {
  ticketNumber: string
  department: string
}

export function TicketHeader({ ticketNumber, department }: TicketHeaderProps) {
  const [escalateModalOpen, setEscalateModalOpen] = useState(false)
  const [closeModalOpen, setCloseModalOpen] = useState(false)

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 pb-4 border-b border-gray-200 gap-4">
      <div className="flex items-center gap-2 flex-wrap">
        <Link href="/tickets-dashboard" className="">
          <Button
            variant="outline"
            className="flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-full text-sm"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Voltar</span>
          </Button>
        </Link>
        <h1 className="text-base sm:text-lg font-medium text-gray-900 break-words">Ticket {ticketNumber}</h1>
        <Badge variant="secondary" className="bg-orange-100 text-orange-800 hover:bg-orange-100 text-xs sm:text-sm">
          {department}
        </Badge>
      </div>
      <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
        <Dialog open={escalateModalOpen} onOpenChange={setEscalateModalOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="text-gray-600 text-xs sm:text-sm flex-1 sm:flex-none">
              <span className="hidden sm:inline">Escalonar N2</span>
              <span className="sm:hidden">N2</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Escalonar para N2</DialogTitle>
              <DialogDescription>
                Você está prestes a escalonar o ticket #{ticketNumber} para o nível 2 de suporte.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <p className="text-sm text-gray-600">
                Esta ação irá transferir o chamado para a equipe de nível 2, que possui maior especialização técnica
                para resolver problemas complexos.
              </p>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEscalateModalOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={() => setEscalateModalOpen(false)}>Confirmar Escalação</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={closeModalOpen} onOpenChange={setCloseModalOpen}>
          <DialogTrigger asChild>
            <Button
              size="sm"
              className="bg-[#DF1463] hover:bg-[#DF1463]/80 text-white text-xs sm:text-sm flex-1 sm:flex-none"
            >
              <span className="hidden sm:inline">Encerrar Chamado</span>
              <span className="sm:hidden">Encerrar</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Encerrar Chamado</DialogTitle>
              <DialogDescription>Você está prestes a encerrar o ticket #{ticketNumber}.</DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <p className="text-sm text-gray-600">
                Esta ação irá marcar o chamado como resolvido e encerrado. Certifique-se de que todas as questões foram
                devidamente atendidas antes de prosseguir.
              </p>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setCloseModalOpen(false)}>
                Cancelar
              </Button>
              <Button className="bg-[#DF1463] hover:bg-[#DF1463]/80" onClick={() => setCloseModalOpen(false)}>
                Confirmar Encerramento
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
