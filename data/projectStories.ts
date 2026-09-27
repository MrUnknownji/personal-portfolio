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
};

export const projectStories: Partial<Record<number, ProjectStory>> = {
  9: {
    contribution: "Auction interface and real-time product flow",
    scope: "Bidder and auctioneer views, live updates, and price suggestions",
    constraint: "A bid loses meaning if the visible price and the auction state disagree.",
    decision: "The bidding surface puts the current price and auction status at the center of the flow. Pusher carries live updates while the database remains the source of record; price suggestions assist a decision rather than place a bid.",
    evidence: [
      "The auction detail screen brings the current offer and bid action together.",
      "The dashboard and notifications show how bidding activity carries into account views.",
      "The live demo and source code let visitors inspect the implemented flow.",
    ],
    takeaway: "Real-time feedback is only useful when people can tell what changed and what remains authoritative.",
    gallery: [
      { match: "Auction Details View", caption: "Auction detail / price and bid context" },
      { match: "Web Dashboard", caption: "Dashboard / auction activity" },
      { match: "Create Auction Step 1", caption: "Auction creation / the other side of the marketplace" },
    ],
  },
  11: {
    contribution: "Mobile product, generation flow, and admin console",
    scope: "Wallpaper pairs, AI creation, catalog approval, and cost controls",
    constraint: "Lock and home screens need to work as a pair, while generated images need review and cost limits before entering a shared catalog.",
    decision: "Mirror treats paired screens as one catalog item. The mobile app previews both contexts; the admin side separates generation from approval and exposes reliability and spending signals.",
    evidence: [
      "The lock and home previews show one coordinated wallpaper pair.",
      "The admin catalog shows the approval surface behind the mobile discovery experience.",
      "Generation and analytics screens show where curation and operating costs are managed.",
    ],
    takeaway: "The visible mobile experience depends on an equally considered publishing workflow behind it.",
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
    constraint: "A convincing store must connect discovery with the purchase flow; attractive product cards alone do not explain the complete experience.",
    decision: "The storefront carries a product from browsing into the cart and checkout while keeping support and administration in the same product system.",
    evidence: [
      "The product, cart, and checkout screens show the buying sequence.",
      "The admin screens demonstrate the management side of the catalog.",
      "The source and demo can be inspected to distinguish the interface from production payment behavior.",
    ],
    takeaway: "End-to-end product thinking is clearer when the critical path is shown as a connected sequence.",
    gallery: [
      { match: "Product Detail View", caption: "Product / deciding what to buy" },
      { match: "Shopping Cart", caption: "Cart / reviewing the selection" },
      { match: "Web Checkout", caption: "Checkout / completing the flow" },
    ],
  },
  8: {
    contribution: "Creator workspace and AI-assisted content flows",
    scope: "Scripts, titles, thumbnails, saved projects, and exports",
    constraint: "Creators move between several related outputs, but each output still needs its own editing and review step.",
    decision: "The workspace groups work by content task and saves the project context across scripts, metadata, visual assets, and export screens.",
    evidence: [
      "The script editor and metadata screens show distinct writing and packaging steps.",
      "The visual management and export screens show where a creator reviews outputs before leaving the workspace.",
      "The demo and source code show the implemented task boundaries.",
    ],
    takeaway: "AI output becomes more useful when a creator can revise, organize, and export it in a coherent workflow.",
    gallery: [
      { match: "Web Script Editor", caption: "Script / drafting the spoken story" },
      { match: "Web Thumbnail Meta", caption: "Packaging / visual and metadata work" },
      { match: "Web Export Section", caption: "Delivery / taking work out of the workspace" },
    ],
  },
  7: {
    contribution: "Browser editing interface and local processing flow",
    scope: "Image upload, adjustments, batch processing, and export",
    constraint: "Sending images to a server adds a privacy decision and upload delay to a task that can run on the visitor's device.",
    decision: "AuraEdit keeps transformations in the browser with Canvas APIs and uses the same editing concepts for individual and batch work.",
    evidence: [
      "The upload and editor screens show the start of the local workflow.",
      "The settings and batch screens show how the same controls scale to multiple images.",
      "The source code exposes the browser processing path.",
    ],
    takeaway: "Keeping work local simplifies privacy, while making device limits an explicit design constraint.",
    gallery: [
      { match: "Web Image Upload (Light)", caption: "Input / bringing an image into the browser" },
      { match: "Web Image Editor (Light)", caption: "Edit / adjusting the image locally" },
      { match: "Batch Image Processing", caption: "Batch / applying work to more than one image" },
    ],
  },
  1: {
    contribution: "Mobile listening interface and playback flow",
    scope: "Local music discovery, playback, and notification controls",
    constraint: "A local music player must keep playback understandable across the main screen and Android notification controls.",
    decision: "AudioVibes centers the now-playing state and carries it through playlists and notification controls, with motion used to acknowledge playback changes.",
    evidence: [
      "The now-playing screen shows the core listening interaction.",
      "Playlist and notification screens show how playback stays available outside one view.",
      "The source code documents the React Native implementation.",
    ],
    takeaway: "Mobile polish depends on maintaining clear state across screens and system surfaces.",
    gallery: [
      { match: "Now Playing Screen", caption: "Playback / the active track" },
      { match: "Playlist View", caption: "Library / finding the next track" },
      { match: "Notification Player", caption: "System / playback outside the app" },
    ],
  },
};
