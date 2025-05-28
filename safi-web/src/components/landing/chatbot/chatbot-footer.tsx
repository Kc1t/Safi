"use client"

import type React from "react"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CardFooter } from "@/components/ui/card"
import { ArrowUp } from "lucide-react"

interface ChatbotFooterProps {
  input: string
  isLoading: boolean
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onSubmit: (e: React.FormEvent) => void
}

export function ChatbotFooter({ input, isLoading, onInputChange, onSubmit }: ChatbotFooterProps) {
  return (
    <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
      <CardFooter className="p-6 border-t border-[#252525]/10 flex-shrink-0 bg-white/50">
        <form onSubmit={onSubmit} className="flex w-full gap-3 items-center">
          <div className="flex-1 relative">
            <Input
              value={input}
              onChange={onInputChange}
              placeholder="Escreva Algo..."
              className="flex-1 bg-white focus:ring-0 focus:outline-none text-[#252525] placeholder:text-[#475569] py-4 px-6 rounded-full border-[#CBD5E1] border-1 h-full w-full"
              disabled={isLoading}
            />
          </div>
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
  )
}
