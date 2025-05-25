import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText, Scale, Users, Shield, Settings, AlertTriangle, Mail, Calendar, Phone, Clock } from "lucide-react"
import Navbar from "@/components/landing/navbar"

export default function TermsOfUse() {
    return (
        <div className="min-h-screen overflow-x-hidden">
            <Navbar />

            {/* Main Content */}
            <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-8">
                {/* Hero Section */}
                <div className="text-center mb-16">
                    <div className="flex justify-center mb-8">
                        <div className="relative">
                            <div className="absolute inset-0 bg-[#DF1463] rounded-full blur-lg opacity-20 animate-pulse"></div>
                            <div className="relative bg-white rounded-full p-6 shadow-xl border border-gray-100">
                                <Scale className="w-16 h-16 text-[#DF1463]" />
                            </div>
                        </div>
                    </div>
                    <Badge
                        variant="secondary"
                        className="mb-4 bg-[#DF1463]/10 text-[#DF1463] hover:bg-[#DF1463]/20 border-[#DF1463]/20"
                    >
                        <FileText className="w-3 h-3 mr-1" />
                        Documento Legal
                    </Badge>
                    <h1 className="text-5xl font-bold text-[#252525] mb-6">Termos de Uso</h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                        Conheça as regras e condições para utilização da plataforma SAFI AI. Seu uso implica na concordância com
                        todos os termos aqui estabelecidos.
                    </p>
                    <div className="flex items-center justify-center mt-6 text-sm text-gray-500">
                        <Calendar className="w-4 h-4 mr-2" />
                        Última atualização: 25/05/2025
                    </div>
                </div>

                {/* Document Content */}
                <Card className="shadow-2xl border-0 bg-white">
                    <CardContent className="p-0">
                        {/* Document Header */}
                        <div className="bg-[#252525] p-8 text-white">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-2xl font-bold mb-2">SAFI AI — Termos de Uso</h2>
                                    <p className="text-gray-300">Versão 1.0 | Documento Controlado</p>
                                </div>
                                <div className="text-right">
                                    <div className="bg-[#DF1463] rounded-lg p-3">
                                        <Scale className="w-8 h-8" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-12">
                            <div className="prose prose-lg max-w-none">
                                {/* 1. Introdução */}
                                <div className="mb-12">
                                    <div className="flex items-center mb-6">
                                        <div className="bg-[#DF1463] text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4">
                                            1
                                        </div>
                                        <h2 className="text-3xl font-bold text-[#252525] m-0">INTRODUÇÃO</h2>
                                    </div>
                                    <div className="bg-[#DF1463]/5 border-l-4 border-[#DF1463] p-6 rounded-r-lg mb-6">
                                        <p className="text-gray-700 leading-relaxed m-0">
                                            Estes Termos de Uso ("Termos") regulam o acesso e a utilização da plataforma SAFI AI, um sistema
                                            inteligente voltado ao atendimento e suporte técnico para empresas do setor farmacêutico.
                                        </p>
                                    </div>
                                    <p className="text-gray-700 leading-relaxed">
                                        <strong>Ao utilizar nossos serviços, você concorda com todas as regras aqui descritas.</strong>
                                        Se não concordar com qualquer disposição destes Termos, não utilize a plataforma.
                                    </p>
                                </div>

                                {/* 2. Definições */}
                                <div className="mb-12">
                                    <div className="flex items-center mb-6">
                                        <div className="bg-[#252525] text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4">
                                            2
                                        </div>
                                        <h2 className="text-3xl font-bold text-[#252525] m-0">DEFINIÇÕES</h2>
                                    </div>
                                    <p className="text-gray-700 leading-relaxed mb-6">
                                        Para os fins destes Termos, consideram-se as seguintes definições:
                                    </p>
                                    <div className="grid gap-4">
                                        {[
                                            {
                                                term: "Plataforma",
                                                definition: "o sistema SAFI AI acessado via web, aplicativo ou totem",
                                            },
                                            {
                                                term: "Usuário",
                                                definition: "qualquer pessoa física ou jurídica que utilize a plataforma",
                                            },
                                            {
                                                term: "Conta",
                                                definition: "acesso individual autorizado e identificado por login e senha",
                                            },
                                            {
                                                term: "Chamado",
                                                definition: "solicitação registrada na plataforma, relacionada a suporte técnico",
                                            },
                                            {
                                                term: "Atendimento Automatizado",
                                                definition: "funcionalidades operadas por inteligência artificial",
                                            },
                                        ].map((item, index) => (
                                            <div
                                                key={index}
                                                className="bg-gray-50 border border-gray-200 rounded-lg p-4 hover:shadow-md hover:border-[#DF1463]/30 transition-all"
                                            >
                                                <div className="flex items-start">
                                                    <div className="bg-[#DF1463]/10 text-[#DF1463] rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5 flex-shrink-0">
                                                        {String.fromCharCode(97 + index)}
                                                    </div>
                                                    <div>
                                                        <span className="font-semibold text-[#252525]">{item.term}:</span>{" "}
                                                        <span className="text-gray-700">{item.definition}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* 3. Condições de Uso */}
                                <div className="mb-12">
                                    <div className="flex items-center mb-6">
                                        <div className="bg-[#DF1463] text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4">
                                            3
                                        </div>
                                        <h2 className="text-3xl font-bold text-[#252525] m-0">CONDIÇÕES DE USO</h2>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="bg-[#252525]/5 border border-[#252525]/20 rounded-lg p-6">
                                            <h3 className="text-lg font-semibold text-[#252525] mb-3">Requisitos Básicos</h3>
                                            <p className="text-gray-700 mb-4">
                                                O uso da plataforma está condicionado ao fornecimento de dados verdadeiros e atualizados.
                                            </p>
                                            <p className="text-gray-700">
                                                Cada usuário é responsável pela confidencialidade de suas credenciais de acesso.
                                            </p>
                                        </div>

                                        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                                            <div className="flex items-center mb-4">
                                                <AlertTriangle className="w-6 h-6 text-red-600 mr-3" />
                                                <h3 className="text-lg font-semibold text-red-800">Práticas Proibidas</h3>
                                            </div>
                                            <div className="space-y-3">
                                                {[
                                                    "Utilizar a plataforma para fins ilegais ou não autorizados",
                                                    "Tentar acessar dados de outros usuários sem permissão",
                                                    "Violar a integridade do sistema por meio de engenharia reversa",
                                                    "Explorar falhas de segurança para obter vantagens indevidas",
                                                    "Compartilhar credenciais de acesso com terceiros",
                                                ].map((item, index) => (
                                                    <div key={index} className="flex items-start">
                                                        <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                                                        <span className="text-red-700">{item}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* 4. Serviços Disponíveis */}
                                <div className="mb-12">
                                    <div className="flex items-center mb-6">
                                        <div className="bg-[#252525] text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4">
                                            4
                                        </div>
                                        <h2 className="text-3xl font-bold text-[#252525] m-0">SERVIÇOS DISPONÍVEIS</h2>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-6">
                                        {[
                                            {
                                                icon: "📋",
                                                title: "Registro e Acompanhamento de Chamados",
                                                desc: "Sistema completo para abertura e monitoramento de solicitações",
                                            },
                                            {
                                                icon: "🤖",
                                                title: "Triagem e Classificação com IA",
                                                desc: "Inteligência artificial para categorização automática",
                                            },
                                            {
                                                icon: "📱",
                                                title: "Acesso Multiplataforma",
                                                desc: "Disponível via web, mobile e totem físico",
                                            },
                                            {
                                                icon: "📚",
                                                title: "Base de Conhecimento Colaborativa",
                                                desc: "Repositório de soluções e documentação técnica",
                                            },
                                            {
                                                icon: "👨‍💻",
                                                title: "Suporte Técnico por Especialistas",
                                                desc: "Atendimento humano especializado quando necessário",
                                            },
                                        ].map((service, index) => (
                                            <Card key={index} className="border border-gray-200 hover:border-[#DF1463] transition-colors">
                                                <CardContent className="p-6">
                                                    <div className="flex items-start">
                                                        <span className="text-2xl mr-4">{service.icon}</span>
                                                        <div>
                                                            <h3 className="font-semibold text-[#252525] mb-2">{service.title}</h3>
                                                            <p className="text-gray-600 text-sm">{service.desc}</p>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                </div>

                                {/* 5. Propriedade Intelectual */}
                                <div className="mb-12">
                                    <div className="flex items-center mb-6">
                                        <div className="bg-[#DF1463] text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4">
                                            5
                                        </div>
                                        <h2 className="text-3xl font-bold text-[#252525] m-0">PROPRIEDADE INTELECTUAL</h2>
                                    </div>

                                    <div className="bg-[#DF1463]/5 border border-[#DF1463]/20 rounded-xl p-8">
                                        <div className="flex items-center mb-4">
                                            <Shield className="w-8 h-8 text-[#DF1463] mr-3" />
                                            <h3 className="text-xl font-semibold text-[#252525]">Direitos Autorais e Marcas</h3>
                                        </div>
                                        <p className="text-gray-700 leading-relaxed mb-4">
                                            Todo o conteúdo da plataforma é propriedade da SAFI AI ou de seus licenciadores, incluindo:
                                        </p>
                                        <div className="grid md:grid-cols-2 gap-4">
                                            {[
                                                "Código-fonte e algoritmos",
                                                "Marca e identidade visual",
                                                "Design e interface",
                                                "Fluxos e processos",
                                                "Inteligência artificial integrada",
                                                "Documentação e manuais",
                                            ].map((item, index) => (
                                                <div key={index} className="flex items-center">
                                                    <div className="w-2 h-2 bg-[#DF1463] rounded-full mr-3"></div>
                                                    <span className="text-gray-700">{item}</span>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="mt-6 p-4 bg-white rounded-lg border border-[#DF1463]/30">
                                            <p className="text-sm text-gray-700">
                                                <strong>⚠️ Importante:</strong> É proibida a reprodução, modificação ou distribuição sem
                                                autorização formal por escrito da SAFI AI.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* 6. Limitação de Responsabilidade */}
                                <div className="mb-12">
                                    <div className="flex items-center mb-6">
                                        <div className="bg-[#252525] text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4">
                                            6
                                        </div>
                                        <h2 className="text-3xl font-bold text-[#252525] m-0">LIMITAÇÃO DE RESPONSABILIDADE</h2>
                                    </div>

                                    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-8">
                                        <div className="flex items-center mb-4">
                                            <AlertTriangle className="w-8 h-8 text-yellow-600 mr-3" />
                                            <h3 className="text-xl font-semibold text-[#252525]">Exclusões de Responsabilidade</h3>
                                        </div>
                                        <p className="text-gray-700 leading-relaxed mb-6">
                                            A SAFI AI não se responsabiliza por danos decorrentes de:
                                        </p>
                                        <div className="space-y-4">
                                            {[
                                                {
                                                    title: "Uso Indevido",
                                                    desc: "Erros causados por utilização inadequada da plataforma ou violação destes Termos",
                                                },
                                                {
                                                    title: "Fatores Externos",
                                                    desc: "Interrupções causadas por queda de internet, falhas de hardware do usuário ou problemas de infraestrutura",
                                                },
                                                {
                                                    title: "Ações de Terceiros",
                                                    desc: "Ataques cibernéticos, invasões ou outras ações maliciosas realizadas por terceiros",
                                                },
                                            ].map((item, index) => (
                                                <div key={index} className="bg-white rounded-lg p-4 border border-yellow-300">
                                                    <h4 className="font-semibold text-[#252525] mb-2">{item.title}</h4>
                                                    <p className="text-gray-700 text-sm">{item.desc}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* 7. Suspensão ou Cancelamento */}
                                <div className="mb-12">
                                    <div className="flex items-center mb-6">
                                        <div className="bg-[#DF1463] text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4">
                                            7
                                        </div>
                                        <h2 className="text-3xl font-bold text-[#252525] m-0">SUSPENSÃO OU CANCELAMENTO</h2>
                                    </div>

                                    <div className="bg-red-50 border border-red-200 rounded-xl p-8">
                                        <div className="flex items-center mb-4">
                                            <Users className="w-8 h-8 text-red-600 mr-3" />
                                            <h3 className="text-xl font-semibold text-[#252525]">Motivos para Suspensão</h3>
                                        </div>
                                        <p className="text-gray-700 leading-relaxed mb-6">
                                            A SAFI AI reserva-se o direito de suspender ou cancelar contas nas seguintes situações:
                                        </p>
                                        <div className="grid md:grid-cols-3 gap-4">
                                            {[
                                                {
                                                    icon: "⚖️",
                                                    title: "Violação dos Termos",
                                                    desc: "Descumprimento de qualquer disposição destes Termos de Uso",
                                                },
                                                {
                                                    icon: "🚫",
                                                    title: "Uso Fraudulento",
                                                    desc: "Utilização indevida ou fraudulenta da plataforma",
                                                },
                                                {
                                                    icon: "🏛️",
                                                    title: "Determinação Legal",
                                                    desc: "Solicitação judicial ou de autoridade competente",
                                                },
                                            ].map((reason, index) => (
                                                <div key={index} className="bg-white rounded-lg p-4 border border-red-300 text-center">
                                                    <div className="text-2xl mb-2">{reason.icon}</div>
                                                    <h4 className="font-semibold text-[#252525] mb-2">{reason.title}</h4>
                                                    <p className="text-gray-700 text-sm">{reason.desc}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* 8. Alterações nos Termos */}
                                <div className="mb-12">
                                    <div className="flex items-center mb-6">
                                        <div className="bg-[#252525] text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4">
                                            8
                                        </div>
                                        <h2 className="text-3xl font-bold text-[#252525] m-0">ALTERAÇÕES NOS TERMOS</h2>
                                    </div>

                                    <div className="bg-[#252525]/5 border border-[#252525]/20 rounded-xl p-8">
                                        <div className="flex items-center mb-4">
                                            <Settings className="w-8 h-8 text-[#252525] mr-3" />
                                            <h3 className="text-xl font-semibold text-[#252525]">Atualizações e Modificações</h3>
                                        </div>
                                        <div className="space-y-4">
                                            <p className="text-gray-700 leading-relaxed">
                                                A SAFI AI pode atualizar estes Termos de Uso a qualquer momento, sempre com aviso prévio aos
                                                usuários.
                                            </p>
                                            <div className="bg-white rounded-lg p-4 border border-[#252525]/30">
                                                <p className="text-gray-700">
                                                    <strong>📢 Importante:</strong> O uso contínuo da plataforma após a atualização dos Termos
                                                    implica concordância automática com as novas condições estabelecidas.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* 9. Contato */}
                                {/* <div className="mb-12">
                                    <div className="flex items-center mb-6">
                                        <div className="bg-[#DF1463] text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4">
                                            9
                                        </div>
                                        <h2 className="text-3xl font-bold text-[#252525] m-0">CONTATO</h2>
                                    </div>

                                    <Card className="border-0 shadow-xl bg-[#DF1463]/5">
                                        <CardContent className="p-8">
                                            <div className="grid md:grid-cols-2 gap-8">
                                                <div>
                                                    <div className="flex items-center mb-6">
                                                        <div className="bg-[#DF1463]/10 p-3 rounded-full mr-4">
                                                            <Mail className="w-8 h-8 text-[#DF1463]" />
                                                        </div>
                                                        <div>
                                                            <h3 className="text-xl font-semibold text-[#252525]">Dúvidas sobre os Termos</h3>
                                                            <p className="text-gray-600">Para esclarecimentos ou solicitações</p>
                                                        </div>
                                                    </div>

                                                    <div className="space-y-4">
                                                        <div className="flex items-center">
                                                            <Mail className="w-5 h-5 text-[#DF1463] mr-3" />
                                                            <div>
                                                                <div className="font-medium text-[#252525]">E-mail Geral</div>
                                                                <div className="text-[#DF1463]">contato@safi-ai.me</div>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center">
                                                            <Mail className="w-5 h-5 text-[#DF1463] mr-3" />
                                                            <div>
                                                                <div className="font-medium text-[#252525]">Encarregado de Dados</div>
                                                                <div className="text-[#DF1463]">privacidade@safi-ai.me</div>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center">
                                                            <Phone className="w-5 h-5 text-[#DF1463] mr-3" />
                                                            <div>
                                                                <div className="font-medium text-[#252525]">Telefone</div>
                                                                <div className="text-[#DF1463]">(11) 9999-9999</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div>
                                                    <div className="flex items-center mb-6">
                                                        <div className="bg-[#252525]/10 p-3 rounded-full mr-4">
                                                            <Clock className="w-8 h-8 text-[#252525]" />
                                                        </div>
                                                        <div>
                                                            <h3 className="text-xl font-semibold text-[#252525]">Suporte Oficial</h3>
                                                            <p className="text-gray-600">Atendimento especializado</p>
                                                        </div>
                                                    </div>

                                                    <div className="bg-white rounded-lg p-6 border border-[#DF1463]/20">
                                                        <div className="space-y-3">
                                                            <div className="flex justify-between">
                                                                <span className="text-gray-700">Segunda a Sexta</span>
                                                                <span className="font-medium text-[#252525]">8h às 18h</span>
                                                            </div>
                                                            <div className="flex justify-between">
                                                                <span className="text-gray-700">Sábados</span>
                                                                <span className="font-medium text-[#252525]">8h às 12h</span>
                                                            </div>
                                                            <div className="border-t pt-3 mt-3">
                                                                <div className="text-sm text-gray-600">
                                                                    <strong>Tempo de resposta:</strong> até 24 horas úteis
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div> */}

                                {/* Footer do Documento */}
                                <div className="border-t-2 border-gray-200 pt-8 mt-16">
                                    <div className="bg-[#252525] text-white rounded-xl p-8 text-center">
                                        <h3 className="text-2xl font-bold mb-4">SAFI AI — Termos de Uso</h3>
                                        <div className="grid md:grid-cols-3 gap-4 text-sm">
                                            <div>
                                                <div className="font-semibold">Versão</div>
                                                <div className="text-gray-300">1.0</div>
                                            </div>
                                            <div>
                                                <div className="font-semibold">Data</div>
                                                <div className="text-gray-300">25/05/2025</div>
                                            </div>
                                            <div>
                                                <div className="font-semibold">Status</div>
                                                <div className="text-[#DF1463]">Documento Controlado</div>
                                            </div>
                                        </div>
                                        <p className="text-gray-300 mt-4 text-xs">
                                            📄 Status: Documento Controlado | 📅 Versão: 1.0 | 📆 Data: 25/05/2025
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Footer Actions */}
                {/* <div className="text-center mt-12 space-y-4">
                    <div className="flex justify-center space-x-4">
                        <Button
                            variant="outline"
                            className="border-2 border-[#DF1463]/30 hover:border-[#DF1463] hover:bg-[#DF1463]/5"
                        >
                            <FileText className="w-4 h-4 mr-2" />
                            Imprimir Termos
                        </Button>
                        <Button className="bg-[#DF1463] hover:bg-[#DF1463]/90 text-white shadow-lg">
                            <Mail className="w-4 h-4 mr-2" />
                            Entrar em Contato
                        </Button>
                    </div>
                    <p className="text-sm text-gray-500">
                        Dúvidas sobre estes termos? Nossa equipe jurídica está pronta para esclarecer.
                    </p>
                </div> */}
            </main>
        </div>
    )
}
