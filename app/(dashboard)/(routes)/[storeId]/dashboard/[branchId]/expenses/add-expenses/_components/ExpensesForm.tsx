"use client"

import { useState } from "react"
import { Calendar } from 'lucide-react'
import { format } from "date-fns"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

export default function ExpenseForm() {
  const [date, setDate] = useState<Date>()
  const [paidDate, setPaidDate] = useState<Date>()

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Add Expense</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="business-location">Business Location*</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Please Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="location1">Location 1</SelectItem>
                  <SelectItem value="location2">Location 2</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="expense-category">Expense Category</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Please Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="category1">Category 1</SelectItem>
                  <SelectItem value="category2">Category 2</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Date*</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <CalendarComponent
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reference">Reference No.</Label>
              <Input 
                id="reference" 
                placeholder="Leave empty to autogenerate"
              />
            </div>

            <div className="space-y-2">
              <Label>Expense for</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="None" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="option1">Option 1</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Applicable Tax</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="None" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="tax1">Tax 1</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Attach Document</Label>
            <div className="grid w-full gap-1.5">
              <Input
                id="document"
                type="file"
                className="cursor-pointer"
              />
              <div className="text-xs text-muted-foreground">
                Max file size: 5MB
                <br />
                Allowed files: pdf, csv, zip, doc, docx, jpeg, jpg, png
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Total amount*</Label>
            <Input type="number" placeholder="Total amount" />
          </div>

          <div className="space-y-2">
            <Label>Expense note</Label>
            <Textarea placeholder="Add any additional notes here" />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox id="is-refund" />
            <label
              htmlFor="is-refund"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Is refund?
            </label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox id="is-recurring" />
            <label
              htmlFor="is-recurring"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Is Recurring?
            </label>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Recurring Interval*</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Days" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="days">Days</SelectItem>
                  <SelectItem value="weeks">Weeks</SelectItem>
                  <SelectItem value="months">Months</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>No. of Repetitions</Label>
              <Input type="number" placeholder="If blank expense will be generated infinite times" />
            </div>
          </div>

          <CardHeader>
            <CardTitle>Add payment</CardTitle>
          </CardHeader>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-2">
              <Label>Amount*</Label>
              <Input type="number" placeholder="0.00" />
            </div>

            <div className="space-y-2">
              <Label>Paid on*</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !paidDate && "text-muted-foreground"
                    )}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {paidDate ? format(paidDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <CalendarComponent
                    mode="single"
                    selected={paidDate}
                    onSelect={setPaidDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>Payment Method*</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Cash" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="card">Card</SelectItem>
                  <SelectItem value="bank">Bank Transfer</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Payment Account</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="None" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="account1">Account 1</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Payment note</Label>
            <Textarea placeholder="Add any payment notes here" />
          </div>

          <div className="flex justify-between items-center">
            <div className="text-sm">
              Payment due: <span className="font-semibold">0.00</span>
            </div>
            <Button type="submit">Save</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

