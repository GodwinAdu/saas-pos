
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type CheckingState = {
    checking: boolean;
    setChecking: (value: boolean) => void;
};

const useCheckingStore = create<CheckingState>()(
    persist(
        (set) => ({
            checking: false,
            setChecking: (value: boolean) => set({ checking: value }),
        }),
        {
            name: 'checking-storage', // Key in localStorage
        }
    )
);

export default useCheckingStore;
