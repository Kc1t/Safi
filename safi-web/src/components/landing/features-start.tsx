import { TrendingUp, BarChart3, Users, BrainCog, SlidersHorizontal, SmartphoneNfc } from "lucide-react"

export default function FeaturesStart() {
    return (
        <section className="mt-12">
            <div className="py-16 px-4 container mx-auto max-w-6xl border-t">
                <div className="w-full mx-auto px-4">
                    <div className="grid md:grid-cols-3 gap-4">
                        <div className="text-center space-y-4 flex gap-4">
                            <div className="w-11 h-11 min-h-11 min-w-11 md:w-15 md:h-15 md:min-h-15 md:min-w-15 bg-[#DF1463]/0 border-[#DF1463] border rounded-full flex items-center justify-center">
                                <BrainCog className="w-4 h-4 md:w-6 md:h-6 text-[#DF1463]" />
                            </div>
                            <p className="text-gray-700 leading-relaxed text-left text-sm md:text-base">
                                Chamados analisados em tempo real com auxílio de IA — respostas mais rápidas desde o primeiro clique.
                            </p>
                        </div>

                        <div className="text-center space-y-4 flex gap-4">
                            <div className="w-11 h-11 min-h-11 min-w-11 md:w-15 md:h-15 md:min-h-15 md:min-w-15 border-[#DF1463] border rounded-full flex items-center justify-center">
                                <SlidersHorizontal className="w-4 h-4 md:w-6 md:h-6 text-[#DF1463]" />
                            </div>
                            <p className="text-gray-700 leading-relaxed text-left text-sm md:text-base">
                                Cada chamado recebe um peso com base no setor de origem, garantindo atendimento inteligente e eficiente.
                            </p>
                        </div>

                        <div className="text-center space-y-4 flex gap-4">
                            <div className="w-11 h-11 min-h-11 min-w-11 md:w-15 md:h-15 md:min-h-15 md:min-w-15 border-[#DF1463] border rounded-full flex items-center justify-center">
                                <SmartphoneNfc className="w-4 h-4 md:w-6 md:h-6 text-[#DF1463]" />
                            </div>
                            <p className="text-gray-700 leading-relaxed text-left text-sm md:text-base">
                                Abertura de chamados por chatbot, app ou web — o suporte vai até você, onde estiver.
                            </p>
                        </div>

                    </div>
                </div>
            </div>
        </section>
    )
}
