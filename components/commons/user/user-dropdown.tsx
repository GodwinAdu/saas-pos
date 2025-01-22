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
import { Bell, ChevronDown, Beaker, Receipt, Layout, Settings, Moon, LogOut, User, Send } from 'lucide-react'
import { Badge } from "@/components/ui/badge"
import { toast } from '@/hooks/use-toast'
import { logoutUser } from '@/lib/helpers/logout-user'
import { useParams, useRouter } from 'next/navigation'
import { LucideIcon } from 'lucide-react';
import Link from 'next/link'
interface UserDropdownProps {
  username: string
  avatarUrl: string
  email: string
  notificationCount?: number
}

export default function UserDropdown({ username, avatarUrl, email, notificationCount = 0 }: UserDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)

  const router = useRouter();
  const params = useParams();

  const { storeId, branchId } = params;

  const handleLogout = async () => {
    try {
      await logoutUser();
      router.push('/')
      toast({
        title: 'Logged Out',
        description: 'You have been successfully logged out.',
        variant: 'success'
      })

    } catch {
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
          className="w-[280px] shadow-xl bg-card backdrop-blur-sm  text-card-foreground p-4"
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
              <span className="text-card-foreground font-bold">{username}</span>
              <span className="text-[#FFA116] text-sm">
                {email}
              </span>
            </div>
          </div>
          <DropdownMenuSeparator className="bg-card-foreground" />

          <DropdownMenuGroup className="space-y-1">
            <MenuItem icon={User}  label="Profile" href={`/${storeId}/dashboard/${branchId}/profile`} />
            <MenuItem icon={Beaker} disabled label="Try New Features" href={`/${storeId}/dashboard/${branchId}/new_features`} />
            <MenuItem icon={Send} disabled label="Feedback" href={`/${storeId}/dashboard/${branchId}/feedback`} />
            <MenuItem icon={Settings} label="Support" href={`/${storeId}/dashboard/${branchId}/support`} />
            <MenuItem icon={LogOut} label="Sign Out" onClick={handleLogout} />
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}


function MenuItem({ icon: Icon, label, hasChevron, onClick, disabled, href }: { icon: LucideIcon; label: string; hasChevron?: boolean, onClick?: () => void, disabled?: boolean, href?: string }) {
  return (
    <DropdownMenuItem disabled={disabled}  onClick={onClick}>
      <Link href={href || '#'} className="flex items-center px-2 py-2  rounded-md cursor-pointer" >
        <Icon className="h-5 w-5 mr-3" />
        <span className="flex-grow">{label}</span>
        {hasChevron && <ChevronDown className="h-4 w-4 rotate-[-90deg]" />}
      </Link>
    </DropdownMenuItem>
  )
}

