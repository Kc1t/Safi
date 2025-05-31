import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import AvatarPlaceholder from "@/assets/placeholders/avatar-placeholder.png"
import SafiBubble from "@/assets/ai/safi-bubble.png"

import Avatar1 from "@/assets/avatars/avatar-1.png"
import Avatar2 from "@/assets/avatars/avatar-2.png"
import Avatar3 from "@/assets/avatars/avatar-3.png"
import Avatar4 from "@/assets/avatars/avatar-4.png"
import Avatar5 from "@/assets/avatars/avatar-5.png"

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

interface TimelineItem {
    id: string
    user: string
    action: string
    date: string
    avatar?: string
    initials: string
    type: "user" | "ai" | "analyst"
    avatarNumber?: number
}

interface TicketTimelineProps {
    timelineItems: TimelineItem[]
}

export function TicketTimeline({ timelineItems }: TicketTimelineProps) {
    const renderAvatar = (item: TimelineItem) => {
        const avatarSize = "h-8 w-8 sm:h-10 sm:w-10"

        switch (item.type) {
            case "user":
                const userAvatarImage = getAvatarImage(item.avatarNumber)
                return (
                    <Avatar className={`${avatarSize} border-2 border-white shadow-sm`}>
                        <AvatarImage src={item.avatar || userAvatarImage.src} />
                        <AvatarFallback className="bg-blue-600 text-white text-xs">{item.initials}</AvatarFallback>
                    </Avatar>
                )
            case "ai":
                return (
                    <Avatar className={`${avatarSize} border-2 border-white shadow-sm`}>
                        <AvatarImage src={item.avatar || SafiBubble.src} />
                        <AvatarFallback className="bg-red-50 text-white text-xs">{item.initials}</AvatarFallback>
                    </Avatar>
                )
            case "analyst":
                const analystAvatarImage = getAvatarImage(item.avatarNumber)
                return (
                    <Avatar className={`${avatarSize} border-2 border-white shadow-sm`}>
                        <AvatarImage src={item.avatar || analystAvatarImage.src} />
                        <AvatarFallback className="bg-red-50 text-white text-xs">{item.initials}</AvatarFallback>
                    </Avatar>
                )
            default:
                return (
                    <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gray-100 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                        <div className="w-2 h-2 sm:w-3 sm:h-3 bg-gray-500 rounded-full"></div>
                    </div>
                )
        }
    }

    return (
        <div className="bg-white border border-gray-200 rounded-lg p-3 sm:p-4">
            <h3 className="font-medium text-gray-900 mb-4 text-sm sm:text-base">Histórico do Chamado</h3>
            <div className="border-t py-4">
                <div className="relative">
                    {/* Linha pontilhada vertical */}
                    <div className="absolute left-4 sm:left-5 top-0 bottom-0 w-px border-l-2 border-dashed border-gray-300"></div>

                    <div className="space-y-4 sm:space-y-6">
                        {timelineItems.map((item, index) => (
                            <div key={item.id} className="relative flex items-start gap-3 sm:gap-4">
                                <div className="relative z-10 flex-shrink-0">{renderAvatar(item)}</div>

                                <div className="flex-1 min-w-0 pt-1">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                                        <span className="text-xs sm:text-sm font-medium text-gray-900 break-words">{item.user}</span>
                                        <span className="text-xs text-gray-400">{item.date}</span>
                                    </div>
                                    <p className="text-xs text-gray-600 mt-1 break-words">{item.action}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
