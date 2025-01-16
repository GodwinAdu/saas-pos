import {  useForm } from 'react-hook-form'
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { zodResolver } from '@hookform/resolvers/zod'
import { IStore } from '@/lib/types'
import { z } from 'zod'

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

export default function BasicInfoForm({store }: { store:IStore }) {
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
        <div className="space-y-6">
            <div className="flex items-center space-x-4">
                <FormField
                    control={control}
                    name="avatar"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Store Avatar</FormLabel>
                            <FormControl>
                                <div className="flex items-center space-x-4">
                                    <Avatar className="h-20 w-20">
                                        <AvatarImage src={field.value || undefined} alt="Store Avatar" />
                                        <AvatarFallback>{storeName.toUpperCase().slice(0,2)}</AvatarFallback>
                                    </Avatar>
                                    <Input placeholder="Enter avatar URL" {...field} className="w-[300px]" />
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <FormField
                    control={control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Store Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter store name" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={control}
                    name="storeEmail"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Store Email</FormLabel>
                            <FormControl>
                                <Input type="email" placeholder="Enter store email" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={control}
                    name="storePhone"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Store Phone</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter store phone" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={control}
                    name="storeAddress"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Store Address</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter store address" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={control}
                    name="autoDeleteTrash"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                                <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                                <FormLabel>
                                    Auto Delete Trash
                                </FormLabel>
                                <FormDescription>
                                    Automatically delete items in trash.
                                </FormDescription>
                            </div>
                        </FormItem>
                    )}
                />
            </div>
            <div className="flex justify-end">
                    <Button type="submit" disabled={isLoading}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {isLoading ? "Saving..." : "Save Changes"}
                    </Button>
                </div>
        </div>
    )
}

