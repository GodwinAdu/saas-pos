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
import { playWarningSound } from "@/lib/audio";
import { Pause } from "lucide-react";
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
 
const formSchema = z.object({
  reason: z.string().min(2, {
    message: "please add reason for this suspend",
  }),
})


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

        // 1. Define your form.
        const form = useForm<z.infer<typeof formSchema>>({
          resolver: zodResolver(formSchema),
          defaultValues: {
            reason: "",
          },
        })
      
        // 2. Define a submit handler.
        function onSubmit(values: z.infer<typeof formSchema>) {
          // Do something with the form values.
          // ✅ This will be type-safe and validated.
          console.log(values)
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
          name="reason"
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
        <Button type="submit">Submit</Button>
      </form>
    </Form>
      </DialogContent>
    </Dialog>
  </>
  );
};

export default SuspendModal;
