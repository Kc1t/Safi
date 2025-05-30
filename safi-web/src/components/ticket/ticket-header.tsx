import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface TicketHeaderProps {
  ticketNumber: string
  department: string
}

export function TicketHeader({ ticketNumber, department }: TicketHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
      <div className="flex items-center gap-2">
        <h1 className="text-lg font-medium text-gray-900">Ticket# {ticketNumber}</h1>
        <Badge variant="secondary" className="bg-orange-100 text-orange-800 hover:bg-orange-100">
          {department}
        </Badge>
      </div>
      <div className="flex items-center gap-3">
        <Button variant="outline" size="sm" className="text-gray-600">
          Escalonar N2
        </Button>
        <Button size="sm" className="bg-[#DF1463] hover:bg-[#DF1463]/80 text-white">
          Encerrar Chamado
        </Button>
      </div>
    </div>
  )
}
