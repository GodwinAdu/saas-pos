"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCartStore } from "@/hooks/use-cart";
import { toast } from "@/hooks/use-toast";
import { playWarningSound } from "@/lib/audio";
import { Pause } from "lucide-react";
import { useState } from "react";

const SuspendModal = () => {
  const cart = useCartStore();
  const [openModal, setOpenModal] = useState(false);

  const handleProceedClick = () => {
    if (cart.cartItems.length === 0) {
      playWarningSound();
      toast({
        title: "Warning !...",
        description: "Cart is empty. No product to suspend.",
        variant: "warning",
      });
    } else {
      setOpenModal(true);
    }
  };

  return (
    <>
      <Button onClick={handleProceedClick} variant="destructive">
        <Pause /> Suspend
      </Button>

      <Dialog open={openModal} onOpenChange={setOpenModal}>
        <DialogContent className="max-w-5xl h-[90%]">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          {/* Add additional content here */}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SuspendModal;
