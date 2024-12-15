
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

interface BrandSelectionProps {
    brands: any[],
    SelectedBrand: (value: string) => void;
}
const BrandSelection = ({ SelectedBrand, brands }: BrandSelectionProps) => {

    return (
        <>
            <Select
                onValueChange={(value) => SelectedBrand(value)}
            >
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="All Brands "/>
                </SelectTrigger>
                <SelectContent>
                    {brands?.map((brand) => (
                        <SelectItem key={brand._id} value={brand._id}>
                            {brand.name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>


        </>
    )
}

export default BrandSelection