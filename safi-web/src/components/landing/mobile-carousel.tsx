"use client";

import Image from "next/image";
import React, { useState, useEffect } from "react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import MobilePreview1 from "@/assets/screens/mobile-preview-1.png";
import MobilePreview2 from "@/assets/screens/mobile-preview-2.png";
import MobilePreview3 from "@/assets/screens/mobile-preview-3.png";

const images = [MobilePreview1, MobilePreview2, MobilePreview3];

function MobileCarousel() {
  const [api, setApi] = useState<any>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <section className="w-full flex items-center justify-center px-4 sm:px-6 py-8 sm:py-12 bg-white">
      <div className="max-w-7xl w-full flex flex-col lg:flex-row items-center gap-6 sm:gap-8 lg:gap-12 xl:gap-16">
        {/* Texto Section */}
        <div className="flex-1 space-y-4 sm:space-y-6 text-center lg:text-left max-w-lg lg:max-w-none">
          <div className="space-y-2 sm:space-y-3">
            <p className="text-xs sm:text-sm font-semibold text-pink-500 uppercase tracking-widest">
              Funcionalidades
            </p>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 leading-tight">
              Experiência{" "}
              <span className="block sm:inline">Multiplataforma</span>
            </h2>
          </div>
          <p className="text-gray-600 text-sm sm:text-base lg:text-lg leading-relaxed">
            Tenha acesso ao sistema onde estiver. Um app leve e responsivo, disponível em versão mobile, com navegação otimizada e recursos completos de abertura, consulta e acompanhamento de chamados em poucos toques.
          </p>
        </div>

        {/* Carousel Section */}
        <div className="flex-1 w-full max-w-[320px] sm:max-w-[400px] md:max-w-[500px] lg:max-w-[600px] xl:max-w-[700px] relative">
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
                <CarouselItem key={index} className="pl-2 sm:pl-4 basis-1/2 md:basis-2/5 lg:basis-1/2">
                  <div className="flex items-center justify-center p-1 sm:p-2 h-[280px] sm:h-[350px] md:h-[400px] lg:h-[450px] xl:h-[500px]">
                    <div className="relative w-full h-full max-w-[180px] sm:max-w-[220px] md:max-w-[260px] lg:max-w-[280px] xl:max-w-[300px]">
                      <Image
                        src={src || "/placeholder.svg"}
                        alt={`Mockup ${index + 1}`}
                        fill
                        sizes="(max-width: 640px) 180px, (max-width: 768px) 220px, (max-width: 1024px) 260px, (max-width: 1280px) 280px, 300px"
                        className="object-contain drop-shadow-2xl"
                        priority={index === 0}
                      />
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            
            <CarouselPrevious className="left-2 sm:left-4 h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 bg-white/90 hover:bg-white border-2 shadow-lg cursor-pointer" />
            <CarouselNext className="right-2 sm:right-4 h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 bg-white/90 hover:bg-white border-2 shadow-lg cursor-pointer" />
          </Carousel>

          {/* Dots Indicator */}
          <div className="flex justify-center mt-4 sm:mt-6 space-x-2">
            {images.map((_, index) => (
              <button
                key={index}
                className={`h-2 w-2 sm:h-3 sm:w-3 rounded-full transition-all duration-300 ${
                  index === current 
                    ? "bg-pink-500 scale-110" 
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
                onClick={() => api?.scrollTo(index)}
                aria-label={`Ir para slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default MobileCarousel;
