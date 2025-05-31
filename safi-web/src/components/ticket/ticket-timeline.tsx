import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import AvatarPlaceholder from "@/assets/placeholders/avatar-placeholder.png"
import AvatarAnalyst from "@/assets/avatars/avatar-1.png"
import SafiBubble from "@/assets/ai/safi-bubble.png"

interface TimelineItem {
    id: string
    user: string
    action: string
    date: string
    avatar?: string
    initials: string
    type: 'user' | 'ai' | 'analyst'
}

interface TicketTimelineProps {
    timelineItems: TimelineItem[]
}

export function TicketTimeline({ timelineItems }: TicketTimelineProps) {
    const renderAvatar = (item: TimelineItem) => {
        switch (item.type) {
            case 'user':
                return (
                    <Avatar className="h-10 w-10">
                        <AvatarImage src={item.avatar || AvatarPlaceholder.src} />
                        <AvatarFallback className="bg-blue-600 text-white text-xs">
                            {item.initials}
                        </AvatarFallback>
                    </Avatar>
                )
            case 'ai':
                return (
                    <Avatar className="h-10 w-10">
                        <AvatarImage src={item.avatar || SafiBubble.src} />
                        <AvatarFallback className="bg-red-50 text-white text-xs">
                            {item.initials}
                        </AvatarFallback>
                    </Avatar>
                )
            case 'analyst':
                return (
                    <Avatar className="h-10 w-10">
                        <AvatarImage src={item.avatar || AvatarAnalyst.src} />
                        <AvatarFallback className="bg-red-50 text-white text-xs">
                            {item.initials}
                        </AvatarFallback>
                    </Avatar>
                )
            default:
                return (
                    <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
                        <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                    </div>
                )
        }
    }

    return (
        <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-4">Histórico do Chamado</h3>
            <div className="space-y-4 border-t py-4">
                {timelineItems.map((item) => (
                    <div key={item.id} className="flex gap-3">
                        {renderAvatar(item)}
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
