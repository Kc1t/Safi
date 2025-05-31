"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, ChevronLeft, ChevronRight } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import DailyReportAI from "./daily-report"
import { ticketsData } from "@/data/tickets-data"
import Link from "next/link"

export function Dashboard() {
  const [activeTab, setActiveTab] = useState("todos")
  const [currentPage, setCurrentPage] = useState(1)
  const [ticketsPerPage] = useState(3)

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

  // Pagination calculations
  const totalPages = Math.ceil(ticketsData.length / ticketsPerPage)
  const startIndex = (currentPage - 1) * ticketsPerPage
  const endIndex = startIndex + ticketsPerPage
  const currentTickets = ticketsData.slice(startIndex, endIndex)

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  const handlePreviousPage = () => {
    handlePageChange(currentPage - 1)
  }

  const handleNextPage = () => {
    handlePageChange(currentPage + 1)
  }

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = []
    const maxVisiblePages = 4

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      if (currentPage <= 2) {
        pages.push(1, 2, 3)
      } else if (currentPage >= totalPages - 1) {
        pages.push(totalPages - 2, totalPages - 1, totalPages)
      } else {
        pages.push(currentPage - 1, currentPage, currentPage + 1)
      }
    }

    return pages
  }

  // Reset to page 1 when changing tabs
  const handleTabChange = (value: string) => {
    setActiveTab(value)
    setCurrentPage(1)
  }

  return (
    <div className="container mx-auto py-6 max-w-7xl flex-col flex px-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Chamados Abertos</h1>
      </div>

      <div className="w-full h-full flex flex-col lg:flex-row gap-4 lg:gap-8">
        <div className="flex-1 lg:flex-[2.5] flex flex-col">
          <div className="py-4 mb-1\ flex flex-col sm:flex-row gap-4">
            <div className="relative w-full gap-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                placeholder="Procurar Chamado"
                className="pl-10 h-10 rounded-full"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Select>
                <SelectTrigger className="h-10 rounded-full w-full">
                  <SelectValue placeholder="Semana" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="atual">Semana Atual</SelectItem>
                  <SelectItem value="anterior">Semana Anterior</SelectItem>
                  <SelectItem value="proxima">Próxima Semana</SelectItem>
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger className="h-10 rounded-full w-full">
                  <SelectValue placeholder="Prioridade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="alta">Alta</SelectItem>
                  <SelectItem value="media">Média</SelectItem>
                  <SelectItem value="baixa">Baixa</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="">
            <div className="w-full">
              <Tabs defaultValue="todos" className="w-full" onValueChange={handleTabChange}>
                <TabsList className="flex flex-wrap mb-4 w-full bg-white shadow-sm">
                  <TabsTrigger value="todos" className="">
                    <span className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-[#e91e63]"></span>
                      <span className="hidden sm:inline">Todos Tickets</span>
                      <span className="sm:hidden">Todos</span>
                    </span>
                  </TabsTrigger>
                  <TabsTrigger value="novos">
                    Novos
                  </TabsTrigger>
                  <TabsTrigger value="concluidos">
                    <span className="hidden sm:inline">Concluídos</span>
                    <span className="sm:hidden">Feitos</span>
                  </TabsTrigger>
                  <TabsTrigger value="finalizados">
                    <span className="hidden sm:inline">Finalizado com IA</span>
                    <span className="sm:hidden">IA</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="todos" className="space-y-4">
                  {currentTickets.map((ticket) => (
                    <div key={ticket.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-white">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
                        <div className="flex items-center gap-3 flex-wrap">
                          <div className="flex items-center gap-2">
                            <span
                              className={`h-2 w-2 rounded-full ${ticket.department === "RH" ? "bg-pink-500" : ticket.department === "Financeiro" ? "bg-amber-500" : "bg-orange-500"}`}
                            ></span>
                            <span className="font-medium text-gray-900 text-sm sm:text-base">Ticket# {ticket.number}</span>
                          </div>
                          <Badge className={getDepartmentColor(ticket.department)}>{ticket.department}</Badge>
                        </div>
                        <div className="flex items-center gap-2 self-start">
                          <Avatar className="h-8 w-8">
                            <AvatarImage
                              src={ticket.assignedTo.avatar || `/placeholder.svg?height=32&width=32`}
                              alt={ticket.assignedTo.name}
                            />
                            <AvatarFallback className="text-xs">{ticket.assignedTo.initials}</AvatarFallback>
                          </Avatar>
                          <span className="text-sm text-gray-600 hidden sm:inline">{ticket.assignedTo.name}</span>
                        </div>
                      </div>

                      <h4 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">{ticket.title}</h4>
                      <p className="text-sm text-gray-600 mb-4 leading-relaxed">{ticket.description}</p>

                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div className="text-xs text-gray-500 leading-relaxed">
                          Aberto às {ticket.openedAt} · Triagem: IA ({ticket.triage}) · Nível De Complexidade: {ticket.complexity}
                        </div>
                        <Link href={`/ticket/${ticket.id}`}>
                          <Button size="sm" className="bg-[#e91e63] hover:bg-[#d81b60] text-white font-medium self-start sm:self-auto text-xs sm:text-sm">
                            <span className="hidden sm:inline">Acompanhar Chamado</span>
                            <span className="sm:hidden">Acompanhar</span>
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}

                  {totalPages > 1 && (
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-8">
                      <div className="text-sm text-gray-500 order-2 sm:order-1">
                        Mostrando {startIndex + 1} a {Math.min(endIndex, ticketsData.length)} de {ticketsData.length} chamados
                      </div>

                      <div className="flex items-center justify-center gap-2 order-1 sm:order-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 sm:h-9 sm:w-9"
                          onClick={handlePreviousPage}
                          disabled={currentPage === 1}
                        >
                          <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
                        </Button>

                        {getPageNumbers().map((pageNumber) => (
                          <Button
                            key={pageNumber}
                            variant="outline"
                            size="sm"
                            className={`h-8 w-8 sm:h-9 sm:w-9 text-xs sm:text-sm ${currentPage === pageNumber
                              ? "bg-[#e91e63] text-white hover:bg-[#d81b60] hover:text-white border-[#e91e63]"
                              : "hover:bg-gray-50"
                              }`}
                            onClick={() => handlePageChange(pageNumber)}
                          >
                            {pageNumber}
                          </Button>
                        ))}

                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 sm:h-9 sm:w-9"
                          onClick={handleNextPage}
                          disabled={currentPage === totalPages}
                        >
                          <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
                        </Button>
                      </div>
                    </div>
                  )}

                  {ticketsData.length === 0 && (
                    <div className="text-center py-8 text-gray-500">Nenhum chamado encontrado.</div>
                  )}
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

          </div>
        </div>
        <div className="w-full lg:w-120 lg:flex-[1]">
          <DailyReportAI />
        </div>
      </div>
    </div>
  )
}
