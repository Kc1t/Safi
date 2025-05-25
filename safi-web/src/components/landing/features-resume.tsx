import { Card, CardContent } from "@/components/ui/card";
import { BadgeCheck, BrainIcon, Code, LockKeyhole, Rabbit, Settings2 } from "lucide-react";
import { Mail, Phone, MapPin } from "lucide-react"
import { Play } from "lucide-react"
import Image from "next/image"
import { motion } from "framer-motion"
import GridBg from "@/assets/grid-bg.png"
import AiInspect from "@/assets/ai/safi-ai-inspect.png"

import AiPillar from "@/assets/pillars/ai-pillar.png"
import TechPillar from "@/assets/pillars/tech-pillar.png"
import SecPillar from "@/assets/pillars/sec-pillar.png"

export default function FeaturesResume() {
    return (
        <section className="w-full bg-white text-center border py-24 relative" id="pillars">
            <Image
                src={GridBg}
                alt="Imagem de fundo"
                className="absolute select-none left-0 top-0 inset-[10] z-[11] w-full h-[320px]"
            />

            <div className="absolute inset-0 z-[10] bg-gradient-to-b from-[#F7F8FA]/100 tv:from-[#F7F8FA]/100 to-white/100" />
            <div className="max-w-6xl mx-auto relative z-[20]">
                <p className="text-pink-500 text-sm font-semibold mb-2">Pilares Poderosos</p>
                <h2 className="text-3xl md:text-5xl font-bold mb-4">
                    A Safi tem como foco <br /> esse três pilares:
                </h2>

                <div className="grid md:grid-cols-3 gap-6 mt-12">
                    <div className="">
                        <CardContent className="p-6 bg-transparent border-none">
                            <Image src={AiPillar} alt="Ai Pillar" className="w-full h-1/2 mx-auto mb-6 rounded-md border" />
                            <div className="text-left">
                                <h3 className="text-lg font-semibold flex items-center gap-2">
                                    <BrainIcon className="w-4 h-4 text-pink-500" />  Inteligência Artificial
                                </h3>
                                <p className="text-sm text-muted-foreground mt-1">
                                    Automatizamos triagens, categorização de chamados e sugestões de solução com IA integrada — decisões mais rápidas, suporte mais inteligente.
                                </p>
                            </div>
                        </CardContent>
                    </div>

                    <div className="">
                        <CardContent className="p-6 bg-transparent border-none">
                            <Image src={TechPillar} alt="Tech Pillar" className="w-full h-1/2 mx-auto mb-6 rounded-md border" />
                            <div className="text-left">
                                <h3 className="text-lg font-semibold flex items-center gap-2">
                                    <BadgeCheck className="w-4 h-4 text-pink-500" /> Soluções Ágeis
                                </h3>
                                <p className="text-sm text-muted-foreground mt-1">
                                    Software robusto, multiplataforma e responsivo. Abertura de chamados via chatbot, app ou web com triagem automática e priorização inteligente por setor — tudo em segundos.
                                </p>
                            </div>
                        </CardContent>
                    </div>

                    <div className="">
                        <CardContent className="p-6 bg-transparent border-none">
                            <Image src={SecPillar} alt="Sec Pillar" className="w-full h-1/2 mx-auto mb-6 rounded-md border" />
                            <div className="text-left">
                                <h3 className="text-lg font-semibold flex items-center gap-2">
                                    <Rabbit className="w-4 h-4 text-pink-500" />
                                    Conformidade e Segurança
                                </h3>
                                <p className="text-sm text-muted-foreground mt-1">
                                    Sistema construído com base na LGPD, controle rigoroso de dados, autenticação segura e monitoramento contínuo.
                                </p>
                            </div>
                        </CardContent>
                    </div>
                </div>
            </div>
        </section>
    );
}
