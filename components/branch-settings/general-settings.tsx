"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useFieldArray, useForm } from "react-hook-form"
import * as z from "zod"
import { Loader2, MapPin, X } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { toast } from '@/hooks/use-toast'
import { updateBranch } from "@/lib/actions/branch.actions"
import { useRouter } from "next/navigation"
import { playErrorSound, playSuccessSound } from "@/lib/audio"

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Branch name must be at least 2 characters.",
  }).optional(),
  location: z.string().min(2, {
    message: "Location must be at least 2 characters.",
  }).optional(),
  manager: z.string().min(2, {
    message: "Please select a manager.",
  }).optional(),
  phone: z.string().min(10, {
    message: "Phone number must be at least 10 characters.",
  }).optional(),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }).optional(),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }).optional(),
  operatingHours: z.array(z.object({
    day: z.string(),
    openingTime: z.string(),
    closingTime: z.string(),
  })),
  capacity: z.number().min(0).max(100),
});

interface BranchProps {
  _id: string;
  name: string;
  location: string;
  manager: string;
  phone: string;
  email: string;
  description: string;
  capacity: number;
}
const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
export default function GeneralSettings({ branch }: { branch: BranchProps }) {
  const branchId = branch._id as string;
  const router = useRouter()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: branch ?? {
      name: "",
      location: "",
      manager: "",
      phone: "",
      email: "",
      description: "",
      capacity: 50,
      operatingHours: [],
    },
  });
  const { control } = form;
  const { isSubmitting } = form.formState;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "operatingHours",
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      console.log(values)
      await updateBranch(branchId, values);
      router.refresh();
      playSuccessSound();
      toast({
        title: "Form submitted",
        description: "Branch general settings was updated successfully",
        variant: "success",
      })
    } catch {
      playErrorSound();
      toast({
        title: "Something when wrong",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-4 md:grid-cols-3">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Branch Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter branch name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <div className="flex space-x-2">
                    <Input placeholder="Enter branch location" {...field} />
                    <Button size="icon" variant="outline" type="button">
                      <MapPin className="h-4 w-4" />
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="manager"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Manager Assigned</FormLabel>
                <Input disabled {...field} />
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input type="tel" placeholder="Enter phone number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />


          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="Enter email address" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

        </div>


        <div className="space-y-2">

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    placeholder="Enter a brief description of the branch"
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>


        <div className="space-y-5">
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="grid grid-cols-1 md:grid-cols-3 gap-4 border rounded-md p-4 items-start"
            >
              {/* Day Selection */}
              <FormField
                control={form.control}
                name={`operatingHours.${index}.day`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Day</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a day" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {daysOfWeek.map((day) => (
                          <SelectItem key={day} value={day}>
                            {day}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Opening Time */}
              <FormField
                control={form.control}
                name={`operatingHours.${index}.openingTime`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Opening Time</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Closing Time and Remove Button */}
              <div className="grid grid-cols-4 gap-2 items-center">
                <div className="col-span-3">
                  <FormField
                    control={form.control}
                    name={`operatingHours.${index}.closingTime`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Closing Time</FormLabel>
                        <FormControl>
                          <Input type="time" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="col-span-1 flex justify-center items-center mt-6">
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => remove(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}

          {/* Add Button */}
          <div className="pt-4">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => append({ day: "", openingTime: "", closingTime: "" })}
              className="w-full md:w-auto"
            >
              Add Operating Hours
            </Button>
          </div>
        </div>

        <div className="space-y-2">

          <FormField
            control={form.control}
            name="capacity"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="flex items-center space-x-2">
                    <Slider
                      min={0}
                      max={100}
                      value={[field.value]}
                      onValueChange={(value) => field.onChange(value[50])}
                    />
                    <span className="w-12 text-center font-bold">
                      {field.value}%
                    </span>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button disabled={isSubmitting} type="submit">
          {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
          {isSubmitting ? 'Updating ...' : "Update Settings"}
        </Button>
      </form>
    </Form >
  )
}

