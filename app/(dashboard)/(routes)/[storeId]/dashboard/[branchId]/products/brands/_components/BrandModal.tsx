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
import { createBrand } from "@/lib/actions/brand.actions";
import { playErrorSound, playSuccessSound } from "@/lib/audio";
import { toast } from "@/hooks/use-toast";
import MultiSelect from "@/components/commons/MultiSelect";
import { useEffect, useState } from "react";


const formSchema = z.object({
    name: z.string().min(2, {
        message: "name must be at least 2 characters.",
    }),
    branchIds: z.array(z.string()),
    active: z.boolean()
});

export function BrandModal({ branches, user }: { branches: IBranch[], user: IUser }) {
    const [selectedBranches, setSelectedBranches] = useState<IBranch[]>([]);
    const router = useRouter();

    useEffect(()=>{
        const matchBranches = branches.filter((branch) =>
            user.accessLocation.includes(branch._id)
        );
        setSelectedBranches(matchBranches);
    },[branches, user]);
    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            branchIds: [],
            active: false,
        },
    });

    const { isSubmitting } = form.formState;

    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            await createBrand(values)
            playSuccessSound()
            form.reset();
            router.refresh();
            toast({
                title: "Created successfully",
                description: "New brand was added successfully...",
                variant:'success'
            });
        } catch{
            playErrorSound()
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
                        New Brand
                    </span>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] w-[96%]">
                <DialogHeader>
                    <DialogTitle>Create Product Brand</DialogTitle>
                    <DialogDescription>Creating a new Product Brand .</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Enter Brand Name</FormLabel>
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
                                name="branchIds"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Add Branches</FormLabel>
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
