"use client"

import { useState, useEffect } from "react"
import Image from "next/image"

interface PropertyCarouselProps {
  images: string[]
  propertyType: string
}

export function PropertyCarousel({ images, propertyType }: PropertyCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState<"left" | "right" | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)

  // Используем placeholder, если нет изображений
  const imageUrls = images.length > 0 ? images : ["/placeholder.svg"]

  const goToNext = () => {
    if (isAnimating || imageUrls.length <= 1) return
    setDirection("right")
    setIsAnimating(true)
    setCurrentIndex((prev) => (prev + 1) % imageUrls.length)
  }

  const goToPrev = () => {
    if (isAnimating || imageUrls.length <= 1) return
    setDirection("left")
    setIsAnimating(true)
    setCurrentIndex((prev) => (prev - 1 + imageUrls.length) % imageUrls.length)
  }

  useEffect(() => {
    if (isAnimating) {
      const timer = setTimeout(() => {
        setIsAnimating(false)
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [isAnimating])

  return (
    <div className="relative w-full h-full">
      {imageUrls.map((image, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-all duration-300 ease-in-out ${
            index === currentIndex ? "opacity-100 z-10" : "opacity-0"
          } ${
            isAnimating && index === currentIndex && direction === "right"
              ? "animate-slide-in-right"
              : isAnimating && index === currentIndex && direction === "left"
                ? "animate-slide-in-left"
                : ""
          }`}
        >
          <Image
            src={image || "/placeholder.svg"}
            alt={`Фото ${propertyType}`}
            fill
            className="object-cover"
            priority={index === 0}
          />
        </div>
      ))}

      {imageUrls.length > 1 && (
        <>
          <button
            onClick={goToPrev}
            className="absolute left-4 top-1/2 h-10 w-10 -translate-y-1/2 rounded-full bg-black/50 text-white flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity z-20 text-2xl"
            aria-label="Предыдущее изображение"
          >
            ‹
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 h-10 w-10 -translate-y-1/2 rounded-full bg-black/50 text-white flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity z-20 text-2xl"
            aria-label="Следующее изображение"
          >
            ›
          </button>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 px-3 py-1 text-sm text-white rounded-full z-20">
            {currentIndex + 1} / {imageUrls.length}
          </div>
        </>
      )}
    </div>
  )
}
