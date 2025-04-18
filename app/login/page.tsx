"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { loginUser } from "./actions"

const formSchema = z.object({
  email: z.string().email({
    message: "Пожалуйста, введите корректный email адрес.",
  }),
  password: z.string().min(1, {
    message: "Пароль обязателен.",
  }),
})

export default function LoginPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    try {
      console.log("LoginPage: Попытка входа для email:", values.email)
      const result = await loginUser(values)

      if (result.error) {
        console.error("LoginPage: Ошибка входа:", result.error)
        toast({
          variant: "destructive",
          title: "Ошибка входа",
          description: result.error,
        })
      } else {
        console.log("LoginPage: Вход успешен, перенаправление на панель управления")
        toast({
          title: "Вход выполнен",
          description: "Добро пожаловать!",
        })

        // Устанавливаем cookie на стороне клиента для v0
        const userId = result.userId
        if (userId) {
          document.cookie = `auth-token=${userId}; path=/; max-age=${60 * 60 * 24 * 7}; samesite=lax;`
        }

        // Небольшая задержка перед перенаправлением
        setTimeout(() => {
          router.push("/dashboard")
          // Принудительное обновление страницы для применения новых cookie
          window.location.href = "/dashboard"
        }, 500)
      }
    } catch (error) {
      console.error("LoginPage: Непредвиденная ошибка:", error)
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
    <div className="flex min-h-screen items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">Вход в аккаунт</h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Нет аккаунта?{" "}
            <Link href="/register" className="font-medium text-primary hover:text-primary/90">
              Зарегистрироваться
            </Link>
          </p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="ivan@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Пароль</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="********" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Вход..." : "Войти"}
            </Button>
          </form>
        </Form>
        <div className="text-center mt-4">
          <Link href="/debug" className="text-sm text-gray-500 hover:text-gray-700">
            Проверить состояние аутентификации
          </Link>
        </div>
      </div>
    </div>
  )
}
