import type { Project, ProjectSummary } from "@/types/Project";

// Selected work, in display order. Facts and stacks are checked against each project's repository.
export const selectedProjects: Project[] = [
  {
    id: 9,
    title: "BidStrike",
    shortDescription:
      "Bidding only works when everyone sees the same price. I built live auction rooms, proxy auto-bidding, and dashboards for bidders and sellers.",
    longDescription:
      "BidStrike is a real-time auction platform. Bids are validated on the server, broadcast to everyone watching an auction through Socket.io rooms, and backed by proxy auto-bidding, notifications, reviews, and an admin dashboard.",
    image:
      "https://res.cloudinary.com/dfwgprzxo/image/upload/v1769855178/Bid-Strike-Light-Home.png",
    technologies: ["Next.js", "TypeScript", "Socket.io", "MongoDB", "Stripe", "Tailwind CSS"],
    features: [
      "Live bid updates broadcast to per-auction Socket.io rooms",
      "Proxy auto-bidding: set a maximum and the server bids for you",
      "Server-side bid validation for auction status, end time, and minimum increment",
      "Auction creation, editing, and scheduling with Cloudinary image uploads",
      "Outbid notifications, reviews, and seller ratings",
      "Admin dashboard for users, auctions, and service settings",
    ],
    demoLink: "https://bid-strike.vercel.app/",
    githubLink: "https://github.com/MrUnknownji/bid-strike",
    category: "Web App",
    year: 2026,
    showcaseVariant: "bid",
    gallery: [
      {
        type: "image",
        src: "https://res.cloudinary.com/dfwgprzxo/image/upload/v1769855185/Bid-Strike-Dark-Web-Liked-Auctions-Notifications.png",
        alt: "BidStrike Notifications and Liked Auctions",
      },
      {
        type: "image",
        src: "https://res.cloudinary.com/dfwgprzxo/image/upload/v1769855185/Bid-Strike-Dark-Web-FAQ.png",
        alt: "BidStrike FAQ Page (Dark)",
      },
      {
        type: "image",
        src: "https://res.cloudinary.com/dfwgprzxo/image/upload/v1769855185/Bid-Strike-Dark-Mobile-Dashboard.png",
        alt: "BidStrike Mobile Dashboard",
      },
      {
        type: "image",
        src: "https://res.cloudinary.com/dfwgprzxo/image/upload/v1769855184/Bid-Strike-Dark-Web-Contact.png",
        alt: "BidStrike Contact Page (Dark)",
      },
      {
        type: "image",
        src: "https://res.cloudinary.com/dfwgprzxo/image/upload/v1769855183/Bid-Strike-Dark-Web-Login.png",
        alt: "BidStrike Login Page (Dark)",
      },
      {
        type: "image",
        src: "https://res.cloudinary.com/dfwgprzxo/image/upload/v1769855179/Bid-Strike-Dark-Web-Auctions.png",
        alt: "BidStrike Auctions List (Dark)",
      },
      {
        type: "image",
        src: "https://res.cloudinary.com/dfwgprzxo/image/upload/v1769855179/Bid-Strike-Dark-Web-Sign-Up.png",
        alt: "BidStrike Sign Up Page (Dark)",
      },
      {
        type: "image",
        src: "https://res.cloudinary.com/dfwgprzxo/image/upload/v1769855178/Bid-Strike-Light-Home.png",
        alt: "BidStrike Home Page (Light)",
      },
      {
        type: "image",
        src: "https://res.cloudinary.com/dfwgprzxo/image/upload/v1769855178/Bid-Strike-Dark-Web-Home.png",
        alt: "BidStrike Home Page (Dark)",
      },
      {
        type: "image",
        src: "https://res.cloudinary.com/dfwgprzxo/image/upload/v1769855178/Bid-Strike-Dark-Web-Create-Auction-1.png",
        alt: "BidStrike Create Auction Step 1",
      },
      {
        type: "image",
        src: "https://res.cloudinary.com/dfwgprzxo/image/upload/v1769855177/Bid-Strike-Dark-Web-Auction-Info.png",
        alt: "BidStrike Auction Details View",
      },
      {
        type: "image",
        src: "https://res.cloudinary.com/dfwgprzxo/image/upload/v1769855177/Bid-Strike-Dark-Web-My-Auctions.png",
        alt: "BidStrike User Auctions Page",
      },
      {
        type: "image",
        src: "https://res.cloudinary.com/dfwgprzxo/image/upload/v1769855177/Bid-Strike-Dark-Web-Dashboard.png",
        alt: "BidStrike Web Dashboard",
      },
      {
        type: "image",
        src: "https://res.cloudinary.com/dfwgprzxo/image/upload/v1769855176/Bid-Strike-Dark-Web-Create-Auction.png",
        alt: "BidStrike Create Auction Page",
      },
    ],
    caseStudy: {
      problem:
        "In an auction, a stale price is a wrong price. Bidders need to see each new bid immediately, and the server has to reject bids that arrive after the price has moved.",
      solution:
        "BidStrike validates every bid on the server, then broadcasts the accepted price to everyone in that auction's room. Proxy auto-bids run in the same request, so the shared price is always the result of one authoritative decision.",
      architecture: [
        "Next.js App Router serves 24 pages and 26 API route handlers for auctions, bids, auth, payments, and admin.",
        "A dedicated Socket.io server joins each viewer to an auction room and broadcasts new-bid and bid-update events.",
        "The bid route checks auction status, end time, ownership, and the minimum increment before saving, then resolves competing auto-bids.",
        "MongoDB (Mongoose) stores auctions, bids, users, transactions, and notifications; Stripe handles payments and Resend sends email.",
      ],
      tradeoffs: [
        "A separate socket server gives low-latency updates but is one more process to deploy and keep healthy.",
        "Resolving auto-bids inside the bid request keeps the price consistent, at the cost of a slightly slower response for the bidder.",
      ],
    },
    facts: [
      {
        value: "26",
        label: "API route handlers",
      },
      {
        value: "14",
        label: "automated test cases",
      },
      {
        value: "4",
        label: "real-time socket events",
      },
      { value: "94", label: "Lighthouse mobile performance, live demo" },
    ],
  },
  {
    id: 13,
    title: "FrameRelay Studio",
    shortDescription:
      "The motion studio I founded and run. Its site is a hand-painted WebGL world that lowers its own quality on slower phones, and every product film is written as code.",
    longDescription:
      "FrameRelay Studio makes launch films, product walkthroughs, and landing pages for software teams. I founded it in October 2026 and built everything it runs on: an Astro site on Cloudflare Workers with a scroll-driven WebGL2 scene, a Remotion pipeline that renders each film in three formats, a free MIT-licensed motion component, and the pricing, intake, and delivery workflow. The films on the site are original concept studies with fictional products, and the site says so.",
    image: "/images/framerelay/reel.webp",
    technologies: ["Astro", "TypeScript", "Three.js", "WebGL2", "Remotion", "Cloudflare Workers"],
    features: [
      "Scroll-driven WebGL2 world: a painted meadow, a butterfly rig, and brush-stroke panels behind the copy",
      "Four quality tiers chosen from motion preference, data saver, memory, CPU cores, and pointer type",
      "A frame-time governor that steps the scene down after sustained slow frames",
      "A static tier, a plain simple view, and a pause button, so no content depends on the 3D scene",
      "Product films written as Remotion compositions and retimed to measured downbeats of their scores",
      "A free, MIT-licensed focus-highlight component with a standalone example",
    ],
    demoLink: "https://framerelaystudio.com/",
    sourceNote: "Private studio repository · code walkthrough on request",
    category: "Studio",
    year: 2026,
    showcaseVariant: "film",
    showcaseLoop: {
      src: "/images/framerelay/reel-loop.mp4",
      poster: "/images/framerelay/reel-loop.webp",
    },
    facts: [
      { value: "23", label: "Remotion compositions" },
      { value: "4", label: "quality tiers, chosen per device" },
      { value: "7", label: "concept films on the live site" },
      { value: "27", label: "automated tests" },
    ],
    films: [
      {
        src: "/images/framerelay/reel.mp4",
        poster: "/images/framerelay/reel.webp",
        title: "Studio reel",
        caption:
          "25 seconds. Every cut and interface action lands on a measured beat of the score. All products shown are fictional.",
      },
    ],
    gallery: [
      {
        type: "image",
        src: "/images/framerelay/hero.webp",
        alt: "FrameRelay home: the painted butterfly-wing opening",
      },
      {
        type: "image",
        src: "/images/framerelay/meadow.webp",
        alt: "WebGL meadow scene behind the selected work",
      },
      {
        type: "image",
        src: "/images/framerelay/halden.webp",
        alt: "Halden concept film: one-tap expense approval",
      },
      {
        type: "image",
        src: "/images/framerelay/pulseboard.webp",
        alt: "Pulseboard concept film: a shared insight on a dashboard",
      },
      {
        type: "image",
        src: "/images/framerelay/mobile.webp",
        alt: "FrameRelay home on a phone",
      },
    ],
    caseStudy: {
      problem:
        "Software teams want short films that look like their real product. A new studio has to prove it can make them before anyone has hired it, and its own site is the first proof.",
      solution:
        "I built the site as the studio's demo: a hand-painted WebGL2 world that plays on capable devices and steps aside everywhere else. Films are React code in Remotion, so timing, formats, and revisions are exact and repeatable.",
      architecture: [
        "Static Astro site served by a Cloudflare Worker. The 3D world is a separate chunk, imported only when motion is on, and loads mobile or desktop texture sizes.",
        "selectTier() returns static, low, medium, or high from reduced motion, data saver, device memory, CPU cores, and pointer type. A Governor averages 90 frames and steps down after two slow windows (over 22 ms a frame).",
        "Each film is a Remotion composition in 16:9, 1:1, and 9:16. A source-to-output frame map retimes the animation onto measured downbeats without reordering any interaction.",
        "node:test covers pricing arithmetic, kit packaging, the music timing map, the brief builder, and both motion kits.",
      ],
      tradeoffs: [
        "The painted world is the studio's signature but costs texture weight, so the static tier, the simple view, and the pause button keep it optional.",
        "The films use fictional products so they can be shown publicly; they demonstrate craft, not client results.",
      ],
    },
  },
  {
    id: 11,
    title: "Mirror Wallpapers",
    shortDescription:
      "AI wallpapers need curation as well as creation. I built paired mobile previews and an admin console for approval, credits, and generation costs.",
    longDescription:
      "Mirror Wallpapers is an end-to-end wallpaper platform for discovering coordinated lock and home screen pairs, browsing standalone designs, previewing wallpapers in context, and accessing credit-based AI creation. Its Next.js admin console manages generation, catalog approval, style presets, subscription settings, and cost and reliability analytics across the same Supabase-backed product.",
    image:
      "https://res.cloudinary.com/dfwgprzxo/image/upload/v1782828909/portfolio/projects/mirror-wallpapers/mirror-admin-pairs.png",
    technologies: [
      "React Native",
      "Expo",
      "TypeScript",
      "Next.js",
      "FastAPI",
      "Supabase",
      "Gemini API",
      "Cloudinary",
      "Razorpay",
      "Tailwind CSS",
    ],
    features: [
      "Curated lock and home wallpaper pairs alongside a standalone wallpaper catalog",
      "Full-screen lock and home previews with native Android wallpaper application",
      "Search, filters, favorites, generation history, and cross-device account sync",
      "Credit-based AI generation with style presets, quality tiers, and resolution controls",
      "Subscription tiers and one-time credit packs with server-verified Razorpay payments",
      "Admin workflows for generation, approval, catalog management, and remote configuration",
      "Operational analytics for generation success, failure rates, spend, and cost guardrails",
    ],
    sourceNote: "Private repository · code walkthrough on request",
    category: "Full Stack",
    year: 2026,
    facts: [
      { value: "3", label: "apps: mobile, admin, AI service" },
      { value: "39", label: "Python tests" },
      { value: "14", label: "SQL migrations" },
    ],
    showcaseVariant: "mirror",
    showcaseFrames: [
      {
        label: "Discovery",
        src: "https://res.cloudinary.com/dfwgprzxo/image/upload/v1782828972/portfolio/projects/mirror-wallpapers/mirror-mobile-explore.png",
        alt: "Mirror mobile discovery screen with featured wallpaper pairs",
      },
      {
        label: "Lock screen",
        src: "https://res.cloudinary.com/dfwgprzxo/image/upload/v1782828978/portfolio/projects/mirror-wallpapers/mirror-mobile-pair-lock.png",
        alt: "Red Crescent Ronin wallpaper shown as a full-screen lock screen preview",
      },
      {
        label: "Home screen",
        src: "https://res.cloudinary.com/dfwgprzxo/image/upload/v1782828983/portfolio/projects/mirror-wallpapers/mirror-mobile-pair-home.png",
        alt: "Matching Red Crescent Ronin home screen wallpaper preview",
      },
    ],
    gallery: [
      {
        type: "image",
        src: "https://res.cloudinary.com/dfwgprzxo/image/upload/v1782828909/portfolio/projects/mirror-wallpapers/mirror-admin-pairs.png",
        alt: "Mirror admin catalog showing approved lock and home wallpaper pairs",
      },
      {
        type: "image",
        src: "https://res.cloudinary.com/dfwgprzxo/image/upload/v1782828972/portfolio/projects/mirror-wallpapers/mirror-mobile-explore.png",
        alt: "Mirror mobile discovery screen with featured wallpaper pairs",
      },
      {
        type: "image",
        src: "https://res.cloudinary.com/dfwgprzxo/image/upload/v1782828978/portfolio/projects/mirror-wallpapers/mirror-mobile-pair-lock.png",
        alt: "Red Crescent Ronin wallpaper shown as a full-screen lock screen preview",
      },
      {
        type: "image",
        src: "https://res.cloudinary.com/dfwgprzxo/image/upload/v1782828983/portfolio/projects/mirror-wallpapers/mirror-mobile-pair-home.png",
        alt: "Matching Red Crescent Ronin home screen wallpaper preview",
      },
      {
        type: "image",
        src: "https://res.cloudinary.com/dfwgprzxo/image/upload/v1782828987/portfolio/projects/mirror-wallpapers/mirror-mobile-singles.png",
        alt: "Mirror mobile catalog of standalone wallpapers",
      },
      {
        type: "image",
        src: "https://res.cloudinary.com/dfwgprzxo/image/upload/v1782828989/portfolio/projects/mirror-wallpapers/mirror-mobile-upgrade.png",
        alt: "Mirror Pro subscription tiers and AI generation benefits",
      },
      {
        type: "image",
        src: "https://res.cloudinary.com/dfwgprzxo/image/upload/v1782828991/portfolio/projects/mirror-wallpapers/mirror-admin-generate.png",
        alt: "Mirror admin AI generation workspace for wallpaper pairs and singles",
      },
      {
        type: "image",
        src: "https://res.cloudinary.com/dfwgprzxo/image/upload/v1782828993/portfolio/projects/mirror-wallpapers/mirror-admin-styles.png",
        alt: "Mirror admin style preset management grid",
      },
      {
        type: "image",
        src: "https://res.cloudinary.com/dfwgprzxo/image/upload/v1782828997/portfolio/projects/mirror-wallpapers/mirror-admin-singles.png",
        alt: "Mirror admin catalog for approving and managing standalone wallpapers",
      },
      {
        type: "image",
        src: "https://res.cloudinary.com/dfwgprzxo/image/upload/v1782828999/portfolio/projects/mirror-wallpapers/mirror-admin-analytics.png",
        alt: "Mirror admin analytics for generation reliability, spend, and cost risk",
      },
    ],
    caseStudy: {
      problem:
        "Most wallpaper apps treat lock and home screens as unrelated downloads, while AI generation, catalog curation, subscriptions, and operational visibility live in disconnected tools.",
      solution:
        "Mirror combines coordinated wallpaper pairs and standalone designs in one mobile experience, backed by an admin console that manages generation, approval, styles, pricing, and reliability from the same product data.",
      architecture: [
        "Expo and React Native deliver the mobile catalog, previews, account flows, purchases, and Android wallpaper integration.",
        "A Next.js admin console uses authenticated server routes for catalog curation, remote settings, payment operations, and analytics.",
        "FastAPI orchestrates Gemini image generation, deduplication, storage, and generation logging.",
        "Supabase provides authentication and relational product data, while Cloudinary serves the approved image catalog.",
      ],
      tradeoffs: [
        "Native wallpaper application and payment SDKs provide a better Android experience but cannot be fully represented by the Expo web build.",
        "AI generation quality and cost require explicit model tiers, credit controls, deduplication, and operational monitoring.",
        "Supporting Cloudinary, R2, and legacy Supabase Storage improves deployment flexibility but adds configuration and deletion-path complexity.",
      ],
    },
  },
  {
    id: 10,
    title: "OmniMart",
    shortDescription:
      "Shopping needs discovery and checkout to work together. I built product browsing, cart and checkout flows, and admin screens for catalog and orders.",
    longDescription:
      "OmniMart is a full-stack store built with Next.js and MongoDB. It covers browsing, cart, checkout, shipping, and support, with an admin side for products, orders, and customers.",
    image:
      "https://res.cloudinary.com/dfwgprzxo/image/upload/v1777124896/OmniMart-Light-Web-Home.png",
    technologies: ["Next.js", "TypeScript", "MongoDB", "Gemini API", "Cloudinary", "Tailwind CSS"],
    features: [
      "Editorial storefront with category browsing and product detail pages",
      "Account-gated cart, checkout, shipping, and order history",
      "Gemini embeddings for product search, AI product drafts from a photo, and review summaries",
      "Admin screens for products, orders, and customers with Recharts analytics",
      "Cloudinary-hosted product media",
      "Responsive layouts with Radix UI primitives",
    ],
    demoLink: "https://omni-mart-orpin.vercel.app/",
    githubLink: "https://github.com/MrUnknownji/omni-mart",
    category: "Web App",
    year: 2026,
    showcaseVariant: "omni",
    showcaseFrames: [
      {
        label: "Home",
        src: "https://res.cloudinary.com/dfwgprzxo/image/upload/v1777124896/OmniMart-Light-Web-Home.png",
        alt: "OmniMart Web Home (Light)",
      },
      {
        label: "Product",
        src: "https://res.cloudinary.com/dfwgprzxo/image/upload/v1777124876/OmniMart-Dark-Web-Product2.png",
        alt: "OmniMart Product Detail View",
      },
      {
        label: "Cart",
        src: "https://res.cloudinary.com/dfwgprzxo/image/upload/v1777124869/OmniMart-Dark-Web-Cart.png",
        alt: "OmniMart Shopping Cart (Dark)",
      },
      {
        label: "Checkout",
        src: "https://res.cloudinary.com/dfwgprzxo/image/upload/v1777124871/OmniMart-Dark-Web-Checkout.png",
        alt: "OmniMart Web Checkout (Dark)",
      },
    ],
    gallery: [
      {
        type: "image",
        src: "https://res.cloudinary.com/dfwgprzxo/image/upload/v1777124907/OmniMart-Dark-Mobile-Checkout.png",
        alt: "OmniMart Mobile Checkout (Dark)",
      },
      {
        type: "image",
        src: "https://res.cloudinary.com/dfwgprzxo/image/upload/v1777124906/OmniMart-Dark-Mobile-Home.png",
        alt: "OmniMart Mobile Home (Dark)",
      },
      {
        type: "image",
        src: "https://res.cloudinary.com/dfwgprzxo/image/upload/v1777124896/OmniMart-Light-Web-Home.png",
        alt: "OmniMart Web Home (Light)",
      },
      {
        type: "image",
        src: "https://res.cloudinary.com/dfwgprzxo/image/upload/v1777124884/OmniMart-Dark-Web-Admin-Customers.png",
        alt: "OmniMart Admin Customer Management",
      },
      {
        type: "image",
        src: "https://res.cloudinary.com/dfwgprzxo/image/upload/v1777124882/OmniMart-Dark-Web-Admin-Orders.png",
        alt: "OmniMart Admin Order Management",
      },
      {
        type: "image",
        src: "https://res.cloudinary.com/dfwgprzxo/image/upload/v1777124880/OmniMart-Dark-Web-Admin-Products.png",
        alt: "OmniMart Admin Product Management",
      },
      {
        type: "image",
        src: "https://res.cloudinary.com/dfwgprzxo/image/upload/v1777124878/OmniMart-Dark-Web-Admin-Dashboard.png",
        alt: "OmniMart Admin Dashboard",
      },
      {
        type: "image",
        src: "https://res.cloudinary.com/dfwgprzxo/image/upload/v1777124876/OmniMart-Dark-Web-Product2.png",
        alt: "OmniMart Product Detail View",
      },
      {
        type: "image",
        src: "https://res.cloudinary.com/dfwgprzxo/image/upload/v1777124875/OmniMart-Dark-Web-Product1.png",
        alt: "OmniMart Product Listing",
      },
      {
        type: "image",
        src: "https://res.cloudinary.com/dfwgprzxo/image/upload/v1777124871/OmniMart-Dark-Web-Checkout.png",
        alt: "OmniMart Web Checkout (Dark)",
      },
      {
        type: "image",
        src: "https://res.cloudinary.com/dfwgprzxo/image/upload/v1777124869/OmniMart-Dark-Web-Cart.png",
        alt: "OmniMart Shopping Cart (Dark)",
      },
      {
        type: "image",
        src: "https://res.cloudinary.com/dfwgprzxo/image/upload/v1777124867/OmniMart-Dark-Web-Support2.png",
        alt: "OmniMart Support Chat (Dark)",
      },
      {
        type: "image",
        src: "https://res.cloudinary.com/dfwgprzxo/image/upload/v1777124866/OmniMart-Dark-Web-Support1.png",
        alt: "OmniMart Help Center (Dark)",
      },
      {
        type: "image",
        src: "https://res.cloudinary.com/dfwgprzxo/image/upload/v1777124864/OmniMart-Dark-Web-Profile.png",
        alt: "OmniMart User Profile (Dark)",
      },
      {
        type: "image",
        src: "https://res.cloudinary.com/dfwgprzxo/image/upload/v1777124862/OmniMart-Dark-Web-Home6.png",
        alt: "OmniMart Landing Page Section 6",
      },
      {
        type: "image",
        src: "https://res.cloudinary.com/dfwgprzxo/image/upload/v1777124860/OmniMart-Dark-Web-Home5.png",
        alt: "OmniMart Landing Page Section 5",
      },
      {
        type: "image",
        src: "https://res.cloudinary.com/dfwgprzxo/image/upload/v1777124859/OmniMart-Dark-Web-Home4.png",
        alt: "OmniMart Landing Page Section 4",
      },
      {
        type: "image",
        src: "https://res.cloudinary.com/dfwgprzxo/image/upload/v1777124856/OmniMart-Dark-Web-Home3.png",
        alt: "OmniMart Landing Page Section 3",
      },
      {
        type: "image",
        src: "https://res.cloudinary.com/dfwgprzxo/image/upload/v1777124851/OmniMart-Dark-Web-Home2.png",
        alt: "OmniMart Landing Page Section 2",
      },
      {
        type: "image",
        src: "https://res.cloudinary.com/dfwgprzxo/image/upload/v1777124848/OmniMart-Dark-Web-Home1.png",
        alt: "OmniMart Landing Page Section 1",
      },
      {
        type: "image",
        src: "https://res.cloudinary.com/dfwgprzxo/image/upload/v1777124841/OmniMart-Dark-Web-SignUp.png",
        alt: "OmniMart Sign Up Page (Dark)",
      },
    ],
    caseStudy: {
      problem:
        "E-commerce demos often stop at a product grid and skip the parts that make a store work: accounts, checkout, support, and administration.",
      solution:
        "OmniMart carries a product from browsing into cart, checkout, and order history, and gives the store owner the admin screens to manage the catalog behind it.",
      architecture: [
        "Next.js App Router with TypeScript organizes 25 pages across storefront, account, and admin.",
        "MongoDB (Mongoose) models products, carts, orders, and customers.",
        "Cloudinary serves product media; Gemini generates embeddings, drafts product listings from a photo, and summarizes reviews.",
        "Radix UI primitives and Tailwind CSS keep dense admin screens accessible and consistent.",
      ],
      tradeoffs: [
        "Covering the whole store shows end-to-end thinking but leaves less depth for any single flow, such as real payments.",
        "Editorial visuals strengthen the brand, while admin screens stay deliberately utilitarian.",
      ],
    },
    facts: [
      {
        value: "25",
        label: "app pages",
      },
      {
        value: "3",
        label: "surfaces: store, account, admin",
      },
    ],
  },
  {
    id: 8,
    title: "YouTube Content OS",
    shortDescription:
      "Creators juggle scripts, titles, and thumbnails across many tools. I built one AI workspace that keeps working even when a provider is down.",
    longDescription:
      "YouTube Content OS is an AI workspace for planning, scripting, and packaging YouTube videos. Every external service has a fallback, so the workflow stays usable when an AI provider, the database, or image storage is unavailable.",
    image:
      "https://res.cloudinary.com/dfwgprzxo/image/upload/v1777123509/Content-OS-Web-Light-Home.png",
    technologies: ["React", "Vite", "TypeScript", "Express", "MongoDB", "Gemini API", "OpenAI API"],
    features: [
      "Topic suggestions from uploaded dashboard screenshots, CSV files, or manual metrics",
      "Script studio for facecam and faceless videos",
      "Scene-by-scene storyboard with image prompts",
      "Titles, SEO descriptions, and thumbnail concepts",
      "Choice of Gemini or OpenAI models from one central catalog",
      "Fallbacks for AI, database, and image storage",
    ],
    demoLink: "https://youtube-content-os-one.vercel.app/",
    githubLink: "https://github.com/MrUnknownji/youtube-content-os",
    category: "Web App",
    gallery: [
      {
        type: "image",
        src: "https://res.cloudinary.com/dfwgprzxo/image/upload/v1777123605/Content-OS-Mobile-Dark-Sidebar.png",
        alt: "Youtube Content OS Mobile Sidebar (Dark)",
      },
      {
        type: "image",
        src: "https://res.cloudinary.com/dfwgprzxo/image/upload/v1777123603/Content-OS-Mobile-ImageGen.png",
        alt: "Youtube Content OS Mobile Image Generation",
      },
      {
        type: "image",
        src: "https://res.cloudinary.com/dfwgprzxo/image/upload/v1777123601/Content-OS-Mobile-Dark-Settings.png",
        alt: "Youtube Content OS Mobile Settings (Dark)",
      },
      {
        type: "image",
        src: "https://res.cloudinary.com/dfwgprzxo/image/upload/v1777123600/Content-OS-Web-Dark-Pinned.png",
        alt: "Youtube Content OS Web Pinned Projects (Dark)",
      },
      {
        type: "image",
        src: "https://res.cloudinary.com/dfwgprzxo/image/upload/v1777123597/Content-OS-Web-Dark-ImageGen.png",
        alt: "Youtube Content OS Web Image Generation (Dark)",
      },
      {
        type: "image",
        src: "https://res.cloudinary.com/dfwgprzxo/image/upload/v1777123595/Content-OS-Web-Dark-Profile.png",
        alt: "Youtube Content OS Web User Profile (Dark)",
      },
      {
        type: "image",
        src: "https://res.cloudinary.com/dfwgprzxo/image/upload/v1777123592/Content-OS-Web-Light-ImageGen.png",
        alt: "Youtube Content OS Web Image Generation (Light)",
      },
      {
        type: "image",
        src: "https://res.cloudinary.com/dfwgprzxo/image/upload/v1777123590/Content-OS-Web-Light-Export.png",
        alt: "Youtube Content OS Web Export Section (Light)",
      },
      {
        type: "image",
        src: "https://res.cloudinary.com/dfwgprzxo/image/upload/v1777123588/Content-OS-Web-Light-Shorts.png",
        alt: "Youtube Content OS Web Shorts Generator (Light)",
      },
      {
        type: "image",
        src: "https://res.cloudinary.com/dfwgprzxo/image/upload/v1777123586/Content-OS-Web-Light-Meta-Thumbnail.png",
        alt: "Youtube Content OS Web Thumbnail Meta",
      },
      {
        type: "image",
        src: "https://res.cloudinary.com/dfwgprzxo/image/upload/v1777123583/Content-OS-Web-Light-Meta-Title.png",
        alt: "Youtube Content OS Web Title Meta",
      },
      {
        type: "image",
        src: "https://res.cloudinary.com/dfwgprzxo/image/upload/v1777123581/Content-OS-Web-Light-Visuals.png",
        alt: "Youtube Content OS Web Visuals Management",
      },
      {
        type: "image",
        src: "https://res.cloudinary.com/dfwgprzxo/image/upload/v1777123578/Content-OS-Web-Light-Scripts.png",
        alt: "Youtube Content OS Web Script Editor",
      },
      {
        type: "image",
        src: "https://res.cloudinary.com/dfwgprzxo/image/upload/v1777123509/Content-OS-Web-Light-Home.png",
        alt: "Youtube Content OS Web Home (Light)",
      },
    ],
    caseStudy: {
      problem:
        "YouTube creators move between scripts, hooks, metadata, and thumbnails in disconnected tools, and an AI outage can stop the whole workflow.",
      solution:
        "Content OS keeps each step of a video in one workspace and degrades gracefully: AI falls back to templates, MongoDB to local storage with export, and Cloudinary to in-browser images.",
      architecture: [
        "A React and Vite single-page app holds the creator workflow, with an Express API deployed as a Vercel function.",
        "A central model catalog maps each model to its provider and migrates saved, deprecated model IDs automatically.",
        "MongoDB stores projects and Cloudinary stores generated images when they are configured.",
      ],
      tradeoffs: [
        "Fallbacks keep the tool usable offline-first, but every feature has two code paths to test.",
        "AI output speeds up drafting but is always presented for review, never published automatically.",
      ],
    },
    facts: [
      {
        value: "2",
        label: "AI providers behind one interface",
      },
      {
        value: "4",
        label: "services with graceful fallbacks",
      },
      { value: "100", label: "Lighthouse accessibility, live demo" },
    ],
  },
  {
    id: 7,
    title: "AuraEdit",
    shortDescription:
      "Most image tools upload your photos first. AuraEdit resizes, converts, and batch-exports images entirely in the browser.",
    longDescription:
      "Aura Edit is a high-performance image editing tool that runs entirely in your browser. It allows users to perform complex modifications, apply filters, and process images in batches without ever uploading files to a server, ensuring maximum privacy and speed.",
    image:
      "https://res.cloudinary.com/dfwgprzxo/image/upload/v1777116565/AuraEdit-ImageUpload-Web-Light.png",
    technologies: ["Next.js", "TypeScript", "Canvas API", "JSZip", "Framer Motion"],
    features: [
      "Resize, convert, filter, rotate, and flip JPG, PNG, WebP, GIF, and BMP",
      "Batch processing with bounded concurrency and ZIP export",
      "EXIF-aware orientation",
      "No server uploads: files never leave the device",
      "Light and dark themes",
    ],
    demoLink: "https://image-modifier-jet.vercel.app/",
    githubLink: "https://github.com/MrUnknownji/image-modifier",
    category: "Web App",
    gallery: [
      {
        type: "image",
        src: "https://res.cloudinary.com/dfwgprzxo/image/upload/v1777116715/AuraEdit-HomePage-Bottom-Mobile-Dark.png",
        alt: "Aura Edit Mobile Home Page (Dark)",
      },
      {
        type: "image",
        src: "https://res.cloudinary.com/dfwgprzxo/image/upload/v1777116714/AuraEdit-ImageSettings-Mobile-Dark-2.png",
        alt: "Aura Edit Mobile Image Settings (Dark)",
      },
      {
        type: "image",
        src: "https://res.cloudinary.com/dfwgprzxo/image/upload/v1777116711/AuraEdit-ImagePreview-Mobile-Dark.png",
        alt: "Aura Edit Mobile Image Preview (Dark)",
      },
      {
        type: "image",
        src: "https://res.cloudinary.com/dfwgprzxo/image/upload/v1777116710/AuraEdit-ImageUpload-Mobile-Dark.png",
        alt: "Aura Edit Mobile Image Upload (Dark)",
      },
      {
        type: "image",
        src: "https://res.cloudinary.com/dfwgprzxo/image/upload/v1777116709/AuraEdit-ImageSettings-Mobile-Light.png",
        alt: "Aura Edit Mobile Image Settings (Light)",
      },
      {
        type: "image",
        src: "https://res.cloudinary.com/dfwgprzxo/image/upload/v1777116687/AuraEdit-ImageUpload-Mobile-Light.png",
        alt: "Aura Edit Mobile Image Upload (Light)",
      },
      {
        type: "image",
        src: "https://res.cloudinary.com/dfwgprzxo/image/upload/v1777116686/AuraEdit-ImageUpload-Mobile-Light-2.png",
        alt: "Aura Edit Mobile Upload Screen",
      },
      {
        type: "image",
        src: "https://res.cloudinary.com/dfwgprzxo/image/upload/v1777116664/AuraEdit-ImageSettings-Web-Light-2.png",
        alt: "Aura Edit Web Settings (Light)",
      },
      {
        type: "image",
        src: "https://res.cloudinary.com/dfwgprzxo/image/upload/v1777116647/AuraEdit-ImageSettings-Web-Dark.png",
        alt: "Aura Edit Web Settings (Dark)",
      },
      {
        type: "image",
        src: "https://res.cloudinary.com/dfwgprzxo/image/upload/v1777116645/AuraEdit-ImageSettings-Web-Dark-2.png",
        alt: "Aura Edit Web Editor View (Dark)",
      },
      {
        type: "image",
        src: "https://res.cloudinary.com/dfwgprzxo/image/upload/v1777116612/AuraEdit-BatchImage-Web-Dark.png",
        alt: "Aura Edit Batch Image Processing (Dark)",
      },
      {
        type: "image",
        src: "https://res.cloudinary.com/dfwgprzxo/image/upload/v1777116609/AuraEdit-ImageUpload-Web-Dark.png",
        alt: "Aura Edit Web Image Upload (Dark)",
      },
      {
        type: "image",
        src: "https://res.cloudinary.com/dfwgprzxo/image/upload/v1777116571/AuraEdit-ImageSettings-Web-Light-2.png",
        alt: "Aura Edit Web Image Settings",
      },
      {
        type: "image",
        src: "https://res.cloudinary.com/dfwgprzxo/image/upload/v1777116568/AuraEdit-ImageSettings-Web-Light.png",
        alt: "Aura Edit Web Image Editor (Light)",
      },
      {
        type: "image",
        src: "https://res.cloudinary.com/dfwgprzxo/image/upload/v1777116565/AuraEdit-ImageUpload-Web-Light.png",
        alt: "Aura Edit Web Image Upload (Light)",
      },
    ],
    caseStudy: {
      problem:
        "Most browser image tools upload user files before editing, which adds latency and creates unnecessary privacy concerns.",
      solution:
        "AuraEdit keeps the editing pipeline inside the browser so users can resize, adjust, batch-process, and export images without server uploads.",
      architecture: [
        "Next.js and TypeScript provide the app shell, routing, and strong UI contracts.",
        "Canvas APIs run the image transformation pipeline locally in the browser.",
        "Batch operations reuse one processing path so single-image and multi-image exports stay consistent.",
      ],
      tradeoffs: [
        "Local processing protects privacy but depends on the user's device memory and CPU.",
        "Canvas-based transforms are portable, while very advanced editing features would need heavier rendering infrastructure.",
      ],
    },
    facts: [
      {
        value: "0",
        label: "server uploads",
      },
      {
        value: "5",
        label: "image formats",
      },
      {
        value: "40",
        label: "unit tests",
      },
      { value: "96", label: "Lighthouse accessibility, live demo" },
    ],
  },
  {
    id: 1,
    title: "AudioVibes",
    shortDescription:
      "A minimalist React Native music player for Android & iOS with animations and Material You theming.",
    longDescription:
      "AudioVibes is an elegantly designed music player application for Android and iOS. Boasting a minimalist interface with captivating animations, it supports Material You theming, notifications, and background playback.",
    image: "https://res.cloudinary.com/dfwgprzxo/image/upload/v1745062498/DescHome_gijzvt.png",
    technologies: ["React Native", "Expo", "Reanimated"],
    features: [
      "Minimalist UI/UX",
      "Captivating animations via Reanimated",
      "Material You theming support",
      "Background audio playback",
      "Playback notifications",
      "Cross-platform (Android/iOS)",
      "Local audio file scanning and playback",
    ],
    githubLink: "https://github.com/MrUnknownji/AudioVibes_music_player",
    category: "Mobile",
    gallery: [
      {
        type: "image",
        src: "https://res.cloudinary.com/dfwgprzxo/image/upload/v1745062498/DescHome_gijzvt.png",
        alt: "AudioVibes Home Screen",
      },
      {
        type: "image",
        src: "https://res.cloudinary.com/dfwgprzxo/image/upload/v1745062499/ScreenShot7_vf2x9x.jpg",
        alt: "AudioVibes Now Playing Screen",
      },
      {
        type: "image",
        src: "https://res.cloudinary.com/dfwgprzxo/image/upload/v1745062498/ScreenShot2_cxfvdm.jpg",
        alt: "AudioVibes Playlist View",
      },
      {
        type: "image",
        src: "https://res.cloudinary.com/dfwgprzxo/image/upload/v1745062498/ScreenShot3_gcqdxd.jpg",
        alt: "AudioVibes Search Functionality",
      },
      {
        type: "image",
        src: "https://res.cloudinary.com/dfwgprzxo/image/upload/v1745062498/ScreenShot6_wnr0j7.jpg",
        alt: "AudioVibes Settings Screen",
      },
      {
        type: "image",
        src: "https://res.cloudinary.com/dfwgprzxo/image/upload/v1745062497/ScreenShot4_kra2yo.jpg",
        alt: "AudioVibes Album View",
      },
      {
        type: "image",
        src: "https://res.cloudinary.com/dfwgprzxo/image/upload/v1745062497/ScreenShot5_wt8tnl.jpg",
        alt: "AudioVibes Artist View",
      },
      {
        type: "image",
        src: "https://res.cloudinary.com/dfwgprzxo/image/upload/v1745062497/ScreenShot1_qmsvam.jpg",
        alt: "AudioVibes Notification Player",
      },
    ],
    caseStudy: {
      problem:
        "Mobile music players often feel generic or depend on cloud-first flows even when users mainly want polished local playback.",
      solution:
        "AudioVibes focuses on a local-first listening experience with a minimal interface, animated transitions, Material You styling, and background playback support.",
      architecture: [
        "Expo and React Native handle cross-platform screens and navigation.",
        "Reanimated powers high-frequency UI transitions without blocking the JavaScript thread.",
        "Playback state is separated from presentation so notification controls and app screens stay in sync.",
      ],
      tradeoffs: [
        "Local file handling keeps privacy high but requires more platform-specific testing.",
        "Animation richness is balanced against battery use and older Android device performance.",
      ],
    },
  },
  {
    id: 12,
    title: "This portfolio",
    shortDescription:
      "A portfolio is a product too. I rebuilt this one around verified facts, measured performance, and tests, and cut mobile LCP by about 30%.",
    longDescription:
      "This site is built with the same discipline as the products it shows: every claim is checked against a repository, the first screen is measured on a throttled phone, and every pull request runs formatting, types, unit and browser tests, accessibility checks, and Lighthouse budgets.",
    image: "/images/portfolio/home.webp",
    technologies: ["Next.js", "React", "TypeScript", "Playwright", "Vitest", "Lighthouse CI"],
    features: [
      "One typed source for experience, skills, and projects, shared by the site, the résumé PDF, and the assistant",
      "Repository-counted facts on every case study",
      "A unit-tested simulation of races, retries, and idempotency in the lab",
      "Lighthouse, Playwright, and axe checks on every pull request",
    ],
    githubLink: "https://github.com/MrUnknownji/personal-portfolio",
    category: "Engineering",
    year: 2026,
    facts: [
      { value: "94", label: "mobile Lighthouse score, up from 87" },
      { value: "29%", label: "faster LCP on a throttled phone (worst median)" },
      { value: "45%", label: "less CSS on the home page" },
    ],
    gallery: [
      { type: "image", src: "/images/portfolio/home.webp", alt: "Portfolio home page hero" },
      {
        type: "image",
        src: "/images/portfolio/filmstrip-before.webp",
        alt: "Filmstrip before: the loading screen covers the hero",
      },
      {
        type: "image",
        src: "/images/portfolio/filmstrip-after.webp",
        alt: "Filmstrip after: the hero paints first",
      },
      {
        type: "image",
        src: "/images/portfolio/lab-race.webp",
        alt: "Lab simulation of two bids and a lost reply",
      },
    ],
    caseStudy: {
      problem:
        "A portfolio is judged in seconds, usually on a phone. Mine had grown layers of unused code, stacks that did not match the real repositories, and a first screen that waited behind a loading animation.",
      solution:
        "I checked every claim against its repository, moved career facts into one typed source, removed about 2,500 lines of dead components and 220 dead CSS rules, and fixed the load path after a Lighthouse filmstrip showed the real cause of the slow first paint.",
      architecture: [
        "Statically generated Next.js routes; client components receive small project summaries as props instead of importing the full data module.",
        "Styles are split into one stylesheet per feature, with route-only styles imported by their pages.",
        "The lab simulation is a pure, deterministic module with its own unit tests; the view only animates its output.",
        "CI runs Prettier, ESLint, TypeScript, Vitest, a production build, Playwright with axe on desktop and mobile, and Lighthouse budgets.",
      ],
      tradeoffs: [
        "Removing the route loading screen made first visits faster, at the cost of a branded transition between pages.",
        "Repository counts are verifiable but modest; they show how the work is built rather than how many people use it.",
      ],
    },
  },
];

export function getProject(id: number | string) {
  return selectedProjects.find((project) => project.id === Number(id));
}

/** Small, serializable project fields for client components. */
export function toProjectSummary(project: Pick<Project, keyof ProjectSummary>): ProjectSummary {
  const {
    id,
    title,
    shortDescription,
    image,
    technologies,
    category,
    year,
    demoLink,
    githubLink,
    sourceNote,
  } = project;
  return {
    id,
    title,
    shortDescription,
    image,
    technologies,
    category,
    year,
    demoLink,
    githubLink,
    sourceNote,
  };
}
