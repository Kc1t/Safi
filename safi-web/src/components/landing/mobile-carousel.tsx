"use client"

import Image from "next/image"
import { useState } from "react"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel"
import { useEffect } from "react"

const images = ["/images/mockup1.png", "/images/mockup2.png", "/images/mockup3.png"]

export default function MobileCarousel() {
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (!api) {
      return
    }

    setCurrent(api.selectedScrollSnap())

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap())
    })
  }, [api])

  return (
    <section className="w-full flex items-center justify-center px-4 sm:px-6 py-8 sm:py-12 bg-white">
      <div className="max-w-6xl w-full flex flex-col lg:flex-row items-center gap-6 sm:gap-8 lg:gap-10">
        {/* Text content */}
        <div className="flex-1 space-y-4 sm:space-y-6 text-center lg:text-left">
          <div className="space-y-2">
            <p className="text-xs sm:text-sm font-semibold text-pink-500 uppercase tracking-widest">Features</p>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 leading-tight">
              Uifry Premium
            </h2>
          </div>
          <p className="text-gray-600 text-sm sm:text-base leading-relaxed max-w-lg mx-auto lg:mx-0">
            Estamos administrando seu chamado da melhor maneira possível, com um sistema de atendimento automatizado e
            inteligente, desenhado para farmácias modernas.
          </p>
        </div>

        {/* Carousel content */}
        <div className="flex-1 w-full max-w-[350px] sm:max-w-[400px] md:max-w-[600px] lg:max-w-[800px] relative">
          <Carousel
            setApi={setApi}
            className="w-full"
            opts={{
              align: "center",
              loop: true,
              slidesToScroll: 1,
            }}
          >
            <CarouselContent className="-ml-2 sm:-ml-4">
              {images.map((src, index) => (
                <CarouselItem key={index} className="pl-2 sm:pl-4 md:basis-1/2 lg:basis-1/2">
                  <div className="p-1 sm:p-2">
                    <div className="border rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                      <Image
                        src={src || "/placeholder.svg"}
                        alt={`Mockup ${index + 1}`}
                        width={0}
                        height={0}
                        className="w-[200px] h-[500px] object-contain"
                      />
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>

            {/* Navigation buttons - melhor posicionamento para mobile */}
            <CarouselPrevious className="left-2 sm:left-4 h-8 w-8 sm:h-10 sm:w-10 bg-white/90 hover:bg-white border-2 shadow-lg" />
            <CarouselNext className="right-2 sm:right-4 h-8 w-8 sm:h-10 sm:w-10 bg-white/90 hover:bg-white border-2 shadow-lg" />
          </Carousel>

          {/* Indicadores de posição */}
          <div className="flex justify-center mt-4 space-x-2">
            {images.map((_, index) => (
              <button
                key={index}
                className={`h-2 w-2 sm:h-3 sm:w-3 rounded-full transition-all duration-300 ${
                  index === current ? "bg-pink-500 scale-110" : "bg-gray-300 hover:bg-gray-400"
                }`}
                onClick={() => api?.scrollTo(index)}
                aria-label={`Ir para slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
