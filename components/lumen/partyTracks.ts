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
  /** Subtitles for songs with vocals: [start, end, line], seconds into the file. */
  lyrics?: [start: number, end: number, text: string][];
  /** A word the song is built around, flashed on screen each time it is sung (seconds into the
      file, on the stressed syllable). */
  hook?: { word: string; at: number[] };
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
  {
    // A Hindi/Hinglish party track with real vocals, at 120 BPM: a developer with a fever on the
    // dance floor. The lyrics and the moments "bukhaar" is sung were transcribed by Gemini in
    // 16-second pieces cut on the bar lines (long clips drift), by two models, reconciled by a
    // third listen; each "bukhaar" was then pinned on a 4-second clip by both models and kept only
    // where they agree with each other and with the lyrics.
    id: "bukhaar",
    title: "Sandeep Ka Bukhaar",
    files: ["/audio/party-bukhaar-1.webm", "/audio/party-bukhaar-1.m4a"],
    bpm: 120.02,
    first: 0.062,
    loop: [8, 81],
    song: [
      [0, "intro"],
      [8, "verse"],
      [16, "break"],
      [20, "verse"],
      [24, "lift"],
      [28, "build"],
      [32, "drop"],
      [44, "verse"],
      [52, "lift"],
      [60, "break"],
      [65, "build"],
      [69, "drop"],
      [81, "outro"],
    ],
    hook: {
      word: "Bukhaar",
      at: [
        22.91, 56.42, 64.0, 65.56, 69.68, 77.78, 79.06, 79.56, 80.06, 137.94, 138.75, 139.67, 150,
      ],
    },
    lyrics: [
      [0.21, 1.01, "Lights down"],
      [1.16, 2.06, "Volume up"],
      [3.01, 5.71, "Aaj raat temperature check hoga"],
      [6.76, 8.71, "Kyunki party mein aaya hai"],
      [9.81, 11.71, "Saturday bukhaar"],
      [12.11, 14.41, "Thermometer ready rakho"],
      [14.81, 15.51, "Ho!"],
      [16.06, 17.94, "Entry maari club mein"],
      [17.94, 19.81, "DJ ne gaana roka"],
      [19.81, 21.71, "Bouncer bola na munna"],
      [21.71, 23.81, "Suna logon ko bukhaar ho gaya"],
      [23.91, 25.96, "Full stack developer"],
      [25.96, 27.91, "Dance bhi full stack"],
      [27.91, 29.86, "Upar se left to right"],
      [29.86, 31.86, "Neeche se roll back"],
      [32.11, 32.91, "Back, back, back"],
      [33.01, 34.96, "Floor pe chaloon jaise production server, brother"],
      [35.11, 36.21, "Back, back, back, back"],
      [36.46, 39.46, "Ek lachke pe poora club down, m*********a"],
      [40.31, 43.96, "Slow beat pe chaloon jaise production server, brother"],
      [44.11, 47.66, "Ek lachke pe poora club down, m*********a"],
      [48.06, 49.89, "Temperature badh raha"],
      [50.17, 51.71, "99, 100"],
      [52.04, 53.62, "Ek sau ek, 02"],
      [53.82, 55.7, "Sar pe mere ceiling fan ghoom raha"],
      [55.88, 57.63, "Haan bukhaar chadh raha"],
      [58.0, 61.61, "Air horn! Air horn! Air horn! Air horn!"],
      [61.88, 63.88, "Tick, tick, tick, tick, boom!"],
      [63.85, 65.2, "Bukhaar!"],
      [65.86, 67.21, "Bukhaar!"],
      [67.71, 70.91, "Naam suna toh chadh gaya bukhaar"],
      [71.81, 74.51, "Sanki sanki sanki sanki hai yaar"],
      [75.66, 78.46, "Sunta nahi kisi ki bukhaar"],
      [78.81, 79.86, "Bukhaar!"],
      [83.26, 83.81, "Hoye!"],
      [86.81, 87.31, "Hoye!"],
      [87.41, 88.26, "Oho!"],
      [88.41, 89.46, "Oho!"],
      [89.86, 91.41, "Banta tha jo bill"],
      [91.46, 93.16, "Maine bhi khayi kaju katli"],
      [93.26, 95.86, "Company paison ka paison hi kar diya delete"],
      [96.06, 97.16, "Corner mein khada tha chup"],
      [97.16, 98.11, "Sab samjhe main serious"],
      [98.11, 99.01, "Sach bataun toh launda"],
      [99.01, 100.11, "Tha hi nahi mysterious"],
      [100.11, 101.01, "Ladki ko bola hey"],
      [101.01, 102.01, "Woh bhaagi at 58"],
      [102.01, 103.76, "99, 100% pe nikal gaye"],
      [103.76, 105.46, "Phone call pe bola bhai Uber late"],
      [105.91, 107.51, "Confidence loading"],
      [109.86, 110.71, "Das percent"],
      [110.76, 111.71, "Bees percent"],
      [114.16, 115.51, "Signal detected"],
      [117.98, 119.81, "Alien found on dance floor"],
      [119.91, 121.86, "Area 51 se live"],
      [122.11, 123.86, "Alien alien"],
      [124.06, 125.86, "Alien alien"],
      [126.11, 128.06, "Confidence mera jaise"],
      [128.06, 130.11, "Alien, alien"],
      [130.21, 131.76, "Sab ne suna"],
      [131.81, 133.46, "Kisi ne dekha nahi"],
      [133.56, 135.36, "Sandeep laya"],
      [135.66, 137.66, "Beat bhool gaya kahin"],
      [137.86, 141.16, "Bukhaar! Bukhaar! Bukhaar!"],
      [141.41, 143.66, "Madhosh, sab behosh"],
      [144.21, 145.36, "Haath upar boss"],
      [145.91, 147.46, "Friday ko plan"],
      [147.56, 149.21, "Saturday ko party"],
      [149.31, 150.61, "Sunday ko bukhar"],
      [150.71, 152.01, "Sunday, Sunday, Sunday"],
      [152.06, 153.31, "Three, two, one"],
      [153.36, 154.26, "Aahaa"],
      [157.36, 158.06, "Aahaa"],
      [161.91, 163.54, "Club ka AC fail ho gaya hai"],
      [163.61, 165.41, "Kyunki Sandeep abhi bhi andar hai"],
      [165.91, 168.41, "Paracetamol counter pe available hai"],
      [168.56, 170.31, "Good night Mumbai"],
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
