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
import { createUnit } from "@/lib/actions/unit.actions";
import MultiText from "@/components/commons/MultiText";
import MultiSelect from "@/components/commons/MultiSelect";
import { useEffect, useState } from "react";
import { createVariation } from "@/lib/actions/variation.actions";

const formSchema = z.object({
    name: z.string().min(2, {
        message: "Name must be at least 2 characters.",
    }),
    variations: z.array(z.string()),
    branchIds: z.array(z.string()),
});

export function VariationModal({ branches, user }: { branches: IBranch[], user: IUser }) {
    const [selectedBranches, setSelectedBranches] = useState<IBranch[] | []>([]);
    const router = useRouter();

    useEffect(() => {
        const filteredBranches = branches.filter((branch) => user.accessLocation.includes(branch._id))
        setSelectedBranches(filteredBranches);
    }, [branches, user])
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            variations: [],
            branchIds: [],
        },
    });

    const { isSubmitting } = form.formState;

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            await createVariation(values)
            playSuccessSound();
            form.reset();
            router.refresh();
            toast({
                title: "Created successfully",
                description: "New unit was added successfully...",
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
                        New Variation
                    </span>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] w-[96%]">
                <DialogHeader>
                    <DialogTitle>Create Variation</DialogTitle>
                    <DialogDescription>Creating a new Variations.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Enter Variation Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Eg. color" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="variations"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Add Variations</FormLabel>
                                        <FormControl>
                                            <MultiText
                                                placeholder="Add some variations"
                                                value={field.value ?? []}
                                                onChange={(tag) =>
                                                    field.onChange([...field.value ?? [], tag])
                                                }
                                                onRemove={(tagToRemove) =>
                                                    field.onChange([
                                                        ...(field.value ?? []).filter(
                                                            (tag) => tag !== tagToRemove
                                                        ),
                                                    ])
                                                }
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
                                        <FormLabel>Add Branch</FormLabel>
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
