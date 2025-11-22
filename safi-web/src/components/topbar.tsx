"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
  ChevronDown,
  Menu,
  Home,
  Plus,
  Ticket,
  User,
  Settings,
  ArrowLeft,
} from "lucide-react"
import Link from "next/link"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { NotificationPopover } from "@/components/notification-popover"
import Avatar1 from "@/assets/avatars/avatar-1.png"
import Avatar2 from "@/assets/avatars/avatar-2.png"
import Avatar3 from "@/assets/avatars/avatar-3.png"
import Avatar4 from "@/assets/avatars/avatar-4.png"
import Avatar5 from "@/assets/avatars/avatar-5.png"
import AvatarKc1t from "@/assets/avatars/avatar-kc1t.png"

export function Topbar() {
  const [userName, setUserName] = useState("Usuário")
  const [contact, setContact] = useState("usuario@gmail.com")
  const [userAvatar, setUserAvatar] = useState(Avatar3.src)
  const router = useRouter()

  const getAvatarByName = (name: string) => {
    // Special users check (case insensitive)
    const specialUsers = ['kc1t', 'kauã miguel', 'kauã', 'kaua miguel', 'kaua']
    if (specialUsers.includes(name.toLowerCase().trim())) {
      return AvatarKc1t.src
    }

    // Get first letter and map to avatar
    const firstLetter = name.charAt(0).toLowerCase()
    const avatarMap: { [key: string]: string } = {
      'a': Avatar1.src, 'b': Avatar1.src, 'c': Avatar1.src, 'd': Avatar1.src,
      'e': Avatar2.src, 'f': Avatar2.src, 'g': Avatar2.src, 'h': Avatar2.src,
      'i': Avatar3.src, 'j': Avatar3.src, 'k': Avatar3.src, 'l': Avatar3.src,
      'm': Avatar4.src, 'n': Avatar4.src, 'o': Avatar4.src, 'p': Avatar4.src,
      'q': Avatar5.src, 'r': Avatar5.src, 's': Avatar5.src, 't': Avatar5.src,
      'u': Avatar1.src, 'v': Avatar2.src, 'w': Avatar3.src, 'x': Avatar4.src,
      'y': Avatar5.src, 'z': Avatar1.src
    }
    
    return avatarMap[firstLetter] || Avatar1.src
  }

  useEffect(() => {
    if (typeof window !== "undefined") {
      const name = localStorage.getItem("userName")
      const contact = localStorage.getItem("userContact")
      let avatar = localStorage.getItem("userAvatar")
      
      if (name) {
        setUserName(name)
        const generatedAvatar = getAvatarByName(name)
        if (!avatar || avatar !== generatedAvatar) {
          avatar = generatedAvatar
          localStorage.setItem("userAvatar", avatar)
        }
      }
      if (contact) setContact(contact)
      if (avatar) setUserAvatar(avatar)
    }
  }, [])

  const userInitials = userName
    .split(" ")
    .map((n) => n[0]?.toUpperCase())
    .slice(0, 2)
    .join("")

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 shadow-xs">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="mr-2">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Abrir menu</span>
            </Button>
          </SheetTrigger>

          <SheetContent side="left" className="flex flex-col w-80 p-0 text-white">
            <div className="bg-gradient-to-r from-[#DF1463] to-[#DF1463] p-6 text-white">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12 border-2 border-white/20">
                  <AvatarImage src={userAvatar} alt={userName} />
                  <AvatarFallback className="bg-white/20 text-white font-semibold text-lg">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-lg">{userName}</h3>
                  <p className="text-blue-100 text-sm">{contact}</p>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2 text-blue-100">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-sm">Online</span>
              </div>
            </div>

            <div className="flex-1 p-4">
              <nav className="space-y-1">
                <Link
                  href="/"
                  className="flex items-center gap-3 px-3 py-3 text-sm font-medium text-gray-700 rounded-lg hover:text-white hover:bg-[#DF1463] transition-all duration-200 group"
                >
                  <Home className="h-5 w-5 text-gray-500 group-hover:text-white" />
                  <span>Página Inicial</span>
                </Link>
                <Link
                  href="/open-ticket"
                  className="flex items-center gap-3 px-3 py-3 text-sm font-medium text-gray-700 rounded-lg hover:text-white hover:bg-[#DF1463] transition-all duration-200 group"
                >
                  <Plus className="h-5 w-5 text-gray-500 group-hover:text-white" />
                  <span>Abrir Ticket</span>
                </Link>
                <Link
                  href="/tickets-dashboard"
                  className="flex items-center gap-3 px-3 py-3 text-sm font-medium text-gray-700 rounded-lg hover:text-white hover:bg-[#DF1463] transition-all duration-200 group"
                >
                  <Ticket className="h-5 w-5 text-gray-500 group-hover:text-white" />
                  <span>Meus Tickets (Analista)</span>
                </Link>

                <div className="border-t pt-2 mt-2">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2 px-3">Configurações</p>
                  <div className="flex items-center gap-3 px-3 py-3 text-sm font-medium text-gray-400 rounded-lg cursor-not-allowed opacity-60">
                    <User className="h-5 w-5 text-gray-400" />
                    <span>Perfil</span>
                    <span className="ml-auto text-xs text-gray-400">(Em breve)</span>
                  </div>
                  <div className="flex items-center gap-3 px-3 py-3 text-sm font-medium text-gray-400 rounded-lg cursor-not-allowed opacity-60">
                    <Settings className="h-5 w-5 text-gray-400" />
                    <span>Configurações</span>
                    <span className="ml-auto text-xs text-gray-400">(Em breve)</span>
                  </div>
                </div>
              </nav>
            </div>

            <div className="border-t bg-gray-50 p-6">
              <div className="text-xs text-muted-foreground">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-medium text-gray-900">Sistema Safi v0.1</span>
                </div>
                <p className="leading-relaxed">
                  Esta é uma <span className="font-medium">demonstração</span> com o objetivo de apresentar uma prévia
                  funcional da solução.
                </p>
                <div className="mt-3 flex items-center gap-4 text-xs">
                  <span className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    Sistema Online
                  </span>
                  <span className="text-gray-400">•</span>
                  <span>Suporte 24/7</span>
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>

        <div className="hidden lg:flex items-center">
          {/* <h1 className="text-xl font-bold text-gray-900">Sistema Safi</h1> */}
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-2 ml-auto">
          <Button 
            variant="ghost" 
            size="sm" 
            className="hidden lg:flex items-center gap-1 text-gray-900 hover:text-black hover:bg-gray-100 px-2 py-1"
            onClick={() => router.push("/")}
          >
            <ArrowLeft className="h-3 w-3" />
            <span className="text-xs">Voltar</span>
          </Button>

          <NotificationPopover />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2 px-2 py-1.5 h-auto">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={userAvatar} alt={userName} />
                  <AvatarFallback className="bg-[#DF1463]/20 text-[#DF1463] font-medium">{userInitials}</AvatarFallback>
                </Avatar>
                <div className="hidden sm:flex items-center gap-1">
                  <span className="text-sm font-medium text-gray-800 max-w-32 truncate">{userName}</span>
                  <ChevronDown className="h-4 w-4 text-gray-600" />
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="px-2 py-1.5 text-sm text-gray-900">
                <div className="font-medium">{userName}</div>
                <div className="text-xs text-gray-500">{contact}</div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem disabled className="text-gray-400 cursor-not-allowed">
                Perfil <span className="ml-auto text-xs">(Em breve)</span>
              </DropdownMenuItem>
              <DropdownMenuItem disabled className="text-gray-400 cursor-not-allowed">
                Configurações <span className="ml-auto text-xs">(Em breve)</span>
              </DropdownMenuItem>
              <DropdownMenuItem>Ajuda e Suporte</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push("/")} className="text-red-600 focus:text-red-600">
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
