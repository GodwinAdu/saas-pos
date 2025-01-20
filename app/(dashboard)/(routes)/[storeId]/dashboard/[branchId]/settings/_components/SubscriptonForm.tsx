import { useForm } from 'react-hook-form'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CalendarIcon, Loader2 } from 'lucide-react'
import { format } from 'date-fns'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Calendar } from '@/components/ui/calendar'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { updateStore } from '@/lib/actions/store.actions'
import { playErrorSound, playSuccessSound } from '@/lib/audio'
import { toast } from '@/hooks/use-toast'

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
});

type StoreFormValues = z.infer<typeof storeFormSchema>

export default function SubscriptionForm({ store }) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter();
  const storeId = store._id
  const defaultValues: Partial<StoreFormValues> = store ?? {
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
    defaultValues: defaultValues,
  });

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
        <Card>
          <CardHeader>
            <CardTitle>Subscription Details</CardTitle>
            <CardDescription>Manage your subscription plan and payment status.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <FormField
              control={form.control}
              name="subscriptionPlan.period.name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subscription Period</FormLabel>
                  <FormControl>
                    <Input disabled value={field.value ?? ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="subscriptionPlan.period.value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Period Value</FormLabel>
                  <FormControl>
                    <Input disabled type="number" {...field} value={field.value ?? ''} onChange={(e) => field.onChange(parseInt(e.target.value, 10))} />
                  </FormControl>
                  <FormDescription>
                    Number of months for the subscription period.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="subscriptionPlan.subscriptionExpiry"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Subscription Expiry</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          disabled
                          variant={"outline"}
                          className={cn(
                            "w-[240px] pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="subscriptionPlan.paymentStatus"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payment Status</FormLabel>
                  <FormControl>
                    <Input disabled value={field.value ?? ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
       
      </form>
    </Form>
  )
}

