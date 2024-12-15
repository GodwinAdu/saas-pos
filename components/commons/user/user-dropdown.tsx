'use client'

import { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Bell, Flame, ChevronDown, ListTodo, BookMarked, Trophy, PieChart, Coins, Beaker, Receipt, Layout, Settings, Moon, LogOut } from 'lucide-react'
import { Badge } from "@/components/ui/badge"
import { toast } from '@/hooks/use-toast'
import { logoutUser } from '@/lib/helpers/logout-user'
import { useRouter } from 'next/navigation'

interface UserDropdownProps {
  username: string
  avatarUrl: string
  email: string
  notificationCount?: number
}

export default function UserDropdown({ username, avatarUrl, email, notificationCount = 0 }: UserDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)

  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logoutUser();
      router.push('/')
      toast({
        title: 'Logged Out',
        description: 'You have been successfully logged out.',
        variant:'success'
      })

    } catch (error) {
      toast({
        title: 'Error logging out',
        description: 'Failed to log out. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsOpen(false)
    }
  }

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
          <Avatar className="h-8 w-8 border-2 border-transparent hover:border-[#FFA116] transition-colors">
            <AvatarImage src={avatarUrl} alt={username} />
            <AvatarFallback className="bg-black text-white">
              {username[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-[280px] bg-[#282828]/95 backdrop-blur-sm border-[#3E3E3E] text-gray-300 p-4"
          align="end"
        >
          <div className="flex items-start space-x-3 mb-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={avatarUrl} alt={username} />
              <AvatarFallback className="bg-black text-white">
                {username[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-white font-medium">{username}</span>
              <span className="text-[#FFA116] text-sm">
                {email}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-4">
            <FeatureButton icon={ListTodo} label="My Lists" />
            <FeatureButton icon={BookMarked} label="Notebook" />
            <FeatureButton icon={Trophy} label="Submissions" />
            <FeatureButton icon={PieChart} label="Progress" />
            <FeatureButton icon={Coins} label="Points" />
          </div>

          <DropdownMenuSeparator className="bg-[#3E3E3E]" />

          <DropdownMenuGroup className="space-y-1">
            <MenuItem icon={Beaker} label="Try New Features" />
            <MenuItem icon={Receipt} label="Orders" />
            <MenuItem icon={Layout} label="My Playgrounds" />
            <MenuItem icon={Settings} label="Settings" />
            <MenuItem icon={Moon} label="Appearance" hasChevron />
            <MenuItem icon={LogOut} label="Sign Out" onClick={handleLogout} />
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

function FeatureButton({ icon: Icon, label }: { icon: any; label: string }) {
  return (
    <button className="flex flex-col items-center justify-center p-3 rounded-lg  transition-colors text-sm">
      <Icon className="h-5 w-5 mb-1" />
      {label}
    </button>
  )
}

function MenuItem({ icon: Icon, label, hasChevron, onClick }: { icon: any; label: string; hasChevron?: boolean, onClick?: () => void }) {
  return (
    <DropdownMenuItem className="flex items-center px-2 py-2  rounded-md cursor-pointer" onClick={onClick}>
      <Icon className="h-5 w-5 mr-3" />
      <span className="flex-grow">{label}</span>
      {hasChevron && <ChevronDown className="h-4 w-4 rotate-[-90deg]" />}
    </DropdownMenuItem>
  )
}

