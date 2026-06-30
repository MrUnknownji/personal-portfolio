You are working in the root of an existing product repository that contains:

- a full Expo/React Native mobile application;
- an admin-control web application;
- any backend, database, authentication, or supporting services required by them.

Your task is to understand the real product, run it on the connected Android phone and in a desktop browser, create a professional screenshot set, upload the approved screenshots to Cloudinary, and add a complete project entry to my portfolio.

The portfolio repository is:

`/home/unknown/web/personal-portfolio`

Complete this end to end. Do not stop after merely drafting copy or taking a few screenshots.

## Phase 0: mandatory preflight gate

This must be your first phase. Before starting servers, installing packages, building, changing files, using ADB/scrcpy, creating demo records, taking screenshots, or uploading anything, perform only the read-only checks needed for this preflight.

1. Inspect this repository’s structure, package scripts, README files, `.env.example` files, app configuration, Expo configuration, EAS configuration, web-admin configuration, backend configuration, and deployment configuration.
2. Discover every environment variable actually referenced by code or configuration. Check `process.env`, `import.meta.env`, Expo public variables, `app.config.*`, `eas.json`, native configuration, server configuration, Docker/Compose files, and any generated environment typings.
3. Check whether the required variable names exist in this repository’s applicable `.env*` files. You may inspect variable names and whether values are non-empty, but never print, copy, log, or expose secret values.
4. Determine which variables are:
   - mandatory to start the mobile app;
   - mandatory to start the admin website;
   - mandatory for the backend/database/authentication paths needed for the showcase;
   - optional and unrelated to the showcase.
5. Cloudinary upload access is mandatory. Accept either:
   - `CLOUDINARY_URL`; or
   - `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET`; or
   - for an intentionally unsigned workflow, `CLOUDINARY_CLOUD_NAME` and `CLOUDINARY_UPLOAD_PRESET`.
6. Check the current repository and `/home/unknown/web/personal-portfolio/.env*` for those Cloudinary variable names without revealing values.
7. Verify prerequisites:
   - `adb` is installed;
   - `scrcpy` is installed;
   - exactly one intended Android device is visible as `device` in `adb devices -l`;
   - the phone is not `unauthorized`, `offline`, or ambiguous;
   - the required Node/package-manager/runtime commands exist;
   - a usable Chrome/Chromium browser exists.

If any mandatory environment variable, Cloudinary credential set, test login, service credential, device authorization, or runtime prerequisite is missing, stop immediately. Tell me:

- the exact missing variable or prerequisite;
- why it is required;
- which `.env` or local configuration file it should be added to;
- whether it belongs to the mobile app, admin app, backend, database, or Cloudinary.

Do not ask me to paste secrets into chat. Ask me to add them locally and tell you when they are ready. Do not perform partial setup or continue to another phase while the gate is blocked.

If all mandatory checks pass, give me a concise preflight result and continue automatically.

## Safety and source-of-truth rules

- Never expose secrets in terminal output, screenshots, generated files, logs, or your final response.
- Do not upload `.env` files, tokens, private keys, signing files, database exports, or source maps.
- Do not point the apps at production data unless the repository explicitly uses a safe read-only production demo. Prefer local, development, staging, or seeded demo data.
- Do not delete or destructively alter real user data. Use a clearly identified test account and reversible demo records.
- Do not invent product features, technologies, architecture, metrics, or links. Confirm them from source code and working behavior.
- Do not modify the product merely to manufacture attractive screenshots. Necessary local configuration or genuine fixes are allowed, but preserve product behavior and report any code changes.
- Preserve unrelated user changes in both repositories.
- Do not commit, push, deploy, or open a pull request unless I separately ask.

## Phase 1: understand the real project

Audit the source before writing portfolio copy.

1. Identify the mobile app, admin app, backend/services, shared packages, database, auth, storage, realtime features, notifications, payments, analytics, AI features, and deployment setup that genuinely exist.
2. Read the primary user flows and admin flows from routes, screens, components, schema/migrations, API handlers, and tests.
3. Inspect Git remotes and deployment configuration for a legitimate GitHub/source URL and live demo/admin URL. If a link cannot be confirmed, omit it rather than guessing.
4. Determine the project’s strongest differentiators, actual technical challenges, architecture, and honest tradeoffs.
5. Produce a capture matrix before taking final screenshots. It must tell one coherent story across mobile and admin rather than collecting random screens.

Unless the product itself suggests a better sequence, aim to cover:

- a strong mobile hero/home state;
- the main mobile user journey;
- one or two distinctive mobile features;
- a polished detail, management, or completion state;
- the admin dashboard overview;
- the admin’s most important management workflow;
- a detail/edit/analytics state that demonstrates real control;
- at least one pair of mobile/admin screenshots that visibly proves the two surfaces belong to one system.

## Phase 2: run and verify every required surface

Use the repository’s actual scripts and package manager. Do not assume a command merely because the app uses Expo.

1. Install dependencies only if needed and respect the existing lockfile/package manager.
2. Start the backend and supporting services in the correct order.
3. Start the admin website on an available local port.
4. Start the Expo app using the correct workflow for this repository: Expo Go, a development client, or a native Android build.
5. Use `adb reverse` for Metro/API ports when the physical phone requires it.
6. Use `scrcpy` to inspect and control the connected phone. Use ADB for deterministic checks, launching, logs, and lossless captures.
7. Confirm that both mobile and admin surfaces are functional before capture:
   - no red screens, console-breaking errors, failed requests, loading dead-ends, empty accidental states, or auth loops;
   - mobile and admin data are synchronized where the product promises synchronization;
   - test/demo data is realistic, coherent, and free of private personal information.
8. Exercise the important flows, not just the landing screens. Review relevant browser console output, network failures, Metro output, and `adb logcat` errors.

## Phase 3: capture high-quality screenshots

Create a local working directory such as:

`showcase/portfolio-capture/`

Keep raw captures, approved captures, and the final manifest separate.

### Android captures

- Use the real connected device.
- Use scrcpy for control and inspection.
- Prefer lossless device-native screenshots with:

  `adb exec-out screencap -p > <descriptive-name>.png`

- Keep the device in a consistent orientation unless landscape is an important feature.
- Remove the keyboard, transient toasts, debug overlays, developer menus, notification shade, permission prompts, and accidental system UI.
- Wait for images, fonts, data, and animations to settle.
- Do not stretch, upscale, blur, aggressively recompress, or place screenshots in fake device frames.

### Admin/browser captures

- Use a consistent desktop viewport, preferably `1440x900` or a similarly professional 16:10/16:9 viewport.
- Capture at a high device scale when supported.
- Wait for fonts, data, charts, images, and animations to settle.
- Avoid browser chrome unless it is deliberately relevant.
- Do not capture development overlays, terminal windows, broken responsive states, blank sidebars, clipped dialogs, or private credentials.
- Use full-page capture only when the whole page is genuinely useful; otherwise capture a well-composed viewport.

### Naming

Use deterministic descriptive names such as:

- `<slug>-mobile-home.png`
- `<slug>-mobile-primary-flow.png`
- `<slug>-mobile-detail.png`
- `<slug>-admin-dashboard.png`
- `<slug>-admin-management.png`
- `<slug>-admin-detail.png`

Names must describe the visible screen, not use generic names such as `Screenshot1`.

## Phase 4: visual quality review

You must inspect every capture visually before upload. Do not approve files by filename or dimensions alone.

Reject and retake any image with:

- clipping, overlap, broken spacing, odd scaling, poor composition, or unreadable text;
- loading placeholders, missing images, errors, empty accidental states, debug controls, or stale data;
- duplicate or near-duplicate coverage;
- visible secrets, tokens, private email addresses, phone numbers, personal notifications, or unrelated user data;
- an unclear purpose that another screenshot already communicates better.

Then review the approved set as a sequence. The combined gallery must make the project understandable without narration:

1. The cover immediately establishes the product.
2. Mobile screenshots explain the user experience.
3. Admin screenshots explain control and operations.
4. The sequence demonstrates breadth without repetition.
5. Both surfaces use consistent, believable demo data.
6. Portrait and landscape images are ordered intentionally.

Prefer a focused final set of approximately 8–14 excellent images over a large repetitive dump. Use a strong landscape admin/product overview as the portfolio cover when a portrait phone screenshot would crop poorly in the project card.

Do not upload rejected captures.

## Phase 5: upload approved media to Cloudinary

Upload only the approved original PNG files. Use a dedicated folder:

`portfolio/projects/<project-slug>/`

Use stable descriptive public IDs derived from the filenames. Do not overwrite unrelated assets. Preserve the original high-resolution images; the portfolio’s Next.js image pipeline can generate delivery variants.

For every upload:

1. Record the returned `secure_url`, `public_id`, format, width, height, and byte size.
2. Verify the secure URL returns successfully.
3. Verify the served image has the expected dimensions and content.
4. Create `showcase/portfolio-capture/cloudinary-manifest.json` containing only non-secret upload metadata.
5. Keep the ordered approved gallery list explicit in the manifest.

If any upload fails or produces the wrong asset, fix it before editing the portfolio.

## Phase 6: create the portfolio project entry

Before editing, inspect the current files in `/home/unknown/web/personal-portfolio` because its schema may have evolved.

At the time this prompt was created, the portfolio’s project source of truth is code, not MongoDB:

- project type: `types/Project.ts`;
- complete records: `data/data.tsx`;
- selected/featured ordering: `selectedProjectIds` in `data/data.tsx`;
- lightweight bot command metadata: `data/bot-projects.ts`;
- MongoDB is used for contact-form submissions, not project records.

Do not insert this project into MongoDB unless the current portfolio code has genuinely changed to use a project database.

Create a complete project object matching the current `Project` interface. It should include the current equivalents of:

```ts
{
  id: number,
  title: string,
  shortDescription: string,
  longDescription: string,
  image: string,
  technologies: string[],
  features: string[],
  demoLink?: string,
  githubLink?: string,
  category: string,
  gallery: Array<{
    type: "image" | "video",
    src: string,
    alt?: string,
  }>,
  featured?: boolean,
  caseStudy?: {
    problem: string,
    solution: string,
    architecture: string[],
    tradeoffs: string[],
  },
}
```

Requirements:

- choose the next unused numeric ID;
- write concise, specific copy grounded in verified product behavior;
- make `shortDescription` work well on a project card;
- make `longDescription` explain the whole product;
- list only technologies confirmed in source;
- write feature bullets around user value and real capability;
- use the strongest approved Cloudinary URL as `image`;
- use all and only approved Cloudinary URLs in `gallery`;
- give every gallery item a useful, accessible alt description;
- order the gallery according to the reviewed story;
- include honest problem, solution, architecture, and tradeoff notes;
- add the project to `selectedProjectIds` as featured unless I explicitly say it should be archived;
- if it is featured, update `data/bot-projects.ts` with matching lightweight command metadata so Krypton can open it without importing the full gallery dataset.

Also create a portable copy of the final object in:

`showcase/portfolio-capture/project-entry.ts`

## Phase 7: portfolio integration and final verification

1. Apply the project entry and Cloudinary URLs to `/home/unknown/web/personal-portfolio`.
2. Run the portfolio’s typecheck, lint, and production build using its existing scripts/toolchain.
3. Run the production portfolio locally.
4. Open the Projects page and verify:
   - the new card appears in the intended order;
   - the cover is composed well at desktop and mobile card sizes;
   - search and category filtering find it;
   - the project modal opens;
   - all text, features, architecture, tradeoffs, links, and technology chips are correct;
   - every gallery image loads;
   - thumbnails and full previews handle portrait and landscape images correctly;
   - there is no clipping, overlap, layout shift, broken image, or visual regression.
5. Visually inspect the final portfolio card and modal. If the screenshots do not work well together inside the actual portfolio, revise the selection/order and repeat verification.
6. Verify the project’s bot metadata is synchronized when featured.

## Required final deliverables

Do not declare completion until all applicable items exist and pass:

- approved raw screenshot set;
- `cloudinary-manifest.json`;
- all Cloudinary URLs verified;
- `project-entry.ts`;
- integrated portfolio project record;
- featured ordering and bot metadata updated when applicable;
- target app/admin verification completed;
- portfolio typecheck, lint, and production build passing;
- final visual review of the mobile app, admin portal, portfolio card, modal, and complete gallery.

In your final response, provide:

- the project title and one-sentence positioning;
- which app/admin flows you verified;
- the approved screenshot list in gallery order;
- the Cloudinary folder and non-secret public IDs;
- the portfolio files changed;
- validation commands and results;
- any genuine limitations or omitted links;
- a clear statement that the complete screenshot set was reviewed together inside the portfolio.
