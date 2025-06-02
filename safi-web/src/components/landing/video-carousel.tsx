"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { ChevronLeft, ChevronRight, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface Tutorial {
  id: string
  title: string
  description: string
  thumbnail: string
  videoUrl: string
}

const tutorials: Tutorial[] = [
  {
    id: "1",
    title: "Primeiros Passos",
    description: "Navegue pela interface e configure sua conta",
    thumbnail: "/shots-placeholder-2.png",
    videoUrl: "https://www.youtube.com/embed/kQQNymAIbOg",
  },
  {
    id: "2",
    title: "Gerenciamento",
    description: "Crie e organize seus projetos",
    thumbnail: "/shots-placeholder-3.png",
    videoUrl: "https://www.youtube.com/embed/RLEUokEqfJ4",
  },
]

export default function VideoCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedVideo, setSelectedVideo] = useState<Tutorial | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState(0)
  const [itemsPerView, setItemsPerView] = useState(2)

  const containerRef = useRef<HTMLDivElement>(null)
  const startPosRef = useRef(0)
  const currentPosRef = useRef(0)

  useEffect(() => {
    const updateItemsPerView = () => {
      if (window.innerWidth < 640) setItemsPerView(1)
      else if (window.innerWidth < 1024) setItemsPerView(2)
      else setItemsPerView(2)
    }

    updateItemsPerView()
    window.addEventListener("resize", updateItemsPerView)
    return () => window.removeEventListener("resize", updateItemsPerView)
  }, [])

  const maxIndex = Math.max(0, tutorials.length - itemsPerView)

  const nextSlide = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, maxIndex))
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0))
  }

  const openVideo = (tutorial: Tutorial) => {
    if (!isDragging) {
      setSelectedVideo(tutorial)
    }
  }

  const closeVideo = () => {
    setSelectedVideo(null)
  }

  const handleStart = (clientX: number) => {
    setIsDragging(true)
    startPosRef.current = clientX
    currentPosRef.current = clientX
    setDragOffset(0)
  }

  const handleMove = (clientX: number) => {
    if (!isDragging) return

    const diff = clientX - startPosRef.current
    currentPosRef.current = clientX
    setDragOffset(diff)
  }

  const handleEnd = () => {
    if (!isDragging) return

    const diff = currentPosRef.current - startPosRef.current
    const threshold = 50

    if (Math.abs(diff) > threshold) {
      if (diff > 0 && currentIndex > 0) {
        prevSlide()
      } else if (diff < 0 && currentIndex < maxIndex) {
        nextSlide()
      }
    }

    setIsDragging(false)
    setDragOffset(0)
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    handleStart(e.touches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    handleMove(e.touches[0].clientX)
  }

  const handleTouchEnd = () => {
    handleEnd()
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    handleStart(e.clientX)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    handleMove(e.clientX)
  }

  const handleMouseUp = () => {
    handleEnd()
  }

  const handleMouseLeave = () => {
    if (isDragging) {
      handleEnd()
    }
  }

  return (
    <section className="w-full flex items-center justify-center px-4 sm:px-6 py-8 sm:py-12">
      <div className="max-w-6xl w-full">
        <div className="text-center mb-10">
          <div className="space-y-2">
            <p className="text-xs sm:text-sm font-semibold text-pink-500 uppercase tracking-widest">Tutoriais</p>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 leading-tight">
              Conheça Melhor Nosso Sistema
            </h2>
          </div>
          <p className="text-gray-600 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto mt-4">
            Vídeos tutoriais para dominar as funcionalidades do sistema
          </p>
        </div>

        <div className="relative">
          <Button
            variant="outline"
            size="icon"
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-10 h-8 w-8 sm:h-10 sm:w-10 bg-white/90 hover:bg-white border-2 shadow-lg rounded-full"
            onClick={prevSlide}
            disabled={currentIndex === 0}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-10 h-8 w-8 sm:h-10 sm:w-10 bg-white/90 hover:bg-white border-2 shadow-lg rounded-full"
            onClick={nextSlide}
            disabled={currentIndex >= maxIndex}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>

          <div
            className="overflow-hidden mx-4 sm:mx-6 cursor-grab active:cursor-grabbing"
            ref={containerRef}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onMouseDown={handleMouseDown}
            onMouseMove={isDragging ? handleMouseMove : undefined}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
          >
            <div
              className={`flex gap-4 sm:gap-2 lg:gap-2 transition-transform duration-300 ease-out ${isDragging ? "transition-none" : ""
                }`}
              style={{
                transform: `translateX(calc(-${currentIndex * (100 / itemsPerView)}% + ${dragOffset}px))`,
              }}
            >
              {tutorials.map((tutorial) => (
                <div key={tutorial.id} className="flex-none w-full sm:w-1/2 min-h-0 py-5 px-5">
                  <Card className="group cursor-pointer hover:shadow-lg transition-all duration-300 bg-white border shadow-sm select-none h-full p-0">
                    <CardContent className="p-0 h-full flex flex-col">
                      <div
                        className="relative overflow-hidden rounded-t-lg aspect-video"
                        onClick={() => openVideo(tutorial)}
                      >
                        <img
                          src={tutorial.thumbnail || "/placeholder.svg"}
                          alt={tutorial.title}
                          className="w-full h-full object-cover transition-transform duration-200 pointer-events-none group-hover:scale-105"
                          draggable={false}
                        />
                        <div className="absolute inset-0 bg-black/5 group-hover:bg-black/15 transition-colors duration-200" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="bg-pink-500 rounded-full p-3 sm:p-4 transition-all duration-200 group-hover:scale-110 shadow-lg">
                            <Play className="h-4 w-4 sm:h-5 sm:w-5 text-white fill-white" />
                          </div>
                        </div>
                      </div>

                      <div className="p-4 sm:p-6 text-center space-y-2 flex-1 flex flex-col justify-center">
                        <h3 className="font-semibold text-base sm:text-lg text-gray-900 line-clamp-2">
                          {tutorial.title}
                        </h3>
                        <p className="text-gray-600 text-sm sm:text-base line-clamp-2">{tutorial.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-center mt-6 space-x-2">
          {Array.from({ length: maxIndex + 1 }).map((_, index) => (
            <button
              key={index}
              className={`h-2 w-2 sm:h-3 sm:w-3 rounded-full transition-all duration-300 ${index === currentIndex ? "bg-pink-500 scale-110" : "bg-gray-300 hover:bg-gray-400"
                }`}
              onClick={() => setCurrentIndex(index)}
              aria-label={`Ir para slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      <Dialog open={!!selectedVideo} onOpenChange={closeVideo}>
        <DialogContent className="lg:min-w-[40vw] p-0 bg-white">
          <DialogHeader className="p-4 sm:p-6 pb-0">
            <div className="text-center">
              <DialogTitle className="text-gray-900 text-lg sm:text-xl">{selectedVideo?.title}</DialogTitle>
              <p className="text-gray-600 mt-1 text-sm sm:text-base">{selectedVideo?.description}</p>
            </div>
          </DialogHeader>

          {selectedVideo && (
            <div className="aspect-video">
              <iframe
                className="w-full h-full rounded-b-md"
                src={`${selectedVideo.videoUrl}?autoplay=1`}
                title={selectedVideo.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          )}

          {/* <div className="p-4 sm:p-6 pt-4 bg-gray-50 border-t">
            <p className="text-sm text-gray-600 text-center">Tutorial do Sistema Safi</p>
          </div> */}
        </DialogContent>
      </Dialog>
    </section>
  )
}
