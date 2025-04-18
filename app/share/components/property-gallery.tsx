"use client"

import { useState } from "react"
import Image from "next/image"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { ChevronLeft, ChevronRight, X } from "lucide-react"

interface PropertyImage {
  id: string
  image_url: string
}

interface PropertyGalleryProps {
  images: PropertyImage[]
  isOpen: boolean
  onClose: () => void
}

export function PropertyGallery({ images, isOpen, onClose }: PropertyGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextImage = () => {
    if (images.length <= 1) return
    setCurrentIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    if (images.length <= 1) return
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  if (images.length === 0) return null

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-5xl w-full p-0 bg-black/95 border-none">
        <div className="relative h-[80vh] w-full">
          <button
            className="absolute top-2 right-2 z-50 text-white hover:bg-black/50 rounded-full p-2"
            onClick={onClose}
          >
            <X className="h-6 w-6" />
          </button>

          <div className="relative h-full w-full flex items-center justify-center">
            <Image
              src={images[currentIndex]?.image_url || "/placeholder.svg?height=600&width=800&query=property"}
              alt={`Изображение ${currentIndex + 1}`}
              fill
              className="object-contain"
              sizes="(max-width: 1200px) 100vw, 1200px"
              priority
            />

            {images.length > 1 && (
              <>
                <button
                  className="absolute left-2 z-10 bg-black/30 hover:bg-black/50 text-white rounded-full p-2"
                  onClick={prevImage}
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  className="absolute right-2 z-10 bg-black/30 hover:bg-black/50 text-white rounded-full p-2"
                  onClick={nextImage}
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </>
            )}
          </div>

          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
            {images.map((_, idx) => (
              <button
                key={idx}
                className={`h-2 rounded-full transition-all ${
                  idx === currentIndex ? "w-8 bg-white" : "w-2 bg-white/60"
                }`}
                onClick={() => setCurrentIndex(idx)}
              />
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
