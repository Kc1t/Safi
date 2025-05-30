import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send } from "lucide-react"
import AvatarPlaceholder from "@/assets/placeholders/avatar-placeholder.png"

export function TicketChat() {
    return (
        <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-900 mb-4">Histórico de Chat</h3>

            <div className="space-y-4 mb-6">
                {/* Message from Leticia */}
                <div className="flex gap-3">
                    <Avatar className="h-12 w-12">
                        <AvatarImage src={AvatarPlaceholder.src} />
                        <AvatarFallback className="bg-gray-600 text-white">U</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-sm">Leticia</span>
                            <span className="text-xs text-gray-500">RH</span>
                        </div>
                        <p className="text-sm text-gray-700 leading-relaxed">
                            O usuário "JohnDoe123" está com dificuldades para acessar sua conta de e-mail. Ao tentar fazer
                            login usando suas credenciais, eles encontram um erro.
                        </p>
                        <div className="text-xs text-gray-400 mt-2">11:05</div>
                    </div>
                </div>
            </div>


            {/* Response Input */}
            <div className="border-t pt-4">
                <div className="flex items-center gap-3">
                    <div className="flex-1 relative">
                        <Input placeholder="Enviar Resposta" className="pr-10 border-gray-300" />
                        <Button
                            size="icon"
                            variant="ghost"
                            className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 text-gray-600 hover:text-gray-800"
                        >
                            <Send className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
