"use client"

import * as React from "react"
import {
  AudioWaveform,
  Command,
  GalleryVerticalEnd,
} from "lucide-react"


import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { TeamSwitcher } from "./team-switcher"
import { NavMain } from "./nav-main"
import { NavUser } from "./nav-user"
import { NavProjects } from "./nav-projects"
import SideContent from "./sidebar"

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],

}

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  store: IStore, // Replace `any` with the specific type if you know it
  branches: IBranch[],
  role: any
}

export function AppSidebar(props: AppSidebarProps) {
  const { store, branches, role, ...rest } = props;

  return (
    <Sidebar collapsible="icon" {...rest}>
      <SidebarHeader>
        <TeamSwitcher branches={branches} />
      </SidebarHeader>
      <SidebarContent>
        <SideContent role={role} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser store={store} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}