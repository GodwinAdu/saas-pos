import { Control } from 'react-hook-form'
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export default function BasicInfoForm({ control,storeName }: { control: Control<any>,storeName:string }) {
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
        </div>
    )
}
