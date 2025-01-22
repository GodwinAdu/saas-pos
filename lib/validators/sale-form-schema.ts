import { z } from "zod"

export const saleFormSchema = z.object({
    customer: z.string().optional(),
    payTerms: z.string().nonempty({
        message: "Please specify the payment terms.",
    }),
    saleDate: z.date({
        required_error: "A sale date is required.",
    }),
    account: z.string().nonempty({
        message: "Please select the account",
    }),
    invoiceNo: z.string().optional(),
    discountAmount: z.coerce.number().optional(),
    taxAmount: z.coerce.number().optional(),
    sellNote: z.string().optional(),
    shippingDetails: z.string().optional(),
    shippingAddress: z.string().optional(),
    shippingCharges: z.coerce.number().optional(),
    shippingStatus: z.string().optional(),
    deliveryTo: z.string().optional(),
    paymentAmount: z.coerce.number().optional(),
    paymentDate: z.date().optional(),
    paymentMethod: z.string().optional(),
})

export type SaleFormValues = z.infer<typeof saleFormSchema>

