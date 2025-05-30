import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import AvatarPlaceholder from "@/assets/placeholders/avatar-placeholder.png"

interface TimelineItem {
    id: string
    user: string
    action: string
    date: string
    avatar?: string
    initials: string
    type: 'user' | 'system' | 'analyst'
}

export function TicketTimeline() {
    const timelineItems: TimelineItem[] = [
        {
            id: "1",
            user: "Analista N1",
            action: "Recebeu Chamado Escalonado",
            date: "25 Mai",
            initials: "A",
            type: "analyst"
        },
        {
            id: "2",
            user: "Analista N0",
            action: "Tentou Resolver",
            date: "24 Mai",
            initials: "A",
            type: "system"
        },
        {
            id: "3",
            user: "Leticia Rocha",
            action: "Abriu o Chamado",
            date: "24 Mai",
            initials: "L",
            type: "user"
        }
    ]

    return (
        <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-4">Histórico do Chamado</h3>
            <div className="space-y-4">
                {timelineItems.map((item) => (
                    <div key={item.id} className="flex gap-3">
                        {item.type === 'user' ? (
                            <Avatar className="h-6 w-6">
                                <AvatarImage src={AvatarPlaceholder.src} />
                                <AvatarFallback className="bg-gray-600 text-white text-xs">
                                    {item.initials}
                                </AvatarFallback>
                            </Avatar>
                        ) : (
                            <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
                                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                            </div>
                        )}
                        <div className="flex-1">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">{item.user}</span>
                                <span className="text-xs text-gray-400">{item.date}</span>
                            </div>
                            <p className="text-xs text-gray-600">{item.action}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
