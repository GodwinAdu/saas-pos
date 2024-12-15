'use client'

import { useState } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import PromotionsForm from './PromotionsForm'
import { toast } from '@/hooks/use-toast'
import OperatingHoursForm from './OpeningHoursForm'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { updateBranch } from '@/lib/actions/branch.actions'
import { useRouter } from 'next/navigation'
import { playErrorSound, playSuccessSound } from '@/lib/audio'


const branchFormSchema = z.object({
  name: z.string().min(2, {
    message: "Branch name must be at least 2 characters.",
  }),
  promotions: z.array(z.object({
    promoCode: z.string().nullable(),
    discountRate: z.number().min(0).max(100).nullable(),
    startDate: z.date().nullable(),
    endDate: z.date().nullable(),
  })),
  stockType: z.string(),
  pricingType: z.string(),
  pricingGroups: z.object({
    wholesale: z.coerce.boolean(),
    retail: z.coerce.boolean(),
  }),
  branchSettings: z.object({
    allowCustomReceipts: z.boolean(),
    receiptTemplate: z.string(),
    operatingHours: z.array(z.object({
      day: z.string(),
      openingTime: z.string(),
      closingTime: z.string(),
    })),
  }),
})

type BranchFormValues = z.infer<typeof branchFormSchema>


export default function BranchSettingsForm({ branch }: { branch: any }) {

  const router = useRouter();
  const branchId = branch._id;
  const defaultValues: Partial<BranchFormValues> = branch ?? {
    name: "",
    promotions: [],
    branchSettings: {
      allowCustomReceipts: false,
      receiptTemplate: "",
      operatingHours: [],
    },
    pricingType: "fixed",
    pricingGroups: {
      wholesale: true,
      retail: true,
    },
  }

  const form = useForm<BranchFormValues>({
    resolver: zodResolver(branchFormSchema),
    defaultValues,
  });

  const type = form.watch('pricingType');

  const { isSubmitting } = form.formState;

  async function onSubmit(data: BranchFormValues) {
    try {
      await updateBranch(branchId, data)

      router.refresh();
      playSuccessSound()
      toast({
        title: 'Branch settings updated successfully',
        description: 'Your changes have been saved',
        variant:'success'
      })

    } catch (error) {
      playErrorSound()
      toast({
        title: 'Something went wrong',
        description: 'Please try again later',
        variant: 'destructive',
      })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Branch Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter branch name" {...field} />
              </FormControl>
              <FormDescription>
                This is the name of your branch location.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Tabs defaultValue="promotions" className="w-full">
          <TabsList>
            <TabsTrigger value="promotions">Promotions</TabsTrigger>
            <TabsTrigger value="pricing">Pricing</TabsTrigger>
            <TabsTrigger value="settings">Branch Settings</TabsTrigger>
          </TabsList>
          <TabsContent value="promotions">
            <Card>
              <CardHeader>
                <CardTitle>Promotions</CardTitle>
                <CardDescription>Manage your branch promotions here.</CardDescription>
              </CardHeader>
              <CardContent>
                <PromotionsForm control={form.control} />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="pricing">
            <Card>
              <CardHeader>
                <CardTitle>Pricing & Stock Settings</CardTitle>
                <CardDescription>Configure your pricing-specific settings.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="grid grid-col-1 md:grid-cols-3 gap-5">
                  <FormField
                    control={form.control}
                    name="pricingType"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Select Pricing Type</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col space-y-1"
                          >
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="manual" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Manual Pricing
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="automated" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Automatic Pricing
                              </FormLabel>
                            </FormItem>

                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="stockType"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Select Stock Type</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col space-y-1"
                          >
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="manual" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Manual Stock
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="automated" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Automatic Stock
                              </FormLabel>
                            </FormItem>

                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                {type === 'automated' && (


                  <div className="">
                    <h2 className='font-bold py-2'>Select Pricing Groups</h2>
                    <FormField
                      control={form.control}
                      name="pricingGroups.wholesale"
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
                              Allow Wholesale Pricing
                            </FormLabel>
                            <FormDescription>
                              Enable Wholesale pricing in this Branch.
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="pricingGroups.retail"
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
                              Allow Retail Pricing
                            </FormLabel>
                            <FormDescription>
                              Enable Retail pricing in this Branch.
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />

                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Branch Settings</CardTitle>
                <CardDescription>Configure your branch-specific settings.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="branchSettings.allowCustomReceipts"
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
                          Allow Custom Receipts
                        </FormLabel>
                        <FormDescription>
                          Enable custom receipt templates for this branch.
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="branchSettings.receiptTemplate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Receipt Template</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter receipt template" {...field} />
                      </FormControl>
                      <FormDescription>
                        Enter a template string or identifier for custom receipt designs.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <OperatingHoursForm control={form.control} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving ...' : 'Save Changes'}
        </Button>
      </form>
    </Form>
  )
}

