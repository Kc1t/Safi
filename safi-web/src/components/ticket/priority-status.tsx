import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function PriorityStatus() {
  return (
    <div className="bg-gray-50 p-3 sm:p-4 rounded-lg border">
      <h3 className="text-sm font-medium text-gray-900 mb-3">Controles</h3>
      <div className="space-y-3 sm:space-y-4">
        <div>
          <label className="text-xs sm:text-sm text-gray-500 mb-2 block">Prioridade</label>
          <Select defaultValue="baixa">
            <SelectTrigger className="w-full h-9 sm:h-10 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="baixa">Baixa</SelectItem>
              <SelectItem value="media">Média</SelectItem>
              <SelectItem value="alta">Alta</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-xs sm:text-sm text-gray-500 mb-2 block">Status</label>
          <Select defaultValue="pendente">
            <SelectTrigger className="w-full h-9 sm:h-10 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pendente">Pendente</SelectItem>
              <SelectItem value="em-andamento">Em Andamento</SelectItem>
              <SelectItem value="resolvido">Resolvido</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}
