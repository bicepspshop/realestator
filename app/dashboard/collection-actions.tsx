"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Trash, Copy, ExternalLink, Share2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { deleteCollection, generateShareLink } from "./actions"

interface CollectionActionsProps {
  collectionId: string
  userId: string
  hasShareLink: boolean
  shareId?: string
}

export function CollectionActions({ collectionId, userId, hasShareLink, shareId }: CollectionActionsProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleDelete = async () => {
    setIsLoading(true)
    try {
      const result = await deleteCollection(collectionId, userId)

      if (result.error) {
        toast({
          variant: "destructive",
          title: "Не удалось удалить коллекцию",
          description: result.error,
        })
      } else {
        toast({
          title: "Коллекция удалена",
          description: "Коллекция была успешно удалена.",
        })
        setIsDeleteDialogOpen(false)
        router.refresh()
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Что-то пошло не так",
        description: "Пожалуйста, попробуйте позже.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleGenerateShareLink = async () => {
    setIsLoading(true)
    try {
      const result = await generateShareLink(collectionId, userId)

      if (result.error) {
        toast({
          variant: "destructive",
          title: "Не удалось создать ссылку",
          description: result.error,
        })
      } else {
        const link = `${window.location.origin}/share/${result.shareId}`

        // Копируем ссылку в буфер обмена
        await navigator.clipboard.writeText(link)

        toast({
          title: "Ссылка скопирована",
          description: "Ссылка скопирована в буфер обмена",
        })
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Что-то пошло не так",
        description: "Пожалуйста, попробуйте позже.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = async () => {
    try {
      // Если у нас уже есть shareId, формируем ссылку
      if (shareId) {
        const link = `${window.location.origin}/share/${shareId}`
        await navigator.clipboard.writeText(link)
        toast({
          title: "Ссылка скопирована",
          description: "Ссылка скопирована в буфер обмена",
        })
      }
      // Если нет shareId, но есть флаг hasShareLink, генерируем ссылку
      else if (hasShareLink) {
        handleGenerateShareLink()
      }
      // Если нет ни shareId, ни флага hasShareLink, создаем новую ссылку
      else {
        handleGenerateShareLink()
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Не удалось скопировать ссылку",
        description: "Произошла ошибка при копировании ссылки",
      })
    }
  }

  return (
    <div className="flex justify-between w-full">
      <div className="flex gap-2">
        <Button 
          variant="minimal" 
          size="sm" 
          onClick={copyToClipboard} 
          disabled={isLoading}
          className="text-luxury-black/70 hover:text-luxury-gold transition-colors duration-300 flex items-center gap-1.5 px-2.5 py-1"
        >
          {hasShareLink ? (
            <>
              <Copy className="h-4 w-4" />
              <span className="hidden md:inline">Копировать</span>
            </>
          ) : (
            <>
              <Share2 className="h-4 w-4" />
              <span className="hidden md:inline">Создать ссылку</span>
            </>
          )}
        </Button>

        {hasShareLink && (
          <Button 
            variant="minimal" 
            size="sm" 
            asChild
            className="text-luxury-black/70 hover:text-luxury-gold transition-colors duration-300 flex items-center gap-1.5 px-2.5 py-1"
          >
            <Link href={`/share/${shareId}`}>
              <ExternalLink className="h-4 w-4" />
              <span className="hidden md:inline">Перейти</span>
            </Link>
          </Button>
        )}
      </div>

      <Button 
        variant="minimal" 
        size="sm" 
        onClick={() => setIsDeleteDialogOpen(true)} 
        disabled={isLoading}
        className="text-red-500 hover:text-red-600 hover:bg-red-50 transition-colors duration-300 flex items-center gap-1.5 px-2.5 py-1"
      >
        <Trash className="h-4 w-4" />
        <span className="hidden md:inline">Удалить</span>
      </Button>

      {/* Диалог подтверждения удаления */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px] rounded-sm">
          <DialogHeader>
            <DialogTitle className="text-xl font-display text-luxury-black">Удалить коллекцию</DialogTitle>
            <DialogDescription className="text-luxury-black/70">
              Вы уверены, что хотите удалить эту коллекцию? Это действие нельзя отменить.
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
    </div>
  )
}
