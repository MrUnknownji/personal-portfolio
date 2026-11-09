// Editorial case-study content is kept separate from the project index so the
// overview can stay short while the project pages show the actual decisions.
export type ProjectStory = {
  contribution: string;
  scope: string;
  constraint: string;
  decision: string;
  evidence: string[];
  takeaway: string;
  gallery: { match: string; caption: string }[];
  /** A path through the system, step by step (used where the code is private). */
  pipeline?: { title: string; detail: string }[];
  /** Two-line heading for the pipeline; defaults to "One request, / start to finish". */
  pipelineHeading?: [string, string];
  /** Where to look in the public repository, with what each file is responsible for. */
  sourceMap?: { path: string; role: string }[];
};

export const projectStories: Partial<Record<number, ProjectStory>> = {
  9: {
    contribution: "Auction interface and real-time product flow",
    scope: "Bidder and seller views, live auction rooms, and proxy auto-bidding",
    constraint: "A bid loses meaning if the visible price and the auction state disagree.",
    decision:
      "The server is the only place a bid is accepted. It checks status, end time, and the minimum increment, resolves competing auto-bids, and only then broadcasts the new price to the auction's Socket.io room, so every screen shows the same authoritative number.",
    evidence: [
      "The auction detail screen brings the current offer and bid action together.",
      "The dashboard and notifications show how bidding activity carries into account views.",
      "The live demo and source code let visitors inspect the implemented flow.",
    ],
    takeaway:
      "Real-time feedback is only useful when people can tell what changed and what remains authoritative.",
    sourceMap: [
      {
        path: "app/api/bids/route.ts",
        role: "Validates every bid (status, end time, ownership, minimum increment) and resolves proxy auto-bids.",
      },
      {
        path: "server/socket.ts",
        role: "Standalone Socket.io server: auction rooms, bid broadcasts, and the periodic auction-status updater.",
      },
      { path: "lib/db/Bid.ts", role: "Mongoose bid model, including the maximum auto-bid amount." },
      {
        path: "tests/unit/bid.test.ts",
        role: "Tests the bid API route, including the single-round-trip update of the previous winner.",
      },
    ],
    gallery: [
      { match: "Auction Details View", caption: "Auction detail / price and bid context" },
      { match: "Web Dashboard", caption: "Dashboard / auction activity" },
      {
        match: "Create Auction Step 1",
        caption: "Auction creation / the other side of the marketplace",
      },
    ],
  },
  11: {
    contribution: "Mobile product, generation flow, and admin console",
    scope: "Wallpaper pairs, AI creation, catalog approval, and cost controls",
    constraint:
      "Lock and home screens need to work as a pair, while generated images need review and cost limits before entering a shared catalog.",
    decision:
      "Mirror treats paired screens as one catalog item. The mobile app previews both contexts; the admin side separates generation from approval and exposes reliability and spending signals.",
    evidence: [
      "The lock and home previews show one coordinated wallpaper pair.",
      "The admin catalog shows the approval surface behind the mobile discovery experience.",
      "Generation and analytics screens show where curation and operating costs are managed.",
    ],
    takeaway:
      "The visible mobile experience depends on an equally considered publishing workflow behind it.",
    pipeline: [
      {
        title: "Prompt check",
        detail: "The FastAPI service rejects unsafe prompts before any cost is incurred.",
      },
      {
        title: "Duplicate check",
        detail:
          "An exact normalised-prompt match, then a vector-similarity search against existing wallpapers.",
      },
      {
        title: "Reserve credits",
        detail:
          "A Supabase SQL function reserves the user's credits atomically, so two requests cannot spend the same balance.",
      },
      {
        title: "Generate",
        detail:
          "Gemini renders the lock screen, and the matching home screen for a pair, while a cost tracker records spend.",
      },
      {
        title: "Store",
        detail:
          "Lock, home, and thumbnail images upload in parallel; any failure refunds the reservation.",
      },
      {
        title: "Review",
        detail:
          "The result is saved as pending, the credits are finalised, and an admin approves it into the mobile catalog.",
      },
    ],
    gallery: [
      { match: "lock screen preview", caption: "Pair / lock screen" },
      { match: "home screen wallpaper preview", caption: "Pair / matching home screen" },
      { match: "mobile discovery", caption: "Discovery / finding a paired design" },
      { match: "AI generation workspace", caption: "Creation / admin generation workflow" },
      { match: "generation reliability", caption: "Operations / reliability and cost" },
    ],
  },
  10: {
    contribution: "Storefront and commerce interface",
    scope: "Discovery, cart, checkout, support, and administration",
    constraint:
      "A convincing store must connect discovery with the purchase flow; attractive product cards alone do not explain the complete experience.",
    decision:
      "The storefront carries a product from browsing into the cart and checkout while keeping support and administration in the same product system.",
    evidence: [
      "The product, cart, and checkout screens show the buying sequence.",
      "The admin screens demonstrate the management side of the catalog.",
      "The source and demo can be inspected to distinguish the interface from production payment behavior.",
    ],
    takeaway:
      "End-to-end product thinking is clearer when the critical path is shown as a connected sequence.",
    sourceMap: [
      {
        path: "src/proxy.ts",
        role: "Route guard: public, sign-in, and account-only pages such as cart, checkout, and orders.",
      },
      {
        path: "src/lib/ai.ts",
        role: "Gemini embeddings, product drafts from a photo, and review summaries.",
      },
      {
        path: "src/lib/models/Product.ts",
        role: "Mongoose product model behind the catalog and admin screens.",
      },
      { path: "src/app/checkout/page.tsx", role: "Checkout step of the purchase flow." },
    ],
    gallery: [
      { match: "Product Detail View", caption: "Product / deciding what to buy" },
      { match: "Shopping Cart", caption: "Cart / reviewing the selection" },
      { match: "Web Checkout", caption: "Checkout / completing the flow" },
    ],
  },
  8: {
    contribution: "Creator workspace and AI-assisted content flows",
    scope: "Scripts, titles, thumbnails, saved projects, and exports",
    constraint:
      "Creators move between several related outputs, but each output still needs its own editing and review step.",
    decision:
      "The workspace groups work by content task and saves the project context across scripts, metadata, visual assets, and export screens.",
    evidence: [
      "The script editor and metadata screens show distinct writing and packaging steps.",
      "The visual management and export screens show where a creator reviews outputs before leaving the workspace.",
      "The demo and source code show the implemented task boundaries.",
    ],
    takeaway:
      "AI output becomes more useful when a creator can revise, organize, and export it in a coherent workflow.",
    sourceMap: [
      {
        path: "src/lib/ai-models.ts",
        role: "Central model catalog: maps each model to Gemini or OpenAI and migrates retired model IDs.",
      },
      {
        path: "api/routes/ai.js",
        role: "Express routes that call the AI providers for scripts, metadata, and images.",
      },
      { path: "api/index.js", role: "API entry point, deployed as a single Vercel function." },
      {
        path: "FALLBACKS.md",
        role: "What happens when AI, MongoDB, or Cloudinary is unavailable.",
      },
    ],
    gallery: [
      { match: "Web Script Editor", caption: "Script / drafting the spoken story" },
      { match: "Web Thumbnail Meta", caption: "Packaging / visual and metadata work" },
      { match: "Web Export Section", caption: "Delivery / taking work out of the workspace" },
    ],
  },
  7: {
    contribution: "Browser editing interface and local processing flow",
    scope: "Image upload, adjustments, batch processing, and export",
    constraint:
      "Sending images to a server adds a privacy decision and upload delay to a task that can run on the visitor's device.",
    decision:
      "AuraEdit keeps transformations in the browser with Canvas APIs and uses the same editing concepts for individual and batch work.",
    evidence: [
      "The upload and editor screens show the start of the local workflow.",
      "The settings and batch screens show how the same controls scale to multiple images.",
      "The source code exposes the browser processing path.",
    ],
    takeaway:
      "Keeping work local simplifies privacy, while making device limits an explicit design constraint.",
    sourceMap: [
      {
        path: "src/lib/image-processing.ts",
        role: "Canvas pipeline: validation, resizing, format conversion, and EXIF-aware output.",
      },
      {
        path: "src/lib/concurrency.ts",
        role: "A small promise limiter that keeps batch exports from exhausting device memory.",
      },
      { path: "src/lib/image-processing.test.ts", role: "Unit tests for the processing pipeline." },
    ],
    gallery: [
      { match: "Web Image Upload (Light)", caption: "Input / bringing an image into the browser" },
      { match: "Web Image Editor (Light)", caption: "Edit / adjusting the image locally" },
      { match: "Batch Image Processing", caption: "Batch / applying work to more than one image" },
    ],
  },
  1: {
    contribution: "Mobile listening interface and playback flow",
    scope: "Local music discovery, playback, and notification controls",
    constraint:
      "A local music player must keep playback understandable across the main screen and Android notification controls.",
    decision:
      "AudioVibes centers the now-playing state and carries it through playlists and notification controls, with motion used to acknowledge playback changes.",
    evidence: [
      "The now-playing screen shows the core listening interaction.",
      "Playlist and notification screens show how playback stays available outside one view.",
      "The source code documents the React Native implementation.",
    ],
    takeaway:
      "Mobile polish depends on maintaining clear state across screens and system surfaces.",
    gallery: [
      { match: "Now Playing Screen", caption: "Playback / the active track" },
      { match: "Playlist View", caption: "Library / finding the next track" },
      { match: "Notification Player", caption: "System / playback outside the app" },
    ],
  },
  13: {
    contribution: "Founder: brand, design, engineering, films, and operations",
    scope: "Studio website, film pipeline, free component, pricing, and intake",
    constraint:
      "The site has to show off motion on a fast laptop without punishing a budget phone, a slow connection, or a visitor who prefers less motion.",
    decision:
      "Quality is decided twice: once at start from device signals, and again while the page runs, from measured frame times. Every tier shows the same content; only the scene behind it changes.",
    evidence: [
      "The live site: open it on a laptop and on a phone, or add ?static=1, to see the tiers.",
      "The studio reel on this page is rendered from Remotion code, cut to measured beats of its score.",
      "27 automated tests cover pricing, packaging, music timing, and the two motion kits.",
    ],
    takeaway: "Motion earns its place only when it can step aside.",
    pipelineHeading: ["One film,", "brief to delivery"],
    gallery: [
      { match: "butterfly-wing", caption: "Opening / painted wing, then the meadow" },
      { match: "meadow scene", caption: "WebGL2 / the world behind the copy" },
      { match: "Halden", caption: "Concept film / one-tap approval" },
      { match: "Pulseboard", caption: "Concept film / a shared insight" },
    ],
    pipeline: [
      { title: "Brief", detail: "A fixed scope and price, agreed before any work starts." },
      { title: "Storyboard", detail: "Frames approved by the client before animation." },
      {
        title: "Compositions",
        detail: "Each scene is a React component in Remotion, with shared timing and tokens.",
      },
      {
        title: "Score",
        detail: "A frame map moves key actions onto measured downbeats of the music.",
      },
      { title: "Render", detail: "16:9, 1:1, and 9:16 from the same source." },
      {
        title: "QA",
        detail: "Scripted checks for decoding, loudness, clipping, and fades before delivery.",
      },
    ],
  },
  12: {
    contribution: "Design, engineering, writing, and testing",
    scope: "Content accuracy, performance, accessibility, and the quality pipeline",
    constraint:
      "Every claim has to survive a reviewer opening the repository, and the first screen has to load quickly on a mid-range phone.",
    decision:
      "Facts are counted from each project's repository and stored once in typed data. The slow first paint was traced with a Lighthouse filmstrip to a route loading screen covering the hero; removing it, then letting the text fonts load before the label font and portrait, cut simulated mobile LCP from 3.8 s to 2.4–2.7 s. Budgets in CI keep it there.",
    evidence: [
      "The before and after filmstrips show what the visitor saw while the page loaded.",
      "docs/performance records each measurement and the changes that were tried and reverted.",
      "The lab simulation and its unit tests show the same rigour applied to an interactive piece.",
    ],
    takeaway: "Measure first: the slow part was not the code anyone would have guessed.",
    gallery: [
      { match: "Filmstrip before", caption: "Before / the loading screen covers the hero" },
      { match: "Filmstrip after", caption: "After / the hero paints first" },
      { match: "Lab simulation", caption: "Lab / a lost reply, then idempotent retries" },
    ],
    sourceMap: [
      {
        path: "data/profile.ts",
        role: "Single source for experience, skills, availability, and the résumé path.",
      },
      {
        path: "components/lab/bidRace.ts",
        role: "Deterministic simulation of latency, timeouts, retries, and idempotency.",
      },
      {
        path: "scripts/build-resume.mjs",
        role: "Prints the 1-page profile to the résumé PDF so the two never drift.",
      },
      {
        path: "docs/performance/2026-11-portfolio-refresh.md",
        role: "Measurements, causes, and the experiments that were reverted.",
      },
    ],
  },
};
