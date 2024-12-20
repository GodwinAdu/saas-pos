"use client";

import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import { BanknoteIcon } from "lucide-react";
import dynamic from "next/dynamic";

// Dynamically import PaystackButton (client-side only)
const PaystackButton = dynamic(() => import("react-paystack").then(mod => mod.PaystackButton), {
    ssr: false // Disable SSR for this component
});



const formSchema = z.object({
    period: z.object({
        name: z.string(),
        value: z.number().min(1),
    }),
    numberOfBranches: z.coerce.number(),
});

// Calculate the setup price per branch
const calculateSetupPrice = (branches: number) => (branches / 5) * 200;

// Calculate the total price with discounts for longer durations
const calculateTotalPrice = (branches: number, period: number) => {
    const basePrice = calculateSetupPrice(branches) * period;

    // Apply discounts
    if (period === 6) {
        return basePrice * 0.9; // 10% discount for 6 months
    }
    if (period === 12) {
        return basePrice * 0.8; // 20% discount for yearly
    }

    return basePrice; // No discount for other durations
};

const periods = [
    { name: "1 Month", value: 1 },
    { name: "3 Months", value: 3 },
    { name: "6 Months (10% Discount)", value: 6 },
    { name: "Yearly (20% Discount)", value: 12 },
];

export function PaymentDialog({ store }: { store: IStore }) {
    const [setupPrice, setSetupPrice] = useState(200);
    const [totalPrice, setTotalPrice] = useState(200);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            period: store.subscriptionPlan.period,
            numberOfBranches: store.numberOfBranches,
        },
    });
    const branches = form.watch('numberOfBranches')
    const period = form.watch("period")

    // Watch form changes and update prices
    useEffect(() => {
        const branches = form.watch("numberOfBranches");
        const period = form.watch("period");
        setSetupPrice(calculateSetupPrice(Number(branches)));
        setTotalPrice(calculateTotalPrice(Number(branches), Number(period.value)));
    }, [branches, period, form]);


    const handlePaymentSuccess = () => {
        form.handleSubmit(onSubmit)();
    };

    const subscriptionClose = () => {
        alert("You closed the payment dialog.");
    };

    const componentProps = {
        email: "gyamfiadu01@gmail.com",
        amount: totalPrice * 100,
        currency: process.env.NEXT_PUBLIC_PAYSTACK_CURRENCY!,
        publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY!,
        text: "Pay Now",
        onSuccess: handlePaymentSuccess,
        onClose: subscriptionClose,
    };


    function onSubmit(values: z.infer<typeof formSchema>) {
        console.log("Form submitted:", values);
    }


    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="w-full" variant="outline" size="sm">
                    <BanknoteIcon className="mr-2" />
                    Extend Period
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Proceed Payment</DialogTitle>
                    <DialogDescription>
                        Select a subscription period, confirm your store details, and proceed to payment.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="period"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Subscription Period</FormLabel>
                                    <Select
                                        onValueChange={(value) => {
                                            const selectedPeriod = periods.find(
                                                (period) => String(period.value) === value
                                            );
                                            field.onChange(selectedPeriod!);
                                        }}
                                        defaultValue={String(field.value.value)}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select period" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {periods.map((period) => (
                                                <SelectItem key={period.value} value={String(period.value)}>
                                                    {period.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="numberOfBranches"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Number of Branches</FormLabel>
                                    <Input disabled {...field} type="number" />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <p className="text-gray-600">
                            Setup Price:{" "}
                            <span className="font-bold text-green-700">GH₵{setupPrice}</span>{" "}
                            Monthly
                        </p>
                        <p className="text-gray-600">
                            Total Price:{" "}
                            <span className="font-bold text-blue-700">GH₵{totalPrice}</span>
                        </p>
                        {form.watch("period.value") >= 6 && (
                            <p className="text-sm text-green-600">
                                {form.watch("period.value") === 6
                                    ? "A 10% discount has been applied."
                                    : "A 20% discount has been applied for yearly subscriptions."}
                            </p>
                        )}
                    </form>
                </Form>
                <DialogClose>
                    <PaystackButton {...componentProps} className="inline-block w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors duration-300" />
                </DialogClose>
            </DialogContent>
        </Dialog>
    );
}
