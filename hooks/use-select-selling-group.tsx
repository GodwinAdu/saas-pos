import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";


interface SelectSellingGroupStore {
    selectedValue: "retail" | "wholesale" | null; // Use string values for the options
    setSelectedValue: (value: "retail" | "wholesale") => void;
}

export const useSelectSellingGroup = create(
    persist<SelectSellingGroupStore>(
        (set) => ({
            selectedValue: null, // Default value
            setSelectedValue: (value) => set({ selectedValue: value }),
        }),
        { name: 'selling-group', storage: createJSONStorage(() => localStorage), } // Key for localStorage
    )
);
