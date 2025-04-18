"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Copy, ArrowRight, ChevronLeft, ChevronRight, LayoutIcon as LayoutPlan } from "lucide-react"
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
  const router = useRouter()
  const [copied, setCopied] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isGalleryOpen, setIsGalleryOpen] = useState(false)
  const [isFloorPlanView, setIsFloorPlanView] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)
  const hasMultipleImages = property.property_images.length > 1

  // Animation delay based on index
  const animationDelay = index ? `${index * 100}ms` : '0ms';

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in-up');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) observer.unobserve(cardRef.current);
    };
  }, []);

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

  const copyLink = (e: React.MouseEvent) => {
    // Stop propagation to prevent card navigation
    e.stopPropagation()
    navigator.clipboard.writeText(`${window.location.origin}/share/property/${property.id}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const nextImage = useCallback((e: React.MouseEvent) => {
    // Stop propagation to prevent card navigation
    e.stopPropagation()
    e.preventDefault()
    if (property.property_images.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % property.property_images.length)
    }
  }, [property.property_images.length])

  const prevImage = useCallback((e: React.MouseEvent) => {
    // Stop propagation to prevent card navigation
    e.stopPropagation()
    e.preventDefault()
    if (property.property_images.length > 1) {
      setCurrentImageIndex((prev) => (prev - 1 + property.property_images.length) % property.property_images.length)
    }
  }, [property.property_images.length])

  const openGallery = (e: React.MouseEvent, isFloorPlan = false) => {
    // Stop propagation to prevent card navigation
    e.stopPropagation()
    e.preventDefault()
    setIsFloorPlanView(isFloorPlan)
    setIsGalleryOpen(true)
  }

  // Navigate to property detail page
  const navigateToProperty = () => {
    router.push(`/share/property/${property.id}`)
  }

  return (
    <>
      {/* Make entire card clickable */}
      <div 
        ref={cardRef}
        className="bg-white rounded-sm overflow-hidden flex flex-col transition-all duration-500 
          shadow-sm hover:shadow-elegant opacity-0 transform translate-y-6
          border border-gray-100 cursor-pointer"
        style={{ animationDelay }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={navigateToProperty}
      >
        {/* Image Carousel */}
        <div className="relative w-full aspect-[4/3] overflow-hidden">
          {property.property_images.length > 0 ? (
            <>
              <Image
                src={property.property_images[currentImageIndex]?.image_url || "/placeholder.svg"}
                alt={`${roomsText}, ${property.area} м²`}
                fill
                className={`object-cover transform transition-transform duration-700 ease-out ${isHovered ? 'scale-110' : 'scale-100'}`}
              />

              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-40"></div>

              {/* Property type label */}
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-sm text-xs font-medium text-[#2C2C2C] shadow-sm z-10">
                {roomsText}
              </div>

              {/* Navigation arrows - only show if multiple images */}
              {hasMultipleImages && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm text-[#2C2C2C] rounded-full p-1.5 
                      opacity-0 group-hover:opacity-100 hover:opacity-100 transition-all duration-300 
                      hover:shadow-elegant hover:scale-105 active:scale-95 z-20"
                    aria-label="Previous image"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm text-[#2C2C2C] rounded-full p-1.5 
                      opacity-0 group-hover:opacity-100 hover:opacity-100 transition-all duration-300
                      hover:shadow-elegant hover:scale-105 active:scale-95 z-20"
                    aria-label="Next image"
                  >
                    <ChevronRight size={18} />
                  </button>

                  {/* Image counter indicator */}
                  <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm text-[#2C2C2C] text-xs px-2 py-1 rounded-sm font-medium shadow-sm z-10">
                    {currentImageIndex + 1} / {property.property_images.length}
                  </div>
                </>
              )}

              {/* View gallery button */}
              <button
                onClick={(e) => openGallery(e, false)}
                className="absolute bottom-4 left-4 bg-[#CBA135] hover:bg-[#D4AF37] text-white text-xs px-3 py-1.5 
                  rounded-sm transition-all duration-300 opacity-0 hover:opacity-100 group-hover:opacity-100 shadow-sm z-10"
              >
                Просмотр галереи
              </button>
            </>
          ) : (
            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
              <p className="text-[#2C2C2C]/50">Нет изображения</p>
            </div>
          )}
        </div>

        <div className="p-6">
          {/* Content */}
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-start">
                <h3 className="text-xl font-serif font-medium text-[#2C2C2C] leading-tight">
                  {roomsText}, {property.area} м²
                </h3>
                <div className="text-lg font-bold text-[#CBA135]">{formatPrice(property.price)}</div>
              </div>
              <p className="text-sm text-[#2C2C2C]/70 mt-1">{property.address}</p>
            </div>

            {/* Horizontal line */}
            <div className="w-12 h-0.5 bg-[#CBA135]/40"></div>

            {/* Features */}
            <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-sm text-[#2C2C2C]/80">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#CBA135]/70"></div>
                <span>Площадь: {property.area} м²</span>
              </div>
              {property.rooms !== null && (
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#CBA135]/70"></div>
                  <span>Комнат: {property.rooms}</span>
                </div>
              )}
              {property.floor && property.total_floors && (
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#CBA135]/70"></div>
                  <span>Этаж: {property.floor}/{property.total_floors}</span>
                </div>
              )}
              {property.bathroom_count && (
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#CBA135]/70"></div>
                  <span>Санузлы: {property.bathroom_count}</span>
                </div>
              )}
            </div>

            {/* Description - limited to 2 lines */}
            <p className="text-sm text-[#2C2C2C]/70 line-clamp-2 min-h-[2.5rem]">
              {property.description || "Нет описания"}
            </p>
          </div>
        </div>

        {/* Floor Plan Section - only show if floor_plan_url exists */}
        {property.floor_plan_url && (
          <div className="px-6 pb-4">
            <div 
              className="relative rounded-sm overflow-hidden h-24 group border border-gray-100 cursor-pointer" 
              onClick={(e) => openGallery(e, true)}
            >
              <Image
                src={property.floor_plan_url}
                alt="Планировка"
                fill
                className="object-contain opacity-60 group-hover:opacity-80 transition-opacity duration-300"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-white/50 group-hover:bg-transparent transition-all duration-300">
                <div className="flex items-center gap-2 bg-white/80 px-3 py-1.5 rounded-sm shadow-sm">
                  <LayoutPlan className="text-[#CBA135]" size={16} />
                  <span className="text-xs font-medium text-[#2C2C2C]">Планировка</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Button and actions */}
        <div className="px-6 pb-6 mt-auto">
          {/* This button is now redundant since the whole card is clickable, but keeping for design consistency */}
          <div
            className="flex items-center justify-between w-full border border-[#CBA135] text-[#CBA135] hover:bg-[#CBA135] hover:text-white 
              font-medium py-3 px-5 rounded-sm text-center transition-all duration-300 group cursor-pointer"
          >
            <span>Подробнее об объекте</span>
            <ArrowRight size={18} className="transition-transform duration-300 transform group-hover:translate-x-1" />
          </div>

          <div className="flex items-center justify-between mt-4">
            <button
              onClick={copyLink}
              className="text-xs text-[#2C2C2C]/60 hover:text-[#CBA135] transition-colors duration-300 flex items-center gap-1 z-20"
              title="Копировать ссылку"
            >
              <Copy size={14} />
              <span>Скопировать ссылку</span>
            </button>

            {copied && (
              <span className="text-xs text-[#CBA135] animate-fade-in">
                Ссылка скопирована
              </span>
            )}
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
