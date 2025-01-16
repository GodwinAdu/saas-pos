import { Control } from 'react-hook-form'
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

export default function ConfigurationForm({ control }: { control: Control<any> }) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div className="">
              <CardTitle>Paystack Settings</CardTitle>
              <CardDescription>Configure your Paystack API keys.</CardDescription>

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

