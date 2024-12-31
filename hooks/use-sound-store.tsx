import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface SoundStore {
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
}



export const useSoundStore = create(
  persist<SoundStore>(
    (set) => ({
      soundEnabled: true, // Default value
      setSoundEnabled: (enabled: boolean) => set({ soundEnabled: enabled }),
    }),
    { name: 'sound-store', storage: createJSONStorage(() => localStorage), } // Key for localStorage
  )
);
