
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { useCartStore } from "@/hooks/use-cart";
import { toast } from "@/hooks/use-toast";
import { playWarningSound } from "@/lib/audio";
import { ShoppingCartIcon } from "lucide-react"
import { useState } from "react";

const OrderModal = () => {
    const cart = useCartStore();
    const [openModal, setOpenModal] = useState(false);

    const handleProceedClick = () => {
        if (cart.cartItems.length === 0) {
            playWarningSound();
            toast({
                title: "Warning !...",
                description: "Cart is empty. Please add new Product to proceed to Order.",
                variant: "warning",
            });
        } else {
            setOpenModal(true);
        }
    };
    return (
        <>
            <Button onClick={handleProceedClick} variant="outline"><ShoppingCartIcon /> Order</Button>
            <Dialog open={openModal} onOpenChange={setOpenModal}>
                <DialogContent className="max-w-5xl ">
                    <DialogHeader>
                        <DialogTitle>Edit Profile</DialogTitle>
                        <DialogDescription>
                            Make changes to your profile here. Click save when you&apos;re done.
                        </DialogDescription>
                    </DialogHeader>
                    {/* Add additional content here */}
                </DialogContent>
            </Dialog>
        </>
    )
}

export default OrderModal
