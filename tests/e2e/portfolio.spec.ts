import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("home renders essential content and labelled contact fields", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");

  await expect(page.getByRole("heading", { level: 1, name: "Sandeep Kumar" })).toBeVisible();
  await expect(page.getByLabel("Name")).toBeVisible();
  await expect(page.getByLabel("Email")).toBeVisible();
  await expect(page.getByLabel("Your Message...")).toBeVisible();

  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations.filter((violation) => ["serious", "critical"].includes(violation.impact || ""))).toEqual([]);
});

test("project dialog manages focus and limits initial gallery content", async ({ page }) => {
  await page.goto("/my-projects");
  const projectButton = page.getByRole("button", { name: /Mirror Wallpapers/ });
  await projectButton.click();

  const dialog = page.getByRole("dialog", { name: "Mirror Wallpapers" });
  await expect(dialog).toBeVisible();
  await expect(page.getByRole("button", { name: "Close project details" })).toBeFocused();
  await expect(dialog.getByRole("button", { name: /Show \d+ more/ })).toBeVisible();

  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(projectButton).toBeFocused();
});

test("project actions keep a consistent height", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name.includes("mobile"), "Desktop action row check");
  await page.goto("/my-projects");
  await page.getByRole("button", { name: /BidStrike/ }).click();

  const dialog = page.getByRole("dialog", { name: "BidStrike" });
  const actions = [
    dialog.getByRole("link", { name: "Full Case Study" }),
    dialog.getByRole("link", { name: "Live Demo" }),
    dialog.getByRole("link", { name: "Source Code" }),
  ];
  await Promise.all(actions.map((action) => expect(action).toBeVisible()));

  const heights = await Promise.all(
    actions.map(async (action) => (await action.boundingBox())?.height),
  );
  expect(new Set(heights).size).toBe(1);
});

test("project navigation lands on home page sections", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name.includes("mobile"), "Desktop primary navigation check");

  for (const destination of ["About", "Skills"] as const) {
    await page.goto("/my-projects");
    await page
      .getByRole("navigation", { name: "Primary navigation" })
      .getByRole("link", { name: destination, exact: true })
      .click();

    const sectionId = destination.toLowerCase();
    await expect(page).toHaveURL(new RegExp(`/#${sectionId}$`));
    await expect
      .poll(() =>
        page.locator(`#${sectionId}`).evaluate((element) =>
          Math.round(element.getBoundingClientRect().top),
        ),
      )
      .toBeLessThan(140);
  }

  await page.goto("/my-projects");
  await page.getByRole("button", { name: "Contact Me" }).click();
  await expect(page).toHaveURL(/\/#contact$/);
  await expect
    .poll(() =>
      page.locator("#contact").evaluate((element) =>
        Math.round(element.getBoundingClientRect().top),
      ),
    )
    .toBeLessThan(140);
});

test("project filters animate only after interaction", async ({ page }) => {
  await page.goto("/my-projects");
  await page.getByRole("button", { name: "Web App", exact: true }).click();

  const animationName = await page
    .locator(".animate-filter-grid")
    .evaluate((element) => getComputedStyle(element).animationName);
  expect(animationName).toContain("filter-grid-in");
});

test("social cards preserve the original layout and choose a visible side", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name.includes("mobile"), "Desktop hover-card geometry check");
  await page.route("**/api/social/stats", async (route) => {
    await route.fulfill({
      contentType: "application/json",
      body: JSON.stringify({
        profiles: {
          github: {
            username: "MrUnknownji",
            profileImage: null,
            status: "live",
            stats: [
              { label: "Repos", value: 47 },
              { label: "Followers", value: 12 },
              { label: "Stars", value: 86 },
            ],
          },
          linkedin: {
            username: null,
            profileImage: null,
            status: "unavailable",
            stats: [
              { label: "Connections", value: null },
              { label: "Posts", value: null },
              { label: "Impressions", value: null },
            ],
          },
          twitter: {
            username: null,
            profileImage: null,
            status: "unavailable",
            stats: [
              { label: "Followers", value: null },
              { label: "Posts", value: null },
              { label: "Following", value: null },
            ],
          },
        },
        fetchedAt: new Date().toISOString(),
      }),
    });
  });
  await page.goto("/");

  const github = page.getByRole("link", { name: /Open GitHub/ });
  await github.hover();
  const cardText = page.getByText("Check out my open source projects");
  await expect(cardText).toBeVisible();
  await expect(page.getByText("47", { exact: true })).toBeVisible();

  const aboveButton = await github.boundingBox();
  const aboveCard = await cardText.locator("xpath=../../..").boundingBox();
  expect((aboveCard?.y ?? 0) + (aboveCard?.height ?? 0)).toBeLessThanOrEqual(
    aboveButton?.y ?? 0,
  );

  await page.mouse.move(800, 100);
  await page.evaluate(() => window.scrollTo(0, 500));
  await github.hover();
  const belowButton = await github.boundingBox();
  const belowCard = await cardText.locator("xpath=../../..").boundingBox();
  expect(belowCard?.y).toBeGreaterThanOrEqual(
    (belowButton?.y ?? 0) + (belowButton?.height ?? 0),
  );
});

test("about portrait stays pinned and timeline dots remain centered", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name.includes("mobile"), "Desktop sticky layout check");
  await page.goto("/");
  await page
    .locator('canvas[data-spark-ready="true"]')
    .waitFor({ state: "attached" });

  await page.locator("#about > div.relative.grid").evaluate((grid) => {
    document.documentElement.style.setProperty("scroll-behavior", "auto", "important");
    grid.scrollIntoView({ behavior: "instant" as ScrollBehavior, block: "start" });
  });
  await page.waitForTimeout(50);
  const firstTop = await page
    .locator('img[alt="Portrait of Sandeep Kumar"]')
    .evaluate((portrait) => portrait.getBoundingClientRect().top);
  await page.evaluate(() => {
    window.scrollBy(0, 180);
  });
  await page.waitForTimeout(50);
  const secondTop = await page
    .locator('img[alt="Portrait of Sandeep Kumar"]')
    .evaluate((portrait) => portrait.getBoundingClientRect().top);
  expect(Math.abs((firstTop ?? 0) - (secondTop ?? 0))).toBeLessThan(2);

  const alignment = await page.evaluate(() => {
    const line = document.querySelector<HTMLElement>("#about .absolute.bottom-2");
    const dots = document.querySelectorAll<HTMLElement>("#about .absolute.z-20.flex.size-5");
    const lineRect = line?.getBoundingClientRect();
    const lineCenter = lineRect ? lineRect.left + lineRect.width / 2 : 0;
    return [...dots].map((dot) => {
      const rect = dot.getBoundingClientRect();
      return Math.abs(rect.left + rect.width / 2 - lineCenter);
    });
  });
  expect(Math.max(...alignment)).toBeLessThan(1);
});

test("assistant recenters after closing and keeps its hint onscreen", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name.includes("mobile"), "Explicit narrow viewport regression check");
  await page.goto("/");
  await page.getByRole("button", { name: "Open Krypton portfolio assistant" }).click();
  await page.getByRole("button", { name: "Close chat" }).click();
  const launcher = page.getByRole("button", { name: "Open Krypton assistant" });
  await expect(launcher).toBeVisible({ timeout: 3_000 });

  await page.setViewportSize({ width: 285, height: 800 });
  await launcher.hover();
  const hint = page.getByRole("status");
  await expect(hint).toContainText("Click me to chat.");

  const geometry = await page.evaluate(() => {
    const button = document.querySelector<HTMLElement>('button[aria-label="Open Krypton assistant"]');
    const image = document.querySelector<HTMLElement>('img[src*="bot-mark.svg"]');
    const bubble = document.querySelector<HTMLElement>('[role="status"]');
    if (!button || !image || !bubble) return null;
    const buttonRect = button.getBoundingClientRect();
    const imageRect = image.getBoundingClientRect();
    const bubbleRect = bubble.getBoundingClientRect();
    return {
      centerDelta: Math.abs(
        buttonRect.left + buttonRect.width / 2 -
          (imageRect.left + imageRect.width / 2),
      ),
      bubbleLeft: bubbleRect.left,
      bubbleRight: bubbleRect.right,
      viewportWidth: window.innerWidth,
    };
  });
  expect(geometry?.centerDelta).toBeLessThan(1);
  expect(geometry?.bubbleLeft).toBeGreaterThanOrEqual(0);
  expect(geometry?.bubbleRight).toBeLessThanOrEqual(geometry?.viewportWidth ?? 0);
});

test("clicks render the restored spark canvas", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name.includes("mobile"), "Mouse-only decorative effect");
  await page.goto("/");
  await page
    .locator('canvas[data-spark-ready="true"]')
    .waitFor({ state: "attached" });
  await page.getByRole("heading", { level: 1, name: "Sandeep Kumar" }).click();
  await expect
    .poll(async () =>
      Number(
        await page
          .locator('canvas[aria-hidden="true"]')
          .getAttribute("data-spark-bursts"),
      ),
    )
    .toBeGreaterThan(0);
});

test("mobile navigation removes closed links from the tab order", async ({ page }, testInfo) => {
  test.skip(!testInfo.project.name.includes("mobile"), "Mobile-only behavior");
  await page.goto("/");

  const menuButton = page.getByRole("button", { name: "Open navigation menu" });
  await menuButton.click();
  await expect(page.getByRole("navigation", { name: "Mobile navigation" }).getByRole("link", { name: "Projects" })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("button", { name: "Open navigation menu" })).toBeFocused();
});
