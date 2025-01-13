"use client";

// import axios from "axios";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
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
    FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";
import { createBranch } from "@/lib/actions/branch.actions";
import { Plus } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const formSchema = z.object({
    name: z.string().min(1, {
        message: "Company name is required."
    }),

});

export const CreateBranchModal = () => {

    const params = useParams();

    const storeId = params.storeId as string;



    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
        }
    });

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {

            await createBranch(values, storeId)

            form.reset();

            toast({
                title: "Branch created successfully",
                description: "success"
            })

            window.location.reload()

        } catch (error) {
            console.log(error);
            toast({
                title: "Something went wrong",
                description: "Please try again later",
                variant: "destructive"
            })
        }
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <div className="flex items-center gap-2 cursor-pointer">
                    <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                        <Plus className="size-4" />
                    </div>
                    <div className="font-bold text-xs text-muted-foreground">New Store Branch</div>
                </div>
            </DialogTrigger>
            <DialogContent className="bg-white text-black p-0 overflow-hidden">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center font-bold">
                        Customize your Store Branch
                    </DialogTitle>
                    <DialogDescription className="text-center text-zinc-500">
                        Give your branch a personality with a name. You can always change it later.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <div className="space-y-8 px-6">

                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel
                                            className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70"
                                        >
                                            Branch Name
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={isLoading}
                                                className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                                                placeholder="Enter Store Branch"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <DialogFooter className="bg-gray-100 px-6 py-4">
                            <Button type="submit" disabled={isLoading}>
                                Create
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}