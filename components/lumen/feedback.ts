/** A short vibration on devices that allow it. (The only sound on the site is the Party toy.) */
export function haptic(pattern: number | number[]) {
  try {
    navigator.vibrate?.(pattern);
  } catch {
    /* Not every browser allows vibration. */
  }
}
