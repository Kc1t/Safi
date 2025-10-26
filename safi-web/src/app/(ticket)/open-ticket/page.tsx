"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Topbar } from "@/components/topbar";

import { useTicketStore } from "@/store/ticketStore";

export default function OpenTicket() {
  const router = useRouter();
  const { ticket, setTicket, resetTicket } = useTicketStore();
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (field: keyof typeof ticket, value: any) => {
    setTicket({ ...ticket, [field]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5080";
      
      // Criar ticket via API
      const response = await fetch(`${API_BASE_URL}/api/tickets/public`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requesterName: ticket.nome,
          requesterEmail: ticket.contato,
          departmentName: ticket.setor,
          title: `[${ticket.tipoProblema}] ${ticket.descricao.substring(0, 100)}...`,
          description: ticket.descricao
        })
      });

      if (!response.ok) {
        throw new Error('Erro ao criar ticket');
      }

      const data = await response.json();
      
      // Salvar ticket ID no store ou localStorage
      if (data.ticketId) {
        localStorage.setItem('currentTicketId', data.ticketId.toString());
      }

      router.push("/client-ticket");
    } catch (error) {
      console.error("Error submitting form:", error);
      alert('Erro ao criar ticket. Verifique se o backend está rodando.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <Topbar />
      <main className="flex-1 h-full w-full flex items-center justify-center">
        <div className="flex justify-center items-center bg-white p-4 h-full w-full">
          <Card className="w-full max-w-xl shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl font-medium">Abrir Chamado</CardTitle>
              <p className="text-sm text-muted-foreground">
                Preencha os dados para registrar um novo chamado
              </p>
            </CardHeader>
            <CardContent className="w-full">
              <form onSubmit={handleSubmit} className="space-y-4 w-full">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nome">Nome</Label>
                    <Input
                      id="nome"
                      value={ticket.nome}
                      onChange={(e) => handleChange("nome", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contato">Email ou Telefone</Label>
                    <Input
                      id="contato"
                      value={ticket.contato}
                      onChange={(e) => handleChange("contato", e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2 w-full">
                  <Label htmlFor="setor">Setor</Label>
                  <Select
                    value={ticket.setor}
                    onValueChange={(value) => handleChange("setor", value)}
                  >
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
                  <Select
                    value={ticket.tipoProblema}
                    onValueChange={(value) => handleChange("tipoProblema", value)}
                  >
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
                  <Textarea
                    id="descricao"
                    value={ticket.descricao}
                    onChange={(e) => handleChange("descricao", e.target.value)}
                    rows={5}
                  />
                </div>

                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="concordo"
                    checked={ticket.concordo}
                    onCheckedChange={(checked) =>
                      handleChange("concordo", checked as boolean)
                    }
                    className="data-[state=checked]:bg-[#e91e63] data-[state=checked]:border-[#e91e63]"
                  />
                  <Label htmlFor="concordo" className="text-xs leading-tight">
                    Concordo com o tratamento dos meus dados pessoais para a finalidade
                    de atendimento do chamado técnico, conforme a Política de
                    Privacidade da empresa.
                  </Label>
                </div>

                <div className="flex justify-end space-x-2 pt-2">
                  <Button type="button" variant="outline" onClick={resetTicket}>
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    disabled={!ticket.concordo || isLoading}
                    className="bg-[#e91e63] hover:bg-[#d81b60]"
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Processando...
                      </div>
                    ) : (
                      "Abrir Chamado"
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
