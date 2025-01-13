"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Check, ChevronsUpDown } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"


const FormSchema = z.object({
    language: z.string({
        required_error: "Please select a language.",
    }),
})

interface Customer {
    id: string;
    name: string;
}

interface CustomerProps {
    customers: Customer[];
    setSelectedCustomer: (customer: Customer) => void;
}

export function Customer({ customers, setSelectedCustomer }: CustomerProps) {
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
    })


    return (
        <Form {...form}>
            <form className="space-y-6">
                <FormField
                    control={form.control}
                    name="language"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                            <Popover>
                                <PopoverTrigger asChild>
                                    <FormControl>
                                        <Button
                                            variant="outline"
                                            role="combobox"
                                            className={cn(
                                                "w-[200px] justify-between",
                                                !field.value && "text-muted-foreground"
                                            )}
                                        >
                                            {field.value
                                                ? customers.find(
                                                    (customer) => customer.id === field.value
                                                )?.name
                                                : "Select customer"}
                                            <ChevronsUpDown className="opacity-50" />
                                        </Button>
                                    </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-[200px] p-0">
                                    <Command>
                                        <CommandInput
                                            placeholder="Search customer..."
                                            className="h-9"
                                        />
                                        <CommandList>
                                            <CommandEmpty>No framework found.</CommandEmpty>
                                            <CommandGroup>
                                                {customers.map((customer) => (
                                                    <CommandItem
                                                        value={customer.name}
                                                        key={customer.id}
                                                        onSelect={() => {
                                                            form.setValue("language", customer.id)
                                                            setSelectedCustomer(customer)
                                                        }}
                                                    >
                                                        {customer.name}
                                                        <Check
                                                            className={cn(
                                                                "ml-auto",
                                                                customer.id === field.value
                                                                    ? "opacity-100"
                                                                    : "opacity-0"
                                                            )}
                                                        />
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </form>
        </Form>
    )
}
