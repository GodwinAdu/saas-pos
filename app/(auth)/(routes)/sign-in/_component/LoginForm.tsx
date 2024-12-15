"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

import { useRouter } from "next/navigation"
import { toast } from "@/hooks/use-toast"
import { logInUser } from "@/lib/helpers/login-user"
const formSchema = z.object({
    email: z.string().min(2, {
        message: "Username must be at least 2 characters.",
    }),
    password: z.string().min(2, {
        message: "Password must be at least 2 characters.",
    }),
})
const LoginForm = () => {
    const router = useRouter()
    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: ""
        },
    })

    const { isSubmitting } = form.formState

    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            const user = await logInUser(values)

            form.reset();

            toast({
                title: "Logged In Successfully",
                description: "Welcome back!",
                variant: 'success'
            })

            router.push(`/${user.storeId}`);
        } catch (error) {
            toast({
                title: "Something went wrong",
                description: "Please try again later",
                variant: "destructive",
            })

        }
    }
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Enter Email</FormLabel>
                            <FormControl>
                                <Input type="email" placeholder="Eg. johndoe12@example.com" {...field} />
                            </FormControl>

                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Enter Password</FormLabel>
                            <FormControl>
                                <Input type="password" placeholder="shadcn" {...field} />
                            </FormControl>

                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button disabled={isSubmitting} className="w-full" type="submit">{
                    isSubmitting ? "Please wait..." : "Log In"
                }</Button>
            </form>
        </Form>
    )
}

export default LoginForm
