"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { playErrorSound, playSuccessSound } from "@/lib/audio";
import { toast } from "@/hooks/use-toast";
import { createWarrant } from "@/lib/actions/warrant.actions";

const formSchema = z.object({
    name: z.string().min(2, {
        message: "Name must be at least 2 characters.",
    }),
    warrant: z.string().nonempty({
        message: "Please specify the warrant duration.",
    }),
});

export function WarrantModal() {
    const router = useRouter();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            warrant: "1 day",
        },
    });

    const { isSubmitting } = form.formState;

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            await createWarrant(values);
            playSuccessSound();
            form.reset();
            router.refresh();
            toast({
                title: "Created successfully",
                description: "New warrant was added successfully...",
                variant: "success",
            });
        } catch (error: any) {
            playErrorSound();
            console.error("Error occurred while creating unit:", error);
            toast({
                title: "Something went wrong",
                description: "Please try again later...",
                variant: "destructive",
            });
        }
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="h-7 gap-1" size="sm">
                    <PlusCircle className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                        New Warrant
                    </span>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] w-[96%]">
                <DialogHeader>
                    <DialogTitle>Create Product Unit</DialogTitle>
                    <DialogDescription>Creating a new Product Unit.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Enter Warrant Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Eg. special" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="warrant"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Warrant Duration</FormLabel>
                                        <FormControl>
                                            <div className="flex items-center">
                                                <Select
                                                    onValueChange={(value) =>
                                                        field.onChange(`${field.value.split(" ")[0] || 1} ${value}`)
                                                    }
                                                    defaultValue="day"
                                                >
                                                    <SelectTrigger className="w-28">
                                                        <SelectValue placeholder="Select Unit" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="day">Day</SelectItem>
                                                        <SelectItem value="month">Month</SelectItem>
                                                        <SelectItem value="year">Year</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <Input
                                                    type="number"
                                                    className="flex-1 ml-2"
                                                    placeholder="Enter value"
                                                    value={field.value.split(" ")[0]}
                                                    onChange={(e) =>
                                                        field.onChange(`${e.target.value} ${field.value.split(" ")[1] || "day"}`)
                                                    }
                                                />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button disabled={isSubmitting} type="submit">
                                {isSubmitting ? "Creating..." : "Create"}
                            </Button>
                        </form>
                    </Form>
                </div>
            </DialogContent>
        </Dialog>
    );
}
