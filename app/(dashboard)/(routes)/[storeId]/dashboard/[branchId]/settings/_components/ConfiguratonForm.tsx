import { Control } from 'react-hook-form'
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function ConfigurationForm({ control }: { control: Control<any> }) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Paystack Settings</CardTitle>
          <CardDescription>Configure your Paystack API keys.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <FormField
            control={control}
            name="paymentKeys.paystackPublicKey"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Paystack Public Key</FormLabel>
                <FormControl>
                  <Input placeholder="Enter Paystack public key" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="paymentKeys.paystackSecretKey"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Paystack Secret Key</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="Enter Paystack secret key" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Gmail Settings</CardTitle>
          <CardDescription>Configure your Gmail API keys for email notifications.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <FormField
            control={control}
            name="gmailKeys.username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gmail Username</FormLabel>
                <FormControl>
                  <Input placeholder="Enter Gmail username" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="gmailKeys.secretKey"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gmail Secret Key</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="Enter Gmail secret key" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>
    </div>
  )
}

