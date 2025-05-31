import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Mail, Phone } from "lucide-react"
import AvatarPlaceholder from "@/assets/placeholders/avatar-placeholder.png"

import Avatar1 from "@/assets/avatars/avatar-1.png"
import Avatar2 from "@/assets/avatars/avatar-2.png"
import Avatar3 from "@/assets/avatars/avatar-3.png"
import Avatar4 from "@/assets/avatars/avatar-4.png"
import Avatar5 from "@/assets/avatars/avatar-5.png"
interface CustomerInfoProps {
  name: string
  phone: string
  email: string
  avatar?: number
  initials: string
}

const AVATAR_IMAGES = {
  1: Avatar1,
  2: Avatar2,
  3: Avatar3,
  4: Avatar4,
  5: Avatar5
} as const

const getAvatarImage = (avatarNumber?: number) => {
  if (!avatarNumber || avatarNumber < 1 || avatarNumber > 5) {
    return AvatarPlaceholder
  }
  return AVATAR_IMAGES[avatarNumber as keyof typeof AVATAR_IMAGES]
}

export function CustomerInfo({ name, phone, email, avatar, initials }: CustomerInfoProps) {
  const avatarImage = getAvatarImage(avatar)

  return (
    <div className="bg-gray-50 p-3 sm:p-4 rounded-lg border">
      <h3 className="text-sm font-medium text-gray-900 mb-3">Informações do Cliente</h3>
      <div className="flex items-start sm:items-center gap-3">
        <Avatar className="h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0">
          <AvatarImage src={avatarImage.src} />
          <AvatarFallback className="bg-gray-600 text-white text-xs sm:text-sm">{initials}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-gray-900 text-sm sm:text-base break-words">{name}</h4>
          <div className="space-y-1 mt-2">
            <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
              <Phone className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
              <span className="break-all">{phone}</span>
            </div>
            <div className="flex items-start gap-2 text-xs sm:text-sm text-gray-600">
              <Mail className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0 mt-0.5" />
              <span className="break-all">{email}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
