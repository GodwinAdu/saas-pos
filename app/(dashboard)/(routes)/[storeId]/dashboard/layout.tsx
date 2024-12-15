
import AppSidebarMain from "@/components/dashboard/app-sidebar-main";
import Navbar from "@/components/dashboard/nav-bar";
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar"
import { currentUser } from "@/lib/helpers/current-user";
export default async function RootLayout({
    children
}: Readonly<{
   
    children: React.ReactNode;
}>) {
    const user = await currentUser()
   
    return (

        <SidebarProvider>
            <AppSidebarMain />
            <SidebarInset>
               <Navbar user={user} />   
                <div className="py-4 px-4">
                    {children}
                </div>
            </SidebarInset>
        </SidebarProvider>

    );
}