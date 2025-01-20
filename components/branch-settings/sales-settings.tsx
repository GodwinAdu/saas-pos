"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useFieldArray, useForm } from "react-hook-form"
import * as z from "zod"
import { CalendarIcon, Loader2, Plus, Trash2 } from 'lucide-react'
import { format } from "date-fns"

import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from '@/hooks/use-toast'
import { playErrorSound, playSuccessSound } from "@/lib/audio"
import { updateBranch } from "@/lib/actions/branch.actions"
import { useRouter } from "next/navigation"

const salesFormSchema = z.object({
  saleSettings: z.object({
    taxRates: z.array(z.object({
      name: z.string(),
      rate: z.coerce.number(),
    })),
    discounts: z.array(z.object({
      name: z.string(),
      type: z.enum(["percentage", "fixed"]),
      value: z.coerce.number(),
      startDate: z.coerce.date(),
      endDate: z.coerce.date(),
    })),
    salesTargets: z.object({
      monthly: z.coerce.number(),
      quarterly: z.coerce.number(),
      yearly: z.coerce.number(),
    }),
    commissionStructure: z.array(z.object({
      salesRange: z.object({
        min: z.coerce.number(),
        max: z.coerce.number(),
      }),
      commissionRate: z.coerce.number(),
    })),
    promotionalCampaigns: z.array(z.object({
      name: z.string(),
      startDate: z.coerce.date(),
      endDate: z.coerce.date(),
      discountType: z.enum(["percentage", "fixed"]),
      discountValue: z.coerce.number().min(0),
    })).optional(),
    loyaltyProgram: z.object({
      enabled: z.boolean(),
      pointsPerSpend: z.coerce.number(),
      redemptionRate: z.coerce.number(),
    }).optional(),
  })
})

type SalesFormValues = z.infer<typeof salesFormSchema>



export default function SalesSettings({ branch }) {
  const router = useRouter();
  const branchId = branch._id;
  const defaultValues: Partial<SalesFormValues> = branch ?? {
    saleSettings: {
      taxRates: [],
      discounts: [],
      salesTargets: {
        monthly: 0,
        quarterly: 0,
        yearly: 0,
      },
      commissionStructure: [],
      promotionalCampaigns: [],
      loyaltyProgram: {
        enabled: false,
        pointsPerSpend: 0,
        redemptionRate: 0.01,
      },
    }
  }
  const form = useForm<SalesFormValues>({
    resolver: zodResolver(salesFormSchema),
    defaultValues,
  });

  const { isSubmitting } = form.formState;

  const { fields: taxFields, append: appendTax, remove: removeTax } = useFieldArray({
    control: form.control,
    name: "saleSettings.taxRates",
  })

  const { fields: discountFields, append: appendDiscount, remove: removeDiscount } = useFieldArray({
    control: form.control,
    name: "saleSettings.discounts",
  })

  const { fields: commissionFields, append: appendCommission, remove: removeCommission } = useFieldArray({
    control: form.control,
    name: "saleSettings.commissionStructure",
  })

  const { fields: campaignFields, append: appendCampaign, remove: removeCampaign } = useFieldArray({
    control: form.control,
    name: "saleSettings.promotionalCampaigns",
  })

  async function onSubmit(data: SalesFormValues) {
    try {
      await updateBranch(branchId, data)
      playSuccessSound();
      router.refresh();
      toast({
        title: "Sales settings updated successfully",
        description: "Your sales settings have been saved.",
        variant: "success",
      })

    } catch {
      playErrorSound()
      toast({
        title: "Error saving sales settings",
        description: "An error occurred while trying to save your sales settings. Please try again.",
        variant: "destructive",
      })

    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Tabs defaultValue="general" className="w-full">
          <TabsList>
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="targets">Targets & Commission</TabsTrigger>
            <TabsTrigger value="promotions">Promotions & Loyalty</TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>Tax Rates</CardTitle>
                <CardDescription>Manage tax rates for this branch</CardDescription>
              </CardHeader>
              <CardContent>
                {taxFields.map((field, index) => (
                  <div key={field.id} className="flex items-center space-x-2 mb-4">
                    <FormField
                      control={form.control}
                      name={`saleSettings.taxRates.${index}.name`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <Input {...field} placeholder="Tax name" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`saleSettings.taxRates.${index}.rate`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <Input {...field} type="number" step="0.01" placeholder="Rate (%)" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="button" variant="destructive" size="icon" onClick={() => removeTax(index)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button type="button" variant="outline" size="sm" onClick={() => appendTax({ name: '', rate: 0 })}>
                  <Plus className="h-4 w-4 mr-2" /> Add Tax Rate
                </Button>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Discounts</CardTitle>
                <CardDescription>Manage discounts for this branch</CardDescription>
              </CardHeader>
              <CardContent>
                {discountFields.map((field, index) => (
                  <div key={field.id} className="flex flex-wrap items-center gap-2 mb-4">
                    <FormField
                      control={form.control}
                      name={`saleSettings.discounts.${index}.name`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <Input {...field} placeholder="Discount name" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`saleSettings.discounts.${index}.type`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="percentage">Percentage</SelectItem>
                              <SelectItem value="fixed">Fixed Amount</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`saleSettings.discounts.${index}.value`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <Input {...field} type="number" step="0.01" placeholder="Value" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`saleSettings.discounts.${index}.startDate`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button variant="outline">
                                  {field.value ? format(field.value, "PPP") : <span>Start date</span>}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) => date < new Date()}
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
                      name={`saleSettings.discounts.${index}.endDate`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button variant="outline">
                                  {field.value ? format(field.value, "PPP") : <span>End date</span>}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) => date < new Date()}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="button" variant="destructive" size="icon" onClick={() => removeDiscount(index)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button type="button" variant="outline" size="sm" onClick={() => appendDiscount({ name: '', type: 'percentage', value: 0, startDate: new Date(), endDate: new Date() })}>
                  <Plus className="h-4 w-4 mr-2" /> Add Discount
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="targets">
            <Card>
              <CardHeader>
                <CardTitle>Sales Targets</CardTitle>
                <CardDescription>Set sales targets for different time periods</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  <FormField
                    control={form.control}
                    name="saleSettings.salesTargets.monthly"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Monthly Target</FormLabel>
                        <FormControl>
                          <Input {...field} type="number" min="0" step="1000" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="saleSettings.salesTargets.quarterly"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quarterly Target</FormLabel>
                        <FormControl>
                          <Input {...field} type="number" min="0" step="1000" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="saleSettings.salesTargets.yearly"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Yearly Target</FormLabel>
                        <FormControl>
                          <Input {...field} type="number" min="0" step="1000" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Commission Structure(For Employees)</CardTitle>
                <CardDescription>Define commission rates based on sales ranges</CardDescription>
              </CardHeader>
              <CardContent>
                {commissionFields.map((field, index) => (
                  <div key={field.id} className="flex flex-wrap items-center gap-2 mb-4">
                    <FormField
                      control={form.control}
                      name={`saleSettings.commissionStructure.${index}.salesRange.min`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>Min Sales</FormLabel>
                          <FormControl>
                            <Input {...field} type="number" min="0" step="1000" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`saleSettings.commissionStructure.${index}.salesRange.max`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>Max Sales</FormLabel>
                          <FormControl>
                            <Input {...field} type="number" min="0" step="1000" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`saleSettings.commissionStructure.${index}.commissionRate`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>Commission Rate (%)</FormLabel>
                          <FormControl>
                            <Input {...field} type="number" min="0" max="100" step="0.1" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="button" variant="destructive" size="icon" onClick={() => removeCommission(index)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button type="button" variant="outline" size="sm" onClick={() => appendCommission({ salesRange: { min: 0, max: 0 }, commissionRate: 0 })}>
                  <Plus className="h-4 w-4 mr-2" /> Add Commission Range
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="promotions">
            <Card>
              <CardHeader>
                <CardTitle>Promotional Campaigns</CardTitle>
                <CardDescription>Manage promotional campaigns for this branch</CardDescription>
              </CardHeader>
              <CardContent>
                {campaignFields.map((field, index) => (
                  <div key={field.id} className="flex flex-wrap items-center gap-2 mb-4">
                    <FormField
                      control={form.control}
                      name={`saleSettings.promotionalCampaigns.${index}.name`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <Input {...field} placeholder="Campaign name" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`saleSettings.promotionalCampaigns.${index}.startDate`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button variant="outline">
                                  {field.value ? format(field.value, "PPP") : <span>Start date</span>}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) => date < new Date()}
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
                      name={`saleSettings.promotionalCampaigns.${index}.endDate`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button variant="outline">
                                  {field.value ? format(field.value, "PPP") : <span>End date</span>}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) => date < new Date()}
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
                      name={`saleSettings.promotionalCampaigns.${index}.discountType`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Discount type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="percentage">Percentage</SelectItem>
                              <SelectItem value="fixed">Fixed Amount</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`saleSettings.promotionalCampaigns.${index}.discountValue`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <Input {...field} type="number" step="0.01" placeholder="Discount value" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="button" variant="destructive" size="icon" onClick={() => removeCampaign(index)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button type="button" variant="outline" size="sm" onClick={() => appendCampaign({ name: '', startDate: new Date(), endDate: new Date(), discountType: 'percentage', discountValue: 0 })}>
                  <Plus className="h-4 w-4 mr-2" /> Add Campaign
                </Button>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Loyalty Program</CardTitle>
                <CardDescription>Configure the customer loyalty program</CardDescription>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="saleSettings.loyaltyProgram.enabled"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Enable Loyalty Program</FormLabel>
                        <FormDescription>
                          Turn on the customer loyalty program for this branch
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
                {form.watch("saleSettings.loyaltyProgram.enabled") && (
                  <div className="mt-4 space-y-4">
                    <FormField
                      control={form.control}
                      name="saleSettings.loyaltyProgram.pointsPerSpend"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Points per Amount Spent</FormLabel>
                          <FormControl>
                            <Input {...field} type="number" step="0.1" />
                          </FormControl>
                          <FormDescription>
                            Number of loyalty points earned per amount spent
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="saleSettings.loyaltyProgram.redemptionRate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Redemption Rate</FormLabel>
                          <FormControl>
                            <Input {...field} type="number" min="0" step="0.01" />
                          </FormControl>
                          <FormDescription>
                            Dollar value of each loyalty point when redeemed
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        <Button disabled={isSubmitting} type="submit">
          {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
          {isSubmitting ? 'Updating ...' : "Save Sales Settings"}
        </Button>

      </form>
    </Form>
  )
}

