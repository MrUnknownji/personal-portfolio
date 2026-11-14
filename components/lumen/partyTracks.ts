/**
 * The Party's tracks and, for each, a map of the song that the lights follow. Bars count from the
 * track's first downbeat (`first`, in seconds into the file, measured from the waveform). Each
 * track loops from `loop[1]` back to `loop[0]` on the bar, skipping its intro after the first time.
 */
export type Scene = "intro" | "verse" | "lift" | "break" | "build" | "drop" | "outro";

export type Track = {
  id: string;
  title: string;
  /** Opus in WebM first; AAC for browsers without it. */
  files: [webm: string, m4a: string];
  bpm: number;
  first: number;
  loop: [start: number, end: number];
  song: [bar: number, scene: Scene][];
};

export const TRACKS: Track[] = [
  {
    // Latin tech house in F minor. Intro: guitar and keys, no drums. Verse: four-on-the-floor
    // kick and dembow snare; halfway, open hats and plucks lift it. Break: drums filtered out.
    // Build: snare roll and riser, one beat of silence, then the drop. (From Gemini's listening
    // notes and the measured energy, which changes on these bars.)
    id: "calor",
    title: "Calor de Madrugada",
    files: ["/audio/club-night-1.webm", "/audio/club-night-1.m4a"],
    bpm: 105,
    first: 0.184,
    loop: [4, 74],
    song: [
      [0, "intro"],
      [4, "verse"],
      [12, "lift"],
      [20, "break"],
      [24, "build"],
      [28, "drop"],
      [44, "verse"],
      [52, "break"],
      [55, "build"],
      [58, "drop"],
      [74, "outro"],
    ],
  },
  /* Two originals made for the party with Google's Lyria 3.5 in the same family as Calor (full
     songs, two takes of each, the best picked by ear by Gemini against Calor). Sections come from
     the measured sub-bass, which drops out in every break and comes back on every drop, with
     Gemini's notes where the bass alone doesn't tell. Each loops from its first drop or groove to
     its last bar, skipping the intro. */
  {
    // Dembow house, G minor: nylon guitar, 808 sub, brass stabs and crowd chants. Three drops.
    id: "fuego",
    title: "Fuego de Medianoche",
    files: ["/audio/party-fuego-1.webm", "/audio/party-fuego-1.m4a"],
    bpm: 103.62,
    first: 0.426,
    loop: [8, 66],
    song: [
      [0, "intro"],
      [8, "drop"],
      [16, "verse"],
      [24, "break"],
      [28, "lift"],
      [36, "build"],
      [40, "drop"],
      [48, "break"],
      [56, "build"],
      [59, "drop"],
      [66, "outro"],
    ],
  },
  {
    // Moombahton, C minor: dembow drums, heavy sub, brass and synth plucks. Two drops, each after
    // a one-beat cut.
    id: "tormenta",
    title: "Tormenta Tropical",
    files: ["/audio/party-tormenta-1.webm", "/audio/party-tormenta-1.m4a"],
    bpm: 108,
    first: 0.558,
    loop: [8, 64],
    song: [
      [0, "intro"],
      [8, "verse"],
      [16, "lift"],
      [20, "break"],
      [23, "lift"],
      [28, "build"],
      [32, "drop"],
      [48, "break"],
      [52, "build"],
      [56, "drop"],
      [64, "outro"],
    ],
  },
];

const KEY = "ld-party-track";

export function savedTrack() {
  try {
    const index = TRACKS.findIndex((track) => track.id === localStorage.getItem(KEY));
    return Math.max(0, index);
  } catch {
    return 0;
  }
}

export function saveTrack(index: number) {
  try {
    localStorage.setItem(KEY, TRACKS[index].id);
  } catch {
    // Private mode or blocked storage: the choice lasts for this party only.
  }
}

/** The file this browser can play. */
export function trackSource(track: Track, audio: HTMLAudioElement) {
  return audio.canPlayType('audio/webm; codecs="opus"') ? track.files[0] : track.files[1];
}
