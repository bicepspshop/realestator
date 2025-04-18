"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, Maximize } from "lucide-react"
import { PropertyGallery } from "../../components/property-gallery"

interface PropertyCarouselProps {
  images: string[]
  propertyType: string
}

export function PropertyCarousel({ images, propertyType }: PropertyCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState<"left" | "right" | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [isGalleryOpen, setIsGalleryOpen] = useState(false)
  const carouselRef = useRef<HTMLDivElement>(null)

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

  const handleThumbnailClick = (index: number) => {
    if (index === currentIndex || isAnimating) return
    
    setDirection(index > currentIndex ? "right" : "left")
    setIsAnimating(true)
    setCurrentIndex(index)
  }

  const openGallery = () => {
    setIsGalleryOpen(true)
  }

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (document.activeElement === carouselRef.current || carouselRef.current?.contains(document.activeElement)) {
        if (e.key === 'ArrowRight') {
          goToNext()
        } else if (e.key === 'ArrowLeft') {
          goToPrev()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isAnimating, imageUrls.length])

  // Reset animation state
  useEffect(() => {
    if (isAnimating) {
      const timer = setTimeout(() => {
        setIsAnimating(false)
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [isAnimating])

  // Auto-play (optional)
  useEffect(() => {
    if (isHovered || imageUrls.length <= 1) return

    const interval = setInterval(() => {
      goToNext()
    }, 6000)

    return () => clearInterval(interval)
  }, [isHovered, isAnimating, imageUrls.length, currentIndex])

  return (
    <>
      <div 
        ref={carouselRef}
        className="relative w-full h-full group focus:outline-none"
        tabIndex={0}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Main Image */}
        <div className="w-full h-full overflow-hidden">
          {imageUrls.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-500 ease-out
                ${index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"}
                ${isAnimating && index === currentIndex && direction === "right"
                  ? "animate-slide-in-right"
                  : isAnimating && index === currentIndex && direction === "left"
                    ? "animate-slide-in-left"
                    : ""
                }`}
            >
              <Image
                src={image || "/placeholder.svg"}
                alt={`${propertyType} - изображение ${index + 1}`}
                fill
                className="object-cover transform transition-transform duration-700 ease-out"
                priority={index === 0}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
              />
            </div>
          ))}
        </div>

        {/* Controls */}
        {imageUrls.length > 1 && (
          <>
            <button
              onClick={goToPrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 
                bg-white/90 backdrop-blur-sm text-[#2C2C2C] rounded-full p-2.5
                opacity-0 group-hover:opacity-100 hover:opacity-100 
                transition-all duration-300 hover:shadow-md active:scale-95 focus:outline-none
                transform hover:scale-105"
              aria-label="Предыдущее изображение"
              disabled={isAnimating}
            >
              <ChevronLeft size={20} />
            </button>
            
            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 
                bg-white/90 backdrop-blur-sm text-[#2C2C2C] rounded-full p-2.5
                opacity-0 group-hover:opacity-100 hover:opacity-100 
                transition-all duration-300 hover:shadow-md active:scale-95 focus:outline-none
                transform hover:scale-105"
              aria-label="Следующее изображение"
              disabled={isAnimating}
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}

        {/* Image counter and full screen button */}
        <div className="absolute bottom-4 right-4 z-20 flex items-center gap-2">
          <div className="bg-white/90 backdrop-blur-sm px-3 py-1.5 text-sm text-[#2C2C2C] rounded-sm font-medium shadow-sm">
            {currentIndex + 1} / {imageUrls.length}
          </div>
          
          <button
            onClick={openGallery}
            className="bg-[#CBA135] hover:bg-[#D4AF37] text-white rounded-sm p-1.5
              transition-all duration-300 hover:shadow-md hover:scale-105 active:scale-95 focus:outline-none"
            aria-label="Открыть галерею"
          >
            <Maximize size={18} />
          </button>
        </div>

        {/* Thumbnail navigation */}
        {imageUrls.length > 1 && (
          <div className="absolute -bottom-1 left-0 right-0 z-20 px-1">
            <div className="flex gap-2 overflow-x-auto pb-2 snap-x scrollbar-hide">
              {imageUrls.map((image, index) => (
                <button
                  key={index}
                  onClick={() => handleThumbnailClick(index)}
                  className={`relative h-14 w-20 md:h-16 md:w-24 flex-shrink-0 overflow-hidden rounded-sm snap-start
                    transition-all duration-300 transform hover:scale-105 focus:outline-none
                    ${index === currentIndex 
                      ? 'ring-2 ring-[#CBA135] ring-offset-2' 
                      : 'ring-1 ring-gray-200 opacity-80 hover:opacity-100'}`}
                >
                  <Image
                    src={image}
                    alt={`Миниатюра ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="96px"
                  />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Full screen gallery */}
      <PropertyGallery
        images={imageUrls}
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
        initialIndex={currentIndex}
      />
    </>
  )
}
