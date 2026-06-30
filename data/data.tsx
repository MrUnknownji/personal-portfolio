import { Project, ProjectCaseStudy } from "@/types/Project";

export const projects: Project[] = [
  //AudioVibes
  {
    id: 1,
    title: "AudioVibes",
    shortDescription:
      "A minimalist React Native music player for Android & iOS with animations and Material You theming.",
    longDescription:
      "AudioVibes is an elegantly designed music player application for Android and iOS. Boasting a minimalist interface with captivating animations, it supports Material You theming, notifications, and background playback.",
    image:
      "https://res.cloudinary.com/dfwgprzxo/image/upload/v1745062498/DescHome_gijzvt.png",
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
    demoLink: "https://github.com/MrUnknownji/AudioVibes2",
    githubLink: "https://github.com/MrUnknownji/AudioVibes_music_player.git",
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
  },
  //Cryptopedia
  {
    id: 2,
    title: "CryptoPedia",
    shortDescription:
      "Real-time cryptocurrency data web app with interactive graphs and light/dark modes.",
    longDescription:
      "CryptoPedia is a sophisticated web app delivering real-time cryptocurrency data through interactive graphs. With features such as coin rankings, price ranges, and dark/light modes, it provides a comprehensive and visually appealing user experience.",
    image:
      "https://res.cloudinary.com/dfwgprzxo/image/upload/v1745062500/DescHome_iyws8m.png",
    technologies: ["React", "Redux", "Tailwind CSS", "axios", "Chart.js"],
    features: [
      "Real-time cryptocurrency data fetching",
      "Interactive historical price charts",
      "Coin ranking and essential data display",
      "Data visualization using graphs",
      "Light and Dark mode toggle",
      "Responsive design for desktop and mobile",
      "Integration with external crypto API",
    ],
    demoLink: "https://crypto-pedia-three.vercel.app/",
    githubLink: "https://github.com/MrUnknownji/CryptoPedia.git",
    category: "Frontend",
    gallery: [
      {
        type: "image",
        src: "https://res.cloudinary.com/dfwgprzxo/image/upload/v1745062500/DescHome_iyws8m.png",
        alt: "CryptoPedia Desktop Home Page",
      },
      {
        type: "image",
        src: "https://res.cloudinary.com/dfwgprzxo/image/upload/v1745062499/DescChart_ov7uud.png",
        alt: "CryptoPedia Desktop Chart View",
      },
      {
        type: "image",
        src: "https://res.cloudinary.com/dfwgprzxo/image/upload/v1745062500/DescCoins_htulz8.png",
        alt: "CryptoPedia Desktop Coins List",
      },
      {
        type: "image",
        src: "https://res.cloudinary.com/dfwgprzxo/image/upload/v1745062499/MobHome_jfuqov.png",
        alt: "CryptoPedia Mobile Home Page",
      },
      {
        type: "image",
        src: "https://res.cloudinary.com/dfwgprzxo/image/upload/v1745062500/MobChart_xiji7o.png",
        alt: "CryptoPedia Mobile Chart View",
      },
      {
        type: "image",
        src: "https://res.cloudinary.com/dfwgprzxo/image/upload/v1745062500/MobCoins_lenb9j.png",
        alt: "CryptoPedia Mobile Coins List",
      },
    ],
  },
  //ShopNest
  {
    id: 3,
    title: "ShopNest",
    shortDescription:
      "Elegant e-commerce website layout demo with search functionality and core shopping features.",
    longDescription:
      "ShopNest offers an exquisite and user-friendly shopping website layout with seamless search functionality. Its elegant design incorporates essential e-commerce components, showcasing a fully functional and interactive shopping experience.",
    image:
      "https://res.cloudinary.com/dfwgprzxo/image/upload/v1745062491/DescHome_cq07dv.png",
    technologies: ["React", "Redux", "Tailwind CSS"],
    features: [
      "Elegant UI/UX design for e-commerce",
      "Product listing and search functionality",
      "Shopping cart state management (Redux)",
      "User profile page layout",
      "Simulated checkout process flow",
      "Responsive design for various screen sizes",
      "Focus on frontend components and layout",
    ],
    demoLink: "https://shop-nest-rosy.vercel.app/",
    githubLink: "https://github.com/MrUnknownji/ShopNest.git",
    category: "Frontend",
    gallery: [
      {
        type: "image",
        src: "https://res.cloudinary.com/dfwgprzxo/image/upload/v1745062491/DescHome_cq07dv.png",
        alt: "ShopNest Desktop Homepage",
      },
      {
        type: "image",
        src: "https://res.cloudinary.com/dfwgprzxo/image/upload/v1745062481/DescProfile_xenrcb.png",
        alt: "ShopNest Desktop Profile Page",
      },
      {
        type: "image",
        src: "https://res.cloudinary.com/dfwgprzxo/image/upload/v1745062481/DescCart_cotfhb.png",
        alt: "ShopNest Desktop Shopping Cart",
      },
      {
        type: "image",
        src: "https://res.cloudinary.com/dfwgprzxo/image/upload/v1745062483/DescCheckout_rzmvpv.png",
        alt: "ShopNest Desktop Checkout Page",
      },
      {
        type: "image",
        src: "https://res.cloudinary.com/dfwgprzxo/image/upload/v1745062487/MobHome_svss73.png",
        alt: "ShopNest Mobile Homepage",
      },
      {
        type: "image",
        src: "https://res.cloudinary.com/dfwgprzxo/image/upload/v1745062487/MobCart_l3qeln.png",
        alt: "ShopNest Mobile Shopping Cart",
      },
      {
        type: "image",
        src: "https://res.cloudinary.com/dfwgprzxo/image/upload/v1745062488/MobProfile_gqoobk.png",
        alt: "ShopNest Mobile Profile Page",
      },
    ],
  },
  //SynthTech
  {
    id: 4,
    title: "SynthTech",
    shortDescription:
      "Visually captivating website design for a tech solutions provider, featuring animations.",
    longDescription:
      "SynthTech presents a visually captivating design for a tech solution provider company. With its sleek design, engaging animations, and sophisticated layout, it stands as an impressive showcase of design and development capabilities.",
    image:
      "https://res.cloudinary.com/dfwgprzxo/image/upload/v1745062491/DescHome_khhemb.png",
    technologies: ["React", "Tailwind CSS", "Framer Motion"],
    features: [
      "Sleek and modern landing page design",
      "Engaging animations and transitions",
      "Sophisticated multi-section layout",
      "Showcase for company services and portfolio",
      "Contact form section",
      "Client/Brand logo display",
      "Responsive across devices",
    ],
    demoLink: "https://synth-tech.vercel.app/",
    githubLink: "https://github.com/MrUnknownji/SynthTech.git",
    category: "Frontend",
    gallery: [
      {
        type: "image",
        src: "https://res.cloudinary.com/dfwgprzxo/image/upload/v1745062491/DescHome_khhemb.png",
        alt: "SynthTech Desktop Homepage",
      },
      {
        type: "image",
        src: "https://res.cloudinary.com/dfwgprzxo/image/upload/v1745062492/DescBrands_yfxraa.png",
        alt: "SynthTech Desktop Brands/Clients Section",
      },
      {
        type: "image",
        src: "https://res.cloudinary.com/dfwgprzxo/image/upload/v1745062491/DescContact_wdeyo9.png",
        alt: "SynthTech Desktop Contact Section",
      },
      {
        type: "image",
        src: "https://res.cloudinary.com/dfwgprzxo/image/upload/v1745062496/DescServices_s5r7tk.png",
        alt: "SynthTech Desktop Services Section",
      },
      {
        type: "image",
        src: "https://res.cloudinary.com/dfwgprzxo/image/upload/v1745062491/MobHome_lqxbwr.png",
        alt: "SynthTech Mobile Homepage",
      },
      {
        type: "image",
        src: "https://res.cloudinary.com/dfwgprzxo/image/upload/v1745062489/MobAbout_lazliq.png",
        alt: "SynthTech Mobile About Section",
      },
      {
        type: "image",
        src: "https://res.cloudinary.com/dfwgprzxo/image/upload/v1745062491/MobBrands_utva4p.png",
        alt: "SynthTech Mobile Brands Section",
      },
    ],
  },
  //VideoHub
  {
    id: 5,
    title: "VideoHub",
    shortDescription:
      "Visually stunning video streaming website demo with Chakra UI theming (light/dark).",
    longDescription:
      "VideoHub is a visually stunning video streaming website demo. Utilizing Chakra UI for theming and components, it promises a seamless experience in both light and dark modes. Its high responsiveness and sleek design ensure an engaging viewing experience for users.",
    image:
      "https://res.cloudinary.com/dfwgprzxo/image/upload/v1745062495/DescHome_ps0drw.png",
    technologies: ["React", "Tailwind CSS", "Redux", "Chakra UI"],
    features: [
      "Video streaming platform UI demo",
      "Component styling with Chakra UI",
      "Seamless Light/Dark mode switching",
      "Highly responsive design",
      "User Login and Signup page examples",
      "Video listing and simulated playback page",
      "State management with Redux",
    ],
    demoLink: "https://video-hub-gamma-two.vercel.app/",
    githubLink: "https://github.com/MrUnknownji/VideoHub.git",
    category: "Frontend",
    gallery: [
      {
        type: "image",
        src: "https://res.cloudinary.com/dfwgprzxo/image/upload/v1745062495/DescHome_ps0drw.png",
        alt: "VideoHub Desktop Homepage",
      },
      {
        type: "image",
        src: "https://res.cloudinary.com/dfwgprzxo/image/upload/v1745062494/DescContact_z6eu34.png",
        alt: "VideoHub Desktop Contact Page",
      },
      {
        type: "image",
        src: "https://res.cloudinary.com/dfwgprzxo/image/upload/v1745062496/DescLoginDark_aw4rlt.png",
        alt: "VideoHub Desktop Login (Dark Mode)",
      },
      {
        type: "image",
        src: "https://res.cloudinary.com/dfwgprzxo/image/upload/v1745062494/DescNavDark_wr2pyb.png",
        alt: "VideoHub Desktop Navigation (Dark Mode)",
      },
      {
        type: "image",
        src: "https://res.cloudinary.com/dfwgprzxo/image/upload/v1745062496/DescNavLight_a5kjs3.png",
        alt: "VideoHub Desktop Navigation (Light Mode)",
      },
      {
        type: "image",
        src: "https://res.cloudinary.com/dfwgprzxo/image/upload/v1745062494/DescServices_cg3xdu.png",
        alt: "VideoHub Desktop Services/Features Page",
      },
      {
        type: "image",
        src: "https://res.cloudinary.com/dfwgprzxo/image/upload/v1745062493/DescSignupDark_evyydd.png",
        alt: "VideoHub Desktop Signup (Dark Mode)",
      },
      {
        type: "image",
        src: "https://res.cloudinary.com/dfwgprzxo/image/upload/v1745062494/DescSignupLight_u8jvw6.png",
        alt: "VideoHub Desktop Signup (Light Mode)",
      },
      {
        type: "image",
        src: "https://res.cloudinary.com/dfwgprzxo/image/upload/v1745062496/DescVideo_dpykz5.png",
        alt: "VideoHub Desktop Video Listing/Playback Page",
      },
      {
        type: "image",
        src: "https://res.cloudinary.com/dfwgprzxo/image/upload/v1745062495/MobHomeDark_hoxjnj.png",
        alt: "VideoHub Mobile Homepage (Dark Mode)",
      },
      {
        type: "image",
        src: "https://res.cloudinary.com/dfwgprzxo/image/upload/v1745062493/MobContact_g8morv.png",
        alt: "VideoHub Mobile Contact Page",
      },
      {
        type: "image",
        src: "https://res.cloudinary.com/dfwgprzxo/image/upload/v1745062492/MobNavDark_ejjn7v.png",
        alt: "VideoHub Mobile Navigation (Dark Mode)",
      },
      {
        type: "image",
        src: "https://res.cloudinary.com/dfwgprzxo/image/upload/v1745062495/MobNavLight_cw7kho.png",
        alt: "VideoHub Mobile Navigation (Light Mode)",
      },
      {
        type: "image",
        src: "https://res.cloudinary.com/dfwgprzxo/image/upload/v1745062492/MobVideo_j42u0d.png",
        alt: "VideoHub Mobile Video Page",
      },
    ],
  },
  //SpaceX Website Clone
  {
    id: 6,
    title: "SpaceX Website Clone",
    shortDescription:
      "A meticulous clone of the SpaceX homepage showcasing HTML, CSS, and JavaScript skills.",
    longDescription:
      "The SpaceX(Clone) project meticulously reproduces the SpaceX homepage, showcasing impeccable attention to detail and advanced web development skills. It serves as a prime example of exemplary web design and development capabilities.",
    image:
      "https://res.cloudinary.com/dfwgprzxo/image/upload/v1745062489/DescHome_o8q5wo.png",
    technologies: ["HTML", "CSS", "JavaScript"],
    features: [
      "Homepage replication of SpaceX website",
      "Implementation using core web technologies",
      "Focus on layout, styling, and basic interactivity",
      "Responsive design for different screen sizes",
      "Navigation menu reproduction",
      "Demonstrates foundational frontend skills",
      "Attention to design details",
    ],
    demoLink: "https://mrunknownji.github.io/SpaceX/",
    githubLink: "https://github.com/MrUnknownji/SpaceX.git",
    category: "Frontend",
    gallery: [
      {
        type: "image",
        src: "https://res.cloudinary.com/dfwgprzxo/image/upload/v1745062489/DescHome_o8q5wo.png",
        alt: "SpaceX Clone Desktop Main Section",
      },
      {
        type: "image",
        src: "https://res.cloudinary.com/dfwgprzxo/image/upload/v1745062484/DescHome1_havv0w.png",
        alt: "SpaceX Clone Desktop Section 2",
      },
      {
        type: "image",
        src: "https://res.cloudinary.com/dfwgprzxo/image/upload/v1745062486/DescHome3_qwrzuc.png",
        alt: "SpaceX Clone Desktop Section 3",
      },
      {
        type: "image",
        src: "https://res.cloudinary.com/dfwgprzxo/image/upload/v1745062489/DescHome4_wqr1nu.png",
        alt: "SpaceX Clone Desktop Section 4",
      },
      {
        type: "image",
        src: "https://res.cloudinary.com/dfwgprzxo/image/upload/v1745062486/DescNav_t89znc.png",
        alt: "SpaceX Clone Desktop Navigation Menu",
      },
      {
        type: "image",
        src: "https://res.cloudinary.com/dfwgprzxo/image/upload/v1745062484/MobHome_xoutxh.png",
        alt: "SpaceX Clone Mobile View",
      },
    ],
  },
  //AuraEdit(Open Source local image modifier)
  {
    id: 7,
    title: "Aura Edit",
    shortDescription: "An open-source browser-based image editor with batch processing capabilities.",
    longDescription: "Aura Edit is a high-performance image editing tool that runs entirely in your browser. It allows users to perform complex modifications, apply filters, and process images in batches without ever uploading files to a server, ensuring maximum privacy and speed.",
    image: "https://res.cloudinary.com/dfwgprzxo/image/upload/v1777116565/AuraEdit-ImageUpload-Web-Light.png",
    technologies: ["Next.js", "TypeScript", "Tailwind CSS", "Canvas API", "Framer Motion"],
    features: [
      "Local-first image processing",
      "Batch image editing and resizing",
      "Real-time filters and adjustments",
      "High-quality image exports",
      "Privacy-focused (no server uploads)",
      "Modern UI with Dark/Light mode support",
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
  },
  //BidStrike (AI Powered Auction Platform)
  {
    id: 9,
    title: "BidStrike",
    shortDescription: "A real-time AI-powered auction platform for seamless bidding experiences.",
    longDescription: "BidStrike is a sophisticated auction platform designed for speed and reliability. It features real-time bidding updates, AI-driven price suggestions, and a comprehensive dashboard for tracking active auctions and notifications.",
    image: "https://res.cloudinary.com/dfwgprzxo/image/upload/v1769855178/Bid-Strike-Light-Home.png",
    technologies: ["Next.js", "TypeScript", "Tailwind CSS", "Pusher", "Prisma", "PostgreSQL"],
    features: [
      "Real-time bid updates via WebSockets",
      "AI-powered auction insights and suggestions",
      "Secure payment and escrow system",
      "User-friendly bidder and auctioneer dashboards",
      "Mobile-responsive interface",
      "Detailed auction management and tracking",
    ],
    demoLink: "https://bid-strike.vercel.app/",
    githubLink: "https://github.com/MrUnknownji/bid-strike",
    category: "Web App",
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
  },
  //Youtube Content OS(AI Powered Youtube Content Generation Platform)
  {
    id: 8,
    title: "Youtube Content OS",
    shortDescription: "An all-in-one AI workspace for YouTube creators to manage scripts, thumbnails, and metadata.",
    longDescription: "Youtube Content OS streamlines the content creation workflow by integrating AI into every step. From generating scripts and meta titles to creating thumbnails and managing export tasks, it's the ultimate tool for modern creators to scale their channels.",
    image: "https://res.cloudinary.com/dfwgprzxo/image/upload/v1777123509/Content-OS-Web-Light-Home.png",
    technologies: ["Next.js", "TypeScript", "Tailwind CSS", "OpenAI/Gemini API", "Drizzle ORM", "Supabase"],
    features: [
      "AI-powered scriptwriting and hooks",
      "Automated thumbnail generation and ideation",
      "Metadata optimization for YouTube SEO",
      "Creator-focused project management dashboard",
      "Content export to various platforms",
      "Mobile-friendly design for on-the-go creation",
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
  },
  //OmniMart(AI Powered E-Commerce Platform)
  {
    id: 10,
    title: "OmniMart",
    shortDescription: "A premium AI-enhanced e-commerce platform with a sophisticated editorial design.",
    longDescription: "OmniMart redefines the online shopping experience with a focus on high-end aesthetics and AI-driven personalization. It features a robust admin panel, seamless checkout flow, and a dynamic search system designed for luxury retail.",
    image: "https://res.cloudinary.com/dfwgprzxo/image/upload/v1777124896/OmniMart-Light-Web-Home.png",
    technologies: ["Next.js", "TypeScript", "Tailwind CSS", "Redux", "Stripe", "AI Personalization"],
    features: [
      "Boutique editorial UI/UX design",
      "AI-powered product discovery and recommendations",
      "Comprehensive admin management dashboard",
      "Secure cart and multi-step checkout flow",
      "Responsive and fluid motion animations",
      "Advanced inventory and customer management",
    ],
    demoLink: "https://omni-mart-orpin.vercel.app/",
    githubLink: "https://github.com/MrUnknownji/omni-mart",
    category: "Web App",
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
  },
  // Mirror Wallpapers
  {
    id: 11,
    title: "Mirror Wallpapers",
    shortDescription:
      "An AI-powered wallpaper ecosystem pairing an Expo mobile experience with a full operations console.",
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
    githubLink: "https://github.com/MrUnknownji/mirror-app",
    category: "Full Stack",
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
    featured: true,
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
];

export const selectedProjectIds = [11, 9, 8, 7, 1, 10] as const;

const selectedProjectIdSet = new Set<number>(selectedProjectIds);

const projectTitleOverrides: Record<number, string> = {
  7: "AuraEdit",
  8: "YouTube Content OS",
};

const projectCaseStudies: Record<number, ProjectCaseStudy> = {
  1: {
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
  7: {
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
  8: {
    problem:
      "YouTube creators juggle scripts, hooks, metadata, thumbnails, and exports across disconnected tools.",
    solution:
      "YouTube Content OS centralizes ideation, AI drafting, metadata generation, visual workflows, and export tasks in one creator workspace.",
    architecture: [
      "Next.js and TypeScript structure the product dashboard and creator workflows.",
      "AI provider calls are isolated behind workflow actions so prompts and outputs can evolve without rewriting the UI.",
      "Supabase and Drizzle model creator projects, saved content, settings, and generated assets.",
    ],
    tradeoffs: [
      "AI-assisted output speeds up drafting but still needs user review before publishing.",
      "A richer workspace creates more state to manage, so flows are split by content task instead of one oversized editor.",
    ],
  },
  9: {
    problem:
      "Auction products need fast bid updates, clear bidder feedback, and reliable dashboard state under time pressure.",
    solution:
      "BidStrike combines real-time bidding, auction management, AI suggestions, and responsive dashboards for bidders and auctioneers.",
    architecture: [
      "Next.js and TypeScript power the product surface and route-level workflows.",
      "Pusher handles real-time bid events so open auction views update immediately.",
      "Prisma and PostgreSQL model auctions, bids, users, notifications, and dashboard data.",
    ],
    tradeoffs: [
      "Real-time UX improves trust but requires careful event ordering and stale-state handling.",
      "AI price suggestions are positioned as decision support, not automatic bidding.",
    ],
  },
  10: {
    problem:
      "E-commerce demos often stop at product grids and miss admin, support, checkout, and personalization flows.",
    solution:
      "OmniMart presents a fuller retail product with editorial shopping, cart and checkout flows, AI discovery ideas, and admin management screens.",
    architecture: [
      "Next.js, TypeScript, Tailwind CSS, and Redux organize storefront, cart, checkout, and admin UI state.",
      "Stripe-oriented checkout flows separate purchase intent from catalog browsing.",
      "Admin dashboards cover product, order, and customer management surfaces.",
    ],
    tradeoffs: [
      "A broad product surface demonstrates end-to-end thinking but needs clear boundaries between demo and production payment behavior.",
      "Editorial visuals strengthen brand feel while dense admin screens stay more utilitarian.",
    ],
  },
};

export const selectedProjects: Project[] = selectedProjectIds.flatMap((id) => {
  const project = projects.find((item) => item.id === id);
  if (!project) return [];

  return [
    {
      ...project,
      title: projectTitleOverrides[id] || project.title,
      featured: true,
      caseStudy: projectCaseStudies[id] || project.caseStudy,
    },
  ];
});

export const archivedProjects = projects.filter((project) => {
  return !selectedProjectIdSet.has(project.id);
});
