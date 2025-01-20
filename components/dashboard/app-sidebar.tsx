"use client"

import * as React from "react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { TeamSwitcher } from "./team-switcher"
import { NavUser } from "./nav-user"
import SideContent from "./sidebar"
import { IRole, IStore } from "@/lib/types"
import { IBranch } from "@/lib/models/branch.models"


interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  store: IStore, // Replace `any` with the specific type if you know it
  branches: IBranch[],
  userRole: IRole
}

export function AppSidebar(props: AppSidebarProps) {
  const { store, branches, userRole, ...rest } = props;

  return (
    <Sidebar collapsible="icon" {...rest}>
      <SidebarHeader>
        <TeamSwitcher branches={branches} />
      </SidebarHeader>
      <SidebarContent>
        <SideContent role={userRole} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser store={store} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}