import { useSoundStore } from "@/hooks/use-sound-store";


const playSound = (formats: string[]) => {
  const audio = new Audio();

  const tryPlay = (index: number) => {
    if (index >= formats.length) return;
    audio.src = formats[index];
    audio.play().catch(() => tryPlay(index + 1));
  };

  tryPlay(0);
};

export const playSuccessSound = () => {
  const { soundEnabled } = useSoundStore.getState();
  if (soundEnabled) playSound(['/sounds/success.mp3', '/sounds/success.ogg']);
};

export const playWarningSound = () => {
  const { soundEnabled } = useSoundStore.getState();
  if (soundEnabled) playSound(['/sounds/warning.mp3', '/sounds/warning.ogg']);
};

export const playErrorSound = () => {
  const { soundEnabled } = useSoundStore.getState();
  if (soundEnabled) playSound(['/sounds/error.mp3', '/sounds/error.ogg']);
};
