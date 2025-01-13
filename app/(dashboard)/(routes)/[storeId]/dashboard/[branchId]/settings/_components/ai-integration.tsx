import { Control } from 'react-hook-form'
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function AiIntegrationForm({ control }: { control: Control<any> }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>AI Settings Preferences</CardTitle>
                {/* <CardDescription>Manage your notification settings.</CardDescription> */}
            </CardHeader>
            <CardContent className="space-y-6">
                <FormField
                    control={control}
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
                                control={control}
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
                                control={control}
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
                                control={control}
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
                                control={control}
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
    )
}

