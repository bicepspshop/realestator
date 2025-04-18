"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
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
    <div className="min-h-screen flex">
      <div className="w-full md:w-1/2 bg-gradient-luxury flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <div className="bg-white p-8 shadow-elegant rounded-sm animate-fade-in-up">
            <div className="text-center mb-8">
              <Link href="/" className="inline-block mb-6">
                <h1 className="text-2xl font-serif font-medium tracking-tight text-luxury-black">
                  РиелторПро
                </h1>
              </Link>
              <h2 className="text-3xl font-display font-medium mb-2 text-luxury-black">Вход в аккаунт</h2>
              <div className="w-16 h-0.5 bg-luxury-gold mx-auto mb-4"></div>
              <p className="text-sm text-luxury-black/70">
                Войдите для доступа к панели управления
              </p>
            </div>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-luxury-black/80 font-medium">Email</FormLabel>
                      <FormControl>
                        <Input 
                          type="email" 
                          placeholder="ivan@example.com" 
                          className="rounded-sm border-gray-200 focus-visible:ring-luxury-gold/50 py-5"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <div className="flex justify-between items-center">
                        <FormLabel className="text-luxury-black/80 font-medium">Пароль</FormLabel>
                        <Link href="#" className="text-xs text-luxury-black/60 hover:text-luxury-gold transition-colors">
                          Забыли пароль?
                        </Link>
                      </div>
                      <FormControl>
                        <Input 
                          type="password" 
                          placeholder="********" 
                          className="rounded-sm border-gray-200 focus-visible:ring-luxury-gold/50 py-5"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />
                <Button 
                  type="submit" 
                  className="w-full bg-luxury-black hover:bg-black text-white py-6 mt-6" 
                  disabled={isLoading}
                  animation="scale"
                >
                  {isLoading ? "Вход..." : "Войти в систему"}
                </Button>
              </form>
            </Form>
            
            <div className="mt-8 pt-6 border-t border-gray-100 text-center">
              <p className="text-luxury-black/70 text-sm">
                Нет аккаунта?{" "}
                <Link href="/register" className="font-medium text-luxury-gold hover:text-luxury-gold/80 transition-colors">
                  Зарегистрируйтесь
                </Link>
              </p>
            </div>
          </div>
          
          <div className="text-center mt-6">
            <Link href="/" className="text-xs text-gray-400 hover:text-luxury-gold transition-colors">
              Вернуться на главную
            </Link>
          </div>
        </div>
      </div>

      <div className="hidden md:block w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-l from-black/70 to-black/40 z-10"></div>
          <Image 
            src="/images/house4.png" 
            alt="Недвижимость премиум-класса" 
            fill 
            className="object-cover"
            priority
          />
        </div>
        <div className="relative z-10 p-12 h-full flex flex-col justify-center items-end text-right">
          <h2 className="text-4xl font-serif font-medium mb-6 text-white leading-tight text-shadow-md animate-fade-in-up max-w-lg">
            Добро пожаловать обратно
          </h2>
          <div className="w-16 h-1 bg-luxury-gold mb-6 ml-auto animate-fade-in-up" style={{animationDelay: '100ms'}}></div>
          <p className="text-lg text-white/90 mb-8 max-w-md leading-relaxed animate-fade-in-up" style={{animationDelay: '200ms'}}>
            Продолжите работу с вашими коллекциями объектов недвижимости и сделайте ваш бизнес еще успешнее.
          </p>
          
          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-sm border border-white/20 max-w-md animate-fade-in-up" style={{animationDelay: '300ms'}}>
            <p className="text-white text-lg mb-4 font-medium">"РиелторПро помогает мне управлять всеми объектами эффективно и профессионально. Это незаменимый инструмент в моей работе."</p>
            <p className="text-white/70 text-sm">— Александр, ведущий риелтор</p>
          </div>
        </div>
      </div>
    </div>
  )
}
