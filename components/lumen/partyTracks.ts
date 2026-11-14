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
  /* Three originals made for the party with Google's Lyria, steered bar by bar (intro, groove,
     break, build, drop), then checked by ear by Gemini and against the waveform. Each loops from
     its first groove through its drop. */
  {
    // Cyberpunk festival trap, half-time: 808 sub, hi-hat rolls, brass stabs. Silence on the
    // last beats of the intro, then everything at bar 8.
    id: "laser-grid",
    title: "Laser Grid",
    files: ["/audio/party-laser-grid-1.webm", "/audio/party-laser-grid-1.m4a"],
    bpm: 140.46,
    first: 0.094,
    loop: [8, 40],
    song: [
      [0, "intro"],
      [8, "verse"],
      [14, "lift"],
      [24, "break"],
      [28, "build"],
      [32, "drop"],
      [40, "outro"],
    ],
  },
  {
    // Drift phonk: distorted 808 slides and a cowbell riff.
    id: "drift-mode",
    title: "Drift Mode",
    files: ["/audio/party-drift-mode-1.webm", "/audio/party-drift-mode-1.m4a"],
    bpm: 130.44,
    first: 0.21,
    loop: [8, 40],
    song: [
      [0, "intro"],
      [8, "verse"],
      [16, "lift"],
      [24, "break"],
      [28, "build"],
      [32, "drop"],
      [40, "outro"],
    ],
  },
  {
    // Bass house: wobble bass, claps, vocal shouts. Its bars start a beat earlier than its first
    // sound suggests (the kick and bass come in on what would otherwise be beat 4).
    id: "chrome-bounce",
    title: "Chrome Bounce",
    files: ["/audio/party-chrome-bounce-1.webm", "/audio/party-chrome-bounce-1.m4a"],
    bpm: 126.58,
    first: 1.588,
    loop: [7, 43],
    song: [
      [0, "intro"],
      [7, "verse"],
      [15, "lift"],
      [23, "break"],
      [27, "build"],
      [31, "drop"],
      [43, "outro"],
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
