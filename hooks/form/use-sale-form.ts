import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { saleFormSchema, type SaleFormValues } from "@/lib/validators/sale-form-schema"

export function useSaleForm() {
    const form = useForm<SaleFormValues>({
        resolver: zodResolver(saleFormSchema),
        defaultValues: {
            customer: "",
            payTerms: "1 day",
            saleDate: new Date(),
            account: "",
            invoiceNo: "",
            discountAmount: 0,
            taxAmount: 0,
            sellNote: "",
            shippingDetails: "",
            shippingAddress: "",
            shippingCharges: 0,
            shippingStatus: "",
            deliveryTo: "",
            paymentAmount: 0,
            paymentDate: new Date(),
            paymentMethod: "",
        },
    })

    return form
}

