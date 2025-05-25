"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Topbar } from "@/components/tobar"

export default function OpenTicket() {
  const [nome, setNome] = useState("")
  const [contato, setContato] = useState("")
  const [setor, setSetor] = useState("recursos-humanos")
  const [tipoProblema, setTipoProblema] = useState("login-conta")
  const [descricao, setDescricao] = useState("")
  const [concordo, setConcordo] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Implementar lógica para enviar o chamado
    console.log({ nome, contato, setor, tipoProblema, descricao, concordo })
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <Topbar />
      <main className="flex-1 h-full w-full flex items-center justify-center">
        <div className="flex justify-center items-center bg-white p-4 h-full w-full">
          <Card className="w-full max-w-xl shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl font-medium">Abrir Chamado</CardTitle>
              <p className="text-sm text-muted-foreground">Preencha os dados para registrar um novo chamado</p>
            </CardHeader>
            <CardContent className="w-full">
              <form onSubmit={handleSubmit} className="space-y-4 w-full">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nome">Nome</Label>
                    <Input id="nome" value={nome} onChange={(e) => setNome(e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contato">Email ou Telefone</Label>
                    <Input id="contato" value={contato} onChange={(e) => setContato(e.target.value)} required />
                  </div>
                </div>

                <div className="space-y-2 w-full">
                  <Label htmlFor="setor">Setor</Label>
                  <Select value={setor} onValueChange={setSetor}>
                    <SelectTrigger className="w-full" id="setor">
                      <SelectValue placeholder="Selecione o setor" />
                    </SelectTrigger>
                    <SelectContent className="w-full">
                      <SelectItem value="recursos-humanos">Recursos Humanos</SelectItem>
                      <SelectItem value="ti">TI</SelectItem>
                      <SelectItem value="financeiro">Financeiro</SelectItem>
                      <SelectItem value="comercial">Comercial</SelectItem>
                      <SelectItem value="operacoes">Operações</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tipo-problema">Tipo de Problema</Label>
                  <Select value={tipoProblema} onValueChange={setTipoProblema}>
                    <SelectTrigger className="w-full" id="tipo-problema">
                      <SelectValue placeholder="Selecione o tipo de problema" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="login-conta">Login e Conta</SelectItem>
                      <SelectItem value="sistema">Sistema</SelectItem>
                      <SelectItem value="acesso">Acesso</SelectItem>
                      <SelectItem value="pagamento">Pagamento</SelectItem>
                      <SelectItem value="outro">Outro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="descricao">Descrição Detalhada</Label>
                  <Textarea id="descricao" value={descricao} onChange={(e) => setDescricao(e.target.value)} rows={5} />
                </div>

                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="concordo"
                    checked={concordo}
                    onCheckedChange={(checked) => setConcordo(checked as boolean)}
                    className="data-[state=checked]:bg-[#e91e63] data-[state=checked]:border-[#e91e63]"
                  />
                  <Label htmlFor="concordo" className="text-xs leading-tight">
                    Concordo com o tratamento dos meus dados pessoais para a finalidade de atendimento do chamado técnico,
                    conforme a Política de Privacidade da empresa.
                  </Label>
                </div>

                <div className="flex justify-end space-x-2 pt-2">
                  <Button type="button" variant="outline">
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={!concordo} className="bg-[#e91e63] hover:bg-[#d81b60]">
                    Abrir Chamado
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
