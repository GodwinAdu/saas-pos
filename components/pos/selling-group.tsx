"use client"

import { useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSelectSellingGroup } from "@/hooks/use-select-selling-group";

export function SellingGroup({ branch }: { branch: IBranch }) {
  const { selectedValue, setSelectedValue } = useSelectSellingGroup();

  // Determine the default value based on the branch settings
  useEffect(() => {
    // Check if the selected value is already in localStorage
    const storedValue = selectedValue;

    if (storedValue) {
      setSelectedValue(storedValue as "retail" | "wholesale"); // Use the value from localStorage
    } else {
      const { retail, wholesale } = branch.pricingGroups;
      if (!storedValue && retail && wholesale) {
        setSelectedValue("retail"); // Retail takes precedence if both are true
      } else if (!storedValue && retail) {
        setSelectedValue("retail");
      } else if (!storedValue && wholesale) {
        setSelectedValue("wholesale");
      }
    }
  }, [branch, selectedValue]);

  return (
    <div>
      <Select
        onValueChange={(value) => setSelectedValue(value as "retail" | "wholesale")}
        value={selectedValue || undefined} // Use string value directly
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Options</SelectLabel>
            {branch.pricingGroups.retail && (
              <SelectItem value="retail">Retail Price</SelectItem>

            )}
            {branch.pricingGroups.wholesale && (
              <SelectItem value="wholesale">Wholesale Price</SelectItem>
            )}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
