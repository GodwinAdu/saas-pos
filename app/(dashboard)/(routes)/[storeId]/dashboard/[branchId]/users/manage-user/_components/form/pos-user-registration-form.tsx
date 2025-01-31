'use client';

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import MultiSelect from "@/components/commons/MultiSelect";
import { toast } from "@/hooks/use-toast";
import { createUser } from "@/lib/actions/user.actions";
import { useParams, usePathname, useRouter } from "next/navigation";
import { currentUser } from '@/lib/helpers/current-user';

const formSchema = z.object({
    // Personal Information
    fullName: z.string().min(2, "Full name must be at least 2 characters."),
    email: z.string().email("Invalid email address."),
    phoneNumber: z.string().min(10, "Phone number must be at least 10 digits."),
    dob: z.date().optional(),
    gender: z.string().optional(),
    emergencyContact: z.string().optional(),

    // Account Details
    password: z.string().min(8, "Password must be at least 8 characters."),
    role: z.string(),
    isActive: z.coerce.boolean(),

    // Work Information
    jobTitle: z.string().optional(),
    departmentId: z.string().min(1, "Department ID is required."),

    // Contact Information
    address: z.object({
        street: z.string().min(1, "Street address is required."),
        city: z.string().min(1, "City is required."),
        state: z.string().min(1, "State is required."),
        country: z.string().min(1, "Country is required."),
        zipCode: z.string().min(1, "ZIP code is required."),
    }),

    // Additional Information
    startDate: z.date().optional(),
    cardDetails: z.object({
        idCardType: z.string(),
        idCardNumber: z.string(),
    }),
    accountDetails: z.object({
        accountName: z.string().optional(),
        accountNumber: z.string().optional(),
        accountType: z.string().optional(),
        monthlyPaymentAmount:z.coerce.number()
    }).optional(),
    workSchedule: z.array(
        z.object({
            day: z.string(),
            startTime: z.string(),
            endTime: z.string(),
        })
    ),
    accessLocation: z.array(z.string()),
    availableAllSchedule: z.coerce.boolean(),
});

export function POSUserRegistrationForm({
    currentUser,
    roles,
    branches,
    departments,
    type,
    initialData,
}: {
    currentUser: IUser;
    roles: IRole[];
    branches: IBranch[];
    departments: any[],
    type: 'create' | 'update',
    initialData?: IUser,
}) {
    const path = usePathname();
    const router = useRouter();
    const params = useParams();
    const [selectedBranches, setSelectedBranches] = useState<IBranch[] | []>([]);

    const storeId = params.storeId as string;
    const branchId = params.branchId as string;

    // Update selected branches in useEffect to avoid infinite render loop
    useEffect(() => {
        const matchBranches = branches.filter((branch) =>
            currentUser.accessLocation.includes(branch._id)
        );
        setSelectedBranches(matchBranches);
    }, [branches, currentUser.accessLocation]);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData ?? {
            fullName: "",
            email: "",
            phoneNumber: "",
            password: "",
            role: "",
            isActive: false,
            departmentId: "",
            address: {
                street: "",
                city: "",
                state: "",
                country: "",
                zipCode: "",
            },
            emergencyContact: "",
            jobTitle: "",
            accessLocation: [],
            cardDetails: {
                idCardType: "",
                idCardNumber: "",
            },
            accountDetails: {
                accountType: "",
                accountName: "",
                accountNumber: "",
                monthlyPaymentAmount: 0,
            },
            workSchedule: [],
            availableAllSchedule: false,
        },
    });

    const { isSubmitting } = form.formState;

    const { control } = form; // Extract control from the form
    const { fields, append, remove } = useFieldArray({
        control,
        name: "workSchedule", // Ensure this matches the form's structure
    });


    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            if (type === 'create') {
                await createUser(values, path);
            }

            if (type === 'update') {
                // await updateUser(values, path);
            }

            form.reset();

            router.push(`/${storeId}/dashboard/${branchId}/users/manage-user`);
            toast({
                title: "User Created Successfully",
                description: "User has been created successfully.",
            })

        } catch (error) {
            toast({
                title: "Something Went Wrong",
                description: "An error occurred while processing your request. Please try again later.",
                variant: "destructive",
            })

        }
    };

    return (
        <Card className="w-full max-w-7xl mx-auto">
            <CardHeader>
            </CardHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} >
                    <CardContent className="space-y-8">
                        <Card>
                            <CardContent>
                                <div className="space-y-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="fullName"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Full Name</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="John Doe" {...field} />
                                                </FormControl>
                                                <FormDescription>Enter your full name (First, Middle, Last)</FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Email Address</FormLabel>
                                                <FormControl>
                                                    <Input type="email" placeholder="john.doe@example.com" {...field} />
                                                </FormControl>
                                                <FormDescription>This will be used for login and communication</FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="phoneNumber"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Phone Number</FormLabel>
                                                <FormControl>
                                                    <Input type="tel" placeholder="+1 (555) 123-4567" {...field} />
                                                </FormControl>
                                                <FormDescription>For contact or two-factor authentication</FormDescription>
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
                                                                    "w-[240px] pl-3 text-left font-normal",
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
                                                <FormDescription>
                                                    Your date of birth is used to calculate your age.
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="gender"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Gender</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select gender" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="male">Male</SelectItem>
                                                        <SelectItem value="female">Female</SelectItem>
                                                        <SelectItem value="other">Other</SelectItem>
                                                        <SelectItem value="prefer not to say">Prefer not to say</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormDescription>Optional</FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    {type === 'create' && (
                                        <FormField
                                            control={form.control}
                                            name="password"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Password</FormLabel>
                                                    <FormControl>
                                                        <Input type="password" placeholder="********" {...field} />
                                                    </FormControl>
                                                    <FormDescription>Must be at least 8 characters long</FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    )}

                                    <FormField
                                        control={form.control}
                                        name="role"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Role</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select role" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {roles.map((role) => (
                                                            <SelectItem key={role._id} value={role.displayName}>{role.displayName}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormDescription>Select the user&apos;s role in the system</FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="isActive"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
                                                <FormControl>
                                                    <Checkbox
                                                        checked={field.value}
                                                        onCheckedChange={field.onChange}
                                                    />
                                                </FormControl>
                                                <div className="space-y-1 leading-none">
                                                    <FormLabel>
                                                        Indicate that User is Active
                                                    </FormLabel>

                                                </div>
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent>
                                <div className="space-y-4  grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="address.street"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Street Address</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="123 Main St" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="address.city"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>City</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Anytown" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="address.state"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>State/Province</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="State" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="address.country"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Country</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Country" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="address.zipCode"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>ZIP/Postal Code</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="12345" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="emergencyContact"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Emergency Contact</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Jane Doe, +1 (555) 987-6543" {...field} />
                                                </FormControl>
                                                <FormDescription>Optional: Name and contact number</FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent>
                                <div className=" grid grid-cols-1 md:grid-cols-3 gap-4 py-4">
                                    <FormField
                                        control={form.control}
                                        name="jobTitle"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Job Title</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Add Job Title" {...field} />
                                                </FormControl>
                                                <FormDescription>e.g., Sales Associate, Supervisor</FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="departmentId"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Select Department</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select department" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {departments?.map((department) => (
                                                            <SelectItem key={department._id} value={department._id}>{department.name}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormDescription>If the POS serves multiple Departments</FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="accessLocation"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Add Branches To work</FormLabel>
                                                <FormControl>
                                                    {selectedBranches && selectedBranches.length > 0 ? (
                                                        <MultiSelect
                                                            placeholder="Select Branches"
                                                            data={selectedBranches}
                                                            value={field.value}
                                                            onChange={(_id) =>
                                                                field.onChange([...field.value, _id])
                                                            }
                                                            onRemove={(idToRemove) =>
                                                                field.onChange([
                                                                    ...field.value.filter(
                                                                        (unitId: string) => unitId !== idToRemove
                                                                    ),
                                                                ])
                                                            }
                                                        />
                                                    ) : null}
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="cardDetails.idCardType"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Select Card Type</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select ID type" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {["ID Card", "Passport", "Driving License"]?.map((type) => (
                                                            <SelectItem key={type} value={type}>{type}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormDescription>Select the type of ID Card the user holds</FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="cardDetails.idCardNumber"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Card Number</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Add  Card number" {...field} />
                                                </FormControl>
                                                <FormDescription>e.g., 1234567890123456</FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="startDate"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-col">
                                                <FormLabel>Starting Date</FormLabel>
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <FormControl>
                                                            <Button
                                                                variant={"outline"}
                                                                className={cn(
                                                                    "w-[240px] pl-3 text-left font-normal",
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
                                                <FormDescription>
                                                    Choose when User should start work
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="accountDetails.monthlyPaymentAmount"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Monthly Salary</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Gh50,000 per month" {...field} />
                                                </FormControl>
                                                <FormDescription>If the POS integrates with payroll</FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="accountDetails.accountType"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Account Type</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select ID type" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {["Bank", "Momo", "Cash"]?.map((type) => (
                                                            <SelectItem key={type} value={type}>{type}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormDescription>Payment for Staff (Optional)</FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="accountDetails.accountName"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Account Holder Name</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Eg. John Doe" {...field} />
                                                </FormControl>
                                                <FormDescription>Payment for Staff (Optional)</FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="accountDetails.accountNumber"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Account Number</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Eg. 1234567890..." {...field} />
                                                </FormControl>
                                                <FormDescription>Payment for Staff (Optional)</FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                   
                                    <FormField
                                        control={form.control}
                                        name="availableAllSchedule"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
                                                <FormControl>
                                                    <Checkbox
                                                        checked={field.value}
                                                        onCheckedChange={field.onChange}
                                                    />
                                                </FormControl>
                                                <div className="space-y-1 leading-none">
                                                    <FormLabel>
                                                        Schedule all the time
                                                    </FormLabel>

                                                </div>
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-semibold">Work Schedule</h3>
                                        {fields.map((field, index) => (
                                            <div key={field.id} className="flex space-x-4 items-end">
                                                <FormField
                                                    control={control}
                                                    name={`workSchedule.${index}.day`}
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel className={index !== 0 ? "sr-only" : undefined}>Day</FormLabel>
                                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                                <FormControl>
                                                                    <SelectTrigger>
                                                                        <SelectValue placeholder="Select day" />
                                                                    </SelectTrigger>
                                                                </FormControl>
                                                                <SelectContent>
                                                                    {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
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
                                                <FormField
                                                    control={control}
                                                    name={`workSchedule.${index}.startTime`}
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel className={index !== 0 ? "sr-only" : undefined}>Start Time</FormLabel>
                                                            <FormControl>
                                                                <Input type="time" {...field} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={control}
                                                    name={`workSchedule.${index}.endTime`}
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel className={index !== 0 ? "sr-only" : undefined}>End Time</FormLabel>
                                                            <FormControl>
                                                                <Input type="time" {...field} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="icon"
                                                    onClick={() => remove(index)}
                                                    className="mt-2"
                                                >
                                                    <span className="sr-only">Remove</span>
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="24"
                                                        height="24"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    >
                                                        <line x1="18" y1="6" x2="6" y2="18"></line>
                                                        <line x1="6" y1="6" x2="18" y2="18"></line>
                                                    </svg>
                                                </Button>
                                            </div>
                                        ))}
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            className="mt-2"
                                            onClick={() => append({ day: "", startTime: "", endTime: "" })}
                                        >
                                            Add Schedule
                                        </Button>
                                    </div>

                                </div>
                            </CardContent>
                        </Card>
                    </CardContent>
                    <CardFooter className="flex justify-end">
                        <Button disabled={isSubmitting} type="submit">
                            {isSubmitting ? "Creating..." : "Create User"}
                        </Button>
                    </CardFooter>
                </form>
            </Form>
        </Card>
    );
}
