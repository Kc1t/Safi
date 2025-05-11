"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, ChevronLeft, ChevronRight } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Ticket {
  id: string
  number: string
  department: string
  title: string
  description: string
  openedAt: string
  triage: string
  complexity: string
  assignedTo: {
    name: string
    avatar?: string
    initials: string
  }
}

export function Dashboard() {
  const [activeTab, setActiveTab] = useState("todos")
  const [currentPage, setCurrentPage] = useState(1)

  const tickets: Ticket[] = [
    {
      id: "1",
      number: "2025-CS123",
      department: "RH",
      title: "Computador não liga após atualização",
      description: "Após a última atualização do sistema, o computador não inicia corretamente e exibe tela azul.",
      openedAt: "12:45",
      triage: "Não Resolvido",
      complexity: "N1",
      assignedTo: {
        name: "Leticia Rocha",
        initials: "LR",
      },
    },
    {
      id: "2",
      number: "2025-CS124",
      department: "Financeiro",
      title: "Lentidão no sistema de CRM",
      description: "O sistema está levando mais de 2 minutos para carregar os dados dos clientes.",
      openedAt: "10:33",
      triage: "Resolvido",
      complexity: "N0",
      assignedTo: {
        name: "João Pedro",
        initials: "JP",
      },
    },
    {
      id: "3",
      number: "2025-CS127",
      department: "Logística",
      title: "Lentidão no sistema de CRM",
      description: "As ordens de envio não estão sendo sincronizadas com o sistema da transportadora.",
      openedAt: "08:25",
      triage: "Resolvido",
      complexity: "N0",
      assignedTo: {
        name: "Carla Mendes",
        initials: "CM",
      },
    },
    {
      id: "4",
      number: "2025-CS123",
      department: "RH",
      title: "Acesso negado ao portal do colaborador",
      description: "Vários funcionários estão relatando erro de permissão ao tentar acessar o portal.",
      openedAt: "12:45",
      triage: "Não Resolvido",
      complexity: "N1",
      assignedTo: {
        name: "Rodrigo Campos",
        initials: "RC",
      },
    },
  ]

  const getDepartmentColor = (department: string) => {
    switch (department) {
      case "RH":
        return "bg-pink-100 text-pink-800 hover:bg-pink-100"
      case "Financeiro":
        return "bg-amber-100 text-amber-800 hover:bg-amber-100"
      case "Logística":
        return "bg-orange-100 text-orange-800 hover:bg-orange-100"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100"
    }
  }

  return (
    <div className="container mx-auto py-6 max-w-6xl">
      <h1 className="text-2xl font-medium mb-6">Chamados Abertos</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="md:col-span-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input placeholder="Procurar Chamado" className="pl-10" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Semana" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="atual">Semana Atual</SelectItem>
              <SelectItem value="anterior">Semana Anterior</SelectItem>
              <SelectItem value="proxima">Próxima Semana</SelectItem>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Selecionar Prioridade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="alta">Alta</SelectItem>
              <SelectItem value="media">Média</SelectItem>
              <SelectItem value="baixa">Baixa</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Tabs defaultValue="todos" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-4 mb-4">
              <TabsTrigger
                value="todos"
                className="data-[state=active]:border-b-2 data-[state=active]:border-[#e91e63] data-[state=active]:text-[#e91e63] data-[state=active]:shadow-none rounded-none"
              >
                <span className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[#e91e63]"></span>
                  Todos Tickets
                </span>
              </TabsTrigger>
              <TabsTrigger
                value="novos"
                className="data-[state=active]:border-b-2 data-[state=active]:border-[#e91e63] data-[state=active]:text-[#e91e63] data-[state=active]:shadow-none rounded-none"
              >
                Novos
              </TabsTrigger>
              <TabsTrigger
                value="concluidos"
                className="data-[state=active]:border-b-2 data-[state=active]:border-[#e91e63] data-[state=active]:text-[#e91e63] data-[state=active]:shadow-none rounded-none"
              >
                Concluídos
              </TabsTrigger>
              <TabsTrigger
                value="finalizados"
                className="data-[state=active]:border-b-2 data-[state=active]:border-[#e91e63] data-[state=active]:text-[#e91e63] data-[state=active]:shadow-none rounded-none"
              >
                Finalizado com IA
              </TabsTrigger>
            </TabsList>

            <TabsContent value="todos" className="space-y-4">
              {tickets.map((ticket) => (
                <div key={ticket.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`h-2 w-2 rounded-full ${ticket.department === "RH" ? "bg-pink-500" : ticket.department === "Financeiro" ? "bg-amber-500" : "bg-orange-500"}`}
                      ></span>
                      <h3 className="font-medium">Ticket# {ticket.number}</h3>
                      <Badge className={getDepartmentColor(ticket.department)}>{ticket.department}</Badge>
                    </div>
                    <Avatar className="h-6 w-6">
                      <AvatarImage
                        src={ticket.assignedTo.avatar || `/placeholder.svg?height=24&width=24`}
                        alt={ticket.assignedTo.name}
                      />
                      <AvatarFallback>{ticket.assignedTo.initials}</AvatarFallback>
                    </Avatar>
                  </div>
                  <h4 className="font-medium mb-1">{ticket.title}</h4>
                  <p className="text-sm text-gray-600 mb-3">{ticket.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-gray-500">
                      Aberto às {ticket.openedAt} · Triagem: IA ({ticket.triage}) · Nível De Complexidade:{" "}
                      {ticket.complexity}
                    </div>
                    <Button size="sm" className="bg-[#e91e63] hover:bg-[#d81b60]">
                      Abrir Chamado
                    </Button>
                  </div>
                </div>
              ))}

              <div className="flex items-center justify-center gap-1 mt-6">
                <Button variant="outline" size="icon" className="h-8 w-8">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className={`h-8 w-8 ${currentPage === 1 ? "bg-[#e91e63] text-white hover:bg-[#d81b60] hover:text-white" : ""}`}
                >
                  1
                </Button>
                <Button variant="outline" size="sm" className="h-8 w-8">
                  2
                </Button>
                <Button variant="outline" size="sm" className="h-8 w-8">
                  3
                </Button>
                <Button variant="outline" size="icon" className="h-8 w-8">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="novos">
              <div className="text-center py-8 text-gray-500">Nenhum chamado novo no momento.</div>
            </TabsContent>

            <TabsContent value="concluidos">
              <div className="text-center py-8 text-gray-500">Nenhum chamado concluído no momento.</div>
            </TabsContent>

            <TabsContent value="finalizados">
              <div className="text-center py-8 text-gray-500">Nenhum chamado finalizado com IA no momento.</div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="border rounded-lg p-4">
          <h2 className="font-medium mb-4">Seu Resumo Diário (IA):</h2>
          <div className="flex justify-center mb-4">
            <div className="h-24 w-24 flex items-center justify-center">
              <svg width="96" height="96" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="48" cy="48" r="40" stroke="#F3F4F6" strokeWidth="8" />
                <path
                  d="M48 8C25.92 8 8 25.92 8 48C8 70.08 25.92 88 48 88"
                  stroke="#E91E63"
                  strokeWidth="8"
                  strokeLinecap="round"
                />
                <path
                  d="M76 29.8564L62.5858 43.2707L56.3432 37.028"
                  stroke="#E91E63"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>

          <div className="space-y-4 text-sm">
            <p>Você iniciou o expediente com boa responsabilidade às solicitações de atendimento.</p>
            <p>
              O tempo médio de resposta nos primeiros tickets foi satisfatório (média de 3m20s), porém observou-se uma
              leve queda de rendimento a partir das 10h15, possivelmente devido a sobrecarga momentânea de chamados
              simultâneos.
            </p>
            <p>
              Seu índice de resolução no primeiro contato está em 76%, o que está dentro da meta mínima, mas ainda há
              margem para otimização.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
