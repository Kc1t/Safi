"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { ChevronLeft, ChevronRight, Play, X, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface Tutorial {
  id: string
  title: string
  description: string
  duration: string
  category: string
  thumbnail: string
  videoUrl: string
}

const tutorials: Tutorial[] = [
  {
    id: "1",
    title: "Primeiros Passos no Sistema",
    description: "Aprenda como navegar pela interface principal e configurar sua conta",
    duration: "5:30",
    category: "Básico",
    thumbnail: "/placeholder.svg?height=200&width=350",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  },
  {
    id: "2",
    title: "Gerenciando Projetos",
    description: "Como criar, editar e organizar seus projetos de forma eficiente",
    duration: "8:15",
    category: "Intermediário",
    thumbnail: "/placeholder.svg?height=200&width=350",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
  },
  {
    id: "3",
    title: "Colaboração em Equipe",
    description: "Convide membros, defina permissões e trabalhe em conjunto",
    duration: "6:45",
    category: "Avançado",
    thumbnail: "/placeholder.svg?height=200&width=350",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
  },
  {
    id: "4",
    title: "Relatórios e Analytics",
    description: "Gere relatórios detalhados e analise métricas importantes",
    duration: "10:20",
    category: "Avançado",
    thumbnail: "/placeholder.svg?height=200&width=350",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
  },
  {
    id: "5",
    title: "Integrações e API",
    description: "Conecte o sistema com suas ferramentas favoritas",
    duration: "12:10",
    category: "Técnico",
    thumbnail: "/placeholder.svg?height=200&width=350",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
  },
  {
    id: "6",
    title: "Configurações Avançadas",
    description: "Personalize o sistema de acordo com suas necessidades",
    duration: "7:55",
    category: "Avançado",
    thumbnail: "/placeholder.svg?height=200&width=350",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
  },
]

export default function VideoCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedVideo, setSelectedVideo] = useState<Tutorial | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState(0)
  const [itemsPerView, setItemsPerView] = useState(3)

  const containerRef = useRef<HTMLDivElement>(null)
  const startPosRef = useRef(0)
  const currentPosRef = useRef(0)

  useEffect(() => {
    const updateItemsPerView = () => {
      if (window.innerWidth < 640) setItemsPerView(1)
      else if (window.innerWidth < 1024) setItemsPerView(2)
      else setItemsPerView(3)
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

  const getCategoryColor = (category: string) => {
    const colors = {
      Básico: "bg-emerald-500",
      Intermediário: "bg-blue-500",
      Avançado: "bg-purple-500",
      Técnico: "bg-orange-500",
    }
    return colors[category as keyof typeof colors] || "bg-gray-500"
  }

  // Touch/Mouse event handlers
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

  // Touch events
  const handleTouchStart = (e: React.TouchEvent) => {
    handleStart(e.touches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    handleMove(e.touches[0].clientX)
  }

  const handleTouchEnd = () => {
    handleEnd()
  }

  // Mouse events
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
    <section className="py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Tutoriais do Sistema</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Aprenda a usar todas as funcionalidades com nossos vídeos tutoriais
          </p>
        </div>

        {/* Carousel */}
        <div className="relative">
          {/* Navigation Buttons */}
          <Button
            variant="outline"
            size="icon"
            className="absolute left-2 sm:left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md hover:shadow-lg transition-shadow"
            onClick={prevSlide}
            disabled={currentIndex === 0}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="absolute right-2 sm:right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md hover:shadow-lg transition-shadow"
            onClick={nextSlide}
            disabled={currentIndex >= maxIndex}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>

          {/* Video Grid */}
          <div
            className="overflow-hidden mx-8 sm:mx-12 cursor-grab active:cursor-grabbing"
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
              className={`flex gap-4 sm:gap-6 transition-transform duration-300 ease-out ${
                isDragging ? "transition-none" : ""
              }`}
              style={{
                transform: `translateX(calc(-${currentIndex * (100 / itemsPerView)}% + ${dragOffset}px))`,
              }}
            >
              {tutorials.map((tutorial) => (
                <div key={tutorial.id} className="flex-none w-full sm:w-1/2 lg:w-1/3">
                  <Card className="group cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-white border-0 shadow-sm select-none">
                    <CardContent className="p-0">
                      {/* Thumbnail */}
                      <div className="relative overflow-hidden rounded-lg" onClick={() => openVideo(tutorial)}>
                        <img
                          src={tutorial.thumbnail || "/placeholder.svg"}
                          alt={tutorial.title}
                          className="w-full h-40 sm:h-48 object-cover group-hover:scale-105 transition-transform duration-300 pointer-events-none"
                          draggable={false}
                        />
                        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-colors duration-300" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="bg-white/90 rounded-full p-3 group-hover:bg-white group-hover:scale-110 transition-all duration-300">
                            <Play className="h-5 w-5 text-gray-900 fill-current" />
                          </div>
                        </div>

                        {/* Duration Badge */}
                        <div className="absolute bottom-3 right-3 bg-black/70 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {tutorial.duration}
                        </div>

                        {/* Category Badge */}
                        <div
                          className={`absolute top-3 left-3 ${getCategoryColor(tutorial.category)} text-white text-xs px-2 py-1 rounded`}
                        >
                          {tutorial.category}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-4">
                        <h3 className="font-semibold text-base sm:text-lg text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-1">
                          {tutorial.title}
                        </h3>
                        <p className="text-gray-600 text-sm line-clamp-2">{tutorial.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Dots Indicator */}
        <div className="flex justify-center mt-8 gap-2">
          {Array.from({ length: maxIndex + 1 }).map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentIndex ? "bg-blue-600" : "bg-gray-300 hover:bg-gray-400"
              }`}
              onClick={() => setCurrentIndex(index)}
            />
          ))}
        </div>
      </div>

      {/* Video Modal */}
      <Dialog open={!!selectedVideo} onOpenChange={closeVideo}>
        <DialogContent className="max-w-4xl w-full p-0 bg-black">
          <DialogHeader className="p-4 sm:p-6 pb-0">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <DialogTitle className="text-white text-lg sm:text-xl">{selectedVideo?.title}</DialogTitle>
                <p className="text-gray-300 mt-1 text-sm sm:text-base">{selectedVideo?.description}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={closeVideo}
                className="text-white hover:bg-white/10 flex-shrink-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>

          {selectedVideo && (
            <div className="aspect-video">
              <video src={selectedVideo.videoUrl} controls autoPlay className="w-full h-full">
                Seu navegador não suporta o elemento de vídeo.
              </video>
            </div>
          )}

          {selectedVideo && (
            <div className="p-4 sm:p-6 pt-4">
              <div className="flex items-center gap-3 text-sm text-gray-300">
                <div className={`${getCategoryColor(selectedVideo.category)} text-white text-xs px-2 py-1 rounded`}>
                  {selectedVideo.category}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {selectedVideo.duration}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  )
}
