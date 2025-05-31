import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send } from "lucide-react"
import AvatarPlaceholder from "@/assets/placeholders/avatar-placeholder.png"
import SafiBubble from "@/assets/ai/safi-bubble.png"
import { Ticket } from "@/data/tickets-data"

interface TicketChatProps {
    ticket: Ticket
}

export function TicketChat({ ticket }: TicketChatProps) {
    const getMessageStyle = (role: string) => {
        switch (role) {
            case 'user':
                return 'bg-gray-50 border'
            case 'ai':
                return 'border'
            case 'analyst':
                return 'bg-red-50 border'
            default:
                return 'bg-white'
        }
    }

    const getRoleLabel = (role: string) => {
        switch (role) {
            case 'user':
                return 'Usuário'
            case 'ai':
                return 'Safi Assistente'
            case 'analyst':
                return 'Analista'
            default:
                return role
        }
    }

    return (
        <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-900 mb-4">Histórico de Chat</h3>

            <div className="space-y-4 mb-6">
                {ticket.chatHistory?.map((message, index) => (
                    <div key={index} className={`flex gap-3 p-3 rounded-lg ${getMessageStyle(message.role)}`}>
                        <Avatar className="h-12 w-12">
                            <AvatarImage src={message.role === 'ai' ? SafiBubble.src : AvatarPlaceholder.src} />
                            <AvatarFallback className="bg-gray-600 text-white">
                                {message.name ? message.name.split(' ').map(n => n[0]).join('').toUpperCase() : message.role[0].toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="font-medium text-sm">
                                    {message.name || getRoleLabel(message.role)}
                                </span>
                                {message.department && (
                                    <span className="text-xs text-gray-500">{message.department}</span>
                                )}
                                <span className="text-xs text-gray-400 bg-white px-2 py-1 rounded">
                                    {getRoleLabel(message.role)}
                                </span>
                            </div>
                            <p className="text-sm text-gray-700 leading-relaxed">
                                {message.content}
                            </p>
                            {message.time && (
                                <div className="text-xs text-gray-400 mt-2">{message.time}</div>
                            )}
                        </div>
                    </div>
                ))}
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
