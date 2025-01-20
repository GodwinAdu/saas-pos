import { useForm } from 'react-hook-form'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { z } from 'zod'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { updateStore } from '@/lib/actions/store.actions'
import { playErrorSound, playSuccessSound } from '@/lib/audio'
import { toast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { zodResolver } from '@hookform/resolvers/zod'

const storeFormSchema = z.object({
  twilo: z.object({
    accountSid: z.string().nullable(),
    authToken: z.string().nullable(),
    phone: z.string().nullable(),
  }).optional(),
  gmailKeys: z.object({
    username: z.string().nullable(),
    secretKey: z.string().nullable(),
  }).optional(),
});

type StoreFormValues = z.infer<typeof storeFormSchema>

interface Store {
  _id: string;
  twilo?: {
    accountSid?: string | null;
    authToken?: string | null;
    phone?: string | null;
  };
  gmailKeys?: {
    username?: string | null;
    secretKey?: string | null;
  };
}

export default function ConfigurationForm({ store }: { store: Store }) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter();
  const storeId = store._id
  const defaultValues: Partial<StoreFormValues> = {
    twilo: {
      accountSid: store?.twilo?.accountSid || "",
      authToken: store?.twilo?.authToken || "",
      phone: store?.twilo?.phone || "",
    },
    gmailKeys: {
      username: store?.gmailKeys?.username || "",
      secretKey: store?.gmailKeys?.secretKey || "",
    },
  };


  const form = useForm<StoreFormValues>({
    resolver: zodResolver(storeFormSchema),
    defaultValues,
  });

  const { isSubmitting } = form.formState;

  async function onSubmit(data: StoreFormValues) {
    try {
      const processedData = {
        ...data,
        twilo: {
          ...data.twilo,
          accountSid: data.twilo?.accountSid || null,
          authToken: data.twilo?.authToken || null,
          phone: data.twilo?.phone || null,
        },
        gmailKeys: {
          ...data.gmailKeys,
          username: data.gmailKeys?.username || null,
          secretKey: data.gmailKeys?.secretKey || null,
        },
      };
      console.log(processedData)
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
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div className="">
                  <CardTitle>Twilo Settings</CardTitle>
                  <CardDescription>Configure your Twilo API keys (For SMS).</CardDescription>

                </div>
                <Link
                  href="https://dashboard.paystack.com/#/signup"
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
                  Get your paystack keys here
                </Link>
              </div>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="twilo.accountSid"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Twilo Accounts ID</FormLabel>
                    <FormControl>
                      <Input type='password' placeholder="Enter twilo account id" {...field} value={field.value || ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="twilo.authToken"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Twilo Auth Token</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Enter twilo Auth token" {...field} value={field.value || ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="twilo.phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Paystack Secret Key</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter phone number" {...field} value={field.value || ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div className="">
                  <CardTitle>Gmail Settings</CardTitle>
                  <CardDescription>Configure your Gmail API keys for email notifications.</CardDescription>
                </div>
                <Link
                  href="https://security.google.com/settings/security/apppasswords"
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
                  Get your secret key here
                </Link>
              </div>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <FormField
                control={form.control}
                name="gmailKeys.username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gmail Username</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter Gmail username" {...field} value={field.value || ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="gmailKeys.secretKey"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gmail Secret Key</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Enter Gmail secret key" {...field} value={field.value || ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

        </div>
        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </Form>
  )
}

