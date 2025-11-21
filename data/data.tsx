import { Project } from "@/types/Project";

export const projects: Project[] = [
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
];

import { FiCpu, FiTrendingUp, FiUsers, FiClock, FiZap, FiSearch } from "react-icons/fi";

export const HeroSectionSkills = [
  {
    icon: <FiCpu className="w-6 h-6" />,
    text: "Problem Solving",
  },
  {
    icon: <FiTrendingUp className="w-6 h-6" />,
    text: "Continuous Learning",
  },
  {
    icon: <FiUsers className="w-6 h-6" />,
    text: "Team Collaboration",
  },
  {
    icon: <FiClock className="w-6 h-6" />,
    text: "Time Management",
  },
  {
    icon: <FiZap className="w-6 h-6" />,
    text: "Creative Thinking",
  },
  {
    icon: <FiSearch className="w-6 h-6" />,
    text: "Attention to Detail",
  },
];

export const SkillsData = {
  frontend: [
    "React",
    "React Native",
    "TypeScript",
    "Tailwind CSS",
    "GSAP",
    "Framer Motion",
    "Reanimated",
  ],
  backend: ["Node.js", "Express", "MongoDB", "REST APIs", "GraphQL"],
  tools: [
    "Git",
    "GitHub",
    "Docker",
    "AWS (S3, EC2)",
    "Next js",
    "Vercel",
    "Expo",
    "Postman",
    "Figma",
  ],
  other: [
    "UI/UX Principles",
    "Performance",
    "SEO Basics",
    "Responsive Design",
    "Agile/Scrum",
    "Problem Solving",
  ],
} as const;
