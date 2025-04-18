"use client"

import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "./client-auth-provider"
import { WifiOff, User, ChevronDown, LogOut, Settings, Home } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

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
    <header className="bg-white border-b border-gray-100 shadow-subtle py-3 sticky top-0 z-50">
      <div className="container-luxury flex justify-between items-center">
        <Link href="/dashboard" className="flex items-center">
          <h1 className="text-2xl font-serif font-medium tracking-tight text-luxury-black">
            РиелторПро
          </h1>
        </Link>

        <nav className="hidden md:flex items-center space-x-8">
          <Link 
            href="/dashboard" 
            className="text-luxury-black/80 hover:text-luxury-gold transition-colors duration-300 font-medium flex items-center gap-2"
          >
            <Home size={18} />
            Главная
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          {isOfflineMode && (
            <div className="px-3 py-1.5 bg-amber-50 rounded-sm text-amber-600 text-xs font-medium flex items-center gap-1.5 border border-amber-200">
              <WifiOff className="h-3.5 w-3.5" />
              Офлайн режим
            </div>
          )}
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                className="flex items-center gap-2 hover:bg-luxury-gold/5 hover:text-luxury-gold transition-all duration-300"
              >
                <div className="w-8 h-8 rounded-full bg-luxury-gold/10 flex items-center justify-center text-luxury-gold">
                  <User size={18} />
                </div>
                <span className="font-medium">{userName}</span>
                <ChevronDown size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 p-1.5">
              <DropdownMenuLabel className="text-luxury-black/70 font-normal text-xs">
                Ваш аккаунт
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer flex items-center gap-2.5 py-2.5 rounded-sm">
                <Settings size={16} />
                <span>Настройки</span>
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={handleLogout} 
                className="cursor-pointer flex items-center gap-2.5 py-2.5 focus:bg-red-50 focus:text-red-600 rounded-sm"
              >
                <LogOut size={16} />
                <span>Выйти</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
