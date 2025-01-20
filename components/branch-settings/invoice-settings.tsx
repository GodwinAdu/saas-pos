import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { InvoiceTemplateSelector } from "./invoice-template-selector"
import { toast } from "@/hooks/use-toast"
import { playErrorSound, playSuccessSound } from "@/lib/audio"
import { updateBranch } from "@/lib/actions/branch.actions"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"


const invoiceFormSchema = z.object({
  invoiceSettings: z.object({
    invoicePrefix: z.string(),
    nextInvoiceNumber: z.number(),
    invoiceFooter: z.string(),
    termsAndConditions: z.string(),
    showLogo: z.boolean().default(true),
    showBranchAddress: z.boolean().default(true),
    invoiceTemplate: z.enum(["standard", "modern", "minimal"]),
  })
})

type InvoiceFormValues = z.infer<typeof invoiceFormSchema>


interface Branch {
  _id: string;
  invoiceSettings: {
    invoicePrefix: string;
    nextInvoiceNumber: number;
    invoiceFooter: string;
    termsAndConditions: string;
    showLogo: boolean;
    showBranchAddress: boolean;
    invoiceTemplate: "standard" | "modern" | "minimal";
  };
}

export function InvoiceSettings({ branch }: { branch: Branch }) {
  const router = useRouter();
  const branchId = branch._id;
  const defaultValues: Partial<InvoiceFormValues> = branch ?? {
    invoiceSettings: {
      invoicePrefix: "INV-",
      nextInvoiceNumber: 1001,
      invoiceFooter: "Thank you for your business!",
      termsAndConditions: "Payment is due within 30 days.",
      showLogo: true,
      showBranchAddress: true,
      invoiceTemplate: "standard",
    }
  }

  const form = useForm<InvoiceFormValues>({
    resolver: zodResolver(invoiceFormSchema),
    defaultValues,
  })

const { isSubmitting} = form.formState;


  async function onSubmit(data: InvoiceFormValues) {
    try {
      await updateBranch(branchId, data);
      playSuccessSound();
      router.refresh();
      toast({
        title: 'Invoice Settings Updated',
        description: "Your invoice settings have been updated successfully",
        variant: "success"
      })

    } catch {
      playErrorSound();
      toast({
        title: 'Something went wrong',
        description: "Please try again",
        variant: "destructive"
      })
    }

  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Tabs defaultValue="general" className="w-full">
          <TabsList>
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="customization">Customization</TabsTrigger>
            <TabsTrigger value="template">Template</TabsTrigger>
          </TabsList>
          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>Configure basic invoice settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="invoiceSettings.invoicePrefix"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Invoice Prefix</FormLabel>
                        <FormControl>
                          <Input placeholder="INV-" value={field.value as string} onChange={field.onChange} onBlur={field.onBlur} />
                        </FormControl>
                        <FormDescription>
                          This prefix will appear before the invoice number.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="invoiceSettings.nextInvoiceNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Next Invoice Number</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} onChange={event => field.onChange(+event.target.value)} />
                        </FormControl>
                        <FormDescription>
                          The next invoice will use this number.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="invoiceSettings.invoiceFooter"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Invoice Footer</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter a message to be displayed at the bottom of the invoice"
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        This message will appear at the bottom of each invoice.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="invoiceSettings.termsAndConditions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Terms and Conditions</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter the terms and conditions for your invoices"
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        These terms will be included on each invoice.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="customization">
            <Card>
              <CardHeader>
                <CardTitle>Customization</CardTitle>
                <CardDescription>Customize the appearance and content of your invoices</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="invoiceSettings.invoiceTemplate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Invoice Template</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select invoice template" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="standard">Standard</SelectItem>
                          <SelectItem value="modern">Modern</SelectItem>
                          <SelectItem value="minimal">Minimal</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Choose the visual style for your invoices.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="space-y-2">
                  <FormField
                    control={form.control}
                    name="invoiceSettings.showLogo"
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
                            Show Logo on Invoice
                          </FormLabel>
                          <FormDescription>
                            Display your company logo on invoices.
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="invoiceSettings.showBranchAddress"
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
                            Show Branch Address
                          </FormLabel>
                          <FormDescription>
                            Include the branch address on invoices.
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>

              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="template">
            <Card>
              <CardHeader>
                <CardTitle>Invoice Template</CardTitle>
                <CardDescription>Choose and preview your invoice template</CardDescription>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="invoiceSettings.invoiceTemplate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Select Template</FormLabel>
                      <FormControl>
                        <InvoiceTemplateSelector
                          value={field.value}
                          onValueChange={field.onChange}
                        />
                      </FormControl>
                      <FormDescription>
                        Choose the visual style for your invoices.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        <Button disabled={isSubmitting} type="submit">
          {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
          {isSubmitting ? 'Updating ...' : "Save Invoice Settings"}
        </Button>
      </form>
    </Form>
  )
}

