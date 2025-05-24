"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"


export default function SupportForm() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        sector: "",
        message: "",
        agreeToTerms: false,
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        console.log("Formulário enviado:", formData)
    }

    const sectors = [
        "Tecnologia",
        "Marketing",
        "Vendas",
        "Recursos Humanos",
        "Financeiro",
        "Operações",
        "Jurídico",
        "Outros",
    ]

    return (
        <div className="min-h-screen container mx-auto max-w-6xl flex items-center justify-center p-4">
            <div className="w-full bg-[#F7F8FA] rounded-2xl border overflow-hidden">
                <div className="grid lg:grid-cols-2 min-h-[600px]">
                    {/* Left Side - Text Content */}
                    <div className="bg-white p-8 lg:p-12 flex flex-col justify-center">
                        <div className="space-y-8">
                            <div>
                                <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                                    Vamos conversar <br />
                                    sobre algo <span className="text-[#DF1463]">incrível</span>
                                    <br />
                                    juntos
                                </h1>
                            </div>

                            <div className="space-y-6">
                                {/* <div className="flex items-center gap-3">
                                    <Mail className="w-5 h-5 text-[#DF1463]" />
                                    <span className="text-gray-700">SoulDesign@gmail.com</span>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="bg-[#DF1463] rounded-lg p-3 flex items-center justify-center min-w-[120px]">
                                        <Phone className="w-4 h-4 text-white mr-2" />
                                        <span className="text-white font-medium">+123 456 789</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <MapPin className="w-5 h-5 text-[#DF1463]" />
                                    <span className="text-gray-700">Rua Exemplo, 123, Casa 456</span>
                                </div> */}
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
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="border-0 border-b-2 border-pink-300 rounded-none bg-transparent focus:border-[#DF1463] px-0 py-3"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="sector" className="text-gray-600 text-sm">
                                    Setor da empresa
                                </Label>
                                <Select value={formData.sector} onValueChange={(value) => setFormData({ ...formData, sector: value })}>
                                    <SelectTrigger className="w-full border-0 border-b-2 border-pink-300 rounded-none bg-transparent focus:border-[#DF1463] px-0 py-3">
                                        <SelectValue placeholder="Selecione o setor" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {sectors.map((sector) => (
                                            <SelectItem key={sector} value={sector}>
                                                {sector}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="message" className="text-gray-600 text-sm">
                                    Sua mensagem
                                </Label>
                                <Textarea
                                    id="message"
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    className="border-0 border-b-2 border-pink-300 rounded-none bg-transparent focus:border-[#DF1463] px-0 py-3 min-h-[100px] resize-none"
                                    required
                                />
                            </div>

                            <div className="flex items-center space-x-3 pt-4">
                                <Checkbox
                                    id="terms"
                                    checked={formData.agreeToTerms}
                                    onCheckedChange={(checked) => setFormData({ ...formData, agreeToTerms: checked as boolean })}
                                    className="rounded-full border-2 border-pink-300 data-[state=checked]:bg-[#DF1463] data-[state=checked]:border-[#DF1463]"
                                    required
                                />
                                <Label htmlFor="terms" className="text-sm text-gray-600 cursor-pointer">
                                    Concordo com os termos e condições
                                </Label>
                            </div>

                            <div className="pt-6">
                                <Button
                                    type="submit"
                                    className="bg-[#DF1463] hover:bg-pink-600 text-white px-8 py-3 rounded-lg font-medium w-full lg:w-auto"
                                    disabled={!formData.agreeToTerms}
                                >
                                    Abrir chamado
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}
