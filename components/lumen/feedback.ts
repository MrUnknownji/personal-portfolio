/** A short vibration on devices that allow it. The review build makes no sound. */
export function haptic(pattern: number | number[]) {
  try {
    navigator.vibrate?.(pattern);
  } catch {
    /* Not every browser allows vibration. */
  }
}
