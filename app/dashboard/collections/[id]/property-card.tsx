"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Trash, Edit, Eye } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { deleteProperty } from "./actions"
import { EditPropertyForm } from "./edit-property-form"
import { PropertyDetails } from "./property-details"

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
  description: string
  property_images: PropertyImage[]
  living_area?: number | null
  floor?: number | null
  total_floors?: number | null
  balcony?: boolean
  year_built?: number | null
  renovation_type?: string | null
  bathroom_count?: number | null
  has_parking?: boolean
  property_status?: string
}

interface PropertyCardProps {
  property: Property
  collectionId: string
  userId: string
}

export function PropertyCard({ property, collectionId, userId }: PropertyCardProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: "RUB",
      maximumFractionDigits: 0,
    }).format(price)
  }

  const handleDelete = async () => {
    setIsLoading(true)
    try {
      const result = await deleteProperty(property.id)

      if (result.error) {
        toast({
          variant: "destructive",
          title: "Не удалось удалить объект",
          description: result.error,
        })
      } else {
        toast({
          title: "Объект удален",
          description: "Объект недвижимости был успешно удален.",
        })
        setIsDeleteDialogOpen(false)
        router.refresh()
      }
    } catch (error) {
      console.error("Ошибка при удалении объекта:", error)
      toast({
        variant: "destructive",
        title: "Что-то пошло не так",
        description: "Пожалуйста, попробуйте позже. " + (error instanceof Error ? error.message : ""),
      })
    } finally {
      setIsLoading(false)
    }
  }

  const propertyTypeLabel =
    {
      apartment: "Квартира",
      house: "Дом",
      land: "Земельный участок",
    }[property.property_type] || "Объект"

  return (
    <>
      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-lg">{property.address}</CardTitle>
              <CardDescription>{propertyTypeLabel}</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={() => setIsDetailsDialogOpen(true)}>
                <Eye className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => setIsEditDialogOpen(true)}>
                <Edit className="h-4 w-4" />
              </Button>
              <Button variant="destructive" size="sm" onClick={() => setIsDeleteDialogOpen(true)}>
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pb-2">
          {property.property_images && property.property_images.length > 0 ? (
            <div className="aspect-video relative mb-4 rounded-md overflow-hidden">
              <Image
                src={property.property_images[0].image_url || "/placeholder.svg"}
                alt={property.address}
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <div className="aspect-video bg-gray-200 mb-4 rounded-md flex items-center justify-center">
              <p className="text-gray-500">Нет изображения</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-2 mb-4">
            <div>
              <p className="text-sm text-gray-500">Цена</p>
              <p className="font-semibold">{formatPrice(property.price)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Площадь</p>
              <p className="font-semibold">{property.area} кв.м</p>
            </div>
            {property.rooms !== null && (
              <div>
                <p className="text-sm text-gray-500">Комнаты</p>
                <p className="font-semibold">{property.rooms}</p>
              </div>
            )}
          </div>

          {property.description && (
            <div>
              <p className="text-sm text-gray-500">Описание</p>
              <p className="text-sm line-clamp-3">{property.description}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Диалог подтверждения удаления */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Удалить объект</DialogTitle>
            <DialogDescription>
              Вы уверены, что хотите удалить этот объект? Это действие нельзя отменить.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} disabled={isLoading}>
              Отмена
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isLoading}>
              {isLoading ? "Удаление..." : "Удалить"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Диалог редактирования объекта */}
      <EditPropertyForm propertyId={property.id} isOpen={isEditDialogOpen} onClose={() => setIsEditDialogOpen(false)} />

      {/* Диалог просмотра деталей объекта */}
      <PropertyDetails property={property} isOpen={isDetailsDialogOpen} onClose={() => setIsDetailsDialogOpen(false)} />
    </>
  )
}
