"use client"
import { PropertyCard } from "./property-card"

interface PropertyImage {
  id: string
  image_url: string
}

interface Property {
  id: string
  property_type: string
  address: string
  rooms: number | null
  area: number
  price: number
  description: string | null
  property_images: PropertyImage[]
  living_area?: number | null
  floor?: number | null
  total_floors?: number | null
  bathroom_count?: number | null
}

interface PropertyListProps {
  properties: Property[]
}

export function PropertyList({ properties }: PropertyListProps) {
  return (
    <div className="space-y-6">
      {properties.map((property) => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </div>
  )
}
