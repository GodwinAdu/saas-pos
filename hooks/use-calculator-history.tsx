import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CalculatorState {
  history: string[];
  addHistory: (entry: string) => void;
  clearHistory: () => void;
}

export const useCalculatorStore = create(
  persist<CalculatorState>(
    (set) => ({
      history: [],
      addHistory: (entry) =>
        set((state) => ({ history: [...state.history, entry] })),
      clearHistory: () => set(() => ({ history: [] })),
    }),
    {
      name: 'calculator-history', // Key in localStorage
    }
  )
);
