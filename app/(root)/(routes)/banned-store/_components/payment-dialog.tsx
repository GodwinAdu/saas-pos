"use client"
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogClose,
} from "@/components/ui/dialog";
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from "@/components/ui/form";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DollarSign, Info } from "lucide-react";
import { z } from "zod";
import {  getNextDate } from "@/lib/utils";
import { Tooltip } from "@/components/ui/tooltip";
import { updateStore } from "@/lib/actions/store.actions";
import dynamic from "next/dynamic";

// Dynamically import PaystackButton (client-side only)
const PaystackButton = dynamic(() => import("react-paystack").then(mod => mod.PaystackButton), {
    ssr: false // Disable SSR for this component
});

const periods = [
    { name: "1 Month", value: 1 },
    { name: "3 Months", value: 3 },
    { name: "6 Months (10% Discount)", value: 6 },
    { name: "Yearly (20% Discount)", value: 12 },
];

// Calculate the setup price per branch
const calculateSetupPrice = (branches: number) => {
    if (branches === 1) {
        return 200;
    }
    return (branches / 5) * 500;
};

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


const formSchema = z.object({
    subscriptionPlan: z.object({
        period: z.object({
            name: z.string(),
            value: z.number(),
        }),
    }),
    numberOfBranches: z.number().min(1).default(1),
});

export function BannedPaymentDialog({ store }: { store: IStore }) {
    const [setupPrice, setSetupPrice] = useState(200);
    const [totalPrice, setTotalPrice] = useState(200);
    const [availablePeriods, setAvailablePeriods] = useState(periods);
    const router = useRouter();
    const storeId = store._id;

    // Form initialization
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            subscriptionPlan: {
                period: {
                    name: "1 Month",
                    value: 1,
                },
            },
            numberOfBranches: 1,
        },
    });

    const branches = form.watch("numberOfBranches");
    const currentPeriod = form.watch("subscriptionPlan.period");

    // Update available periods dynamically based on current period
    useEffect(() => {
        const filteredPeriods = periods.filter((period) => period.value > currentPeriod?.value);
        setAvailablePeriods(filteredPeriods);
    }, [currentPeriod]);

    // Calculate prices dynamically
    useEffect(() => {
        const branches = form.watch("numberOfBranches");
        const period = form.watch("subscriptionPlan.period");
        setSetupPrice(calculateSetupPrice(Number(branches)));
        setTotalPrice(calculateTotalPrice(Number(branches), Number(period.value)));
    }, [branches, currentPeriod, form]);

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

    async function onSubmit(values: z.infer<typeof formSchema>) {
        const updateValues = {
            ...values,
            subscriptionPlan: {
                ...values.subscriptionPlan,
                subscriptionExpiry: getNextDate(new Date(), values.subscriptionPlan.period.value),
                paymentStatus: "paid",
            },
            banned: false,
        };

        let attempt = 0;
        const maxRetries = 3;

        while (attempt < maxRetries) {
            try {
                attempt++;
                await updateStore(storeId, updateValues);
                router.push(`/${storeId}`);
                break; // Exit the loop if successful
            } catch (error) {
                console.error(`Attempt ${attempt} failed:`, error);
                if (attempt === maxRetries) {
                    console.error("Max retries reached. Update failed.");
                }
            }
        }
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="w-full bg-green-600 text-white hover:bg-green-700">
                    {currentPeriod?.value === 12 ? (
                        <>
                            Yearly Subscription Active <Info className="ml-2 h-4 w-4" />
                        </>
                    ) : (
                        <>
                            Upgrade Subscription <DollarSign className="ml-2 h-4 w-4" />
                        </>
                    )}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>
                        {currentPeriod?.value === 12 ? "Yearly Subscription Active" : "Upgrade Subscription"}
                    </DialogTitle>
                    <DialogDescription>
                        {currentPeriod?.value === 12
                            ? "Your yearly subscription is active and will expire at the end of the term."
                            : "Select a subscription period, confirm details, and proceed to payment."}
                    </DialogDescription>
                </DialogHeader>

                {currentPeriod?.value !== 12 && (
                    <Form {...form}>
                        <form className="space-y-4">
                            <FormField
                                control={form.control}
                                name="subscriptionPlan.period"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Subscription Period</FormLabel>
                                        {/* <Tooltip text="Choose the duration for your subscription." placement="right"> */}
                                            <Select
                                                onValueChange={(value) => {
                                                    const selectedPeriod = availablePeriods.find(
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
                                        {/* </Tooltip> */}
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
                                        {/* <Tooltip text="Enter the number of branches your business operates."> */}
                                            <Input {...field} type="number" disabled className="cursor-not-allowed" />
                                        {/* </Tooltip> */}
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <p className="text-gray-600">
                                Setup Price: <span className="font-bold text-green-700">GH₵{setupPrice || 0}</span>
                            </p>
                            <p className="text-gray-600">
                                Total Price: <span className="font-bold text-blue-700">GH₵{totalPrice || 0}</span>
                            </p>
                            {form.watch("subscriptionPlan.period.value") >= 6 && (
                                <p className="text-sm text-green-600">
                                    {form.watch("subscriptionPlan.period.value") === 6
                                        ? "A 10% discount has been applied."
                                        : "A 20% discount has been applied for yearly subscriptions."}
                                </p>
                            )}
                        </form>
                    </Form>
                )}
                <DialogClose>
                    <PaystackButton
                        {...componentProps}
                        className="inline-block w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors duration-300"
                    />
                </DialogClose>
            </DialogContent>
        </Dialog>
    );
}
