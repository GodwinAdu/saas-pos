"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCartStore } from "@/hooks/use-cart";
import { toast } from "@/hooks/use-toast";
import { playErrorSound, playSuccessSound, playWarningSound } from "@/lib/audio";
import { Loader2, Pause } from "lucide-react";
import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Textarea } from "../ui/textarea";
import { useParams, useRouter } from "next/navigation";
import { findAutomatedPrice, findManualPrice } from "@/lib/utils";
import { useSelectSellingGroup } from "@/hooks/use-select-selling-group";
import { createSuspend } from "@/lib/actions/suspend.actions";

const formSchema = z.object({
  description: z.string().nonempty("Reason is required"),
})


const SuspendModal = ({ branch }: { branch: IBranch }) => {
  const params = useParams();
  const router = useRouter();
  const cart = useCartStore();
  const [openModal, setOpenModal] = useState(false);
  const { selectedValue } = useSelectSellingGroup();

  const branchId = params.branchId as string;

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

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: "",
    },
  });
  const data = {
    branchId,
    products: cart.cartItems.map((item) => ({
      productId: item.item._id,
      quantity: item.quantity,
      unit: item.unit as string,
      price: Number(branch?.pricingType === 'manual' ? findManualPrice(item.item.manualPrice, item?.unit as string).toFixed(2) : findAutomatedPrice(item.item, item.item.unit, item.unit as string, selectedValue as string).toFixed(2))
    })),
  };

  const { isSubmitting } = form.formState;

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    const allValues = {
      ...values,
      ...data
    }

    try {
      await createSuspend(allValues);
      playSuccessSound();
      form.reset();
      router.refresh();
      toast({
        title: "Suspended successfully",
        description: "Products have been suspended successfully.",
        variant: "success",
      });
      cart.clearCart();

    } catch (error) {
      console.error(error);
      playErrorSound();
      toast({
        title: "Something went wrong !...",
        description: "Failed to suspend product.",
        variant: "destructive",
      })

    } finally {
      setOpenModal(false);
    }
  }

  return (

    <>
      <Button onClick={handleProceedClick} variant="destructive">
        <Pause /> Suspend
      </Button>

      <Dialog open={openModal} onOpenChange={setOpenModal}>
        <DialogContent className="">
          <DialogHeader>
            <DialogTitle>Suspend Product</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Add Reason</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Tell a reason to suspend"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                {isSubmitting ? "Suspending..." : "Suspend"}
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SuspendModal;
