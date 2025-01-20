"use client"

import { useForm } from 'react-hook-form'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { playErrorSound, playSuccessSound } from '@/lib/audio'
import { toast } from '@/hooks/use-toast'
import { updateStore } from '@/lib/actions/store.actions'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

const storeFormSchema = z.object({
  notifications: z.object({
    lowStockAlert: z.boolean(),
    overdueSubscriptionAlert: z.boolean(),
    emailNotifications: z.boolean(),
  })
});
type StoreFormValues = z.infer<typeof storeFormSchema>
export default function NotificationsForm({ store }) {
  const router = useRouter();
  const storeId = store._id
  const defaultValues: Partial<StoreFormValues> = store ?? {
    notifications: {
      lowStockAlert: true,
      overdueSubscriptionAlert: true,
      emailNotifications: true,
    },
  }

  const form = useForm<StoreFormValues>({
    resolver: zodResolver(storeFormSchema),
    defaultValues,
  });

  const {isSubmitting} = form.formState;

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
        <Card>
          <CardHeader>
            <CardTitle>Notification Preferences</CardTitle>
            <CardDescription>Manage your notification settings.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="notifications.lowStockAlert"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      Low Stock Alert
                    </FormLabel>
                    <FormDescription>
                      Receive notifications when stock is low.
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
            <FormField
              control={form.control}
              name="notifications.overdueSubscriptionAlert"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      Overdue Subscription Alert
                    </FormLabel>
                    <FormDescription>
                      Receive notifications for overdue subscriptions.
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
            <FormField
              control={form.control}
              name="notifications.emailNotifications"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      Email Notifications
                    </FormLabel>
                    <FormDescription>
                      Receive notifications via email.
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
          </CardContent>
        </Card>
        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </Form >
  )
}

