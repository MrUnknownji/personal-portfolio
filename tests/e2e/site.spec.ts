import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("home is accessible, indexable and ships the site's look", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1, name: "Sandeep Kumar" })).toBeVisible();
  await expect(page.locator(".ld-tblock").first()).toContainText("Programmer / Developer at TCS");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /index, follow/);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    /^https?:\/\/[^/]+\/?$/,
  );
  await expect(page.locator(".ld-sheet")).toHaveCount(4);
  const html = page.locator("html");
  await expect(html).toHaveAttribute("data-ldt-surface", "flat");
  await expect(html).toHaveAttribute("data-ldt-lines", "ruled");
  await expect(html).toHaveAttribute("data-ldt-cursor", "dot");
  await expect(html).toHaveAttribute("style", /--ldt-accent:\s*#7fe3b4/);
  const data = JSON.parse(
    (await page.locator('script[type="application/ld+json"]').first().textContent())!,
  );
  expect(data["@graph"].map((node: { "@type": string }) => node["@type"])).toEqual([
    "WebSite",
    "Person",
  ]);
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations.map((violation) => violation.id)).toEqual([]);
});

test("every page renders in the site shell with its own canonical address", async ({ page }) => {
  test.setTimeout(90_000);
  for (const path of ["/my-projects", "/my-projects/9", "/quick", "/motion"]) {
    await page.goto(path);
    await expect(page.locator(".ld-top")).toBeVisible();
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      new RegExp(`${path.replace(/\//g, "\\/")}$`),
    );
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations.map((violation) => `${path}: ${violation.id}`)).toEqual([]);
  }
  const missing = await page.goto("/not-a-sheet");
  expect(missing?.status()).toBe(404);
  await expect(page.getByRole("heading", { name: /isn.t in the set/ })).toBeVisible();
});

test("old review addresses redirect to the same page at the root", async ({ page }) => {
  await page.goto("/review/quick");
  await expect(page).toHaveURL(/\/quick$/);
  await page.goto("/review");
  await expect(page).toHaveURL(/\/$/);
});

test("project sheets have no hold-to-inspect layer", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("[data-ld-inspect], [data-ld-layer], #ld-holdring")).toHaveCount(0);
});

test("lab cards open in place and close again", async ({ page }) => {
  await page.goto("/");
  const grid = page.getByRole("button", { name: "A storyboard grid" });
  const race = page.getByRole("button", { name: "Two bids, one price" });
  await grid.scrollIntoViewIfNeeded();
  await expect(page.locator(".ld-tile")).toHaveCount(0);
  await grid.click();
  await expect(grid).toHaveAttribute("aria-expanded", "true");
  await expect(page.locator(".ld-tile")).toHaveCount(6);
  await race.click();
  await expect(grid).toHaveAttribute("aria-expanded", "false");
  await expect(page.locator(".ld-tile")).toHaveCount(0);
  await expect(page.getByRole("radiogroup", { name: "Bidder A's network" })).toBeVisible();
  await race.click();
  await expect(race).toHaveAttribute("aria-expanded", "false");
});

test("a dragged beat lands on a free cell even while the readout updates", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "A storyboard grid" }).click();
  // Pointer input goes to the view transition's overlay until the morph finishes.
  await expect(page.locator("html")).not.toHaveClass(/ld-vt-lab/);
  const beat = page.locator(".ld-tile").nth(5);
  await beat.scrollIntoViewIfNeeded();
  await expect(beat).toHaveAccessibleName(/Outro.*cell D2/);
  const box = (await beat.boundingBox())!;
  await page.mouse.move(box.x + 30, box.y + 30);
  await page.mouse.down();
  for (let step = 1; step <= 12; step++) {
    await page.mouse.move(box.x + 30 - step * 12, box.y + 30);
  }
  await page.mouse.up();
  await expect(page.locator(".ld-readout")).toContainText(/Outro landed on [A-Z]\d/);
  await expect(beat).not.toHaveClass(/is-dragging/);
  await expect(beat).not.toHaveAccessibleName(/cell D2/);
});

test("dragging a beat never selects its text", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "A storyboard grid" }).click();
  await expect(page.locator("html")).not.toHaveClass(/ld-vt-lab/);
  const beat = page.locator(".ld-tile").nth(5);
  await beat.scrollIntoViewIfNeeded();
  await expect(beat).toHaveCSS("user-select", "none");
  await beat.dblclick();
  expect(await page.evaluate(() => window.getSelection()?.toString() ?? "")).toBe("");
});

test("two bids: signal bars set the network and a run ends with a verdict", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.getByRole("button", { name: "Two bids, one price" }).click();
  const bars = page.getByRole("radiogroup", { name: "Bidder B's network" });
  await expect(bars.getByRole("radio", { checked: true })).toHaveAccessibleName(/3G, 300 ms/);
  await bars.getByRole("radio", { checked: true }).focus();
  await page.keyboard.press("ArrowRight");
  await expect(bars.getByRole("radio", { checked: true })).toHaveAccessibleName(/4G, 120 ms/);
  await page.getByRole("button", { name: /Both bid/ }).click();
  await expect(page.locator(".ld-rl-verdict")).toContainText("lost update");
  await page.getByRole("radio", { name: "Authority + IDs" }).click();
  await page.getByRole("button", { name: /Both bid/ }).click();
  await expect(page.locator(".ld-rl-verdict")).toContainText("exactly once");
  const results = await new AxeBuilder({ page }).include(".ld-rl").analyze();
  expect(results.violations.map((violation) => violation.id)).toEqual([]);
});

test("keyboard: arrows move a storyboard beat", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "A storyboard grid" }).click();
  const beat = page.locator(".ld-tile").first();
  await expect(beat).toHaveAccessibleName(/Hook.*cell A1/);
  await beat.scrollIntoViewIfNeeded();
  await beat.focus();
  await page.keyboard.press("ArrowRight");
  await expect(beat).toHaveAccessibleName(/Hook.*cell B1/);
  await expect(page.locator(".ld-readout")).toContainText("Hook landed on B1");
});

test("nothing moves on its own: the only time-based animations are ones the visitor started", async ({
  page,
}) => {
  await page.goto("/");
  await page.waitForTimeout(1500);
  const timeBased = await page.evaluate(
    () =>
      document
        .getAnimations()
        .filter((animation) => animation.timeline === document.timeline)
        .filter((animation) => animation.playState === "running").length,
  );
  expect(timeBased).toBe(0);
});

test("the header keeps the résumé and the night switch, and makes no sound", async ({ page }) => {
  await page.goto("/");
  const header = page.locator(".ld-top");
  await expect(header.getByRole("link", { name: /Résumé/ })).toBeVisible();
  await expect(header.getByRole("switch", { name: "Night" })).toBeVisible();
  await expect(header.getByRole("switch", { name: "Sound" })).toHaveCount(0);
});

test("night draft persists across pages", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("switch", { name: "Night" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-ld-theme", "dark");
  await page.goto("/quick");
  await expect(page.locator("html")).toHaveAttribute("data-ld-theme", "dark");
  await expect(page.getByRole("switch", { name: "Night" })).toHaveAttribute("aria-checked", "true");
});

test("the note form validates before sending", async ({ page }) => {
  await page.goto("/#contact");
  await page.getByRole("button", { name: "Send note" }).click();
  await expect(page.locator("#ld-contact-name")).toHaveAttribute("aria-invalid", "true");
  await expect(page.locator("#ld-contact-name")).toBeFocused();
});

test("robots.txt and the sitemap open the site to crawlers", async ({ request }) => {
  const robots = await (await request.get("/robots.txt")).text();
  expect(robots).toContain("Allow: /");
  expect(robots).toContain("Disallow: /api/");
  expect(robots).not.toContain("/review");
  const sitemap = await (await request.get("/sitemap.xml")).text();
  for (const path of ["/my-projects", "/quick", "/motion", "/my-projects/9"])
    expect(sitemap).toContain(`${path}</loc>`);
});

test("pages send security headers", async ({ request }) => {
  const response = await request.get("/");
  const headers = response.headers();
  expect(headers["content-security-policy"]).toContain("frame-ancestors 'none'");
  expect(headers["x-content-type-options"]).toBe("nosniff");
  expect(headers["referrer-policy"]).toBe("strict-origin-when-cross-origin");
  expect(headers["x-powered-by"]).toBeUndefined();
});

test("the tweak panel loads on demand and its colour picker stays on screen", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("#ldt-panel")).toHaveCount(0);
  await page.getByRole("button", { name: /Tweaks/ }).click();
  const panel = page.getByRole("complementary", { name: "Tweaks and toys" });
  await expect(panel).toBeVisible();
  await page.getByRole("button", { name: "Any colour" }).click();
  const picker = page.locator(".ldt-picker");
  await expect(picker).toBeInViewport({ ratio: 0.98 });
  await page.getByRole("textbox", { name: "Hex colour" }).fill("#ff9a7d");
  await expect(page.locator("html")).toHaveAttribute("style", /--ldt-accent:\s*#ff9a7d/);
  await page.getByRole("button", { name: "Reset all" }).click();
  await expect(page.locator("html")).toHaveAttribute("style", /--ldt-accent:\s*#7fe3b4/);
});

test("toys put the page back exactly", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name.includes("mobile"), "Desktop toy check");
  await page.goto("/");
  for (const toy of ["gravity", "snap", "burn", "party"]) {
    await page.getByRole("button", { name: /Tweaks/ }).click();
    await page.locator(`[data-toy="${toy}"]`).click();
    const back = page.getByRole("button", { name: /Put it back|Stop the party/ });
    await expect(back).toBeVisible();
    await back.click();
    await expect(page.locator(".ldp-stage, .ldp-canvas, .ldp-caption, .ldp-dusting")).toHaveCount(
      0,
    );
    expect(
      await page.evaluate(
        () =>
          [...document.querySelectorAll<HTMLElement>("#ld-main *")].filter(
            (el) => el.style.visibility === "hidden",
          ).length,
      ),
    ).toBe(0);
    await expect(page.locator("html")).toHaveAttribute("style", /--ldt-accent:\s*#7fe3b4/);
  }
});
