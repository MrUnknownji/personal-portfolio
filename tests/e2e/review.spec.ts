import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

// The Lumen Draft redesign under /review: separate from the live site and not indexed.

test("review home is accessible, unindexed, and separate from the live site", async ({ page }) => {
  await page.goto("/review");
  await expect(page.getByRole("heading", { level: 1, name: "Sandeep Kumar" })).toBeVisible();
  await expect(page.locator(".ld-tblock").first()).toContainText("Programmer / Developer at TCS");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  await expect(page.locator(".print-header")).toHaveCount(0);
  await expect(page.locator(".ld-sheet")).toHaveCount(4);
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations.map((violation) => violation.id)).toEqual([]);
});

test("review pages render inside the review shell", async ({ page }) => {
  test.setTimeout(90_000);
  for (const path of [
    "/review/my-projects",
    "/review/my-projects/9",
    "/review/quick",
    "/review/motion",
  ]) {
    await page.goto(path);
    await expect(page.locator(".ld-top")).toBeVisible();
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations.map((violation) => `${path}: ${violation.id}`)).toEqual([]);
  }
  const missing = await page.goto("/review/not-a-sheet");
  expect(missing?.status()).toBe(404);
  await expect(page.getByRole("heading", { name: /isn.t in the set/ })).toBeVisible();
});

test("holding a project sheet explodes it into layers without opening it", async ({ page }) => {
  await page.goto("/review");
  const sheet = page.locator(".ld-sheet").first();
  await sheet.scrollIntoViewIfNeeded();
  const box = (await sheet.locator(".ld-sheet-copy p").boundingBox())!;
  await page.mouse.move(box.x + 20, box.y + 10);
  await page.mouse.down();
  await expect(sheet).toHaveClass(/is-exploded/, { timeout: 2000 });
  await expect(sheet.locator(".ld-dim-w b")).toHaveText(/^\d+ px$/);
  await expect(sheet.locator(".ld-callout")).toHaveCount(5);
  await page.mouse.up();
  await expect(sheet).not.toHaveClass(/is-exploded/);
  await expect(page).toHaveURL(/\/review$/);
});

test("keyboard: hold Space to inspect, arrows move a storyboard beat", async ({ page }) => {
  await page.goto("/review");
  const beat = page.locator(".ld-tile").first();
  await expect(beat).toHaveAccessibleName(/Hook.*cell A1/);
  await beat.scrollIntoViewIfNeeded();
  await beat.focus();
  await page.keyboard.down(" ");
  await expect(beat).toHaveClass(/is-exploded/, { timeout: 2000 });
  await page.keyboard.up(" ");
  await expect(beat).not.toHaveClass(/is-exploded/);
  await page.keyboard.press("ArrowRight");
  await expect(beat).toHaveAccessibleName(/Hook.*cell B1/);
  await expect(page.locator(".ld-readout")).toContainText("Hook landed on B1");
});

test("the light orbits on the compositor and pauses from the dock", async ({ page }) => {
  await page.goto("/review");
  const running = () =>
    page.evaluate(() =>
      document
        .getAnimations()
        .filter((animation) => (animation as CSSAnimation).animationName === undefined)
        .map((animation) => animation.playState),
    );
  await expect
    .poll(async () => (await running()).filter((s) => s === "running").length)
    .toBeGreaterThan(10);
  await page.getByRole("button", { name: "Pause the light" }).click();
  await expect.poll(async () => (await running()).filter((s) => s === "running").length).toBe(0);
  await expect(page.getByRole("button", { name: "Resume the light" })).toBeVisible();
});

test("reduced motion keeps the light still", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/review");
  await expect(page.getByRole("button", { name: "Resume the light" })).toBeVisible();
});

test("night draft persists across pages", async ({ page }) => {
  await page.goto("/review");
  await page.getByRole("switch", { name: "Night" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-ld-theme", "dark");
  await page.goto("/review/quick");
  await expect(page.locator("html")).toHaveAttribute("data-ld-theme", "dark");
  await expect(page.getByRole("switch", { name: "Night" })).toHaveAttribute("aria-checked", "true");
});

test("the note form validates before sending", async ({ page }) => {
  await page.goto("/review#contact");
  await page.getByRole("button", { name: "Send note" }).click();
  await expect(page.locator("#ld-contact-name")).toHaveAttribute("aria-invalid", "true");
  await expect(page.locator("#ld-contact-name")).toBeFocused();
});

test("robots.txt keeps crawlers out of the review", async ({ request }) => {
  const robots = await (await request.get("/robots.txt")).text();
  expect(robots).toContain("Disallow: /review");
});
