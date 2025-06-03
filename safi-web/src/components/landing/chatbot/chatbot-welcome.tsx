import { motion } from "framer-motion"
import Image from "next/image"

interface ChatbotWelcomeProps {
    SafiBubble: any
    suggestions: string[]
    handleSuggestionClick: (suggestion: string) => void
}

export function ChatbotWelcome({ SafiBubble, suggestions, handleSuggestionClick }: ChatbotWelcomeProps) {
    return (
        <motion.div
            className="text-center text-[#252525]/70 mt-16 flex flex-col items-center justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
        >
            <div className="relative w-20 h-20 cursor-pointer transition-all duration-300 hover:scale-95">
                <Image
                    src={SafiBubble || "/placeholder.svg"}
                    className="object-cover w-full h-full"
                    alt="Safi Bubble"
                />
            </div>
            <motion.h3
                className="text-lg font-semibold mb-2 text-[#252525]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
            >
                Como posso ajudá-lo?
            </motion.h3>
            <motion.p
                className="text-sm text-[#252525]/60 max-w-md mx-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
            >
                Sou sua assistente virtual. Pergunte referente ao uso do sistema e terei prazer em ajudá-lo.
            </motion.p>

            <motion.div
                className="flex flex-wrap justify-center gap-2 max-w-md mx-auto mt-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
            >
                {suggestions.map((suggestion, index) => (
                    <motion.button
                        key={index}
                        className="px-4 py-2 bg-white border border-[#252525]/10 rounded-full text-sm text-[#252525]/80 hover:bg-[#f5f5f5] hover:border-[#252525]/20 transition-all duration-200 shadow-sm cursor-pointer"
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 + index * 0.1 }}
                        onClick={() => handleSuggestionClick(suggestion)}
                        id={`chatbot-suggestion-${index}`}
                    >
                        {suggestion}
                    </motion.button>
                ))}
            </motion.div>
        </motion.div>
    )
}
