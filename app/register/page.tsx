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
import { registerUser } from "./actions"

// Найдите текущую схему валидации формы
const formSchema = z.object({
  name: z.string().min(2, {
    message: "Имя должно содержать не менее 2 символов.",
  }),
  email: z.string().email({
    message: "Пожалуйста, введите корректный email адрес.",
  }),
  password: z.string().min(1, {
    message: "Пароль обязателен.",
  }),
})

export default function RegisterPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    try {
      const result = await registerUser(values)

      if (result.error) {
        toast({
          variant: "destructive",
          title: "Ошибка регистрации",
          description: result.error,
        })
      } else {
        toast({
          title: "Регистрация успешна",
          description: "Теперь вы можете войти в систему.",
        })
        router.push("/login")
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
    <div className="min-h-screen flex">
      <div className="hidden md:block w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40 z-10"></div>
          <Image 
            src="/images/house3.png" 
            alt="Недвижимость" 
            fill 
            className="object-cover"
            priority
          />
        </div>
        <div className="relative z-10 p-12 h-full flex flex-col justify-center">
          <h2 className="text-4xl font-serif font-medium mb-6 text-white leading-tight text-shadow-md animate-fade-in-up">
            Присоединяйтесь к нам
          </h2>
          <div className="w-16 h-1 bg-luxury-gold mb-6 animate-fade-in-up" style={{animationDelay: '100ms'}}></div>
          <p className="text-lg text-white/90 mb-8 max-w-md leading-relaxed animate-fade-in-up" style={{animationDelay: '200ms'}}>
            Создавайте коллекции объектов недвижимости и делитесь ими с клиентами быстро и эффективно.
          </p>

          <ul className="space-y-4 animate-fade-in-up" style={{animationDelay: '300ms'}}>
            <li className="flex items-center gap-3">
              <span className="text-luxury-gold flex-shrink-0">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                  <path d="M8 12L11 15L16 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
              <span className="text-white">Бесплатная регистрация</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="text-luxury-gold flex-shrink-0">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                  <path d="M8 12L11 15L16 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
              <span className="text-white">Удобное управление объектами</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="text-luxury-gold flex-shrink-0">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                  <path d="M8 12L11 15L16 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
              <span className="text-white">Современный интерфейс</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="w-full md:w-1/2 bg-gradient-luxury flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <div className="bg-white p-8 shadow-elegant rounded-sm animate-fade-in-up">
            <div className="text-center mb-8">
              <Link href="/" className="inline-block mb-6">
                <h1 className="text-2xl font-serif font-medium tracking-tight text-luxury-black">
                  РиелторПро
                </h1>
              </Link>
              <h2 className="text-3xl font-display font-medium mb-2 text-luxury-black">Создание аккаунта</h2>
              <div className="w-16 h-0.5 bg-luxury-gold mx-auto mb-4"></div>
              <p className="text-sm text-luxury-black/70">
                Быстрая регистрация для доступа к полному функционалу
              </p>
            </div>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-luxury-black/80 font-medium">Имя</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Иван Иванов" 
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
                      <FormLabel className="text-luxury-black/80 font-medium">Пароль</FormLabel>
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
                  {isLoading ? "Регистрация..." : "Зарегистрироваться"}
                </Button>
              </form>
            </Form>
            
            <div className="mt-8 pt-6 border-t border-gray-100 text-center">
              <p className="text-luxury-black/70 text-sm">
                Уже есть аккаунт?{" "}
                <Link href="/login" className="font-medium text-luxury-gold hover:text-luxury-gold/80 transition-colors">
                  Войти
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
    </div>
  )
}
