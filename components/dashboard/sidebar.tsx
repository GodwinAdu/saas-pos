import React from 'react'
import {
    Bot,
    MailCheck,
} from "lucide-react"
import { NavMain } from './nav-main'
import { NavProjects } from './nav-projects'



const data = {

    projects: [
        {
            name: "AI Support",
            url: "#",
            icon:Bot,
            roleField: "aiSupport"
        },
        {
            name: "Email Marketing",
            url: "#",
            icon: MailCheck,
            roleField: "salesMarketing"
        },
    ],
}
const SideContent = ({ role }: { role: IRole }) => {

    return (
        <>
            <NavMain role={role} />
            <NavProjects projects={data.projects} />
        </>
    )
}

export default SideContent
