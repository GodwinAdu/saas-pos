"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

import { useRouter } from "next/navigation"
import { toast } from "@/hooks/use-toast"
import { logInUser } from "@/lib/helpers/login-user"
import Link from "next/link"
import { LoginFormSchema } from "@/lib/validators/sign-up-schema"

const LoginForm = () => {
    const router = useRouter()
    // 1. Define your form.
    const form = useForm<z.infer<typeof LoginFormSchema>>({
        resolver: zodResolver(LoginFormSchema),
        defaultValues: {
            email: "",
            password: ""
        },
    })

    const { isSubmitting } = form.formState

    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof LoginFormSchema>) {
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
            console.log('Error logging in user', error);
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
                            <div className="flex items-center">
                                <FormLabel htmlFor="password">Email</FormLabel>
                                <Link
                                    href="/forget_password"
                                    className="ml-auto text-sm underline-offset-2 hover:underline"
                                >
                                    <span className="text-xs text-blue-700">version 0.0.1</span>
                                </Link>
                            </div>
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
                            <div className="flex items-center">
                                <FormLabel htmlFor="password">Password</FormLabel>
                                <Link
                                    href="/forget_password"
                                    className="ml-auto text-sm underline-offset-2 hover:underline"
                                >
                                    Forgot your password?
                                </Link>
                            </div>
                            <FormControl>
                                <Input type="password" placeholder="password" {...field} />
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
