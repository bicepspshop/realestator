"use client"

import { Input } from "@/components/ui/input"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Share, Trash } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { deleteCollection, generateShareLink } from "./actions"

interface CollectionActionsProps {
  collectionId: string
  userId: string
  hasShareLink: boolean
}

export function CollectionActions({ collectionId, userId, hasShareLink }: CollectionActionsProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false)
  const [shareLink, setShareLink] = useState("")
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
        setShareLink(`${window.location.origin}/share/${result.shareId}`)
        setIsShareDialogOpen(true)
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

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareLink)
    toast({
      title: "Ссылка скопирована",
      description: "Ссылка скопирована в буфер обмена.",
    })
  }

  return (
    <div className="flex justify-between w-full">
      <Button variant="outline" size="sm" onClick={handleGenerateShareLink} disabled={isLoading}>
        <Share className="h-4 w-4 mr-2" />
        {hasShareLink ? "Поделиться" : "Создать ссылку"}
      </Button>

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

      {/* Диалог ссылки для обмена */}
      <Dialog open={isShareDialogOpen} onOpenChange={setIsShareDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Поделиться коллекцией</DialogTitle>
            <DialogDescription>
              Поделитесь этой ссылкой с клиентами, чтобы они могли просмотреть коллекцию.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center space-x-2">
            <Input value={shareLink} readOnly />
            <Button onClick={copyToClipboard}>Копировать</Button>
          </div>
          <DialogFooter>
            <Button onClick={() => setIsShareDialogOpen(false)}>Закрыть</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
