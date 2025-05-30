import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Mail, Phone } from "lucide-react"
import AvatarPlaceholder from "@/assets/placeholders/avatar-placeholder.png"

interface CustomerInfoProps {
  name: string
  phone: string
  email: string
  avatar?: string
  initials: string
}

export function CustomerInfo({ name, phone, email, avatar, initials }: CustomerInfoProps) {
  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <h3 className="text-sm font-medium text-gray-900 mb-3">Informações do Cliente</h3>
      <div className="flex items-center gap-3">
        <Avatar className="h-12 w-12">
          <AvatarImage src={AvatarPlaceholder.src} />
          <AvatarFallback className="bg-gray-600 text-white">{initials}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h4 className="font-medium text-gray-900">{name}</h4>
          <div className="space-y-1 mt-2">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Phone className="h-4 w-4" />
              <span>{phone}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600 wrap-anywhere">
              <Mail className="h-4 w-4" />
              <span>{email}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
