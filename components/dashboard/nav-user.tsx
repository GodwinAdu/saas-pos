

"use client"

import {
  ChevronsUpDown,
  DockIcon,
  House,
  Settings,
} from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { useParams } from "next/navigation"
import { dayLeft } from "@/lib/utils"
import Link from "next/link"
import { ModeToggle } from "../commons/theme/ModeToggle"
import { PaymentDialog } from "./dialog/paymentDialog"
import { RatingDialog } from "./dialog/RatingDialog"

export function NavUser({ store }: { store: IStore }) {
  const { isMobile } = useSidebar()
  const params = useParams()

  const storeId = params.storeId as string;
  const branchId = params.branchId as string;

  console.log(storeId, "store")
  console.log(branchId, "branch")

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src='' alt={store.name} />
                <AvatarFallback className="rounded-lg">{store.name.toUpperCase().slice(0, 2)}</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{store.name}</span>
                <span className="truncate text-xs text-red-400 font-extrabold">Expired : {dayLeft(store?.subscriptionPlan?.subscriptionExpiry)} days left</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src='' alt={store.name} />
                  <AvatarFallback className="rounded-lg">{store.name.toUpperCase().slice(0, 2)}</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{store.name}</span>
                  <span className="truncate text-xs font-extrabold text-green-700">{store?.branchIds.length}  out of {store.numberOfBranches} Branches</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <div className="flex gap-2 items-center">
                <ModeToggle />
                <p className="font-extrabold">Theme</p>
              </div>
              <Link href={`/${storeId}/dashboard/${branchId}/settings`}>
                <DropdownMenuItem>
                  <Settings />
                  Store Settings
                </DropdownMenuItem>
              </Link>

            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <Link href={`/${storeId}/dashboard/${branchId}/branches`}>
                <DropdownMenuItem>
                  <House />
                  Branch Settings
                </DropdownMenuItem>
              </Link>
              <Link href={`/${storeId}/dashboard/${branchId}/support`}>
                <DropdownMenuItem>
                  <DockIcon />
                  Support
                </DropdownMenuItem>
              </Link>
              <PaymentDialog store={store} />
              <RatingDialog />
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
