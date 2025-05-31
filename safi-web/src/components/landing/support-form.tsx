"use client"

import type React from "react"
import { useState } from "react"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useTicketStore } from "@/store/ticketStore"


export default function SupportForm() {
    const router = useRouter()
    const { ticket, setTicket, resetTicket } = useTicketStore()
    const [isLoading, setIsLoading] = useState(false)

    const handleChange = (field: keyof typeof ticket, value: any) => {
        setTicket({ ...ticket, [field]: value })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        
        try {
            localStorage.setItem("userName", ticket.nome)
            localStorage.setItem("userContact", ticket.contato)
            localStorage.setItem("userSector", ticket.setor)
            localStorage.setItem("userDescription", ticket.descricao)
            
            // Simulate some processing time
            await new Promise(resolve => setTimeout(resolve, 1000))
            
            router.push("/client-ticket")
        } catch (error) {
            console.error("Error submitting form:", error)
        } finally {
            setIsLoading(false)
        }
    }

    const sectors = [
        "recursos-humanos",
        "ti",
        "financeiro",
        "comercial",
        "operacoes",
    ]

    return (
        <div className="container mx-auto max-w-6xl flex items-center justify-center p-4 my-12" id="support">
            <div className="w-full bg-[#F7F8FA] rounded-2xl border overflow-hidden">
                <div className="grid lg:grid-cols-2 min-h-[600px]">
                    {/* Left Side - Text Content */}
                    <div className="bg-white p-8 lg:p-12 flex flex-col justify-center">
                        <div className="space-y-8">
                            <div>
                                <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                                    Pronto para testar?
                                    Explore agora mesmo  <br />
                                    <span className="text-[#DF1463]">os recursos da SAFI.</span>
                                    <br />
                                </h1>
                            </div>

                            <div className="space-y-6">
                            </div>
                        </div>
                    </div>

                    {/* Right Side - Form */}
                    <div className="bg-gray-50 p-8 lg:p-12 flex flex-col justify-center">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-gray-600 text-sm">
                                    Seu nome
                                </Label>
                                <Input
                                    id="name"
                                    type="text"
                                    value={ticket.nome}
                                    onChange={(e) => handleChange("nome", e.target.value)}
                                    className="border-0 border-b-2 border-pink-300 rounded-none bg-transparent focus:border-[#DF1463] px-0 py-3"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-gray-600 text-sm">
                                    Seu e-mail
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={ticket.contato}
                                    onChange={(e) => handleChange("contato", e.target.value)}
                                    className="border-0 border-b-2 border-pink-300 rounded-none bg-transparent focus:border-[#DF1463] px-0 py-3"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="sector" className="text-gray-600 text-sm">
                                    Setor da empresa
                                </Label>
                                <Select value={ticket.setor} onValueChange={(value) => handleChange("setor", value)}>
                                    <SelectTrigger className="w-full border-0 border-b-2 border-pink-300 rounded-none bg-transparent focus:border-[#DF1463] px-0 py-3">
                                        <SelectValue placeholder="Selecione o setor" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="recursos-humanos">Recursos Humanos</SelectItem>
                                        <SelectItem value="ti">TI</SelectItem>
                                        <SelectItem value="financeiro">Financeiro</SelectItem>
                                        <SelectItem value="comercial">Comercial</SelectItem>
                                        <SelectItem value="operacoes">Operações</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="message" className="text-gray-600 text-sm">
                                    Sua mensagem
                                </Label>
                                <Textarea
                                    id="message"
                                    value={ticket.descricao}
                                    onChange={(e) => handleChange("descricao", e.target.value)}
                                    className="border-0 border-b-2 border-pink-300 rounded-none bg-transparent focus:border-[#DF1463] px-0 py-3 min-h-[100px] resize-none"
                                    required
                                />
                            </div>

                            <div className="flex items-center space-x-3 pt-4">
                                <Checkbox
                                    id="terms"
                                    checked={ticket.concordo}
                                    onCheckedChange={(checked) => handleChange("concordo", checked as boolean)}
                                    className="rounded-full border-2 border-pink-300 data-[state=checked]:bg-[#DF1463] data-[state=checked]:border-[#DF1463] cursor-pointer"
                                    required
                                />
                                <Label htmlFor="terms" className="text-sm text-gray-600 cursor-pointer">
                                    Concordo com o tratamento dos meus dados pessoais para a finalidade de atendimento do chamado técnico, conforme a Política de Privacidade da empresa.
                                </Label>
                            </div>

                            <div className="pt-6 flex items-end justify-end w-full">
                                <Button
                                    type="submit"
                                    className="bg-[#DF1463] hover:bg-pink-600 text-white px-8 py-3 rounded-lg font-medium w-full lg:w-auto"
                                    disabled={!ticket.concordo || isLoading}
                                >
                                    {isLoading ? (
                                        <div className="flex items-center gap-2">
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            Enviando...
                                        </div>
                                    ) : (
                                        "Simular chamado"
                                    )}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}
