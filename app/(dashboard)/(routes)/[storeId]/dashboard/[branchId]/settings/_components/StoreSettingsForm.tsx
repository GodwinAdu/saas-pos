'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'
import BasicInfoForm from './BasicForm'
import ConfigurationForm from './ConfiguratonForm'
import ReportingForm from './ReportingForm'
import NotificationsForm from './NotificationForm'
import SubscriptionForm from './SubscriptonForm'
import { toast } from '@/hooks/use-toast'
import { updateStore } from '@/lib/actions/store.actions'
import { useRouter } from 'next/navigation'
import { playErrorSound, playSuccessSound } from '@/lib/audio'



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

type StoreFormValues = z.infer<typeof storeFormSchema>


export default function StoreSettingsForm({ store }: { store: any }) {
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
        } catch (error) {
            console.log(error)
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
                <Tabs defaultValue="basic-info" className="w-full">
                    <TabsList className="">
                        <TabsTrigger value="basic-info">Basic Info</TabsTrigger>
                        <TabsTrigger value="configuration-settings">Configuration</TabsTrigger>
                        <TabsTrigger value="reporting">Reporting</TabsTrigger>
                        <TabsTrigger value="notifications">Notifications</TabsTrigger>
                        <TabsTrigger value="subscription">Subscription</TabsTrigger>
                    </TabsList>
                    <TabsContent value="basic-info">
                        <Card>
                            <CardHeader>
                                <CardTitle>Basic Information</CardTitle>
                                <CardDescription>Manage your store&apos;s basic information.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <BasicInfoForm control={form.control} storeName={store.name} />
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="configuration-settings">
                        <Card>
                            <CardHeader>
                                <CardTitle>Configuration Settings</CardTitle>
                                <CardDescription>Configure your payment and email settings.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ConfigurationForm control={form.control} />
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="reporting">
                        <Card>
                            <CardHeader>
                                <CardTitle>Reporting</CardTitle>
                                <CardDescription>Manage your store&apos;s reporting preferences.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ReportingForm control={form.control} />
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="notifications">
                        <Card>
                            <CardHeader>
                                <CardTitle>Notifications</CardTitle>
                                <CardDescription>Configure your notification preferences.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <NotificationsForm control={form.control} />
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="subscription">
                        <Card>
                            <CardHeader>
                                <CardTitle>Subscription</CardTitle>
                                <CardDescription>Manage your subscription plan.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <SubscriptionForm control={form.control} />
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>

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

