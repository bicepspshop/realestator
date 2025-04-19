"use client"

import { useState, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import { Copy, ExternalLink, ChevronLeft, ChevronRight, LayoutTemplateIcon as LayoutPlan } from "lucide-react"
import { PropertyGallery } from "./property-gallery"

interface PropertyImage {
  id: string
  image_url: string
}

interface PropertyCardProps {
  property: {
    id: string
    address: string
    property_type: string
    price: number
    area: number
    rooms: number | null
    description: string | null
    property_images: PropertyImage[]
    floor_plan_url?: string | null
    living_area?: number | null
    floor?: number | null
    total_floors?: number | null
    bathroom_count?: number | null
  }
  index?: number
  isSelected?: boolean
  onSelect?: () => void
}

export function PropertyCard({ property, index, isSelected, onSelect }: PropertyCardProps) {
  const [copied, setCopied] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isGalleryOpen, setIsGalleryOpen] = useState(false)
  const [isFloorPlanView, setIsFloorPlanView] = useState(false)
  const hasMultipleImages = property.property_images.length > 1

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: "RUB",
      maximumFractionDigits: 0,
    }).format(price)
  }

  const roomsText =
    property.rooms === 1
      ? "1-комн. квартира"
      : property.rooms === 2
        ? "2-комн. квартира"
        : property.rooms === 3
          ? "3-комн. квартира"
          : property.property_type === "house"
            ? `Дом`
            : property.property_type === "land"
              ? `Участок`
              : "Студия"

  const copyLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/share/property/${property.id}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const nextImage = useCallback(() => {
    if (property.property_images.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % property.property_images.length)
    }
  }, [property.property_images.length])

  const prevImage = useCallback(() => {
    if (property.property_images.length > 1) {
      setCurrentImageIndex((prev) => (prev - 1 + property.property_images.length) % property.property_images.length)
    }
  }, [property.property_images.length])

  const openGallery = (isFloorPlan = false) => {
    setIsFloorPlanView(isFloorPlan)
    setIsGalleryOpen(true)
  }

  return (
    <>
      <div className="bg-[#141414] rounded-xl overflow-hidden shadow-[0_4px_12px_rgba(0,0,0,0.4)] border border-[#222222] flex flex-col transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
        <div className="p-4">
          {/* Image and content */}
          <div className="flex flex-col space-y-4">
            {/* Image Carousel */}
            <div className="relative w-full h-48 rounded-lg overflow-hidden group">
              {property.property_images.length > 0 ? (
                <>
                  <Image
                    src={property.property_images[currentImageIndex]?.image_url || "/placeholder.svg"}
                    alt={`${roomsText}, ${property.area} м²`}
                    fill
                    className="object-cover transition-opacity duration-300"
                  />

                  {/* Navigation arrows - only show if multiple images */}
                  {hasMultipleImages && (
                    <>
                      <button
                        onClick={(e) => {
                          e.preventDefault()
                          prevImage()
                        }}
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-black/70"
                        aria-label="Previous image"
                      >
                        <ChevronLeft size={20} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.preventDefault()
                          nextImage()
                        }}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-black/70"
                        aria-label="Next image"
                      >
                        <ChevronRight size={20} />
                      </button>

                      {/* Image counter indicator */}
                      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
                        {currentImageIndex + 1} / {property.property_images.length}
                      </div>
                    </>
                  )}

                  {/* View gallery button */}
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      openGallery(false)
                    }}
                    className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-black/70"
                  >
                    Просмотр
                  </button>
                </>
              ) : (
                <div className="w-full h-full bg-[#222222] flex items-center justify-center">
                  <p className="text-[#888888]">Нет изображения</p>
                </div>
              )}
            </div>

            {/* Floor Plan Thumbnail - only show if floor_plan_url exists */}
            {property.floor_plan_url && (
              <div className="relative w-full h-24 rounded-lg overflow-hidden bg-[#1A1A1A] border border-[#333333] group">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex items-center gap-2">
                    <LayoutPlan className="text-[#4370FF]" size={18} />
                    <span className="text-sm font-medium text-white">Планировка</span>
                  </div>
                </div>
                <Image
                  src={property.floor_plan_url || "/placeholder.svg"}
                  alt="Планировка"
                  fill
                  className="object-contain opacity-40 group-hover:opacity-70 transition-opacity duration-200"
                />
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    openGallery(true)
                  }}
                  className="absolute inset-0 w-full h-full cursor-pointer"
                  aria-label="Просмотреть планировку"
                />
              </div>
            )}

            {/* Content */}
            <div className="space-y-3">
              <div>
                <h3 className="text-lg font-semibold text-white">
                  {roomsText}, {property.area} м²
                </h3>
                <p className="text-sm text-[#888888] mt-1">{property.address}</p>
              </div>

              <p className="text-sm text-[#CCCCCC] line-clamp-2">{property.description || "Нет описания"}</p>

              <div className="text-xl font-bold text-[#4370FF]">{formatPrice(property.price)}</div>
            </div>
          </div>
        </div>

        {/* Button and actions */}
        <div className="p-4 mt-auto">
          <div className="space-y-4">
            <Link
              href={`/share/property/${property.id}`}
              className="block w-full bg-[#4370FF] hover:bg-[#3060FF] text-white font-medium py-2.5 px-4 rounded-lg text-center transition-all duration-200 hover:shadow-[0_2px_8px_rgba(67,112,255,0.4)] active:scale-[0.98] group"
            >
              <span className="flex items-center justify-center">
                Просмотр объекта
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1"
                >
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </span>
            </Link>

            <div className="flex items-center justify-between">
              <div className="flex space-x-2">
                <button
                  onClick={copyLink}
                  className="p-2 rounded-lg bg-[#222222] hover:bg-[#333333] text-[#CCCCCC] transition-all duration-200 hover:text-white active:scale-95"
                  title="Копировать ссылку"
                >
                  <Copy size={18} />
                  <span className="sr-only">Копировать ссылку</span>
                </button>

                <Link
                  href={`/share/property/${property.id}`}
                  className="p-2 rounded-lg bg-[#222222] hover:bg-[#333333] text-[#CCCCCC] transition-all duration-200 hover:text-white active:scale-95"
                  title="Открыть"
                >
                  <ExternalLink size={18} />
                  <span className="sr-only">Открыть</span>
                </Link>
              </div>

              {copied && <span className="text-xs text-[#4370FF] animate-fade-in">Ссылка скопирована</span>}
            </div>
          </div>
        </div>
      </div>

      {/* Gallery Modal */}
      <PropertyGallery
        images={
          isFloorPlanView && property.floor_plan_url
            ? [property.floor_plan_url]
            : property.property_images.map((img) => img.image_url)
        }
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
        initialIndex={isFloorPlanView ? 0 : currentImageIndex}
      />
    </>
  )
}
