"use client"

import { Play } from "lucide-react"
import Image from "next/image"
import { motion } from "framer-motion"
import GridBg from "@/assets/grid-bg.png"
import AiInspect from "@/assets/ai/safi-ai-inspect.png"

const Header = () => {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.1,
            },
        },
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: "easeOut",
            },
        },
    }

    const titleVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.8,
                ease: "easeOut",
            },
        },
    }

    const floatVariants = {
        animate: {
            y: [-10, 10, -10],
            transition: {
                duration: 4,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
            },
        },
    }

    return (
        <div className="h-full relative">
            {/* Animated Background */}
            <Image
                src={GridBg}
                alt="Imagem de fundo"
                className="absolute select-none left-0 top-0 inset-[10] z-[10] w-full h-[320px]"
            />

            <div className="absolute inset-0 z-[1] bg-gradient-to-b from-[#F7F8FA] tv:from-[#F7F8FA]/100 to-white/40" />

            <section className="w-full pt-32 z-[10] relative">
                <div className="container mx-auto px-4">
                    <motion.div
                        className="flex flex-col items-center text-center space-y-6 max-w-6xl mx-auto"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        {/* Top Link */}
                        <motion.div
                            className="flex items-center text-sm text-gray-600 hover:text-gray-900 font-semibold border px-2 md:px-6 py-2 rounded-lg transition-colors cursor-pointer"
                            variants={itemVariants}
                            whileHover={{
                                scale: 1.05,
                                boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                            }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <span>Quer Abrir um Chamado? Sem Problemas!</span>
                        </motion.div>

                        {/* Main Heading */}
                        <motion.div className="space-y-4" variants={itemVariants}>
                            <motion.h1
                                className="text-2xl md:text-5xl lg:text-6xl font-bold text-[#111827] leading-[0.9]"
                                variants={titleVariants}
                            >
                                <motion.span
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.5, duration: 0.6 }}
                                >
                                    Centralize, Automatize e Resolva:{" "}
                                </motion.span>
                                <motion.span
                                    className="block"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.8, duration: 0.6 }}
                                >
                                    Seu Suporte Técnico Inteligente com IA
                                </motion.span>
                            </motion.h1>

                            <motion.p
                                className="text-sm md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 1.1, duration: 0.6 }}
                            >
                                Transforme solicitações em soluções com um sistema de atendimento automatizado e inteligente, desenhado
                                para farmácias modernas.
                            </motion.p>
                        </motion.div>

                        {/* Video Demo Section */}
                        <div className="w-full max-w-5xl mx-auto mt-4">
                            <div className="relative group cursor-pointer flex flex-col items-center justify-center">
                                <Image
                                    src={AiInspect}
                                    alt="Demo do sistema de suporte técnico inteligente"
                                    className="z-[99] w-auto h-[60px] md:h-[100px] lg:h-[140px]"
                                />
                                <div className="relative overflow-hidden rounded-lg shadow-2xl border w-full">
                                    <Image
                                        src="/demo-video.png"
                                        alt="Demo do sistema de suporte técnico inteligente"
                                        width={1400}
                                        height={800}
                                        className="w-full h-auto"
                                        priority
                                    />

                                    {/* Play Button Overlay */}
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="bg-pink-500 hover:bg-pink-600 transition-all duration-300 rounded-full p-6 shadow-lg group-hover:scale-110">
                                            <Play className="w-8 h-8 text-white fill-white ml-1" />
                                        </div>
                                    </div>

                                    {/* Gradient Overlay */}
                                    <div className="absolute inset-0 bg-black bg-opacity-10 group-hover:bg-opacity-20 transition-all duration-300 rounded-lg"></div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    )
}

export default Header
