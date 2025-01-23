"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { fetchStoreById, updateStore } from "@/lib/actions/store.actions"
import { useParams, usePathname, useRouter } from "next/navigation"
import { PaymentDialog } from "@/components/dashboard/dialog/PaymentForExpired"
import { currentUser } from "@/lib/helpers/current-user"

const publicRoutes = [
    "/",
    "/sing-in",
    "/sign-up",
    "/banned-store",
]
export function UseCheckStoreExpired() {
    const params = useParams()
    const path = usePathname()
    const [open, setOpen] = useState(false)
    const [expired, setExpired] = useState(false)
    const [countdown, setCountdown] = useState(10)
    const [showPaymentDialog, setShowPaymentDialog] = useState(false)
    const [store, setStore] = useState(null)

    const storeId = params.storeId as string

    const show = publicRoutes.some((route) =>
        path === route || path.startsWith(`${route}/`)
    );

    const fetchStore = async () => {
        try {
            const user = await currentUser();
            if (!user) return
            
            const fetchedStore = await fetchStoreById(storeId)
            if (!fetchedStore) return
            setStore(fetchedStore)

            const expirationDate = new Date(fetchedStore.subscriptionPlan.subscriptionExpiry)
            const currentDate = new Date()
            // Check if the current date is greater than the expiration date + 3 days
            const threeDaysAfterExpiry = new Date(expirationDate);
            threeDaysAfterExpiry.setDate(expirationDate.getDate() + 3);

            if (currentDate > threeDaysAfterExpiry) {
                setExpired(true)
                setOpen(true)
                await updateStore(storeId, { banned: true })
            } else {
                setExpired(false)
            }
        } catch (error) {
            console.error("Store Fetch Error:", error)
        }
    }

    useEffect(() => {
        fetchStore()
    }, [])

    useEffect(() => {
        if (expired && countdown > 0) {
            const timer = setInterval(() => {
                setCountdown((prev) => prev - 1)
            }, 1000)

            return () => clearInterval(timer)
        }

        if (expired && countdown === 0) {
            setOpen(false)
            setShowPaymentDialog(true)
        }
    }, [expired, countdown])

    const handleRenewNow = () => {
        setOpen(false)
        setShowPaymentDialog(true)
    }

    return (
        <>
            <Dialog open={open && !show}>
                <DialogContent className="sm:max-w-[425px] text-center space-y-4">
                    <h2 className="text-xl font-semibold text-gray-800">Subscription Expired</h2>
                    <p className="text-gray-600">
                        Your subscription has expired. You will be redirected to the payment page in{" "}
                        <span className="font-bold text-red-600">{countdown} seconds</span>.
                    </p>
                    <p className="text-gray-600">Please renew your subscription to continue accessing your store.</p>
                    <button onClick={handleRenewNow} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                        Renew Now
                    </button>
                </DialogContent>
            </Dialog>
            {store && <PaymentDialog store={store} open={showPaymentDialog} onOpenChange={setShowPaymentDialog} />}
        </>
    )
}

