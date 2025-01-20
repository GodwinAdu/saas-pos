import { Control, useFieldArray, useForm } from 'react-hook-form'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { DraftingCompass, Loader2 } from 'lucide-react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { updateStore } from '@/lib/actions/store.actions'
import { playErrorSound, playSuccessSound } from '@/lib/audio'
import { toast } from '@/hooks/use-toast'
import { z } from 'zod'



const reportTypes = ['Sales', 'Inventory', 'Customer Activity']
const frequencies = ['Daily', 'Weekly', 'Monthly']
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
export default function ReportingForm({ store }) {
  const [isLoading, setIsLoading] = useState(false);
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
  });
  const { control } = form;
  const { fields: scheduleFields, append: appendSchedule, remove: removeSchedule, move: moveSchedule } = useFieldArray({
    control,
    name: "reporting.schedule",
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
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Enabled Reports</CardTitle>
              <CardDescription>Select which reports you want to enable for your store.</CardDescription>
            </CardHeader>
            <CardContent>
              <FormField
                control={control}
                name="reporting.enabledReports"
                render={() => (
                  <FormItem>
                    {reportTypes.map((type) => (
                      <FormField
                        key={type}
                        control={control}
                        name="reporting.enabledReports"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={type}
                              className="flex flex-row items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(type)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...field.value, type])
                                      : field.onChange(
                                        field.value?.filter(
                                          (value: string) => value !== type
                                        )
                                      )
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {type}
                              </FormLabel>
                            </FormItem>
                          )
                        }}
                      />
                    ))}
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Report Schedule</CardTitle>
              <CardDescription>Configure the schedule for your enabled reports.</CardDescription>
            </CardHeader>
            <CardContent>
              {scheduleFields.map((field, index) => (
                <div key={field.id} className="flex items-center space-x-4 mb-4">
                  <DraftingCompass className="cursor-move" />
                  <FormField
                    control={control}
                    name={`reporting.schedule.${index}.reportType`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a report type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {reportTypes.map((type) => (
                              <SelectItem key={type} value={type}>
                                {type}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name={`reporting.schedule.${index}.frequency`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a frequency" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {frequencies.map((freq) => (
                              <SelectItem key={freq} value={freq}>
                                {freq}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="button" variant="ghost" size="icon" onClick={() => removeSchedule(index)}>
                    ✕
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={() => appendSchedule({ reportType: '', frequency: '', lastGenerated: null })}
              >
                Add Schedule
              </Button>
            </CardContent>
          </Card>
          <div className="flex justify-end">
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  )
}

