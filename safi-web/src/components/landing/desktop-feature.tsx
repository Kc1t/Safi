import Image from "next/image"
import DestkopFeature from "@/assets/desktop-feature.png"

export default function DestktopFeature() {
  return (
    <div className="h-full flex items-center justify-center px-4 md:px-8">
      <div className="max-w-6xl w-full flex flex-col-reverse lg:flex-row gap-8 items-center">
        {/* Left side - Desktop screen image placeholder */}
        <div className="flex justify-center">
          <div className="relative">
            <Image
              src={DestkopFeature}
              alt="Desktop system interface mockup"
              className="h-auto w-[900px] border rounded-lg"
            />
          </div>
        </div>

        {/* Right side - Content */}
        <div className="space-y-6">
          <div className="space-y-4 flex flex-col items-center md:items-start">
            <p className="text-xs sm:text-sm font-semibold text-pink-500 uppercase tracking-widest">Features</p>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 leading-tight">Uifry Premium</h2>
          </div>

          <div className="space-y-4 text-gray-600 leading-relaxed flex flex-col items-center md:items-start w-full">
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed max-w-lg mx-auto lg:mx-0 text-center md:text-left">
              Estamos administrando seu chamado da melhor maneira possível, com um sistema de atendimento automatizado e inteligente, desenhado para farmácias modernas.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
