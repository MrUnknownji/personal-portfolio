/**
 * Browsers only let a page make sound from inside a click. The Party button loads its code after
 * the click has finished, so the audio context is opened here, synchronously, during the click,
 * and handed over when the party starts.
 */
let primed: AudioContext | null = null;

export function primeAudio() {
  try {
    const Context =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Context) return;
    primed?.close().catch(() => undefined);
    primed = new Context({ latencyHint: "playback" });
    void primed.resume().catch(() => undefined);
  } catch {
    primed = null;
  }
}

export function takeAudio() {
  const context = primed;
  primed = null;
  return context;
}
