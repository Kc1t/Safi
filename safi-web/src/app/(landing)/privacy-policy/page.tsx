import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, Lock, Eye, Users, FileText, Mail, Calendar, MapPin, Phone, Clock } from "lucide-react"
import Navbar from "@/components/landing/navbar"

export default function PrivacyPolicy() {
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
                <Shield className="w-16 h-16 text-[#DF1463]" />
              </div>
            </div>
          </div>
          <Badge
            variant="secondary"
            className="mb-4 bg-[#DF1463]/10 text-[#DF1463] hover:bg-[#DF1463]/20 border-[#DF1463]/20"
          >
            <Lock className="w-3 h-3 mr-1" />
            Documento Legal
          </Badge>
          <h1 className="text-5xl font-bold text-[#252525] mb-6">Política de Privacidade</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Sua privacidade é fundamental para nós. Conheça como coletamos, usamos e protegemos suas informações com
            total transparência e conformidade com a LGPD.
          </p>
          <div className="flex items-center justify-center mt-6 text-sm text-gray-500">
            <Calendar className="w-4 h-4 mr-2" />
            Última atualização: {new Date().toLocaleDateString("pt-BR")}
          </div>
        </div>

        {/* Document Content */}
        <Card className="shadow-sm border-0 bg-white">
          <CardContent className="p-0">
            {/* Document Header */}
            <div className="bg-[#252525] p-8 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-2">SAFI AI - Política de Privacidade</h2>
                  <p className="text-gray-300">Versão 1.0 | Documento Controlado</p>
                </div>
                <div className="text-right">
                  <div className="bg-[#DF1463] rounded-lg p-3">
                    <FileText className="w-8 h-8" />
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
                      A SAFI AI, pessoa jurídica de direito privado, inscrita no CNPJ sob o nº XX.XXX.XXX/0001-XX, com
                      sede na [Endereço Completo], doravante denominada simplesmente "SAFI AI", "nós" ou "nossa", está
                      comprometida em proteger a privacidade e os dados pessoais de todos os usuários de nossa
                      plataforma de inteligência artificial para atendimento ao cliente.
                    </p>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    Esta Política de Privacidade ("Política") tem por objetivo esclarecer de forma transparente como
                    coletamos, utilizamos, armazenamos, compartilhamos e protegemos as informações pessoais dos usuários
                    de nossos serviços, em conformidade com a Lei Geral de Proteção de Dados Pessoais (Lei nº
                    13.709/2018 - LGPD) e demais normas aplicáveis.
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
                    Para os fins desta Política, consideram-se as seguintes definições:
                  </p>
                  <div className="grid gap-4">
                    {[
                      {
                        term: "Dados Pessoais",
                        definition: "informação relacionada a pessoa natural identificada ou identificável",
                      },
                      {
                        term: "Titular",
                        definition: "pessoa natural a quem se referem os dados pessoais que são objeto de tratamento",
                      },
                      {
                        term: "Tratamento",
                        definition:
                          "toda operação realizada com dados pessoais, como coleta, produção, recepção, classificação, utilização, acesso, reprodução, transmissão, distribuição, processamento, arquivamento, armazenamento, eliminação, avaliação ou controle da informação, modificação, comunicação, transferência, difusão ou extração",
                      },
                      {
                        term: "Controlador",
                        definition:
                          "pessoa natural ou jurídica, de direito público ou privado, a quem competem as decisões referentes ao tratamento de dados pessoais",
                      },
                      {
                        term: "Operador",
                        definition:
                          "pessoa natural ou jurídica, de direito público ou privado, que realiza o tratamento de dados pessoais em nome do controlador",
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

                {/* 3. Dados Coletados */}
                <div className="mb-12">
                  <div className="flex items-center mb-6">
                    <div className="bg-[#DF1463] text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4">
                      3
                    </div>
                    <h2 className="text-3xl font-bold text-[#252525] m-0">DADOS PESSOAIS COLETADOS</h2>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8 mb-8">
                    {/* Dados Fornecidos */}
                    <Card className="border-2 border-[#DF1463]/20 hover:border-[#DF1463]/40 transition-colors">
                      <CardContent className="p-6">
                        <div className="flex items-center mb-4">
                          <Users className="w-6 h-6 text-[#DF1463] mr-3" />
                          <h3 className="text-xl font-semibold text-[#252525]">3.1 Dados Fornecidos Diretamente</h3>
                        </div>
                        <div className="space-y-3">
                          {[
                            {
                              icon: "👤",
                              label: "Dados de Identificação",
                              desc: "nome, CPF/CNPJ, RG, data de nascimento",
                            },
                            { icon: "📧", label: "Dados de Contato", desc: "e-mail, telefone, endereço postal" },
                            { icon: "💼", label: "Dados Profissionais", desc: "empresa, cargo, área de atuação" },
                            { icon: "💬", label: "Dados de Comunicação", desc: "mensagens, chamados, feedbacks" },
                            {
                              icon: "⚙️",
                              label: "Dados de Preferências",
                              desc: "configurações, preferências de comunicação",
                            },
                          ].map((item, index) => (
                            <div key={index} className="flex items-start p-3 bg-[#DF1463]/5 rounded-lg">
                              <span className="text-lg mr-3">{item.icon}</span>
                              <div>
                                <div className="font-medium text-[#252525]">{item.label}</div>
                                <div className="text-sm text-gray-600">{item.desc}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Dados Automáticos */}
                    <Card className="border-2 border-[#252525]/20 hover:border-[#252525]/40 transition-colors">
                      <CardContent className="p-6">
                        <div className="flex items-center mb-4">
                          <Eye className="w-6 h-6 text-[#252525] mr-3" />
                          <h3 className="text-xl font-semibold text-[#252525]">3.2 Dados Coletados Automaticamente</h3>
                        </div>
                        <div className="space-y-3">
                          {[
                            { icon: "🌐", label: "Dados de Navegação", desc: "IP, navegador, páginas visitadas" },
                            { icon: "📱", label: "Dados de Dispositivo", desc: "modelo, fabricante, resolução" },
                            { icon: "📊", label: "Dados de Uso", desc: "funcionalidades, frequência, padrões" },
                            { icon: "🍪", label: "Cookies", desc: "conforme Política de Cookies" },
                          ].map((item, index) => (
                            <div key={index} className="flex items-start p-3 bg-[#252525]/5 rounded-lg">
                              <span className="text-lg mr-3">{item.icon}</span>
                              <div>
                                <div className="font-medium text-[#252525]">{item.label}</div>
                                <div className="text-sm text-gray-600">{item.desc}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* 4. Finalidades */}
                <div className="mb-12">
                  <div className="flex items-center mb-6">
                    <div className="bg-[#252525] text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4">
                      4
                    </div>
                    <h2 className="text-3xl font-bold text-[#252525] m-0">FINALIDADES DO TRATAMENTO</h2>
                  </div>
                  <p className="text-gray-700 leading-relaxed mb-8">
                    Os dados pessoais coletados são tratados para as seguintes finalidades, com base nas hipóteses
                    legais previstas na LGPD:
                  </p>

                  <div className="space-y-6">
                    {[
                      {
                        title: "4.1 Execução de Contrato",
                        subtitle: "(Art. 7º, V da LGPD)",
                        color: "#DF1463",
                        items: [
                          "Prestação dos serviços de inteligência artificial",
                          "Processamento e resposta a chamados",
                          "Personalização da experiência do usuário",
                          "Suporte técnico e atendimento",
                          "Faturamento e cobrança dos serviços",
                        ],
                      },
                      {
                        title: "4.2 Legítimo Interesse",
                        subtitle: "(Art. 7º, IX da LGPD)",
                        color: "#252525",
                        items: [
                          "Melhoria dos algoritmos de IA",
                          "Análise de performance da plataforma",
                          "Prevenção a fraudes",
                          "Segurança da informação",
                          "Estudos estatísticos (dados anonimizados)",
                        ],
                      },
                      {
                        title: "4.3 Consentimento",
                        subtitle: "(Art. 7º, I da LGPD)",
                        color: "#DF1463",
                        items: [
                          "Comunicações promocionais e marketing",
                          "Newsletter e materiais educativos",
                          "Pesquisas de satisfação",
                          "Participação em eventos e webinars",
                        ],
                      },
                    ].map((section, index) => (
                      <Card key={index} className="border-0 shadow-lg overflow-hidden">
                        <div className="p-4" style={{ backgroundColor: section.color }}>
                          <h3 className="text-xl font-semibold text-white">{section.title}</h3>
                          <p className="text-white/80 text-sm">{section.subtitle}</p>
                        </div>
                        <CardContent className="p-6">
                          <div className="grid md:grid-cols-2 gap-3">
                            {section.items.map((item, itemIndex) => (
                              <div key={itemIndex} className="flex items-center">
                                <div className="w-2 h-2 bg-[#DF1463] rounded-full mr-3"></div>
                                <span className="text-gray-700">{item}</span>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* 5. Segurança */}
                <div className="mb-12">
                  <div className="flex items-center mb-6">
                    <div className="bg-[#DF1463] text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4">
                      5
                    </div>
                    <h2 className="text-3xl font-bold text-[#252525] m-0">SEGURANÇA E PROTEÇÃO DOS DADOS</h2>
                  </div>

                  <div className="bg-[#DF1463]/5 border border-[#DF1463]/20 rounded-xl p-8 mb-8">
                    <div className="flex items-center mb-4">
                      <Lock className="w-8 h-8 text-[#DF1463] mr-3" />
                      <h3 className="text-xl font-semibold text-[#252525]">Compromisso com a Segurança</h3>
                    </div>
                    <p className="text-gray-700 leading-relaxed">
                      A SAFI AI implementa medidas técnicas e organizacionais rigorosas para proteger os dados pessoais
                      contra acesso não autorizado, alteração, divulgação ou destruição.
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                    <Card className="border-2 border-[#DF1463]/20">
                      <CardContent className="p-6">
                        <div className="flex items-center mb-4">
                          <div className="bg-[#DF1463]/10 p-2 rounded-lg mr-3">
                            <Shield className="w-6 h-6 text-[#DF1463]" />
                          </div>
                          <h4 className="text-lg font-semibold text-[#252525]">Medidas Técnicas</h4>
                        </div>
                        <div className="space-y-2">
                          {[
                            "🔐 Criptografia AES-256",
                            "🔑 Autenticação multifator",
                            "🛡️ Firewalls e detecção de intrusão",
                            "📡 Monitoramento 24/7",
                            "💾 Backups seguros regulares",
                            "🔄 Atualizações de segurança",
                          ].map((item, index) => (
                            <div key={index} className="text-gray-700">
                              {item}
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-2 border-[#252525]/20">
                      <CardContent className="p-6">
                        <div className="flex items-center mb-4">
                          <div className="bg-[#252525]/10 p-2 rounded-lg mr-3">
                            <Users className="w-6 h-6 text-[#252525]" />
                          </div>
                          <h4 className="text-lg font-semibold text-[#252525]">Medidas Organizacionais</h4>
                        </div>
                        <div className="space-y-2">
                          {[
                            "👥 Controle de acesso por função",
                            "📚 Treinamento regular da equipe",
                            "📋 Políticas internas rigorosas",
                            "🔍 Auditorias periódicas",
                            "🚨 Plano de resposta a incidentes",
                            "📝 Contratos de confidencialidade",
                          ].map((item, index) => (
                            <div key={index} className="text-gray-700">
                              {item}
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* 6. Direitos dos Titulares */}
                <div className="mb-12">
                  <div className="flex items-center mb-6">
                    <div className="bg-[#252525] text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4">
                      6
                    </div>
                    <h2 className="text-3xl font-bold text-[#252525] m-0">DIREITOS DOS TITULARES (LGPD)</h2>
                  </div>

                  <div className="bg-[#252525]/5 border border-[#252525]/20 rounded-xl p-8 mb-8">
                    <p className="text-gray-700 leading-relaxed text-center">
                      Em conformidade com a LGPD, você possui direitos fundamentais sobre seus dados pessoais.
                      <br />
                      <strong>Exercite-os a qualquer momento através de nossos canais oficiais.</strong>
                    </p>
                  </div>

                  <div className="grid md:grid-cols-3 gap-6">
                    {[
                      { icon: "🔍", title: "Confirmação", desc: "Confirmar existência de tratamento" },
                      { icon: "👁️", title: "Acesso", desc: "Acessar seus dados pessoais" },
                      { icon: "✏️", title: "Correção", desc: "Corrigir dados incorretos" },
                      { icon: "🗑️", title: "Eliminação", desc: "Solicitar exclusão de dados" },
                      { icon: "📦", title: "Portabilidade", desc: "Transferir para outro fornecedor" },
                      { icon: "🚫", title: "Oposição", desc: "Opor-se ao tratamento" },
                      { icon: "ℹ️", title: "Informações", desc: "Sobre compartilhamento" },
                      { icon: "❌", title: "Não Consentimento", desc: "Consequências da negativa" },
                      { icon: "🔄", title: "Revogação", desc: "Retirar consentimento" },
                    ].map((right, index) => (
                      <Card
                        key={index}
                        className="border border-gray-200 hover:border-[#DF1463] transition-colors hover:shadow-lg"
                      >
                        <CardContent className="p-4 text-center">
                          <div className="text-2xl mb-2">{right.icon}</div>
                          <h4 className="font-semibold text-[#252525] mb-1">{right.title}</h4>
                          <p className="text-sm text-gray-600">{right.desc}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* 7. Contato DPO */}
                {/* <div className="mb-12">
                  <div className="flex items-center mb-6">
                    <div className="bg-[#DF1463] text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4">
                      7
                    </div>
                    <h2 className="text-3xl font-bold text-[#252525] m-0">ENCARREGADO DE PROTEÇÃO DE DADOS</h2>
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
                              <h3 className="text-xl font-semibold text-[#252525]">Entre em Contato</h3>
                              <p className="text-gray-600">Para exercer seus direitos ou esclarecer dúvidas</p>
                            </div>
                          </div>

                          <div className="space-y-4">
                            <div className="flex items-center">
                              <Mail className="w-5 h-5 text-[#DF1463] mr-3" />
                              <div>
                                <div className="font-medium text-[#252525]">E-mail</div>
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
                            <div className="flex items-center">
                              <MapPin className="w-5 h-5 text-[#DF1463] mr-3" />
                              <div>
                                <div className="font-medium text-[#252525]">Endereço</div>
                                <div className="text-gray-600">[Endereço completo]</div>
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
                              <h3 className="text-xl font-semibold text-[#252525]">Horário de Atendimento</h3>
                              <p className="text-gray-600">Estamos aqui para ajudar</p>
                            </div>
                          </div>

                          <div className="bg-white rounded-lg p-6 border border-[#DF1463]/20">
                            <div className="space-y-3">
                              <div className="flex justify-between">
                                <span className="text-gray-700">Segunda a Sexta</span>
                                <span className="font-medium text-[#252525]">9h às 18h</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-700">Sábados</span>
                                <span className="font-medium text-[#252525]">9h às 12h</span>
                              </div>
                              <div className="border-t pt-3 mt-3">
                                <div className="text-sm text-gray-600">
                                  <strong>Prazo de Resposta:</strong> até 15 dias úteis
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
                    <h3 className="text-2xl font-bold mb-4">SAFI AI - Política de Privacidade</h3>
                    <div className="grid md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <div className="font-semibold">Versão</div>
                        <div className="text-gray-300">1.0</div>
                      </div>
                      <div>
                        <div className="font-semibold">Data</div>
                        <div className="text-gray-300">{new Date().toLocaleDateString("pt-BR")}</div>
                      </div>
                      <div>
                        <div className="font-semibold">Status</div>
                        <div className="text-[#DF1463]">Documento Controlado</div>
                      </div>
                    </div>
                    <p className="text-gray-300 mt-4 text-xs">
                      Todas as alterações devem ser aprovadas pelo Encarregado de Proteção de Dados
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
              Imprimir Documento
            </Button>
            <Button className="bg-[#DF1463] hover:bg-[#DF1463]/90 text-white shadow-lg">
              <Mail className="w-4 h-4 mr-2" />
              Falar com o DPO
            </Button>
          </div>
          <p className="text-sm text-gray-500">
            Dúvidas sobre esta política? Nossa equipe está pronta para ajudar você.
          </p>
        </div> */}
      </main>
    </div>
  )
}
