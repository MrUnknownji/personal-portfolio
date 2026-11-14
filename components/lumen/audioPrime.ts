/**
 * Browsers only let a page make sound from inside a click. The Party button loads its code after
 * the click has finished, so the track is started here, synchronously, during the click, and
 * handed over when the party is ready. Nothing is downloaded until that click.
 *
 * The track streams: it starts after its first few kilobytes, not after the whole file. With Web
 * Audio available it is routed through a graph the party connects (it stays silent until then),
 * so the music can come in through a muffled door.
 */
import { TRACKS, savedTrack, trackSource } from "./partyTracks";

export type Prime = {
  audio: HTMLAudioElement;
  context: AudioContext | null;
  source: AudioNode | null;
  /** Which of the party's tracks is playing: the one the visitor picked last time. */
  track: number;
};

let primed: Prime | null = null;

export function primeAudio() {
  dropAudio();
  try {
    const audio = new Audio();
    const track = savedTrack();
    audio.preload = "auto";
    audio.loop = true;
    audio.src = trackSource(TRACKS[track], audio);
    let context: AudioContext | null = null;
    let source: AudioNode | null = null;
    try {
      const Context =
        window.AudioContext ??
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (Context) {
        context = new Context({ latencyHint: "playback" });
        source = context.createMediaElementSource(audio);
        void context.resume().catch(() => undefined);
      }
    } catch {
      context?.close().catch(() => undefined);
      context = null;
      source = null;
    }
    void audio.play().catch(() => undefined);
    primed = { audio, context, source, track };
  } catch {
    primed = null;
  }
}

export function dropAudio() {
  if (!primed) return;
  primed.audio.pause();
  primed.audio.removeAttribute("src");
  primed.audio.load();
  primed.context?.close().catch(() => undefined);
  primed = null;
}

export function takeAudio() {
  const taken = primed;
  primed = null;
  return taken;
}
