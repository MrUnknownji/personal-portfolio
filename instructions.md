# Personal Portfolio Project Documentation

## 1. Project Overview

This project is a personal portfolio website built to showcase skills, projects, and professional experience. It is designed to be a dynamic and interactive web application that fetches real-time data from various social media platforms. The primary goal of this portfolio is to serve as a professional landing page for potential employers and collaborators.

The application is built with a modern technology stack, focusing on performance, developer experience, and maintainability.

## 2. Technology Stack

This project is built using the following core technologies:

*   **Framework**: [Next.js](https://nextjs.org/) (v15) - A React framework for building server-side rendered and static web applications.
*   **Language**: [TypeScript](https://www.typescriptlang.org/) - A statically typed superset of JavaScript that enhances code quality and maintainability.
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/) - A utility-first CSS framework for rapid UI development.
*   **Animation**: [GSAP (GreenSock Animation Platform)](https://gsap.com/) - A powerful JavaScript library for creating high-performance animations.
*   **Authentication**: [NextAuth.js](https://next-auth.js.org/) - An authentication library for Next.js applications, used here for LinkedIn authentication.
*   **API Integrations**:
    *   **Twitter**: Uses the `twitter-api-v2` library to interact with the Twitter API.
    *   **LinkedIn**: Fetches data from the LinkedIn API.
    *   **GitHub**: Interacts with the GitHub API to fetch repository and profile data.

## 3. Project Setup and Local Development

To run this project locally, you will need to have [Node.js](https://nodejs.org/) and [pnpm](https://pnpm.io/) installed on your machine.

### 3.1. Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd personal-portfolio
    ```

2.  **Install dependencies:**
    This project uses `pnpm` as the package manager. To install the required dependencies, run the following command in the project's root directory:
    ```bash
    pnpm install
    ```

### 3.2. Running the Development Server

Once the dependencies are installed, you can start the local development server:

```bash
pnpm run dev
```

This command starts the application in development mode with Turbopack for faster performance. The website will be accessible at `http://localhost:3000`.

### 3.3. Building for Production

To create a production-ready build of the application, run:

```bash
pnpm run build
```

This command generates an optimized version of the application in the `.next` directory.

### 3.4. Starting the Production Server

After building the project, you can start the production server with:

```bash
pnpm run start
```

This will serve the application from the production build.

### 3.5. Linting

To check the code for any linting errors, run:

```bash
pnpm run lint
```

## 4. Core Application Structure

The core of the application is built using Next.js's App Router. The files in the `app/` directory define the main structure and behavior of the portfolio.

### 4.1. `app/layout.tsx`

This file serves as the root layout for the entire application. It wraps all pages and provides a consistent structure.

*   **Purpose**: To define the main HTML shell, including the `<html>` and `<body>` tags.
*   **Key Components**:
    *   `Header`: The website's main navigation bar, displayed at the top of every page.
    *   `Footer`: The website's footer, displayed at the bottom of every page.
    *   `SmoothScroller`: A component that likely implements smooth scrolling behavior for the entire page.
*   **Functionality**:
    *   It imports and applies global fonts (`Outfit` and `Poppins`).
    *   It includes `globals.css` for site-wide styling.
    *   It sets the page metadata (title, description, favicon).
    *   It contains a decorative background with CSS gradients and a noise effect.
    *   The main page content (`children`) is passed to the `Template` component.

### 4.2. `app/template.tsx`

This file is a client-side component (`"use client"`) that wraps the page content to provide animated transitions between pages.

*   **Purpose**: To create a smooth loading animation whenever the user navigates to a new page.
*   **Technology**: It uses [GSAP (GreenSock Animation Platform)](https://gsap.com/) to create the animations.
*   **Functionality**:
    *   When a page transition occurs, it displays a full-screen overlay with a percentage counter that animates from 0% to 100%.
    *   While the overlay is active, the new page content is faded in.
    *   Once the content is loaded, the overlay fades out, revealing the new page.
    *   This creates a seamless and visually appealing user experience during navigation.

### 4.3. `app/page.tsx`

This is the entry point for the homepage of the portfolio (the `/` route).

*   **Purpose**: To render the main content of the homepage.
*   **Functionality**: This component is very simple. It directly imports and renders the `Home` component from `./home.tsx`.

### 4.4. `app/home.tsx`

This client-side component (`"use client"`) assembles the different sections of the homepage.

*   **Purpose**: To define the structure and content of the homepage by combining several high-level components.
*   **Key Components**:
    *   `HeroSection`: The introductory section at the top of the homepage.
    *   `AboutMe`: The section that provides information about the portfolio owner.
    *   `ContactForm`: The form for users to send messages or inquiries.
*   **Functionality**: It renders these three components in sequence to build the homepage. Each of these components will be documented in more detail in the "UI Sections" documentation below.

### 4.5. `app/globals.css`

This file contains the global styles for the application.

*   **Purpose**: To define base styles, Tailwind CSS configurations (`@tailwind base`, `@tailwind components`, `@tailwind utilities`), and other site-wide CSS rules.
*   **Functionality**: It provides the foundational styling that is applied across the entire portfolio.

## 5. Feature-based Documentation: UI Sections

This section details the major UI features of the portfolio, which are composed of multiple components working together.

### 5.1. Hero Section

The Hero Section is the main introductory block on the homepage. It is designed to grab the user's attention with animations and provide key information at a glance.

#### 5.1.1. `components/HeroSection.tsx`

This is the main container component for the Hero Section.

*   **Purpose**: To assemble the different parts of the Hero Section and manage its overall layout and animations.
*   **Features**:
    *   **3D Parallax Effect**: Uses GSAP to create a 3D effect where the content card tilts and moves in response to the user's mouse position. This is achieved by applying a `perspective` style to the container and transforming the card's rotation and position.
    *   **Responsive Layout**: It uses a flexbox layout that stacks the content vertically on smaller screens and places it side-by-side on larger screens (`lg` and up).
*   **Child Components**:
    *   `HeroContent`: The main informational content of the section.
    *   `CodeDisplay`: A decorative component that shows a snippet of code, visible only on larger screens.

#### 5.1.2. `components/HeroSectionComponents/HeroContent.tsx`

This component contains the primary textual and interactive content of the Hero Section.

*   **Purpose**: To present the portfolio owner's introduction, skills, and calls-to-action.
*   **Features**:
    *   **Staggered Animations**: Uses GSAP to animate the entry of its child components. Each element fades and slides in sequentially, creating a dynamic loading effect.
*   **Child Components**:
    *   `HireBadge`: A small badge, likely to indicate availability for work.
    *   `HeroText`: The main heading and subheading.
    *   `TypedText`: A component that displays a list of specializations with a typewriter animation effect.
    *   `SkillCard`: Renders a grid of key skills, populated from `data/data.ts`.
    *   `ViewProjectsButton`: A primary call-to-action button.
    *   `SocialLinks`: A component to display links to social media profiles.

#### 5.1.3. `components/HeroSectionComponents/CodeDisplay.tsx`

This is a visual, non-interactive component that displays an animated block of code.

*   **Purpose**: To visually reinforce the "developer" theme of the portfolio.
*   **Features**:
    *   **Scroll-triggered Animation**: Uses GSAP and ScrollTrigger to animate the code block into view as the user scrolls down the page.
    *   **Floating Animation**: The code block has a continuous, subtle floating animation to make it more dynamic.
    *   **Styling**: It is styled to resemble a code editor window, complete with window controls and syntax-highlighted code. The code itself is a JavaScript object representing the portfolio's author.

### 5.2. About Me Section

The "About Me" section provides a more personal look at the portfolio owner, including their professional journey and technical skills.

#### 5.2.1. `components/AboutMe.tsx`

This component serves as the main container for the "About Me" section.

*   **Purpose**: To structure and arrange the different parts of the "About Me" content.
*   **Layout**: It uses a responsive grid system. On large screens, it places the image and the "journey" timeline side-by-side. On smaller screens, these elements stack vertically. The skills section is always displayed below this grid.
*   **Child Components**:
    *   `Title`: A reusable UI component to display the main section heading and a subtitle.
    *   `ImageSection`: Displays the profile picture.
    *   `JourneySection`: Shows a timeline of professional experience.
    *   `SkillsSection`: Lists technical skills.

#### 5.2.2. `components/AboutMeSectionComponents/ImageSection.tsx`

This client-side component displays the portfolio owner's profile picture with an engaging animation.

*   **Purpose**: To display a visually interesting profile image.
*   **Features**:
    *   **Reveal Animation**: Uses GSAP and ScrollTrigger to reveal the image with a `clip-path` animation as the user scrolls.
    *   **Hover Effect**: On desktop, the image is initially grayscale and transitions to full color on hover.
    *   **Decorative Elements**: Includes animated border corners that appear with the image.

#### 5.2.3. `components/AboutMeSectionComponents/JourneySection.tsx`

This client-side component displays a timeline of the owner's career and educational milestones.

*   **Purpose**: To tell a story about the owner's professional journey.
*   **Features**:
    *   **Timeline Animation**: Uses GSAP and ScrollTrigger to animate the timeline into view. The vertical line and each event on the timeline appear sequentially.
    *   **Data**: The content for the timeline is stored in a `journeyData` array within the component.
    *   **Layout**: Each event is styled as a point on a vertical line, creating a clear and readable timeline.

#### 5.2.4. `components/AboutMeSectionComponents/SkillsSection.tsx`

This client-side component displays a comprehensive, categorized list of technical skills.

*   **Purpose**: To showcase the owner's technical capabilities.
*   **Features**:
    *   **Staggered Animation**: Uses GSAP and ScrollTrigger to animate the title, each category, and each skill chip into view in a staggered sequence.
    *   **Data-driven**: The skills are populated from the `SkillsData` object in `data/data.ts`.
    *   **Layout**: The skills are organized into a grid of categories. Within each category, skills are displayed as styled "chips".

### 5.3. Projects Section

The "Projects Section" is a dedicated page (`/my-projects`) that showcases a collection of the portfolio owner's work. It's an interactive and feature-rich section.

#### 5.3.1. `app/my-projects/page.tsx`

This is the main page component for the projects section. It's a complex client-side component that orchestrates the entire feature.

*   **Purpose**: To display a filterable and searchable grid of projects.
*   **Features**:
    *   **Data Fetching**: It imports project data from `data/data.ts`.
    *   **Filtering and Searching**: Provides controls to filter projects by category and to search by keyword. The logic for filtering is handled within this component.
    *   **Complex Animations**: Uses GSAP for numerous animations, including the entry animation for filter controls and a sophisticated filter animation where old project cards animate out and new ones animate in.
    *   **State Management**: Manages the state for the selected project, active filter, search query, and animation status.
*   **Child Components**:
    *   `ProjectCard`: Renders each project in the grid.
    *   `ProjectModal`: A modal that opens to show detailed information about a selected project.

#### 5.3.2. `components/ProjectCard.tsx`

This component displays a preview of a single project in the grid.

*   **Purpose**: To provide an attractive, summarized view of a project and act as a gateway to the detailed view.
*   **Features**:
    *   **Hover Animation**: Uses GSAP to create a rich hover effect where the card scales up, the image zooms, and a "View Details" overlay appears.
    *   **Data Display**: Shows the project's image, title, a short description, and a limited number of technology tags.
    *   **Memoized**: Wrapped in `React.memo` for performance optimization, preventing unnecessary re-renders.
*   **Interaction**: Clicking the card triggers a handler to open the `ProjectModal`.

#### 5.3.3. `components/ProjectModal.tsx`

This is a detailed modal view that opens when a `ProjectCard` is clicked.

*   **Purpose**: To provide a comprehensive overview of a single project.
*   **Features**:
    *   **Open/Close Animation**: Has its own GSAP-powered animation for opening and closing, which is separate from the page content.
    *   **Responsive Layout**: Adapts from a full-screen view on mobile to a large modal window on desktop.
    *   **Scrollable Content**: The content within the modal is scrollable if it exceeds the viewport height.
*   **Child Components**:
    *   `MediaGallery`: Displays additional images or videos related to the project.
    *   `ExpandableSection`: Used for long text sections like the description and features, which can be collapsed to save space.
    *   `TechStack`: Shows the full list of technologies used in the project.
*   **Data Display**: It shows the project's title, descriptions, features, a media gallery, the full tech stack, and provides links to the live demo and GitHub repository.

### 5.4. Contact Section

The "Contact Section" is located on the homepage and provides a way for visitors to get in touch.

#### 5.4.1. `components/ContactForm.tsx`

This is the main container for the contact feature.

*   **Purpose**: To assemble the contact information and the contact form into a single, cohesive section.
*   **Features**:
    *   **Scroll Animation**: Uses GSAP and ScrollTrigger to animate the entire section into view as the user scrolls.
    *   **Dialog Management**: It manages the state for the `ThankYouDialog`, which is displayed after a successful form submission.
*   **Layout**: It uses a responsive grid to display the `ContactInfo` and `Form` components side-by-side on larger screens.

#### 5.4.2. `components/ContactSectionComponents/ContactInfo.tsx`

This component displays static contact information and social media links.

*   **Purpose**: To provide direct contact details and links to social profiles.
*   **Features**:
    *   **Staggered Animation**: The contact details and social icons are animated into view sequentially using GSAP and ScrollTrigger.
    *   **Data**: The contact and social link data is hardcoded within the component.

#### 5.4.3. `components/ContactSectionComponents/Form.tsx`

This component is the interactive form that users can fill out.

*   **Purpose**: To allow users to send a message to the portfolio owner.
*   **Features**:
    *   **Animated Form**: The form fields animate into view and have a continuous, subtle floating animation.
    *   **Client-side Validation**: It includes validation to ensure that all fields are filled before submission.
    *   **`mailto:` Submission**: This form does not submit data to a server. Instead, it dynamically creates a `mailto:` link with the form's content and opens it in a new tab, relying on the user's default email client to send the message.
*   **Interaction**: On successful submission, it triggers a callback to open the `ThankYouDialog`.

## 6. API Integrations

The portfolio integrates with several external APIs to fetch and display real-time social media data and to handle authentication.

### 6.1. Social Media Stats

The application fetches statistics from GitHub, Twitter, and LinkedIn to display on the site. This is orchestrated by a central API route that aggregates the data.

#### 6.1.1. `app/api/social/stats/route.ts`

This is the main aggregator route for all social media statistics.

*   **Purpose**: To provide a single endpoint that returns combined stats from GitHub, Twitter, and LinkedIn.
*   **Functionality**:
    *   It directly calls the `fetchGitHubStats` utility function.
    *   It makes internal `fetch` requests to its own API routes (`/api/social/twitter` and `/api/social/linkedin`) to get data from those services. This pattern encapsulates the logic for each service.
    *   It uses fallback data from `utils/social.ts` to prevent errors if an API call fails.
    *   It sets cache headers on the response for performance.

#### 6.1.2. GitHub Integration (`utils/githubApi.ts`)

*   **Purpose**: To fetch user statistics from the GitHub API.
*   **Functionality**:
    *   The `fetchGitHubStats` function calls the `https://api.github.com/users/{username}` endpoint.
    *   It requires a `GITHUB_TOKEN` environment variable for authentication.
    *   It returns key profile data, including repo count, followers, and following count.

#### 6.1.3. Twitter Integration

*   **`app/api/social/twitter/route.ts`**: An API route that receives a username and calls the utility function to fetch data.
*   **`utils/twitterApi.ts`**:
    *   The `getTwitterUserByUsername` function calls the Twitter API v2 endpoint (`/2/users/by/username/{username}`).
    *   It requires a `TWITTER_BEARER_TOKEN` environment variable for authentication.
    *   It returns profile data, including follower/following counts and tweet count.

#### 6.1.4. LinkedIn Integration

*   **`app/api/social/linkedin/route.ts`**: An API route that receives a username and calls the utility function.
*   **`utils/linkedinApi.ts`**:
    *   The `fetchLinkedInProfile` function calls the LinkedIn API (`/v2/userinfo`).
    *   It requires a `LINKEDIN_ACCESS_TOKEN` environment variable.
    *   **Note**: The LinkedIn API provides limited public data. This function fetches what it can (name, profile picture) and supplements it with hardcoded fallback data for stats like connection count.

### 6.2. LinkedIn Authentication

The application includes a custom implementation of the "Sign In with LinkedIn" OAuth 2.0 flow. This is likely used to obtain the `LINKEDIN_ACCESS_TOKEN` needed for the LinkedIn API integration.

#### 6.2.1. Step 1: Authorization Request (`app/api/auth/linkedin/route.ts`)

*   **Purpose**: To initiate the authentication process.
*   **Functionality**:
    *   When a user accesses this route, it constructs the LinkedIn authorization URL.
    *   It includes the `client_id`, `redirect_uri`, and requested `scopes` (`openid profile`).
    *   It generates a `state` value for CSRF protection.
    *   It redirects the user to LinkedIn's authorization page.

#### 6.2.2. Step 2: Token Exchange (`app/api/auth/linkedin/callback/route.ts`)

*   **Purpose**: To handle the callback from LinkedIn after the user approves the authorization request.
*   **Functionality**:
    *   It receives an authorization `code` from LinkedIn.
    *   It makes a `POST` request to LinkedIn's token endpoint to exchange the `code` for an `access_token`.
    *   It requires `LINKEDIN_CLIENT_ID` and `LINKEDIN_CLIENT_SECRET` environment variables for this step.
    *   **Security Note**: For demonstration purposes, the obtained `access_token` is stored in a `process.env` variable. In a production application, this token must be stored securely (e.g., in a database or an encrypted session).
    *   It then redirects the user to an `/admin` page with a success or error message.

## 7. Data and Content

The portfolio's content, such as project details, skills, and social media links, is largely decoupled from the components. This makes the site easy to update. The core data is stored in the `/data` directory.

### 7.1. `data/data.ts`

This is the main content file for the portfolio.

*   **`projects`**: An array of `Project` objects that contains all the information for the "Projects Section". Each project has a detailed schema including descriptions, a technology list, features, links, and a media gallery.
*   **`HeroSectionSkills`**: A simple array of objects used to populate the soft skills/specializations in the Hero Section.
*   **`SkillsData`**: An object containing categorized lists of technical skills, used to populate the "Skills" part of the "About Me" section.

### 7.2. `data/SocialLink.ts`

This file defines the data and initial state for the social media links.

*   **`socialLinks`**: An array of `SocialLink` objects. Each object contains the data for a social platform, including:
    *   The URL, label, and description.
    *   Presentational data, such as the icon and color definitions for default and hover states.
    *   Fallback/default statistics (e.g., follower counts). These stats are intended to be replaced by live data fetched from the APIs.

## 8. Detailed Component Reference

This section provides detailed documentation for smaller, reusable components that were not covered in the main feature sections, as per user request.

### 8.1. `components/Header.tsx`

A highly interactive and animated header component.

*   **Purpose**: To provide consistent navigation and a strong visual identity at the top of the application.
*   **Features**:
    *   **Hide on Scroll**: The header uses GSAP and ScrollTrigger to slide out of view when the user scrolls down and slide back into view when they scroll up, maximizing screen real estate.
    *   **Particle Hover Effect**: A unique and complex feature. On hovering over the logo or the "Contact Me" button, it generates a burst of animated particles that emanate from the element. This is achieved by managing a pool of reusable DOM elements and animating them with GSAP.
    *   **Smart Contact Button**: The "Contact Me" button has contextual navigation. On the homepage, it triggers a smooth scroll to the contact section. From any other page, it navigates to the homepage at the contact section anchor.
    *   **Standard Hover Animations**: Includes scaling and color-shifting animations on the logo and contact button.
*   **Structure**: Contains a link to the homepage via the logo and the "Contact Me" button.

### 8.2. `components/Footer.tsx`

The application's footer, which contains navigation links and other metadata.

*   **Purpose**: To provide quick navigation and information at the bottom of every page.
*   **Features**:
    *   **Scroll Animation**: The elements within the footer (copyright, links, "built with" text) are animated into view sequentially as the user scrolls to the bottom of the page.
    *   **Smart Navigation**: The "Quick Links" behave intelligently. They scroll to sections if the user is on the homepage or perform a full page navigation if the user is on another page.
    *   **Conditional Hover Effects**: The link animations are context-aware. An underline effect and an "external link" arrow icon only appear if the link will take the user to a different page.
    *   **Data-driven Links**: The navigation links and the list of technologies used are populated from arrays, making them easy to maintain.

### 8.3. `components/GsapMagnetic.tsx`

A reusable wrapper component that applies a "magnetic" mouse-tracking effect to its children.

*   **Purpose**: To create engaging micro-interactions where an element appears to be attracted to the user's cursor.
*   **Features**:
    *   It tracks the mouse position relative to the component's center.
    *   It uses GSAP to animate the child element towards the cursor.
    *   When the mouse leaves the component's area, it animates the element back to its original position with an elastic easing effect.
*   **Props**:
    *   `children`: The React node to which the magnetic effect is applied.
    *   `strength` (optional): A number that controls the intensity of the magnetic pull.

### 8.4. `components/LinkedInAuth.tsx`

A simple button component used to initiate the LinkedIn authentication process.

*   **Purpose**: To provide a user interface element that allows the site owner to connect their LinkedIn account.
*   **Functionality**: When clicked, the button redirects the browser to `/api/auth/linkedin`, which is the API route that starts the custom LinkedIn OAuth 2.0 flow. This component is likely used on a private admin page.

### 8.5. `components/SmoothScroller.tsx`

A wrapper component that implements a smooth scrolling effect for the entire application.

*   **Purpose**: To enhance the user experience by replacing the default browser scroll with a smoother, more fluid motion.
*   **Technology**: It uses the official [GSAP ScrollSmoother](https://gsap.com/docs/v3/Plugins/ScrollSmoother/) plugin.
*   **Functionality**: It wraps the main content of the application (as seen in `app/layout.tsx`) and initializes `ScrollSmoother`. This affects all scrolling behavior on the site, making it more polished. It is configured for both desktop and touch devices.

### 8.6. `components/ThankYouDialog.tsx`

A modal dialog that appears after the user successfully submits the contact form.

*   **Purpose**: To confirm the form submission and provide alternative contact information.
*   **Features**:
    *   **Custom Animations**: It has a unique, custom-built open and close animation using GSAP, independent of the main UI Dialog component.
    *   **Copy to Clipboard**: Includes a button that copies the owner's email address to the clipboard and provides visual feedback to the user.
    *   **Accessibility**: Can be dismissed by clicking the overlay or pressing the `Escape` key.
*   **Composition**: It is built using `DialogContent` and `DialogActions` as child components to structure its layout.

### 8.7. `components/ContactSectionComponents/DialogContent.tsx`

This component renders the main body content inside the `ThankYouDialog`.

*   **Purpose**: To display the confirmation message and provide the copy-to-clipboard functionality.
*   **Features**:
    *   **Entrance Animation**: Uses GSAP to create a staggered entrance animation for its content (icon, text, and button).
    *   **Robust Copying**: Implements a `mailto:` copy function with a built-in fallback. If the modern `navigator.clipboard` API fails, it reverts to using a temporary input element and the older `document.execCommand("copy")` method to ensure high compatibility.
    *   **Stateful Button**: The "Copy" button's text and icon change to "Copied!" to provide clear user feedback.

### 8.8. `components/ContactSectionComponents/DialogActions.tsx`

This component renders the footer section of the `ThankYouDialog`, containing the action buttons.

*   **Purpose**: To provide clear actions for the user after the dialog is shown.
*   **Features**:
    *   **Entrance Animation**: Uses GSAP to animate the buttons into view when the dialog appears.
    *   **Conditional State**: The "Close" button's text changes to "Copied!" if the email was just copied, creating a cohesive user experience with the `DialogContent`.
*   **Actions**: Provides a primary action to view projects and a secondary action to close the dialog.

### 8.9. `components/ContactSectionComponents/InfoItem.tsx`

A small, reusable component for displaying a single line item of contact information (e.g., email, phone).

*   **Purpose**: To create a consistent look and feel for each piece of contact information in the `ContactInfo` component.
*   **Features**:
    *   It renders an icon, a label, and a value.
    *   The entire item is a clickable link.
    *   **Smart Linking**: It correctly uses `target="_blank"` for external web links while using the default `target="_self"` for protocol links like `mailto:` and `tel:`.
    *   Includes a subtle hover animation for visual feedback.

### 8.10. `components/HeroSectionComponents/HeroText.tsx`

A component that groups the main textual elements of the Hero Section.

*   **Purpose**: To structure the main title, subtitle, and descriptive quote in the hero section.
*   **Composition**: It uses two other reusable components:
    *   `Title`: To display the main name/title.
    *   `MagneticText`: To display the subtitle and the quote, giving them a magnetic mouse-tracking effect.

### 8.11. `components/HeroSectionComponents/Title.tsx`

A presentational component for the main `<h1>` title in the Hero Section.

*   **Purpose**: To display the portfolio owner's name with a specific style and animation.
*   **Features**:
    *   The name "Sandeep Kumar" is hardcoded.
    *   The text has a gradient color effect.
    *   It uses GSAP to animate its entrance with a fade and slide-up effect.

### 8.12. `components/HeroSectionComponents/MagneticText.tsx`

A highly interactive component that applies a "wave" or "ripple" animation to text on mouseover.

*   **Purpose**: To create a dynamic and engaging text effect.
*   **Technology**: Uses the GSAP `SplitText` plugin to break the text into individual characters.
*   **Features**:
    *   **Hover Effect**: When the mouse moves over the text, it calculates the distance from the cursor to each character and animates them in a ripple effect. Characters lift up, scale, and change color based on their proximity to the cursor.
    *   **Mouse-out Effect**: When the mouse leaves, the characters animate back to their original state with a randomized stagger.

### 8.13. `components/HeroSectionComponents/HireBadge.tsx`

A small, animated badge to indicate availability for hire.

*   **Purpose**: To act as a visually appealing status indicator in the Hero Section.
*   **Features**:
    *   **Pulse Animation**: It features a dot that has a continuous pulsing animation, created with GSAP.
    *   **Hover Animation**: The entire badge scales up slightly on mouse hover.

### 8.14. `components/HeroSectionComponents/SkillCard.tsx`

A card component that displays a single skill with an icon and text, featuring a unique hover animation.

*   **Purpose**: To display a "soft skill" or specialization in the Hero Section in a visually interesting way.
*   **Features**:
    *   **SVG Border Animation**: On hover, it uses GSAP to animate the `stroke-dashoffset` of an SVG path, which creates the effect of the border being "drawn" around the card.
    *   **Coordinated Hover Effects**: The border animation is synchronized with the icon lifting up, changing color, and a background gradient fading in.

### 8.15. `components/HeroSectionComponents/SocialInfoBox.tsx`

A tooltip-like component that displays detailed information about a social media link on hover.

*   **Purpose**: To provide an "at-a-glance" view of social media stats when a user hovers over a social link icon.
*   **Features**:
    *   **React Portal**: It uses `createPortal` to render itself at the top level of the DOM, preventing it from being clipped by parent containers with `overflow: hidden`.
    *   **Dynamic Positioning**: It is positioned dynamically near the cursor based on props passed from its parent. It also reports its height back to the parent to allow for position adjustments to keep it within the viewport.
    *   **Content**: It displays the social account's profile picture, name, description, and key statistics in a styled "tooltip" box.

### 8.16. `components/HeroSectionComponents/SocialLinks.tsx`

This component fetches live social media statistics and displays the social media icons, orchestrating the hover effect to show the `SocialInfoBox`.

*   **Purpose**: To display an interactive set of links to social media profiles with live data.
*   **Features**:
    *   **Live Data Fetching**: On mount, it calls an API route to fetch the latest stats from GitHub, Twitter, and LinkedIn. It displays a loading state while fetching.
    *   **Data Hydration**: It merges the fetched live stats with local fallback data. This ensures that the component can render immediately and is resilient to API failures.
    *   **Tooltip Orchestration**: It manages the state and logic for showing and positioning the `SocialInfoBox` component when a user hovers over a link.

### 8.17. `components/HeroSectionComponents/TypedText.tsx`

A component that displays a series of phrases with an animated, "typed-in" effect.

*   **Purpose**: To display a rotating list of skills or specializations in a dynamic way.
*   **Technology**: Uses the GSAP `SplitText` plugin to animate individual characters.
*   **Functionality**:
    *   It loops through a hardcoded array of strings.
    *   For each string, it animates the characters in with a staggered effect.
    *   After a delay, it animates the characters out.
    *   It uses a `key` prop on the text element, tied to the array index, to ensure React re-mounts the component and re-runs the animation for each new phrase.

### 8.18. `components/HeroSectionComponents/ViewProjectsButton.tsx`

A call-to-action button that links to the projects page.

*   **Purpose**: To provide a clear and attractive call-to-action for users to view projects.
*   **Features**:
    *   It's a Next.js `Link` component, ensuring optimized client-side navigation to `/my-projects`.
    *   **Shine/Sweep Animation**: On hover, a `div` with a linear gradient is animated across the button, creating a "shine" or "light sweep" effect for a polished feel.

### 8.19. `components/ProjectModalComponents/ExpandableSection.tsx`

A reusable accordion-style component for displaying collapsible content.

*   **Purpose**: To show and hide content in a compact way, used in the `ProjectModal`.
*   **Features**:
    *   **Animated Expansion**: Uses GSAP to smoothly animate the height and opacity of the content when expanding or collapsing. It also animates a chevron icon to indicate the current state.
    *   **Dynamic Content**: Can render either a simple string or an array of strings as a bulleted list, based on the `isList` prop.
    *   **Accessibility**: Includes `aria-expanded` attributes for screen readers.

### 8.20. `components/ProjectModalComponents/MediaGallery.tsx`

A component that displays a grid of media thumbnails (images and videos) and allows users to view them in a full-screen lightbox.

*   **Purpose**: To showcase a gallery of media related to a project within the `ProjectModal`.
*   **Features**:
    *   **Lightbox Modal**: Clicking a thumbnail opens a full-screen preview overlay. This modal is built using the reusable `Dialog` component.
    *   **Image and Video Support**: The lightbox can display both images and HTML5 videos.
    *   **Video Error Handling**: If a video fails to load, it displays a "Video unavailable" message.
    *   **Animations**: The lightbox has a fade-and-scale animation on open/close, and the thumbnails have a hover effect.

### 8.21. `components/ProjectModalComponents/TechStack.tsx`

A presentational component that displays a list of technologies used in a project.

*   **Purpose**: To display a list of technology "chips" in the `ProjectModal`.
*   **Features**:
    *   It receives an array of strings (`technologies`) as a prop.
    *   **Entrance Animation**: Uses GSAP to animate each technology chip into view with a staggered scale and fade effect.
    *   **Styling**: It uses the shared `skill-chip` class to ensure consistent styling with other parts of the application.

## 9. Shared Utilities, Types, and Constants

This section details the shared code that supports the rest of the application, including utility functions, type definitions, and constants.

### 9.1. `lib/utils.ts`

This file provides a crucial utility function for managing CSS classes.

*   **`cn(...inputs)`**: This function intelligently merges Tailwind CSS classes. It uses `clsx` to handle conditional classes and then `tailwind-merge` to resolve conflicts in the class names, ensuring a clean and predictable final class string. This is essential for creating reusable components with variants.

### 9.2. `utils/social.ts`

This file is the central hub for handling social media data.

*   **`FALLBACK_DATA`**: An exported constant containing hardcoded fallback data for each social platform. This ensures the application can always display content even if an API call fails.
*   **`createCacheHeaders()`**: A helper function used by API routes to set the `Cache-Control` headers on responses, enabling server-side caching for better performance.
*   **`fetchSocialStats()`**: A client-side data fetching function that calls the `/api/social/stats` endpoint. It implements an in-memory cache to avoid redundant API calls during a user's session.

### 9.3. `types/Project.ts`

This file defines the TypeScript types and interfaces related to a single project.

*   **`MediaItem`**: A type that defines the structure for an item in the project's media gallery (either an image or a video).
*   **`Project`**: The main interface that defines the data structure for a project, including its title, descriptions, technologies, gallery, etc. This ensures type safety wherever project data is used.

### 9.4. `types/social.ts`

This file contains all the type definitions for the social media integration features.

*   **`SocialLink`**: Defines the comprehensive structure for a social link object, including its data, presentational styles (colors, icon), and statistics.
*   **`GitHubStats` / `LinkedInStats` / `TwitterStats`**: Individual interfaces that define the shape of the data fetched from each social media API.
*   **`SocialStats`**: An aggregator interface that combines the stats from all social platforms. This is the shape of the data returned by the main `/api/social/stats` endpoint.

### 9.5. The `types/` Directory

This directory contains all the custom TypeScript type definitions and interfaces for the project. Following a refactor, each type is now in its own dedicated file for better modularity and maintainability. For example, the `Project` interface is in `types/Project.ts`, and the `Skill` interface is in `types/Skill.ts`.

### 9.6. `constants/animations.ts`

This file centralizes configurations for animations used throughout the application, primarily for the GSAP library.

*   **`ANIMATION_CONFIGS`**: An object that contains predefined animation settings for various effects like fading in, sliding in, and for specific components like the hero section and modals. This helps maintain consistency in animations across the site.
*   **`SCROLL_SETTINGS`**: An object that likely contains settings for a smooth scrolling library.

### 9.7. `constants/icons.ts`

This file centralizes SVG icon data to be used throughout the application.

*   **`ICONS`**: An object containing the raw SVG `d` attribute path data for various icons.
*   **`TYPED_ICONS`**: A typed version of the `ICONS` object.
*   **Purpose**: This approach is a performance optimization. By storing only the SVG path data instead of importing a full icon library (like `react-icons`, which is still a dependency but likely used sparingly), the client-side JavaScript bundle size is reduced. The icons can be rendered using a generic `svg` component that uses this path data.
