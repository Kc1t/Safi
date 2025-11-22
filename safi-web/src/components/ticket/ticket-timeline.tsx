"use client"

import { motion } from "framer-motion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import AvatarPlaceholder from "@/assets/avatars/avatar-3.png"
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
  5: Avatar5,
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.3,
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: {
      opacity: 0,
      x: -20,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
  }

  const lineVariants = {
    hidden: {
      height: 0,
      opacity: 0,
    },
    visible: {
      height: "100%",
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeInOut",
        delay: 0.1,
      },
    },
  }

  const headerVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
  }

  return (
    <motion.div
      className="bg-white border border-gray-200 rounded-lg p-3 sm:p-4"
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0, scale: 0.98 },
        visible: {
          opacity: 1,
          scale: 1,
          transition: {
            duration: 0.3,
            ease: "easeOut",
          },
        },
      }}
    >
      <motion.h3 className="font-medium text-gray-900 mb-4 text-sm sm:text-base" variants={headerVariants}>
        Histórico do Chamado
      </motion.h3>

      <div className="border-t py-4">
        <div className="relative">
          {/* Linha pontilhada vertical animada */}
          <div className="absolute left-4 sm:left-5 top-0 bottom-0 w-px overflow-hidden">
            <motion.div className="w-full h-full border-l-2 border-dashed border-gray-300" variants={lineVariants} />
          </div>

          <motion.div className="space-y-4 sm:space-y-6" variants={containerVariants}>
            {timelineItems.map((item, index) => (
              <motion.div key={item.id} className="relative flex items-start gap-3 sm:gap-4" variants={itemVariants}>
                <motion.div
                  className="relative z-10 flex-shrink-0"
                  whileHover={{
                    scale: 1.05,
                    transition: { duration: 0.2 },
                  }}
                >
                  {renderAvatar(item)}
                </motion.div>

                <div className="flex-1 min-w-0 pt-1">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <span className="text-xs sm:text-sm font-medium text-gray-900 break-words">{item.user}</span>
                    <span className="text-xs text-gray-400">{item.date}</span>
                  </div>
                  <p className="text-xs text-gray-600 mt-1 break-words">{item.action}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}
