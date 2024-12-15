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
import { PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { Checkbox } from "@/components/ui/checkbox";
import { playErrorSound, playSuccessSound } from "@/lib/audio";
import { toast } from "@/hooks/use-toast";
import { createUnit } from "@/lib/actions/unit.actions";
import MultiSelect from "@/components/commons/MultiSelect";
import { useEffect, useState } from "react";


const formSchema = z.object({
    name: z.string().min(2, {
        message: "name must be at least 2 characters.",
    }),
    quantity: z.coerce.number().min(1, {
        message: "quantity must be at least 1.",
    }),
    branchIds: z.array(z.string()),
    active: z.boolean()
});

export function UnitModal({ branches,user }: { branches: IBranch[],user:IUser }) {
    const [selectedBranches, setSelectedBranches] = useState<IBranch[]>([]);
    const router = useRouter();

    useEffect(()=>{
        const matchBranches = branches.filter(branch =>
            user.accessLocation.includes(branch._id)
        );
        setSelectedBranches(matchBranches);
    },[branches,user])
    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            quantity: 1,
            branchIds: [],
            active: false,
        },
    });

    const { isSubmitting } = form.formState;

    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            await createUnit(values)
            playSuccessSound()
            form.reset();
            router.refresh();
            toast({
                title: "Created successfully",
                description: "New unit was added successfully...",
                variant: "success",
            });
        } catch (error: any) {
            playErrorSound()
            console.log("error happened while creating unit", error);
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
                        New Unit
                    </span>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] w-[96%]">
                <DialogHeader>
                    <DialogTitle>Create Product Unit</DialogTitle>
                    <DialogDescription>Creating a new Product Unit .</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Enter Unit Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Eg. Minerals"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="quantity"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Unit Quantity</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                placeholder="Eg. 100"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="branchIds"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Product Sell unit</FormLabel>
                                        <FormControl>
                                            {selectedBranches && selectedBranches.length > 0 ? (
                                                <MultiSelect
                                                    placeholder="Select Units"
                                                    data={selectedBranches}
                                                    value={field.value}
                                                    onChange={(_id) =>
                                                        field.onChange([...field.value, _id])
                                                    }
                                                    onRemove={(idToRemove) =>
                                                        field.onChange([
                                                            ...field.value.filter(
                                                                (id) => id !== idToRemove
                                                            ),
                                                        ])
                                                    }
                                                />
                                            ) : null}
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="active"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md ">
                                        <FormControl>
                                            <Checkbox
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                        <div className="space-y-1 leading-none">
                                            <FormLabel>
                                                Is active
                                            </FormLabel>
                                        </div>
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
