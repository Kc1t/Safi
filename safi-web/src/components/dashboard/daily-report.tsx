"use client"

import { useState, useEffect } from "react"
import SafiBubble from "@/assets/ai/safi-bubble.png"
import Image from "next/image"

const DailyReportAI = () => {
  const [displayedText, setDisplayedText] = useState("")
  const [currentParagraph, setCurrentParagraph] = useState(0)
  const [isTyping, setIsTyping] = useState(true)
  const [showCursor, setShowCursor] = useState(true)

  const paragraphs = [
    "Você iniciou o expediente com boa responsabilidade às solicitações de atendimento.",
    "O tempo médio de resposta nos primeiros tickets foi satisfatório (média de 3m20s), porém observou-se uma leve queda de rendimento a partir das 10h15, possivelmente devido a sobrecarga momentânea de chamados simultâneos.",
    "Seu índice de resolução no primeiro contato está em 76%, o que está dentro da meta mínima, mas ainda há margem para otimização.",
  ]

  const fullText = paragraphs.join(" ")

  useEffect(() => {
    if (currentParagraph >= paragraphs.length) {
      setIsTyping(false)
      return
    }

    const targetText = paragraphs.slice(0, currentParagraph + 1).join(" ")

    if (displayedText.length < targetText.length) {
      const timer = setTimeout(
        () => {
          setDisplayedText(targetText.slice(0, displayedText.length + 1))
        },
        Math.random() * 15 + 10,
      ) 

      return () => clearTimeout(timer)
    } else {
      // Pausa entre parágrafos
      const timer = setTimeout(() => {
        setCurrentParagraph((prev) => prev + 1)
      }, 200)

      return () => clearTimeout(timer)
    }
  }, [displayedText, currentParagraph, paragraphs])

  // Animação do cursor piscando
  useEffect(() => {
    const cursorTimer = setInterval(() => {
      setShowCursor((prev) => !prev)
    }, 300)

    return () => clearInterval(cursorTimer)
  }, [])

  const renderAnimatedText = () => {
    const words = displayedText.split(" ")
    let wordIndex = 0

    return paragraphs.map((paragraph, pIndex) => {
      const paragraphWords = paragraph.split(" ")
      const paragraphText = paragraphWords.map((word, wIndex) => {
        const currentWordIndex = wordIndex++
        const isVisible = currentWordIndex < words.length

        if (word === "76%") {
          return (
            <span
              key={`${pIndex}-${wIndex}`}
              className={`font-semibold text-[#e91e63] transition-opacity duration-200 ${
                isVisible ? "opacity-100" : "opacity-0"
              }`}
            >
              {isVisible ? word : ""}{" "}
            </span>
          )
        }

        return (
          <span
            key={`${pIndex}-${wIndex}`}
            className={`transition-opacity duration-200 ${isVisible ? "opacity-100" : "opacity-0"}`}
          >
            {isVisible ? word : ""}{" "}
          </span>
        )
      })

      return (
        <p key={pIndex} className="mb-4 last:mb-0">
          {paragraphText}
        </p>
      )
    })
  }

  return (
    <div className="border rounded-lg p-6 bg-white h-fit w-full">
      <h2 className="font-semibold text-gray-900 mb-6 text-center">Seu Resumo Diário (IA)</h2>

      <div className="flex flex-col items-center justify-center mb-6">
        <div className="h-18 w-18 flex items-center justify-center relative">
          <Image src={SafiBubble || "/placeholder.svg"} className="object-cover w-full h-full" alt="Safi Bubble" />
          {/* {isTyping && (
            <div className="absolute -top-2 -right-2">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-[#e91e63] rounded-full animate-bounce"></div>
                <div
                  className="w-2 h-2 bg-[#e91e63] rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                ></div>
                <div
                  className="w-2 h-2 bg-[#e91e63] rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
              </div>
            </div>
          )} */}
        </div>
      </div>

      <hr className="w-full h-1" />

      <div className="mt-6">
        <h2 className="font-semibold text-gray-900 mb-2 text-center">
          Análise Resumida
          {isTyping && (
            <span className="ml-2 text-[#e91e63] text-sm">
              <span className="inline-flex items-center">
                <span className="animate-spin rounded-full h-3 w-3 border-b-2 border-[#e91e63] mr-1"></span>
                Analisando...
              </span>
            </span>
          )}
        </h2>

        <div className="space-y-4 text-sm text-gray-600 leading-relaxed min-h-[120px]">
          {renderAnimatedText()}
          {isTyping && showCursor && <span className="inline-block w-0.5 h-4 bg-[#e91e63] animate-pulse ml-1"></span>}
        </div>

        {!isTyping && (
          <div className="mt-4 text-center">
            <span className="text-xs text-green-600 font-medium">✓ Análise concluída</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default DailyReportAI
