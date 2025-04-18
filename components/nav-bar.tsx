"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "./client-auth-provider"
import { WifiOff } from "lucide-react"

interface NavBarProps {
  userName: string
  isOfflineMode?: boolean
}

export function NavBar({ userName, isOfflineMode = false }: NavBarProps) {
  const router = useRouter()
  const { toast } = useToast()
  const { logout } = useAuth()

  const handleLogout = async () => {
    logout()
    toast({
      title: "Выход выполнен",
      description: "Вы успешно вышли из системы.",
    })
  }

  return (
    <header className="bg-white border-b border-gray-200 py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link href="/dashboard" className="text-2xl font-bold">
          Платформа недвижимости
        </Link>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600 flex items-center gap-2">
            {isOfflineMode && <WifiOff className="h-4 w-4 text-amber-500" />}
            Добро пожаловать, {userName}
            {isOfflineMode && <span className="text-xs text-amber-500">(офлайн режим)</span>}
          </span>
          <Button variant="outline" onClick={handleLogout}>
            Выйти
          </Button>
        </div>
      </div>
    </header>
  )
}
