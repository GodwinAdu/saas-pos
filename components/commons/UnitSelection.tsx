import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface UnitSelectionProps {
    units: any[];
    selectedUnit: string; // Add this prop
    onUnitChange: (value: string) => void; // Rename the prop for better clarity
}

const UnitSelection = ({ selectedUnit, units, onUnitChange }: UnitSelectionProps) => {
    return (
        <Select
            onValueChange={(value) => onUnitChange(value)}
            value={selectedUnit} // Use the selected unit prop
           
        >
            <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="Select unit" />
            </SelectTrigger>
            <SelectContent>
                {units?.map((unit) => (
                    <SelectItem key={unit.name} value={unit.name}>
                        {unit.name}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
};

export default UnitSelection;
