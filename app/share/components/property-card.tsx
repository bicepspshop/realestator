"use client"

import { useState } from "react"
import Image from "next/image"
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
  const [activeTab, setActiveTab] = useState<"plan" | "gallery" | "map">("gallery")
  const [galleryOpen, setGalleryOpen] = useState(false)

  const propertyTypeLabels: Record<string, string> = {
    apartment: "Квартира",
    house: "Дом",
    land: "Земельный участок",
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: "RUB",
      maximumFractionDigits: 0,
    }).format(price)
  }

  const roomsText =
    property.rooms === 1
      ? "1-комнатная квартира"
      : property.rooms === 2
        ? "2-комнатная квартира"
        : property.rooms === 3
          ? "3-комнатная квартира"
          : property.property_type === "house"
            ? `Дом ${property.area} м²`
            : property.property_type === "land"
              ? `Участок ${property.area} сот.`
              : "Студия"

  const renovationTypes = {
    designer: "Дизайнерский",
    euro: "Евроремонт",
    cosmetic: "Косметический",
    none: "Без ремонта",
  }

  // Determine renovation type (this is a placeholder - adjust based on your data structure)
  const renovationType = property.description?.toLowerCase().includes("дизайн")
    ? renovationTypes.designer
    : property.description?.toLowerCase().includes("евро")
      ? renovationTypes.euro
      : renovationTypes.cosmetic

  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden">
      <div className="p-0">
        <div className="grid sm:grid-cols-[300px_1fr] gap-4">
          <div className="relative h-48 sm:h-auto">
            {property.property_images.length > 0 ? (
              <Image
                src={property.property_images[0].image_url || "/placeholder.svg"}
                alt={`${roomsText}, ${property.area} м²`}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <p className="text-gray-500">Нет изображения</p>
              </div>
            )}
            <button
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:bg-accent hover:text-accent-foreground absolute top-2 right-2 h-8 w-8 rounded-full text-white"
              onClick={() => {}}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-heart h-5 w-5"
              >
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
              </svg>
              <span className="sr-only">Добавить в избранное</span>
            </button>
          </div>
          <div className="p-4 space-y-4">
            <div>
              <h3 className="text-xl font-semibold">
                {roomsText}, {property.area} м²
              </h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-map-pin h-4 w-4"
                >
                  <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <span>{property.address}</span>
              </div>
            </div>

            <p className="text-sm text-muted-foreground line-clamp-3">{property.description}</p>

            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-ruler h-4 w-4 text-blue-600"
                >
                  <path d="M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L2.7 8.7a2.41 2.41 0 0 1 0-3.4l2.6-2.6a2.41 2.41 0 0 1 3.4 0Z" />
                  <path d="m14.5 12.5 2-2" />
                  <path d="m11.5 9.5 2-2" />
                  <path d="m8.5 6.5 2-2" />
                  <path d="m17.5 15.5 2-2" />
                </svg>
                <span>{property.area} м²</span>
              </div>

              {property.floor && property.total_floors && (
                <div className="flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-building h-4 w-4 text-blue-600"
                  >
                    <rect width="16" height="20" x="4" y="2" rx="2" ry="2" />
                    <path d="M9 22v-4h6v4" />
                    <path d="M8 6h.01" />
                    <path d="M16 6h.01" />
                    <path d="M12 6h.01" />
                    <path d="M12 10h.01" />
                    <path d="M12 14h.01" />
                    <path d="M16 10h.01" />
                    <path d="M16 14h.01" />
                    <path d="M8 10h.01" />
                    <path d="M8 14h.01" />
                  </svg>
                  <span>
                    {property.floor}/{property.total_floors} эт.
                  </span>
                </div>
              )}

              <div className="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-paintbrush h-4 w-4 text-blue-600"
                >
                  <path d="m14.622 17.897-10.68-2.913" />
                  <path d="M18.376 2.622a1 1 0 1 1 3.002 3.002L17.36 9.643a.5.5 0 0 0 0 .707l.944.944a2.41 2.41 0 0 1 0 3.408l-.944.944a.5.5 0 0 1-.707 0L8.354 7.348a.5.5 0 0 1 0-.707l.944-.944a2.41 2.41 0 0 1 3.408 0l.944.944a.5.5 0 0 0 .707 0z" />
                  <path d="M9 8c-1.804 2.71-3.97 3.46-6.583 3.948a.507.507 0 0 0-.302.819l7.32 8.883a1 1 0 0 0 1.185.204C12.735 20.405 16 16.792 16 15" />
                </svg>
                <span>{renovationType}</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-blue-600">{formatPrice(property.price)}</div>
              <a
                href={`/share/property/${property.id}`}
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
              >
                Подробнее
              </a>
            </div>
          </div>
        </div>
      </div>

      {isSelected && (
        <div>
          {activeTab === "gallery" && (
            <PropertyGallery
              images={property.property_images}
              isOpen={galleryOpen}
              onClose={() => setGalleryOpen(false)}
            />
          )}
        </div>
      )}
    </div>
  )
}
