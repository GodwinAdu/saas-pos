
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

interface DepartmentSelectionProps {
    departments: any[],
    selectedDepartment: (value: string) => void;
}
const DepartmentSelection = ({ selectedDepartment, departments }: DepartmentSelectionProps) => {

    return (
        <>
            <Select
                onValueChange={(value) => selectedDepartment(value)}
            >
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="All Departments" />
                </SelectTrigger>
                <SelectContent>
                    {departments?.map((department) => (
                        <SelectItem key={department._id} value={department._id}>
                            {department.name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>


        </>
    )
}

export default DepartmentSelection