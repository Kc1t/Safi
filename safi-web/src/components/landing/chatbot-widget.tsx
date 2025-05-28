"use client"

import { useState } from "react"
// import { useChat } from "ai/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageCircle, X, Send, Bot, User, Minimize2 } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useGeminiChat } from "@/hooks/useGeminiChat"
import { motion, AnimatePresence } from "framer-motion"

export default function ChatbotWidget() {
    const [isOpen, setIsOpen] = useState(false)
    const { messages, input, handleInputChange, handleSubmit, isLoading } = useGeminiChat()

    const toggleChat = () => {
        setIsOpen(!isOpen)
    }

    return (
        <>
            <div className="fixed bottom-6 right-6 z-50">
                <Button
                    onClick={toggleChat}
                    size="lg"
                    className="rounded-full w-16 h-16 shadow-lg hover:shadow-xl transition-all duration-300 bg-slate-800 hover:bg-slate-700 border-2 border-slate-600"
                >
                    {/* {isOpen ? <X className="h-7 w-7" /> : <MessageCircle className="h-7 w-7" />} */}
                </Button>
            </div>

            {/* Modal Backdrop with animation */}
            <AnimatePresence >
                {isOpen && (
                    <motion.div
                        className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        onClick={toggleChat}
                    >
                        {/* Chat Modal - Centered with animations */}
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0, y: 50 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.8, opacity: 0, y: 50 }}
                            transition={{
                                type: "spring",
                                stiffness: 300,
                                damping: 30,
                            }}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full max-w-2xl"
                        >
                            <Card className="h-[600px] shadow-2xl border-0 flex flex-col overflow-hidden p-0">
                                <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
                                    <CardHeader className="bg-slate-800 text-white flex-shrink-0 h-full">
                                        <div className="flex items-center justify-between">
                                            <CardTitle className="flex items-center gap-3 text-xl font-semibold py-3">
                                                <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center">
                                                    <Bot className="h-5 w-5" />
                                                </div>
                                                <motion.span
                                                    initial={{ opacity: 0, x: -10 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: 0.2 }}
                                                >
                                                    Assistente Virtual
                                                </motion.span>
                                            </CardTitle>
                                            <div className="flex gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={toggleChat}
                                                    className="text-white hover:bg-slate-700 h-8 w-8 p-0"
                                                >
                                                    <Minimize2 className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={toggleChat}
                                                    className="text-white hover:bg-slate-700 h-8 w-8 p-0"
                                                >
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </CardHeader>
                                </motion.div>

                                <CardContent className="flex-1 p-0 overflow-hidden">
                                    <ScrollArea className="h-full p-6">
                                        <AnimatePresence mode="wait">
                                            {messages.length === 0 ? (
                                                <motion.div
                                                    className="text-center text-slate-600 mt-16"
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: 0.3 }}
                                                >
                                                    <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                                        <Bot className="h-10 w-10 text-slate-600" />
                                                    </div>
                                                    <motion.h3
                                                        className="text-lg font-semibold mb-2"
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        transition={{ delay: 0.4 }}
                                                    >
                                                        Como posso ajudá-lo?
                                                    </motion.h3>
                                                    <motion.p
                                                        className="text-sm text-slate-500 max-w-md mx-auto"
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        transition={{ delay: 0.5 }}
                                                    >
                                                        Sou seu assistente virtual. Faça qualquer pergunta e terei prazer em ajudá-lo.
                                                    </motion.p>
                                                </motion.div>
                                            ) : (
                                                <div className="space-y-6">
                                                    <AnimatePresence>
                                                        {messages.map((message, index) => (
                                                            <motion.div
                                                                key={message.id}
                                                                className={`flex gap-4 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                                                                initial={{ opacity: 0, y: 20, scale: 0.8 }}
                                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                                exit={{ opacity: 0, y: -20, scale: 0.8 }}
                                                                transition={{
                                                                    type: "spring",
                                                                    stiffness: 500,
                                                                    damping: 30,
                                                                    delay: index * 0.1,
                                                                }}
                                                            >
                                                                {message.role === "assistant" && (
                                                                    <motion.div
                                                                        className="flex-shrink-0"
                                                                        initial={{ scale: 0 }}
                                                                        animate={{ scale: 1 }}
                                                                        transition={{ delay: 0.2 }}
                                                                    >
                                                                        <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center">
                                                                            <Bot className="h-4 w-4 text-slate-600" />
                                                                        </div>
                                                                    </motion.div>
                                                                )}

                                                                <motion.div
                                                                    className={`max-w-[75%] rounded-2xl px-4 py-3 ${message.role === "user"
                                                                            ? "bg-slate-800 text-white"
                                                                            : "bg-slate-50 text-slate-900 border border-slate-200"
                                                                        }`}
                                                                >
                                                                    <motion.p
                                                                        className="text-sm leading-relaxed whitespace-pre-wrap"
                                                                        initial={{ opacity: 0 }}
                                                                        animate={{ opacity: 1 }}
                                                                        transition={{ delay: 0.1 }}
                                                                    >
                                                                        {message.content}
                                                                    </motion.p>
                                                                </motion.div>

                                                                {message.role === "user" && (
                                                                    <motion.div
                                                                        className="flex-shrink-0"
                                                                        initial={{ scale: 0 }}
                                                                        animate={{ scale: 1 }}
                                                                        transition={{ delay: 0.2 }}
                                                                    >
                                                                        <div className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center">
                                                                            <User className="h-4 w-4 text-white" />
                                                                        </div>
                                                                    </motion.div>
                                                                )}
                                                            </motion.div>
                                                        ))}
                                                    </AnimatePresence>

                                                    <AnimatePresence>
                                                        {isLoading && (
                                                            <motion.div
                                                                className="flex gap-4 justify-start"
                                                                initial={{ opacity: 0, y: 20 }}
                                                                animate={{ opacity: 1, y: 0 }}
                                                                exit={{ opacity: 0, y: -20 }}
                                                                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                                            >
                                                                <div className="flex-shrink-0">
                                                                    <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center">
                                                                        <Bot className="h-4 w-4 text-slate-600" />
                                                                    </div>
                                                                </div>
                                                                <div className="bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3">
                                                                    <div className="flex space-x-1">
                                                                        {[0, 1, 2].map((i) => (
                                                                            <motion.div
                                                                                key={i}
                                                                                className="w-2 h-2 bg-slate-400 rounded-full"
                                                                                animate={{ y: [0, -8, 0] }}
                                                                                transition={{
                                                                                    duration: 0.6,
                                                                                    repeat: Number.POSITIVE_INFINITY,
                                                                                    delay: i * 0.1,
                                                                                    ease: "easeInOut",
                                                                                }}
                                                                            />
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </div>
                                            )}
                                        </AnimatePresence>
                                    </ScrollArea>
                                </CardContent>

                                <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
                                    <CardFooter className="p-6 border-t border-slate-200 flex-shrink-0">
                                        <form onSubmit={handleSubmit} className="flex w-full gap-3">
                                            <Input
                                                value={input}
                                                onChange={handleInputChange}
                                                placeholder="Digite sua mensagem..."
                                                className="flex-1 border-slate-300 focus:border-slate-500 focus:ring-slate-500 rounded-xl"
                                                disabled={isLoading}
                                            />
                                            <Button
                                                type="submit"
                                                disabled={isLoading || !input.trim()}
                                                className="bg-slate-800 hover:bg-slate-700 rounded-xl px-6"
                                            >
                                                <Send className="h-4 w-4" />
                                            </Button>
                                        </form>
                                    </CardFooter>
                                </motion.div>
                            </Card>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}
