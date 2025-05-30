import { Archive } from "lucide-react"

interface TicketSummaryProps {
  title: string
  description: string
  createdAt: string
}

export function TicketSummary({ title, description, createdAt }: TicketSummaryProps) {
  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-gray-900">Resumo do Chamado</h3>
        <div className="flex items-center gap-2">
          <span className="text-sm text-blue-600 cursor-pointer">Download</span>
          <Archive className="h-4 w-4 text-gray-400" />
        </div>
      </div>
      
      <div className="space-y-3">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <h4 className="font-medium text-gray-900">{title}</h4>
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">
            {description}
            <span className="text-blue-600 cursor-pointer ml-1">(MAIS)</span>
          </p>
        </div>
        
        <div className="pt-2 border-t border-gray-200">
          <span className="text-sm text-gray-600">
            <span className="font-medium">Criado em:</span> {createdAt}
          </span>
        </div>
      </div>
    </div>
  )
}
