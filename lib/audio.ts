
/**
 * Plays a sound using the provided formats.
 *
 * @param formats - An array of sound file paths in different formats.
 * The function will try to play each format in order until one succeeds.
 *
 * @returns {void}
 */
const playSound = (formats: string[]) => {
    const audio = new Audio();
  
    /**
     * Tries to play the sound at the given index in the formats array.
     * If the sound fails to play, it will try the next format.
     *
     * @param index - The index of the format to try.
     *
     * @returns {void}
     */
    const tryPlay = (index: number) => {
        if (index >= formats.length) return; // If all formats fail, stop trying
  
        audio.src = formats[index];
        audio.play().catch(() => {
            // Try the next format if the current one fails
            tryPlay(index + 1);
        });
    };
  
    tryPlay(0); // Start with the first format
  };
  
  
  /**
  * Plays a success sound.
  *
  * @returns {void}
  */
  export const playSuccessSound = () => {
    playSound(['/sounds/success.mp3', '/sounds/success.ogg']);
  };
  
  /**
  * Plays a warning sound.
  *
  * @returns {void}
  */
  export const playWarningSound = () => {
    playSound(['/sounds/warning.mp3', '/sounds/warning.ogg']);
  };
  
  /**
  * Plays an error sound.
  *
  * @returns {void}
  */
  export const playErrorSound = () => {
    playSound(['/sounds/error.mp3', '/sounds/error.ogg']);
  };
  
  