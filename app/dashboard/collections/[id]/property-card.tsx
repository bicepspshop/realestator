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
      <Card className="overflow-hidden rounded-sm border-transparent shadow-subtle hover:shadow-elegant transition-all duration-300 animate-fade-in-up">
        <CardHeader className="bg-luxury-black/5 border-b border-luxury-black/10 pb-3 px-4 pt-4">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-lg font-display text-luxury-black">{property.address}</CardTitle>
              <CardDescription className="text-luxury-black/60">{propertyTypeLabel}</CardDescription>
            </div>
            <div className="flex gap-1.5">
              <Button 
                variant="minimal" 
                size="sm" 
                onClick={() => setIsDetailsDialogOpen(true)}
                className="text-luxury-black/70 hover:text-luxury-gold transition-colors duration-300 w-8 h-8 p-0 flex items-center justify-center"
              >
                <Eye className="h-4 w-4" />
              </Button>
              <Button 
                variant="minimal" 
                size="sm" 
                onClick={() => setIsEditDialogOpen(true)}
                className="text-luxury-black/70 hover:text-luxury-gold transition-colors duration-300 w-8 h-8 p-0 flex items-center justify-center"
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button 
                variant="minimal" 
                size="sm" 
                onClick={() => setIsDeleteDialogOpen(true)}
                className="text-red-500 hover:text-red-600 hover:bg-red-50 transition-colors duration-300 w-8 h-8 p-0 flex items-center justify-center"
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pb-4 pt-4 px-4">
          {property.property_images && property.property_images.length > 0 ? (
            <div className="aspect-video relative mb-4 rounded-sm overflow-hidden">
              <Image
                src={property.property_images[0].image_url || "/placeholder.svg"}
                alt={property.address}
                fill
                className="object-cover hover:scale-105 transition-all duration-700"
              />
            </div>
          ) : (
            <div className="aspect-video bg-luxury-black/5 mb-4 rounded-sm flex items-center justify-center border border-luxury-black/10">
              <p className="text-luxury-black/40 text-sm">Нет изображения</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-sm text-luxury-black/50">Цена</p>
              <p className="font-medium text-luxury-black">{formatPrice(property.price)}</p>
            </div>
            <div>
              <p className="text-sm text-luxury-black/50">Площадь</p>
              <p className="font-medium text-luxury-black">{property.area} кв.м</p>
            </div>
            {property.rooms !== null && (
              <div>
                <p className="text-sm text-luxury-black/50">Комнаты</p>
                <p className="font-medium text-luxury-black">{property.rooms}</p>
              </div>
            )}
          </div>

          {property.description && (
            <div>
              <p className="text-sm text-luxury-black/50">Описание</p>
              <p className="text-sm line-clamp-3 text-luxury-black/80">{property.description}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Диалог подтверждения удаления */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px] rounded-sm">
          <DialogHeader>
            <DialogTitle className="text-xl font-display text-luxury-black">Удалить объект</DialogTitle>
            <DialogDescription className="text-luxury-black/70">
              Вы уверены, что хотите удалить этот объект? Это действие нельзя отменить.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 mt-6">
            <Button 
              variant="outline" 
              onClick={() => setIsDeleteDialogOpen(false)} 
              disabled={isLoading}
              className="border-luxury-black/20 hover:bg-luxury-black/5 rounded-sm"
            >
              Отмена
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDelete} 
              disabled={isLoading}
              className="bg-red-500 hover:bg-red-600 text-white rounded-sm"
            >
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
