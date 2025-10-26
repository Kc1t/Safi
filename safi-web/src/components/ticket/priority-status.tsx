import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface PriorityStatusProps {
  status?: string
  priority?: string
  issueType?: string
}

const translatePriority = (priority?: string) => {
  const map: Record<string, string> = {
    'low': 'Baixa',
    'medium': 'Média',
    'high': 'Alta',
    'Low': 'Baixa',
    'Medium': 'Média',
    'High': 'Alta',
  }
  return map[priority || ''] || priority || 'Média'
}

const translateStatus = (status?: string) => {
  const map: Record<string, string> = {
    'open': 'Aberto',
    'in_progress': 'Em Andamento',
    'resolved': 'Resolvido',
    'Open': 'Aberto',
    'InProgress': 'Em Andamento',
    'Resolved': 'Resolvido',
  }
  return map[status || ''] || status || 'Aberto'
}

export function PriorityStatus({ status, priority, issueType }: PriorityStatusProps) {
  const priorityValue = priority?.toLowerCase() || 'medium'
  const statusValue = status?.toLowerCase() || 'open'

  return (
    <div className="bg-gray-50 p-3 sm:p-4 rounded-lg border">
      <h3 className="text-sm font-medium text-gray-900 mb-3">Controles</h3>
      <div className="space-y-3 sm:space-y-4">
        {issueType && (
          <div>
            <label className="text-xs sm:text-sm text-gray-500 mb-2 block">Tipo de Problema</label>
            <div className="w-full h-9 sm:h-10 text-sm bg-white border rounded-md px-3 flex items-center">
              <span className="text-gray-900">{issueType}</span>
            </div>
          </div>
        )}
        <div>
          <label className="text-xs sm:text-sm text-gray-500 mb-2 block">Prioridade</label>
          <Select defaultValue={priorityValue}>
            <SelectTrigger className="w-full h-9 sm:h-10 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Baixa</SelectItem>
              <SelectItem value="medium">Média</SelectItem>
              <SelectItem value="high">Alta</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-xs sm:text-sm text-gray-500 mb-2 block">Status</label>
          <Select defaultValue={statusValue}>
            <SelectTrigger className="w-full h-9 sm:h-10 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="open">Aberto</SelectItem>
              <SelectItem value="in_progress">Em Andamento</SelectItem>
              <SelectItem value="resolved">Resolvido</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="pt-2">
          <p className="text-xs text-gray-600">
            <strong>Prioridade:</strong> {translatePriority(priority)}<br />
            <strong>Status:</strong> {translateStatus(status)}
          </p>
        </div>
      </div>
    </div>
  )
}
