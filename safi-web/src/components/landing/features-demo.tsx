import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, Ticket, BarChart3, ChevronRight } from "lucide-react"
import Link from "next/link"

export default function FeaturesDemo() {
    return (
        <div className="min-h-screen pt-8 sm:pt-16 px-4 bg-white">
            <div className="container mx-auto max-w-6xl">
                <div className="text-center mb-8 sm:mb-12">
                    <p className="text-pink-500 text-sm font-semibold mb-2">Demonstrações</p>
                    <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-3 text-black">Teste Nossas Features</h1>
                    <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base">
                        Clique em qualquer demo para ser direcionado para uma versão interativa
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                    <Card className="group shadow-none hover:shadow-sm transition-all duration-200 border bg-white p-0">
                        <div className="relative h-48 sm:h-56 bg-gray-100 overflow-hidden rounded-t-lg">
                            <Image
                                src="/shots-ticket.gif"
                                alt="Dashboard Analytics Preview"
                                width={500}
                                height={300}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                        </div>

                        <CardContent className="p-4 sm:p-6">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-8 h-8 bg-pink-50 rounded-lg flex items-center justify-center">
                                    <Ticket className="w-4 h-4 text-pink-500" />
                                </div>
                                <h3 className="text-lg sm:text-xl font-semibold text-black">Simulação de Ticket</h3>
                            </div>

                            <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                                Experimente como seria abrir e acompanhar um ticket real no sistema Safi
                            </p>

                            <div className="space-y-2 mb-4">
                                <div className="flex items-center text-xs text-gray-500">
                                    <ChevronRight className="w-3 h-3 text-gray-400 mr-2 flex-shrink-0" />
                                    Abertura de chamado simulada
                                </div>
                                <div className="flex items-center text-xs text-gray-500">
                                    <ChevronRight className="w-3 h-3 text-gray-400 mr-2 flex-shrink-0" />
                                    Acompanhamento em tempo real
                                </div>
                                <div className="flex items-center text-xs text-gray-500">
                                    <ChevronRight className="w-3 h-3 text-gray-400 mr-2 flex-shrink-0" />
                                    Interface completa do sistema
                                </div>
                            </div>

                            <div className="bg-gray-50 rounded-lg p-3 mb-5">
                                <p className="text-xs text-gray-600">
                                    <strong>Demo interativa:</strong> Ticket real com dados de exemplo e funcionalidades completas
                                </p>
                            </div>

                            <Link href="/ticket/1">
                                <Button className="w-full bg-[#DF1463] hover:bg-pink-600 text-white py-3 sm:py-5">
                                    Ver Ticket Demo
                                    <ArrowRight className="ml-2 w-3 h-3" />
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>

                    <Card className="group shadow-none hover:shadow-sm transition-all duration-200 border bg-white p-0">
                        <div className="relative h-48 sm:h-56 bg-gray-100 overflow-hidden rounded-t-lg">
                            <Image
                                src="/shots-ticket-dash.gif"
                                alt="AI Assistant Preview"
                                width={500}
                                height={300}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                        </div>

                        <CardContent className="p-4 sm:p-6">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-8 h-8 bg-pink-50 rounded-lg flex items-center justify-center">
                                    <BarChart3 className="w-4 h-4 text-pink-500" />
                                </div>
                                <h3 className="text-lg sm:text-xl font-semibold text-black">Dashboard de Tickets</h3>
                            </div>

                            <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                                Explore o painel completo com todos os tickets, análises de IA e métricas em tempo real
                            </p>

                            <div className="space-y-2 mb-4">
                                <div className="flex items-center text-xs text-gray-500">
                                    <ChevronRight className="w-3 h-3 text-gray-400 mr-2 flex-shrink-0" />
                                    Análise inteligente de tickets
                                </div>
                                <div className="flex items-center text-xs text-gray-500">
                                    <ChevronRight className="w-3 h-3 text-gray-400 mr-2 flex-shrink-0" />
                                    Dashboard com métricas avançadas
                                </div>
                                <div className="flex items-center text-xs text-gray-500">
                                    <ChevronRight className="w-3 h-3 text-gray-400 mr-2 flex-shrink-0" />
                                    Visão geral do sistema
                                </div>
                            </div>

                            <div className="bg-gray-50 rounded-lg p-3 mb-5">
                                <p className="text-xs text-gray-600">
                                    <strong>Demo completa:</strong> Dashboard com IA, análises e gestão de tickets por 15 minutos
                                </p>
                            </div>

                            <Link href="/tickets-dashboard">
                                <Button className="w-full bg-[#DF1463] hover:bg-pink-600 text-white py-3 sm:py-5">
                                    Ver Dashboard
                                    <ArrowRight className="ml-2 w-3 h-3" />
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
