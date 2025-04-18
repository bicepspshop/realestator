"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { createCollection } from "./actions"

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Название коллекции должно содержать не менее 2 символов.",
  }),
})

interface CreateCollectionDialogProps {
  userId: string
  buttonText?: string
}

export function CreateCollectionDialog({ userId, buttonText = "Создать коллекцию" }: CreateCollectionDialogProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    try {
      const result = await createCollection(values.name, userId)

      if (result.error) {
        toast({
          variant: "destructive",
          title: "Не удалось создать коллекцию",
          description: result.error,
        })
      } else {
        toast({
          title: "Коллекция создана",
          description: "Ваша новая коллекция успешно создана.",
        })
        setOpen(false)
        form.reset()
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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>{buttonText}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Создать новую коллекцию</DialogTitle>
          <DialogDescription>
            Создайте новую коллекцию для организации объектов недвижимости для ваших клиентов.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Название коллекции</FormLabel>
                  <FormControl>
                    <Input placeholder="Элитные квартиры" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Отмена
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Создание..." : "Создать"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
