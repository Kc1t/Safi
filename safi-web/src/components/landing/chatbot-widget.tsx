"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { X, Send, Bot, User, Minimize2, ArrowUp } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import SafiBubble from "@/assets/ai/safi-bubble.png"
import { usePublicChat } from "@/hooks/public-chat"

export default function ChatbotWidget() {
    const [isOpen, setIsOpen] = useState(false)
    const { messages, input, handleInputChange, handleSubmit, isLoading } = usePublicChat()

    const toggleChat = () => {
        setIsOpen(!isOpen)
    }

    return (
        <>
            <div className="fixed bottom-6 right-6 z-50 w-20 h-20">
                <div
                    className="relative w-full h-full cursor-pointer transition-all duration-300 hover:scale-95"
                    onClick={toggleChat}
                >
                    <Image src={SafiBubble || "/placeholder.svg"} className="object-cover w-full h-full" alt="Safi Bubble" />
                </div>
            </div>

            {/* Modal Backdrop with animation */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className="fixed inset-0 bg-[#252525]/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
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
                            className="w-full max-w-2xl border-none"
                        >
                            <Card className="h-[600px] flex flex-col border-none overflow-hidden p-0 gap-0 bg-white">
                                <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
                                    <CardHeader className="bg-gradient-to-r from-[#DF1463] to-[#DF1463]/90 text-white flex-shrink-0 h-full">
                                        <div className="flex items-center justify-between">
                                            <CardTitle className="flex items-center gap-3 text-xl font-semibold py-3">
                                                <div
                                                    className="relative w-8 h-8 md:w-15 md:h-15 cursor-pointer transition-all duration-300 hover:scale-95"
                                                    onClick={toggleChat}
                                                >
                                                    <Image
                                                        src={SafiBubble || "/placeholder.svg"}
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
                                                    onClick={toggleChat}
                                                    className="text-white hover:bg-white/20 hover:border-white/60 border border-white/30 hover:text-white h-8 w-8 p-0 transition-all duration-200"
                                                >
                                                    <Minimize2 className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={toggleChat}
                                                    className="text-white hover:bg-white/20 hover:border-white/60 border border-white/30 hover:text-white h-8 w-8 p-0 transition-all duration-200"
                                                >
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </CardHeader>
                                </motion.div>

                                <CardContent className="flex-1 overflow-hidden w-full">
                                    <ScrollArea className="h-full w-full py-3">
                                        <AnimatePresence mode="wait">
                                            {messages.length === 0 ? (
                                                <motion.div
                                                    className="text-center text-[#252525]/70 mt-16 flex flex-col items-center justify-center"
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: 0.3 }}
                                                >
                                                    <div
                                                        className="relative w-20 h-20 cursor-pointer transition-all duration-300 hover:scale-95"
                                                    >
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
                                                                        <div
                                                                            className="relative w-8 h-8 cursor-pointer transition-all duration-300 hover:scale-95"
                                                                        >
                                                                            <Image
                                                                                src={SafiBubble || "/placeholder.svg"}
                                                                                className="object-cover w-full h-full"
                                                                                alt="Safi Bubble"
                                                                            />
                                                                        </div>
                                                                    </motion.div>
                                                                )}

                                                                <motion.div
                                                                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${message.role === "user"
                                                                        ? "bg-[#252525] text-white"
                                                                        : "bg-white text-[#252525] border border-[#252525]/10"
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

                                                                {/* {message.role === "user" && (
                                                                    <motion.div
                                                                        className="flex-shrink-0"
                                                                        initial={{ scale: 0 }}
                                                                        animate={{ scale: 1 }}
                                                                        transition={{ delay: 0.2 }}
                                                                    >
                                                                        <div className="w-8 h-8 bg-[#252525] rounded-full flex items-center justify-center shadow-sm">
                                                                            <User className="h-4 w-4 text-white" />
                                                                        </div>
                                                                    </motion.div>
                                                                )} */}
                                                            </motion.div>
                                                        ))}
                                                    </AnimatePresence>

                                                    <AnimatePresence>
                                                        {isLoading && (
                                                            <motion.div
                                                                className="flex gap-4 justify-start"
                                                                initial={{ opacity: 0, y: 10 }}
                                                                animate={{ opacity: 1, y: 0 }}
                                                                exit={{ opacity: 0, y: -20 }}
                                                                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                                            >
                                                                <div className="flex-shrink-0">
                                                                    <div className="w-8 h-8 bg-[#DF1463]/10 border border-[#DF1463]/20 rounded-full flex items-center justify-center">
                                                                        <Bot className="h-4 w-4 text-[#DF1463]" />
                                                                    </div>
                                                                </div>
                                                                <div className="bg-white border border-[#252525]/10 shadow-sm rounded-2xl px-4 py-3">
                                                                    <div className="flex space-x-1">
                                                                        {[0, 1, 2].map((i) => (
                                                                            <motion.div
                                                                                key={i}
                                                                                className="w-2 h-2 bg-[#DF1463] rounded-full"
                                                                                animate={{ y: [0, -2, 0] }}
                                                                                transition={{
                                                                                    duration: 0.9,
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
                                    <CardFooter className="p-6 border-t border-[#252525]/10 flex-shrink-0 bg-white/50">
                                        <form onSubmit={handleSubmit} className="flex w-full gap-3 items-center">
                                            <div className="flex-1 relative">
                                                {/* <div className="flex items-center bg-white border border-[#252525]/10 rounded-full px-4 py-3 gap-3"> */}
                                                <Input
                                                    value={input}
                                                    onChange={handleInputChange}
                                                    placeholder="Escreva Algo..."
                                                    className="flex-1 bg-white focus:ring-0 focus:outline-none text-[#252525] placeholder:text-[#475569] py-4 px-6 rounded-full border-[#CBD5E1] border-1 h-full w-full"
                                                    disabled={isLoading}
                                                />
                                                {/* <div className="flex items-center gap-2">
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="sm"
                                                            className="h-6 w-6 p-0 hover:bg-[#232525]/10 rounded-full"
                                                        >
                                                            <svg className="h-4 w-4 text-[#252525]/60" fill="currentColor" viewBox="0 0 24 24">
                                                                <path d="M12 2C13.1 2 14 2.9 14 4V11C14 12.1 13.1 13 12 13C10.9 13 10 12.1 10 11V4C10 2.9 10.9 2 12 2ZM19 11C19 14.53 16.39 17.44 13 17.93V21H11V17.93C7.61 17.44 5 14.53 5 11H7C7 13.76 9.24 16 12 16S17 13.76 17 11H19Z" />
                                                            </svg>
                                                        </Button>
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="sm"
                                                            className="h-6 w-6 p-0 hover:bg-[#252525]/10 rounded-full"
                                                        >
                                                            <svg className="h-4 w-4 text-[#252525]/60" fill="currentColor" viewBox="0 0 24 24">
                                                                <path d="M16.5 6V17.5C16.5 19.71 14.71 21.5 12.5 21.5C10.29 21.5 8.5 19.71 8.5 17.5V5C8.5 3.62 9.62 2.5 11 2.5C12.38 2.5 13.5 3.62 13.5 5V15.5C13.5 16.05 13.05 16.5 12.5 16.5C11.95 16.5 11.5 16.05 11.5 15.5V6H10V15.5C10 16.88 11.12 18 12.5 18C13.88 18 15 16.88 15 15.5V5C15 2.79 13.21 1 11 1C8.79 1 7 2.79 7 5V17.5C7 20.54 9.46 23 12.5 23C15.54 23 18 20.54 18 17.5V6H16.5Z" />
                                                            </svg>
                                                        </Button>
                                                    </div> */}
                                            </div>
                                            {/* </div> */}
                                            <Button
                                                type="submit"
                                                disabled={isLoading || !input.trim()}
                                                className="bg-[#DF1463] hover:bg-[#DF1463]/90 text-white border-0 rounded-full h-12 w-12 p-0 shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 flex-shrink-0 text-2xl"
                                            >
                                                <ArrowUp />
                                            </Button>
                                        </form>
                                    </CardFooter>
                                </motion.div>
                            </Card>
                        </motion.div>
                    </motion.div >
                )
                }
            </AnimatePresence >
        </>
    )
}
