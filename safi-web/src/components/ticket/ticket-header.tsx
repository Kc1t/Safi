import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

interface TicketHeaderProps {
  ticketNumber: string
  department: string
}

export function TicketHeader({ ticketNumber, department }: TicketHeaderProps) {
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
        <h1 className="text-base sm:text-lg font-medium text-gray-900 break-words">Ticket# {ticketNumber}</h1>
        <Badge variant="secondary" className="bg-orange-100 text-orange-800 hover:bg-orange-100 text-xs sm:text-sm">
          {department}
        </Badge>
      </div>
      <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
        <Button variant="outline" size="sm" className="text-gray-600 text-xs sm:text-sm flex-1 sm:flex-none">
          <span className="hidden sm:inline">Escalonar N2</span>
          <span className="sm:hidden">N2</span>
        </Button>
        <Button size="sm" className="bg-[#DF1463] hover:bg-[#DF1463]/80 text-white text-xs sm:text-sm flex-1 sm:flex-none">
          <span className="hidden sm:inline">Encerrar Chamado</span>
          <span className="sm:hidden">Encerrar</span>
        </Button>
      </div>
    </div>
  )
}
