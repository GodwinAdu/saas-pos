'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertTriangle, Loader2 } from 'lucide-react'
import BasicInfoForm from './BasicForm'
import ConfigurationForm from './ConfiguratonForm'
import ReportingForm from './ReportingForm'
import NotificationsForm from './NotificationForm'
import SubscriptionForm from './SubscriptonForm'
import { toast } from '@/hooks/use-toast'
import { updateStore } from '@/lib/actions/store.actions'
import { useRouter } from 'next/navigation'
import { playErrorSound, playSuccessSound } from '@/lib/audio'
import AiIntegrationForm from './ai-integration'
import { Input } from '@/components/ui/input'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { IStore } from '@/lib/types'



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


export default function StoreSettingsForm({ store }: { store: IStore }) {
    const [isLoading, setIsLoading] = useState(false)
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)
    const [showDeactivateConfirmation, setShowDeactivateConfirmation] = useState(false)
    const [showResetConfirmation, setShowResetConfirmation] = useState(false)
    const [showMergeConfirmation, setShowMergeConfirmation] = useState(false)
    const [showTransferConfirmation, setShowTransferConfirmation] = useState(false)
    const [mergeBranchName, setMergeBranchName] = useState('')
    const [transferEmployeeCount, setTransferEmployeeCount] = useState(0)

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
                <Tabs defaultValue="basic-info" className="w-full">
                    <TabsList className="">
                        <TabsTrigger value="basic-info">Basic Info</TabsTrigger>
                        <TabsTrigger value="configuration-settings">Configuration</TabsTrigger>
                        <TabsTrigger value="reporting">Reporting</TabsTrigger>
                        <TabsTrigger value="notifications">Notifications</TabsTrigger>
                        <TabsTrigger value="subscription">Subscription</TabsTrigger>
                        <TabsTrigger value="ai-integration">AI Integration</TabsTrigger>
                        <TabsTrigger value="danger">Danger Zone</TabsTrigger>
                    </TabsList>
                    <TabsContent value="basic-info">
                        <Card>
                            <CardHeader>
                                <CardTitle>Basic Information</CardTitle>
                                <CardDescription>Manage your store&apos;s basic information.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <BasicInfoForm  store={store} />
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
                    <TabsContent value="ai-integration">
                        <Card>
                            <CardHeader>
                                <CardTitle>AI Integration</CardTitle>
                                <CardDescription>Manage your AI Settings.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <AiIntegrationForm control={form.control} />
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="danger">
                        <div className="space-y-6">
                            <Alert variant="destructive">
                                <AlertTriangle className="h-4 w-4" />
                                <AlertTitle>Warning</AlertTitle>
                                <AlertDescription>
                                    The actions in this section can have severe consequences. Proceed with extreme caution.
                                </AlertDescription>
                            </Alert>
                            <div className="grid gap-4">
                                <Card>
                                    <CardContent className="pt-6">
                                        <h3 className="text-lg font-semibold mb-2">Deactivate Branch</h3>
                                        <p className="text-sm text-muted-foreground mb-4">
                                            Temporarily disable this branch. This will prevent any new orders or operations.
                                        </p>
                                        <Button variant="outline" onClick={() => setShowDeactivateConfirmation(true)}>
                                            Deactivate Branch
                                        </Button>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardContent className="pt-6">
                                        <h3 className="text-lg font-semibold mb-2">Reset Branch Data</h3>
                                        <p className="text-sm text-muted-foreground mb-4">
                                            Reset all branch data to default values. This includes inventory, sales history, and customer data.
                                        </p>
                                        <Button variant="outline" onClick={() => setShowResetConfirmation(true)}>
                                            Reset Branch Data
                                        </Button>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardContent className="pt-6">
                                        <h3 className="text-lg font-semibold mb-2">Merge Branch</h3>
                                        <p className="text-sm text-muted-foreground mb-4">
                                            Merge this branch with another existing branch. All data will be combined.
                                        </p>
                                        <div className="flex items-center space-x-2">
                                            <Input
                                                placeholder="Enter branch name to merge"
                                                value={mergeBranchName}
                                                onChange={(e) => setMergeBranchName(e.target.value)}
                                            />
                                            <Button variant="outline" onClick={() => setShowMergeConfirmation(true)}>
                                                Merge Branch
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardContent className="pt-6">
                                        <h3 className="text-lg font-semibold mb-2">Transfer Employees</h3>
                                        <p className="text-sm text-muted-foreground mb-4">
                                            Transfer employees from this branch to other branches.
                                        </p>
                                        <div className="flex items-center space-x-2">
                                            <Input
                                                type="number"
                                                placeholder="Number of employees"
                                                value={transferEmployeeCount}
                                                onChange={(e) => setTransferEmployeeCount(parseInt(e.target.value))}
                                            />
                                            <Button variant="outline" onClick={() => setShowTransferConfirmation(true)}>
                                                Transfer Employees
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardContent className="pt-6">
                                        <h3 className="text-lg font-semibold mb-2">Delete Branch</h3>
                                        <p className="text-sm text-muted-foreground mb-4">
                                            Permanently delete this branch and all associated data. This action cannot be undone.
                                        </p>
                                        <Button variant="destructive" onClick={() => setShowDeleteConfirmation(true)}>
                                            Delete Branch
                                        </Button>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
            </form>
        </Form>
    )
}

