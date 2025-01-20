import { useForm } from 'react-hook-form'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from '@/hooks/use-toast'
import { playErrorSound, playSuccessSound } from '@/lib/audio'
import { updateStore } from '@/lib/actions/store.actions'
import { useRouter } from 'next/navigation'
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
})

type StoreFormValues = z.infer<typeof storeFormSchema>

export default function BasicInfoForm({ store }: { store: IStore }) {

    const router = useRouter()
    const storeId = store._id
    const defaultValues: Partial<StoreFormValues> = store ?? {
        name: "",
        avatar: null,
        storeEmail: "",
        storePhone: null,
        storeAddress: null,
        autoDeleteTrash: true,
    }

    const form = useForm<StoreFormValues>({
        resolver: zodResolver(storeFormSchema),
        defaultValues,
    });

    const {isSubmitting } = form.formState;

    async function onSubmit(data: StoreFormValues) {
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
        } 
    }

    return (

        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="space-y-6">
                    <div className="flex items-center space-x-4">
                        <FormField
                            control={form.control}
                            name="avatar"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Store Avatar</FormLabel>
                                    <FormControl>
                                        <div className="flex items-center space-x-4">
                                            <Avatar className="h-20 w-20">
                                                <AvatarImage src={field.value || undefined} alt="Store Avatar" />
                                                <AvatarFallback>{store.name.toUpperCase().slice(0, 2)}</AvatarFallback>
                                            </Avatar>
                                            <Input placeholder="Enter avatar URL" {...field} value={field.value ?? ''} className="w-[300px]" />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        <FormField
                            control={form.control}
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
                            control={form.control}
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
                            control={form.control}
                            name="storePhone"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Store Phone</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter store phone" {...field} value={field.value ?? ''} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="storeAddress"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Store Address</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter store address" {...field} value={field.value ?? ''} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
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
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {isSubmitting ? "Saving..." : "Save Changes"}
                        </Button>
                    </div>
                </div>
            </form>
        </Form>
    )
}

