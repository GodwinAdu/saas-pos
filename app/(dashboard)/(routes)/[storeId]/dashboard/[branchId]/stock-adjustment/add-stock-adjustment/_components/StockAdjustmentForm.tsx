'use client'
"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"



import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { CalendarIcon } from 'lucide-react'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { cn, findAutomatedPrice, findManualPrice } from "@/lib/utils"
import { format } from "date-fns"
import { ProductSearch } from "./ProductSearch"
import { IBranch } from "@/lib/models/branch.models"
import { useCartStockAdjustmentStore } from "@/hooks/use-cart-stock-adjustment"
import { useSelectSellingGroup } from "@/hooks/use-select-selling-group"

type Price = {
  unitId: {
      _id: string;
      name: string;
  };
  price: number;
  tax: number;
}[]

const formSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
})

export default function StockAdjustmentForm({ branch }: { branch: IBranch }) {
  const {cartItems} = useCartStockAdjustmentStore();
  const { selectedValue } = useSelectSellingGroup()
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
    },
  })

  const subtotal = cartItems.reduce((sum, item) => {
    const price =
      branch.inventorySettings.pricingType === "manual"
        ? findManualPrice(item.item?.manualPrice as Price, item?.unit as string)
        : findAutomatedPrice(
          {
            ...item?.item,
            retailPrice: {
              retailUnitCost: item?.item?.retailPrice?.retailSellingPrice || 0,
              retailMarkupPercentage: item?.item?.retailPrice?.retailMarkupPercentage || 0,
            },
            wholesalePrice: {
              wholesaleUnitCost: item?.item?.wholesalePrice?.wholesaleSellingPrice || 0,
              wholesaleMarkupPercentage: item?.item?.wholesalePrice?.wholesaleMarkupPercentage || 0,
            },
          },
          item?.item?.unit as unknown as { _id: string; quantity: number; }[],
          item?.unit as string,
          selectedValue as string,
        )
    return sum + (price ?? 0) * item.quantity
  }, 0)
  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card className="w-full mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl text-primary">Add Stock Adjustment</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reference No</FormLabel>
                    <FormControl>
                      <Input placeholder="reference no" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dob"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date of birth</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              " pl-3 text-left font-normal",
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
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Adjustment</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="please select" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="abnormal">Abnormal</SelectItem>
                      </SelectContent>
                    </Select>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Card>
              <CardContent className="space-y-4">
                <ProductSearch branch={branch} />
                <div className="flex justify-end">
                  <p className="text-lg font-semibold">Total Amount: {subtotal.toFixed(2)}</p>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="total-recovered">Total amount recovered:</Label>
                <Input
                  id="total-recovered"
                  type="number"
                  defaultValue="0"
                  min="0"
                  step="0.01"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="reason">Reason:</Label>
                <Textarea
                  id="reason"
                  placeholder="Reason"
                  className="min-h-[100px]"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit" size="lg">
                Save
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </Form>
  )
}

