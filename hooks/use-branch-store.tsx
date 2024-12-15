import { create } from "zustand";
import { persist } from "zustand/middleware";


interface BranchState {
  activeBranch: IBranch | null;
  setActiveBranch: (branch: IBranch) => void;
}

const useBranchStore = create<BranchState>()(
  persist(
    (set) => ({
      activeBranch: null,
      setActiveBranch: (branch) => set({ activeBranch: branch }),
    }),
    {
      name: "branch-storage", // Key to store in localStorage
    }
  )
);

export default useBranchStore;
