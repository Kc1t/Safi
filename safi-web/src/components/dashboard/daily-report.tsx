import React from 'react'
import SafiBubble from "@/assets/ai/safi-bubble.png"
import Image from "next/image"

const DailyReportAI = () => {
  return (
         <div className="border rounded-lg p-6 bg-white h-fit w-full">
          <h2 className="font-semibold text-gray-900 mb-6 text-center">Seu Resumo Diário (IA)</h2>

          <div className="flex flex-col items-center justify-center mb-6">
            <div className="h-18 w-18 flex items-center justify-center">
              <Image
                src={SafiBubble || "/placeholder.svg"}
                className="object-cover w-full h-full"
                alt="Safi Bubble"
              />
            </div>
          </div>
          <hr className="w-full h-1" />
          <div className="mt-6">
            <h2 className="font-semibold text-gray-900 mb-2 text-center">Análise Resumida </h2>
            <div className="space-y-4 text-sm text-gray-600 leading-relaxed">
              <p>Você iniciou o expediente com boa responsabilidade às solicitações de atendimento.</p>
              <p>
                O tempo médio de resposta nos primeiros tickets foi satisfatório (média de 3m20s), porém observou-se uma
                leve queda de rendimento a partir das 10h15, possivelmente devido a sobrecarga momentânea de chamados
                simultâneos.
              </p>
              <p>
                Seu índice de resolução no primeiro contato está em <span className="font-semibold text-[#e91e63]">76%</span>,
                o que está dentro da meta mínima, mas ainda há margem para otimização.
              </p>
            </div>
          </div>
        </div>
  )
}

export default DailyReportAI
