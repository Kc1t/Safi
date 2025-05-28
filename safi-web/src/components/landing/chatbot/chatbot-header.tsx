"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { CardHeader, CardTitle } from "@/components/ui/card"
import { X, Minimize2, Maximize2 } from "lucide-react"
import SafiBubble from "@/assets/ai/safi-bubble.png"

interface ChatbotHeaderProps {
    onToggle: () => void
    isExpanded: boolean
    onExpandToggle: () => void
}

export function ChatbotHeader({ onToggle, isExpanded, onExpandToggle }: ChatbotHeaderProps) {
    return (
        <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
            <CardHeader className="bg-gradient-to-r from-[#DF1463] to-[#DF1463]/90 text-white flex-shrink-0 h-full">
                <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-3 text-xl font-semibold py-3">
                        <div
                            className="relative w-8 h-8 md:w-15 md:h-15 cursor-pointer transition-all duration-300 hover:scale-95"
                            onClick={onToggle}
                        >
                            <Image
                                src={SafiBubble}
                                className="object-cover w-full h-full"
                                alt="Safi Bubble"
                            />
                        </div>
                        <motion.span
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-sm md:text-lg"
                        >
                            Safi - (AI Powered)
                        </motion.span>
                    </CardTitle>
                    <div className="flex gap-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onExpandToggle}
                            className="text-white hover:bg-white/20 hover:border-white/60 border border-white/30 hover:text-white h-8 w-8 p-0 transition-all duration-200"
                            title={isExpanded ? "Minimizar" : "Expandir"}
                        >
                            {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onToggle}
                            className="text-white hover:bg-white/20 hover:border-white/60 border border-white/30 hover:text-white h-8 w-8 p-0 transition-all duration-200"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </CardHeader>
        </motion.div>
    )
}
