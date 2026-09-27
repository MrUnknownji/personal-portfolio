import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("home presents work and contact with accessible structure", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1, name: /Sandeep.*Kumar/ })).toBeVisible();
  await expect(page.getByRole("heading", { name: /Ideas made.*usable/ })).toBeVisible();
  await expect(page.getByLabel("Name")).toBeVisible();
  await expect(page.getByLabel("Email")).toBeVisible();
  await expect(page.getByLabel("Your Message...")).toBeVisible();
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations.filter((violation) => ["serious", "critical"].includes(violation.impact || ""))).toEqual([]);
});

test("desktop hero stays pinned through its opening transition", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name.includes("mobile"), "Desktop scroll transition check");
  await page.goto("/");
  await expect(page.locator(".offset-hero").locator("..")).toHaveClass(/pin-spacer/);
  await page.evaluate(() => window.scrollTo(0, 600));
  await expect.poll(() => page.locator(".offset-hero").evaluate((hero) => Math.round(hero.getBoundingClientRect().top))).toBe(72);
  await expect.poll(() => page.locator(".offset-hero").evaluate((hero) => getComputedStyle(hero.parentElement!.parentElement!).transform)).toBe("none");
});

test("timeline draws when reached from an About link", async ({ page }) => {
  await page.goto("/#about");
  await page.locator(".offset-field-path").scrollIntoViewIfNeeded();
  await expect(page.locator(".offset-field-note")).toHaveAttribute("data-visible", "true");
  await expect.poll(() => page.locator(".offset-field-path-line:visible").evaluate((line) => getComputedStyle(line).strokeDashoffset)).toBe("0px");
  await expect.poll(() => page.locator(".offset-field-path-ribbon:visible").getAttribute("d")).toMatch(/^M /);
});

test("project index filters, searches, and opens details", async ({ page }) => {
  await page.goto("/my-projects");
  await page.getByRole("button", { name: "Web App", exact: true }).click();
  await expect(page.locator(".animate-filter-grid")).toBeVisible();
  await expect(page.getByRole("button", { name: /BidStrike/ })).toBeVisible();
  await page.getByRole("button", { name: /BidStrike/ }).click();
  const dialog = page.getByRole("dialog", { name: "BidStrike" });
  await expect(dialog).toBeVisible();
  await expect(page.getByRole("button", { name: "Close project details" })).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await page.getByRole("searchbox", { name: "Search projects" }).fill("no-such-project");
  await expect(page.getByText("No matching work.")).toBeVisible();
  await page.getByRole("button", { name: /Clear filters/ }).click();
  await expect(page.getByRole("button", { name: /Mirror Wallpapers/ })).toBeVisible();
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations.filter((violation) => ["serious", "critical"].includes(violation.impact || ""))).toEqual([]);
});

test("case study keeps its project links accessible while reading", async ({ page }, testInfo) => {
  await page.goto("/my-projects/11");
  await expect(page.getByRole("heading", { level: 1, name: /Mirror Wallpapers/ })).toBeVisible();
  await expect(page.getByRole("heading", { name: "What needed solving" })).toBeVisible();
  await expect(page.getByRole("navigation", { name: /Mirror Wallpapers project links/ }).getByRole("link", { name: /Source code/ })).toBeVisible();
  await page.goto("/my-projects/10");
  const actions = page.getByRole("navigation", { name: /OmniMart project links/ });
  await expect(actions.getByRole("link", { name: /Live demo/ })).toBeVisible();
  await expect(actions.getByRole("link", { name: /Source code/ })).toBeVisible();
  await page.evaluate(() => window.scrollTo({ top: 2000, behavior: "instant" }));
  await expect.poll(() => actions.evaluate((bar) => Math.round(bar.getBoundingClientRect().top))).toBe(testInfo.project.name.includes("mobile") ? 64 : 72);
});

test("signal preview changes route on hover and keyboard focus", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name.includes("mobile"), "Pointer hover check");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const card = page.getByRole("button", { name: "Open Signal paths experiment" });
  const path = card.locator(".offset-signal-active");
  const idle = await path.getAttribute("d");
  await card.hover();
  await expect(path).not.toHaveAttribute("d", idle!);
  await page.mouse.move(0, 0);
  await expect(path).toHaveAttribute("d", idle!);
  await card.focus();
  await expect(path).not.toHaveAttribute("d", idle!);
});

test("work previews and lab studies respond to visitors", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const omni = page.locator(".showcase-omni");
  await omni.getByRole("button", { name: "Cart", exact: true }).click();
  await expect(omni.locator(".showcase-browser-top")).toContainText("Cart");
  await page.getByRole("button", { name: "Open Motion type experiment" }).click();
  const lab = page.getByRole("dialog", { name: "Motion type experiment" });
  await expect(lab).toBeVisible();
  await expect(lab.getByRole("slider", { name: "Letter spacing" })).toBeVisible();
  await lab.getByRole("slider", { name: "Letter spacing" }).fill("14");
  await page.keyboard.press("Escape");
  await expect(lab).toBeHidden();
  await page.getByRole("button", { name: "Open Signal paths experiment" }).click();
  const signal = page.getByRole("dialog", { name: "Signal paths experiment" });
  const activePath = signal.locator(".offset-signal-active");
  const directPath = await activePath.getAttribute("d");
  await signal.getByRole("button", { name: "Detour" }).click();
  await expect(activePath).not.toHaveAttribute("d", directPath!);
  await signal.getByRole("button", { name: "Loop" }).click();
  await expect(signal.getByText(/Scenic path/)).toBeVisible();
  await page.keyboard.press("Escape");
  await page.getByRole("button", { name: "Open Color study experiment" }).click();
  await page.getByRole("button", { name: "Use Sage accent" }).click();
  await page.keyboard.press("Escape");
  await page.goto("/my-projects");
  await expect.poll(() => page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue("--offset-orange").trim())).toBe("#7ba78c");
  await expect.poll(() => page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue("--portfolio-tracking").trim())).toBe("2px");
});

test("desktop work strip scrubs across its full width and preview opens its case study", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name.includes("mobile"), "Mouse interaction check");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect.poll(() => page.locator(".offset-section-index-ink > span").first().evaluate((element) => element.style.getPropertyValue("--orange-clip-top"))).not.toBe("");
  const row = page.locator(".showcase-omni");
  await row.scrollIntoViewIfNeeded();
  const bounds = await row.boundingBox();
  expect(bounds).not.toBeNull();
  await page.mouse.move(70, bounds!.y + 100);
  const idleHead = await row.locator(".showcase-head").boundingBox();
  await page.mouse.move(bounds!.x + bounds!.width / 2, bounds!.y + 100);
  await expect.poll(async () => (await row.locator(".showcase-head").boundingBox())!.x).toBeCloseTo(idleHead!.x + 32, 0);
  expect((await row.boundingBox())!.width).toBe(bounds!.width);
  await page.mouse.move(70, bounds!.y + 100);
  await expect.poll(async () => (await row.locator(".showcase-head").boundingBox())!.x).toBeCloseTo(idleHead!.x, 0);
  for (const [fraction, label] of [[0.1, "Home"], [0.35, "Product"], [0.6, "Cart"], [0.9, "Checkout"]] as const) {
    await page.mouse.move(bounds!.x + bounds!.width * fraction, bounds!.y + 100);
    await expect(row.locator(".showcase-browser-top")).toContainText(label);
  }
  await row.getByRole("link", { name: "View OmniMart case study" }).click();
  await expect(page).toHaveURL(/\/my-projects\/10$/);
});

test("desktop navigation reaches home sections from work", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name.includes("mobile"), "Desktop navigation check");
  await page.goto("/");
  await page.getByRole("navigation", { name: "Primary navigation" }).getByRole("link", { name: "Work" }).click();
  await expect(page).toHaveURL(/\/my-projects$/);
  await page.getByRole("navigation", { name: "Primary navigation" }).getByRole("link", { name: "About" }).click();
  await expect(page).toHaveURL(/\/#about$/);
  await expect(page.locator("#about")).toBeInViewport();
  await page.getByRole("navigation", { name: "Page sections" }).getByRole("link", { name: "Jump to Toolkit" }).click();
  await expect(page).toHaveURL(/\/#skills$/);
  await expect(page.locator("#skills")).toBeInViewport();
});

test("returning to the unanchored home page starts at the top", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.locator("#about").scrollIntoViewIfNeeded();
  expect(await page.evaluate(() => window.scrollY)).toBeGreaterThan(500);
  await page.goto("/my-projects");
  await page.getByRole("link", { name: "Sandeep Kumar homepage" }).click();
  await expect(page).toHaveURL(/\/$/);
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
  await page.locator("#about").scrollIntoViewIfNeeded();
  await page.goto("/my-projects");
  await page.goBack();
  await expect(page).toHaveURL(/\/$/);
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
});

test("color study preview and contact email respond on hover", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name.includes("mobile"), "Desktop hover check");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const preview = page.locator(".offset-lab-color-block");
  await page.getByRole("button", { name: "Open Color study experiment" }).hover();
  await expect.poll(() => preview.evaluate((element) => getComputedStyle(element).backgroundColor)).toBe("rgb(115, 152, 189)");
  const email = page.locator(".offset-contact-direct a");
  await email.hover();
  await expect.poll(() => email.evaluate((element) => getComputedStyle(element).color)).toBe("rgb(243, 240, 235)");
});

test("toolkit panels seat their loose screws and About labels clear the next section", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name.includes("mobile"), "Desktop panel geometry check");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/#skills");
  const panels = page.locator(".offset-toolkit-panel");
  await expect(panels).toHaveCount(4);
  const first = panels.first();
  const loose = first.locator(".offset-toolkit-screw-loose");
  expect(await first.evaluate((element) => getComputedStyle(element).transform)).not.toBe("matrix(1, 0, 0, 1, 0, 0)");
  await first.focus();
  await expect.poll(() => first.evaluate((element) => getComputedStyle(element).transform)).toBe("matrix(1, 0, 0, 1, 0, 0)");
  await expect.poll(() => loose.evaluate((element) => getComputedStyle(element).transform)).toBe("matrix(1, 0, 0, 1, 0, 0)");
  await first.blur();
  expect(await first.evaluate((element) => getComputedStyle(element).transform)).not.toBe("matrix(1, 0, 0, 1, 0, 0)");
  const clearance = await page.evaluate(() => {
    const caption = document.querySelector(".offset-field-stop-3 > div")!.getBoundingClientRect();
    const roles = document.querySelector(".offset-profile-roles")!.getBoundingClientRect();
    return roles.top - caption.bottom;
  });
  expect(clearance).toBeGreaterThan(15);
});

test("mobile menu closes on Escape and restores focus", async ({ page }, testInfo) => {
  test.skip(!testInfo.project.name.includes("mobile"), "Mobile navigation check");
  await page.goto("/");
  await page.getByRole("button", { name: "Open navigation menu" }).click();
  await expect(page.getByRole("navigation", { name: "Mobile navigation" }).getByRole("link", { name: "Work" })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("button", { name: "Open navigation menu" })).toBeFocused();
  await page.getByRole("button", { name: "Open navigation menu" }).click();
  await page.getByRole("navigation", { name: "Mobile navigation" }).getByRole("link", { name: "Work" }).click();
  await expect(page).toHaveURL(/\/my-projects$/);
});

test("all main routes fit the viewport", async ({ page }) => {
  for (const route of ["/", "/my-projects", "/my-projects/11"]) {
    await page.goto(route);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow, `${route} horizontal overflow`).toBeLessThanOrEqual(1);
  }
});

test("footer assistant opens on demand", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Ask Krypton portfolio assistant" }).click();
  await expect(page.getByRole("button", { name: "Close chat" })).toBeVisible();
  await page.getByRole("button", { name: /Summarize Sandeep/ }).click();
  await expect(page.getByRole("log", { name: "Krypton conversation" })).toContainText("full-stack developer in Punjab");
  await page.getByRole("button", { name: "Close chat" }).click();
  await expect(page.getByRole("region", { name: "Krypton portfolio assistant" })).toBeHidden();
});
