import { create } from 'zustand';

interface SoundStore {
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
}

export const useSoundStore = create<SoundStore>((set) => ({
  soundEnabled: true, // Default sound is enabled
  setSoundEnabled: (enabled) => set({ soundEnabled: enabled }),
}));
