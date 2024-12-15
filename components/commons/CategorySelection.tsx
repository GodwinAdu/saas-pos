
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

interface CategorySelectionProps {
    categories: any[],
    SelectedCategory: (value: string) => void;
}
const CategorySelection = ({ SelectedCategory, categories }: CategorySelectionProps) => {

    return (
        <>
            <Select
                onValueChange={(value) => SelectedCategory(value)}
            >
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                    {categories?.map((category) => (
                        <SelectItem key={category._id} value={category._id}>
                            {category.name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>


        </>
    )
}

export default CategorySelection