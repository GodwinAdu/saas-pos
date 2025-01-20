import { Control, useForm } from 'react-hook-form'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { updateStore } from '@/lib/actions/store.actions'
import { playErrorSound, playSuccessSound } from '@/lib/audio'
import { toast } from '@/hooks/use-toast'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertTriangle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
const storeFormSchema = z.object({
    name: z.string().min(2, {
        message: "Store name must be at least 2 characters.",
    }),
    avatar: z.string().url().nullable(),
    storeEmail: z.string().email({
        message: "Please enter a valid email address.",
    }),
    storePhone: z.string().nullable(),
    storeAddress: z.string().nullable(),
    autoDeleteTrash: z.boolean(),
    paymentKeys: z.object({
        paystackPublicKey: z.string().nullable(),
        paystackSecretKey: z.string().nullable(),
    }),
    gmailKeys: z.object({
        username: z.string().email().nullable(),
        secretKey: z.string().nullable(),
    }),
    reporting: z.object({
        enabledReports: z.array(z.string()),
        schedule: z.array(z.object({
            reportType: z.string(),
            frequency: z.string(),
            lastGenerated: z.date().nullable(),
        })),
    }),
    notifications: z.object({
        lowStockAlert: z.boolean(),
        overdueSubscriptionAlert: z.boolean(),
        emailNotifications: z.boolean(),
    }),
    subscriptionPlan: z.object({
        period: z.object({
            name: z.string(),
            value: z.number(),
        }),
        subscriptionExpiry: z.coerce.date(),
        paymentStatus: z.string(),
    }),
})
export default function AiIntegrationForm({ store }) {
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter();
    const storeId = store._id
    const defaultValues: Partial<StoreFormValues> = store ?? {
        name: "",
        avatar: null,
        storeEmail: "",
        storePhone: null,
        storeAddress: null,
        autoDeleteTrash: true,
        paymentKeys: {
            paystackPublicKey: null,
            paystackSecretKey: null,
        },
        gmailKeys: {
            username: null,
            secretKey: null,
        },
        reporting: {
            enabledReports: [],
            schedule: [],
        },
        notifications: {
            lowStockAlert: true,
            overdueSubscriptionAlert: true,
            emailNotifications: true,
        },
        subscriptionPlan: {
            period: {
                name: 'Monthly',
                value: 1,
            },
            subscriptionExpiry: new Date(),
            paymentStatus: 'Free Tier',
        },
    }

    const form = useForm<StoreFormValues>({
        resolver: zodResolver(storeFormSchema),
        defaultValues,
    })

    async function onSubmit(data: StoreFormValues) {
        setIsLoading(true)
        try {
            await updateStore(storeId, data)
            playSuccessSound()
            router.refresh()
            toast({
                title: "Settings updated successfully",
                description: "Your store settings have been saved.",
                variant: "success",
            })
        } catch {
            playErrorSound()
            toast({
                title: "Error",
                description: "An error occurred while saving your settings.",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle className='font-extrabold'>COMING SOON</AlertTitle>
                    <AlertDescription>
                        JuTech Devs Team working harder to implement this features,soon you can access AI features in the application
                    </AlertDescription>
                </Alert>
                <Card>
                    <CardHeader>
                        <CardTitle>AI Settings Preferences</CardTitle>
                        {/* <CardDescription>Manage your notification settings.</CardDescription> */}
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <FormField
                            control={form.control}
                            name="notifications.lowStockAlert"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                    <div className="space-y-0.5">
                                        <FormLabel className="font-bold">
                                            Use System AI Model (GPT4o)
                                        </FormLabel>
                                        <FormDescription>
                                            You&apos;ll be charged based on usage. <span className="font-semibold">(Pay only for what you use)</span>
                                        </FormDescription>

                                    </div>
                                    <FormControl>
                                        <Switch
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <div className="rounded-lg border p-4 space-y-4">
                            <h5 className='font-bold'>Customize your AI Model</h5>
                            <Card>
                                <CardHeader>
                                    <div className="flex justify-between items-center">
                                        <div className="">
                                            <CardTitle>OpenAI Settings</CardTitle>
                                            <CardDescription>Configure your OpenAI API keys.</CardDescription>
                                        </div>
                                        <Link
                                            href="https://platform.openai.com/api-keys"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all"
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                strokeWidth="2"
                                                stroke="currentColor"
                                                className="w-5 h-5"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25a2.25 2.25 0 00-2.25-2.25H8.25A2.25 2.25 0 006 5.25V15a2.25 2.25 0 002.25 2.25h4.5m2.25 0H12m0 0v4.5m0-4.5l6-6" />
                                            </svg>
                                            Get your API key here
                                        </Link>
                                    </div>
                                </CardHeader>
                                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="paymentKeys.paystackPublicKey"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>OpenAI Key</FormLabel>
                                                <FormControl>
                                                    <Input type="password" placeholder="sk-XXXXXXXXXXXXXXXXXXXXX" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Select a Model</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select your AI Model" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="m@example.com">m@example.com</SelectItem>
                                                        <SelectItem value="m@google.com">m@google.com</SelectItem>
                                                        <SelectItem value="m@support.com">m@support.com</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <p className='text-xs text-muted-foreground'>Your API key is securely encrypted and stored in our database and cannot be viewed in plain text by anyone, including us.</p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader>
                                    <div className="flex justify-between items-center">
                                        <div className="">
                                            <CardTitle>Gemini Settings</CardTitle>
                                            <CardDescription>Configure your Gemini API keys.</CardDescription>
                                        </div>
                                        <Link
                                            href="https://aistudio.google.com/app/apikey"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-semibold text-white bg-green-600 hover:bg-green-700 focus:ring-2 focus:ring-green-400 focus:outline-none transition-all"
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                strokeWidth="2"
                                                stroke="currentColor"
                                                className="w-5 h-5"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25a2.25 2.25 0 00-2.25-2.25H8.25A2.25 2.25 0 006 5.25V15a2.25 2.25 0 002.25 2.25h4.5m2.25 0H12m0 0v4.5m0-4.5l6-6" />
                                            </svg>
                                            Get your API key here
                                        </Link>
                                    </div>
                                </CardHeader>
                                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="paymentKeys.paystackPublicKey"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Gemini Key</FormLabel>
                                                <FormControl>
                                                    <Input type="password" placeholder="XXXXXXXXXXXXXXXXXXXXXXX" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Select a Model</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select your AI Model" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="m@example.com">m@example.com</SelectItem>
                                                        <SelectItem value="m@google.com">m@google.com</SelectItem>
                                                        <SelectItem value="m@support.com">m@support.com</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <p className='text-xs text-muted-foreground'>Your API key is securely encrypted and stored in our database and cannot be viewed in plain text by anyone, including us.</p>
                                </CardContent>
                            </Card>
                        </div>
                    </CardContent>
                </Card>
                <div className="flex justify-end">
                    <Button type="submit" disabled={isLoading}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {isLoading ? "Saving..." : "Save Changes"}
                    </Button>
                </div>
            </form>
        </Form>
    )
}

