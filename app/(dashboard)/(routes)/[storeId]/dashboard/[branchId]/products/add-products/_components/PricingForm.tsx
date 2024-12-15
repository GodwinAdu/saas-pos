import { useState } from 'react';
import { useForm, UseFormReturn } from 'react-hook-form';
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import Branch from '../../../../../../../../../lib/models/branch.models';

interface ProductUnit {
    _id: string;
    name: string;
    quantity: number;
}

const ProductPricingForm = ({ productUnits, branch }: { productUnits: ProductUnit[], branch: IBranch }) => {
    const [wholesaleSellingPrice, setWholesaleSellingPrice] = useState(0);
    const [wholesaleMargin, setWholesaleMargin] = useState(0);
    const [retailSellingPrice, setRetailSellingPrice] = useState(0);
    const [retailMargin, setRetailMargin] = useState(0);
    const [totalCost, setTotalCost] = useState(0);
    const [selectedUnitQuantity, setSelectedUnitQuantity] = useState(1);
    const [changeCost, setChangeCost] = useState(0);

    const methods = useForm({
        defaultValues: {
            vendorPrice: {
                unitId: '',
                productPrice: 0,
                productQuantity: 1
            },
            purchaseTax: 0,
            selectedUnit: '',
            cost: 0,
            purchaseQuantity: 1,
            wholesaleTax: 0,
            wholesaleTaxType: 'exclusive',
            wholesaleUnitQuantity: 1,
            wholesaleUnitCost: 0,
            wholesaleDiscount: 0,
            wholesaleDiscountType: 'percentage',
            wholesaleMarkupPercentage: 0,
            retailTax: 0,
            retailTaxType: 'exclusive',
            retailUnitQuantity: 1,
            retailUnitCost: 0,
            retailDiscount: 0,
            retailDiscountType: 'percentage',
            retailMarkupPercentage: 0,
        },
    });

    const { control, watch, setValue, getValues } = methods;

    const handlePriceCalculations = (unitCost: number, markupPercentage: number, type: 'wholesale' | 'retail', discount: number, tax: number, discountType: 'percentage' | 'amount', taxType: 'inclusive' | 'exclusive') => {
        if (isNaN(unitCost) || isNaN(markupPercentage)) {
            if (type === 'wholesale') {
                setWholesaleSellingPrice(0)
                setWholesaleMargin(0)
            } else {
                setRetailSellingPrice(0)
                setRetailMargin(0)
            }
            return
        }
        let sellingPrice = unitCost + (unitCost * markupPercentage) / 100;
        if (discountType === 'percentage') {
            sellingPrice -= (sellingPrice * discount) / 100;
        } else {
            sellingPrice -= discount;
        }
        if (taxType === 'inclusive') {
            sellingPrice = sellingPrice / (1 + tax / 100);
        } else {
            sellingPrice += (sellingPrice * tax) / 100;
        }
        const calculatedMargin = ((sellingPrice - unitCost) / sellingPrice) * 100

        if (type === 'wholesale') {
            setWholesaleSellingPrice(sellingPrice)
            setWholesaleMargin(calculatedMargin)
        } else {
            setRetailSellingPrice(sellingPrice)
            setRetailMargin(calculatedMargin)
        }
    }

    const onSubmit = (data: any) => {
        console.log(data);
        // Handle form submission
    };

    return (
        <Form {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)}>
                
            </form>
        </Form>
    );
};

interface CardContentProps {
    children: React.ReactNode;
}

const CardContent: React.FC<CardContentProps> = ({ children }) => {
    return (
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            {children}
        </div>
    );
};

export default ProductPricingForm;

