import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import POSProfileHeader from "./_components/Header"
import POSProfileStats from "./_components/ProfileStats"
import POSProfileTabs from "./_components/ProfileTabs"

const page = () => {
    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="bg-white dark:bg-gray-800 shadow-xl rounded-lg overflow-hidden">
                    <Suspense fallback={<Skeleton className="h-[200px] w-full" />}>
                        <POSProfileHeader />
                    </Suspense>
                    <Suspense fallback={<Skeleton className="h-[100px] w-full" />}>
                        <POSProfileStats />
                    </Suspense>
                    <Suspense fallback={<Skeleton className="h-[500px] w-full" />}>
                        <POSProfileTabs />
                    </Suspense>
                </div>
            </div>
        </div>
    )
}

export default page