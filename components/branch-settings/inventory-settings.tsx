"use client"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { RadioGroup, RadioGroupItem } from '../ui/radio-group'
import * as z from 'zod';
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { updateBranch } from '@/lib/actions/branch.actions'
import { playErrorSound, playSuccessSound } from '@/lib/audio'
import { toast } from '@/hooks/use-toast'
import { Checkbox } from '../ui/checkbox'
import { Button } from '../ui/button';
import { Loader2 } from 'lucide-react';



const branchFormSchema = z.object({
  inventorySettings: z.object({
    stockType: z.string(),
    pricingType: z.string(),
    pricingGroups: z.object({
      wholesale: z.coerce.boolean(),
      retail: z.coerce.boolean(),
    }),
  })
})

type InventorySettingsProps = {
  _id: string;
  inventorySettings: {
    stockType: string,
    pricingType: string,
    pricingGroups: {
      wholesale: boolean,
      retail: boolean,
    }
  }
}

type BranchFormValues = z.infer<typeof branchFormSchema>
export default function InventorySettings({ branch }: { branch: InventorySettingsProps }) {
  const router = useRouter();
  const branchId = branch._id;
  const defaultValues: Partial<BranchFormValues> = branch ?? {
    inventorySettings: {
      stockType: 'manual',
      pricingType: 'manual',
      pricingGroups: {
        wholesale: false,
        retail: false,
      },
    },
  }

  const form = useForm<BranchFormValues>({
    resolver: zodResolver(branchFormSchema),
    defaultValues,
  });

  const type = form.watch('inventorySettings.pricingType');

  const { isSubmitting } = form.formState;

  async function onSubmit(data: BranchFormValues) {
    try {
      console.log(data);
      await updateBranch(branchId, data)

      router.refresh();
      playSuccessSound()
      toast({
        title: 'Branch settings updated successfully',
        description: 'Your changes have been saved',
        variant: 'success'
      })

    } catch  {
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
        <Card>
          <CardHeader>
            <CardTitle>Pricing & Stock Settings</CardTitle>
            <CardDescription>Configure your pricing-specific settings.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="grid grid-col-1 md:grid-cols-3 gap-5">
              <FormField
                control={form.control}
                name="inventorySettings.pricingType"
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
                name="inventorySettings.stockType"
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
                  name="inventorySettings.pricingGroups.wholesale"
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
                  name="inventorySettings.pricingGroups.retail"
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
        <Button disabled={isSubmitting} type="submit">
          {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
          {isSubmitting ? 'Updating ...' : "Update Settings"}
        </Button>
      </form>
    </Form>
  )
}

