import AppSidebarMain from "@/components/dashboard/app-sidebar-main";
import Navbar from "@/components/dashboard/nav-bar";
import {
    SidebarInset,
    SidebarProvider,
} from "@/components/ui/sidebar";
import { currentUser } from "@/lib/helpers/current-user";
import { TourProvider } from "@/lib/context/TourContext";
import TourLayout from "@/components/TourLayout";
import { UseCheckStoreExpired } from "@/hooks/use-check-store-expired";

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const user = (await currentUser()) ?? null;

    return (
        <TourProvider>
            <TourLayout>
                <SidebarProvider>
                    <AppSidebarMain />
                    <SidebarInset>
                        <Navbar user={user} />
                        <div id="main-content" className="py-4 px-4">
                            {children}
                            <UseCheckStoreExpired />
                        </div>
                    </SidebarInset>
                </SidebarProvider>
            </TourLayout>
        </TourProvider>
    );
}
