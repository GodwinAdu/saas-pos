'use client'

import { useState } from 'react'
import { Bell, ChevronDown } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

interface UserButtonProps {
  username: string
  avatarUrl: string
  notificationCount?: number
}

export default function UserButton({ username, avatarUrl, notificationCount = 0 }: UserButtonProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="flex items-center space-x-3">
      <div className="relative">
        <Bell className="h-5 w-5 text-gray-300 hover:text-white cursor-pointer" />
        {notificationCount > 0 && (
          <Badge 
            className="absolute -top-2 -right-2 h-4 min-w-4 px-1 bg-[#FFA116] hover:bg-[#FFA116] text-[10px] flex items-center justify-center rounded-full"
          >
            {notificationCount}
          </Badge>
        )}
      </div>
      
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger className="flex items-center space-x-2 focus:outline-none">
          <Avatar className="h-7 w-7 border-2 border-transparent hover:border-[#FFA116] transition-colors">
            <AvatarImage src={avatarUrl} alt={username} />
            <AvatarFallback className="bg-[#FFA116] text-white">
              {username[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <ChevronDown 
            className={`h-4 w-4 text-gray-300 transition-transform duration-200 ${
              isOpen ? 'transform rotate-180' : ''
            }`}
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48 bg-[#282828] border-[#3E3E3E] text-gray-300">
          <DropdownMenuItem className="hover:bg-[#3E3E3E] hover:text-white focus:bg-[#3E3E3E] focus:text-white">
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem className="hover:bg-[#3E3E3E] hover:text-white focus:bg-[#3E3E3E] focus:text-white">
            Submissions
          </DropdownMenuItem>
          <DropdownMenuItem className="hover:bg-[#3E3E3E] hover:text-white focus:bg-[#3E3E3E] focus:text-white">
            Progress
          </DropdownMenuItem>
          <DropdownMenuSeparator className="bg-[#3E3E3E]" />
          <DropdownMenuItem className="hover:bg-[#3E3E3E] hover:text-white focus:bg-[#3E3E3E] focus:text-white">
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

