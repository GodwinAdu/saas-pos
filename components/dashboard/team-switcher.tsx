"use client";

import { ChevronsUpDown, School, ShoppingCart } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useParams, useRouter } from "next/navigation"; // For dynamic navigation
import useBranchStore from "@/hooks/use-branch-store";
import { CreateBranchModal } from "./create-branch";

export function TeamSwitcher({ branches }: { branches: IBranch[] }) {
  const { isMobile } = useSidebar();
  const router = useRouter();
  const params = useParams();





  const { activeBranch, setActiveBranch } = useBranchStore();


  const handleBranchSelect = (branch: IBranch) => {
    setActiveBranch(branch);
    router.push(`/${params.storeId}/dashboard/${branch._id}`)
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <School className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {activeBranch?.name || branches[0]?.name || "Select Branch"}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg max-h-56 overflow-y-auto"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-xs text-muted-foreground ">
              Branches
            </DropdownMenuLabel>
            {branches?.map((branch, index) => (
              <DropdownMenuItem
                key={branch._id}
                onClick={() => handleBranchSelect(branch)}
                className="gap-2 p-2"
              >
                <div className="flex size-6 items-center justify-center rounded-sm border">
                  <ShoppingCart className="size-4 shrink-0" />
                </div>
                {branch.name}
                <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <CreateBranchModal />
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
