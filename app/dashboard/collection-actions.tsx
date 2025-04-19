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
import { Trash, Copy, ExternalLink } from "lucide-react"
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
        <Button variant="outline" size="sm" onClick={copyToClipboard} disabled={isLoading}>
          <Copy className="h-4 w-4 mr-2" />
          Копировать
        </Button>

        {hasShareLink && (
          <Button variant="outline" size="sm" asChild>
            <Link href={`/share/${shareId}`}>
              <ExternalLink className="h-4 w-4 mr-2" />
              Перейти
            </Link>
          </Button>
        )}
      </div>

      <Button variant="destructive" size="sm" onClick={() => setIsDeleteDialogOpen(true)} disabled={isLoading}>
        <Trash className="h-4 w-4 mr-2" />
        Удалить
      </Button>

      {/* Диалог подтверждения удаления */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Удалить коллекцию</DialogTitle>
            <DialogDescription>
              Вы уверены, что хотите удалить эту коллекцию? Это действие нельзя отменить.
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
    </div>
  )
}
