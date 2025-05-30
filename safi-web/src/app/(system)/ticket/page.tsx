"use client"

import { Topbar } from "@/components/tobar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Archive, Mail, Phone, Send } from "lucide-react"

export default function Ticket() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Topbar />
      <main className="flex-1 flex items-center">
        <Card className="max-w-6xl mx-auto shadow-lg">
          <CardContent className="p-6">
            {/* Header Section */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-medium text-gray-900">Ticket# 2025-CS123</h1>
                <Badge variant="secondary" className="bg-orange-100 text-orange-800 hover:bg-orange-100">
                  RH
                </Badge>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="outline" size="sm" className="text-gray-600">
                  Escalonar N2
                </Button>
                <Button size="sm" className="bg-pink-500 hover:bg-pink-600 text-white">
                  Encerrar Chamado
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Content Area */}
              <div className="lg:col-span-2 space-y-6">
                {/* Customer Info */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src="/placeholder.svg" />
                      <AvatarFallback className="bg-amber-600 text-white">LR</AvatarFallback>
                    </Avatar>
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">Leticia Rocha</h2>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                        <div className="flex items-center gap-1">
                          <Phone className="h-4 w-4" />
                          <span>(11) 485950-9393</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Mail className="h-4 w-4" />
                          <span>leticiarocha@unipharma.com</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div>
                      <div className="text-sm text-gray-500 mb-1">Prioridade</div>
                      <Select defaultValue="baixa">
                        <SelectTrigger className="w-24 h-8 text-sm">
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
                      <div className="text-sm text-gray-500 mb-1">Status</div>
                      <Select defaultValue="pendente">
                        <SelectTrigger className="w-28 h-8 text-sm">
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

                {/* Summary Section */}
                <div className="border-t pt-4">
                  <div className="flex items-center gap-2 mb-3">
                    <h3 className="font-medium text-gray-900">Resumo - Erro no Sistema</h3>
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    O usuário "JohnDoe123" está com dificuldades para acessar sua conta de e-mail. Ao tentar fazer login
                    usando suas credenciais, eles encontram um erro mensagem informando "Nome de usuário ou senha
                    inválidos..." <span className="text-blue-600 cursor-pointer">(MAIS)</span>
                  </p>
                </div>

                {/* Conversation */}
                <div className="space-y-4">
                  {/* Message from Leticia */}
                  <div className="flex gap-3">
                    <Avatar className="h-8 w-8 mt-1">
                      <AvatarFallback className="bg-amber-600 text-white text-xs">L</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm">Leticia</span>
                        <span className="text-xs text-gray-500">RH</span>
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        O usuário "JohnDoe123" está com dificuldades para acessar sua conta de e-mail. Ao tentar fazer
                        login usando suas credenciais, eles encontram um erro.
                      </p>
                      <div className="text-xs text-gray-400 mt-2">11:05</div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="flex justify-center my-6">
                    <Button className="bg-pink-500 hover:bg-pink-600 text-white px-8 py-2 rounded-full">
                      Com Que Posso Ajudar?
                    </Button>
                  </div>
                </div>

                {/* Response Input */}
                <div className="border-t pt-4">
                  <div className="flex items-center gap-3">
                    <div className="flex-1 relative">
                      <Input placeholder="Enviar Resposta" className="pr-10 border-gray-300" />
                      <Button
                        size="icon"
                        variant="ghost"
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 text-pink-500 hover:text-pink-600"
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Sidebar */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Arquivo:</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-blue-600 cursor-pointer">Download</span>
                    <Archive className="h-4 w-4 text-gray-400" />
                  </div>
                </div>

                <div className="text-sm text-gray-600">
                  <span className="font-medium">Criação:</span> 23/03/2025 (1 Dias)
                </div>

                <div>
                  <h3 className="font-medium text-gray-900 mb-4">Histórico</h3>
                  <div className="space-y-4">
                    {/* History Item 1 */}
                    <div className="flex gap-3">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="bg-gray-600 text-white text-xs">A</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Analista N1</span>
                          <span className="text-xs text-gray-400">25 Mai</span>
                        </div>
                        <p className="text-xs text-gray-600">Recebeu Chamado Escalonado</p>
                      </div>
                    </div>

                    {/* History Item 2 */}
                    <div className="flex gap-3">
                      <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Analista N0</span>
                          <span className="text-xs text-gray-400">24 Mai</span>
                        </div>
                        <p className="text-xs text-gray-600">Tentou Resolver</p>
                      </div>
                    </div>

                    {/* History Item 3 */}
                    <div className="flex gap-3">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="bg-amber-600 text-white text-xs">L</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Leticia Rocha</span>
                          <span className="text-xs text-gray-400">24 Mai</span>
                        </div>
                        <p className="text-xs text-gray-600">Abriu o Chamado</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
