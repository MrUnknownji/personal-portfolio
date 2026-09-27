import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("home presents work and contact with accessible structure", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1, name: /Sandeep.*Kumar/ })).toBeVisible();
  await expect(page.getByRole("heading", { name: /Work that.*holds up/ })).toBeVisible();
  await expect(page.locator(".showcase-row").first()).toHaveClass(/showcase-bid/);
  await expect(page.getByRole("navigation", { name: "Portfolio view" }).getByRole("link", { name: "Quick profile" })).toHaveAttribute("href", "/quick");
  await expect(page.getByRole("link", { name: /Request full résumé/ })).toHaveAttribute("href", /mailto:/);
  await expect(page.locator(".print-header-time")).toHaveCount(0);
  await expect(page.getByLabel("Name")).toBeVisible();
  await expect(page.getByLabel("Email")).toBeVisible();
  await expect(page.getByLabel("Your Message...")).toBeVisible();
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations.filter((violation) => ["serious", "critical"].includes(violation.impact || ""))).toEqual([]);
});

test("hero moves directly into selected work", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name.includes("mobile"), "Desktop composition check");
  await page.goto("/");
  await expect(page.locator(".offset-hero").locator("..")).not.toHaveClass(/pin-spacer/);
  await expect(page.getByRole("link", { name: "See the work" })).toHaveAttribute("href", "#work");
  await expect(page.locator(".offset-intro-stage")).toHaveCount(0);
});

test("desktop file details stay aligned without covering the portrait", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name.includes("mobile"), "Desktop composition check");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/", { waitUntil: "networkidle" });
  const details = await page.evaluate(() => {
    const rect = (selector: string) => document.querySelector(selector)!.getBoundingClientRect();
    const firstStage = document.querySelector(".build-map-stage")!;
    const line = getComputedStyle(firstStage, "::before");
    const stop = document.querySelector(".offset-field-stop-1")!;
    const connector = getComputedStyle(stop, "::after");
    const secondStop = document.querySelector(".offset-field-stop-2")!;
    const secondConnector = getComputedStyle(secondStop, "::after");
    const portrait = rect(".offset-hero-portrait");
    return {
      lineStart: firstStage.getBoundingClientRect().left + Number.parseFloat(line.left),
      lineEnd: firstStage.getBoundingClientRect().left + Number.parseFloat(line.left) + Number.parseFloat(line.width),
      firstNode: rect(".build-map-stage-index").left + 16,
      secondNode: rect(".build-map-stage:nth-child(2) .build-map-stage-index").left + 16,
      connectorEnd: stop.getBoundingClientRect().top + Number.parseFloat(connector.top) + Number.parseFloat(connector.height),
      cardTop: rect(".offset-field-stop-1 > div").top,
      secondConnectorEnd: secondStop.getBoundingClientRect().top + Number.parseFloat(secondConnector.top) + Number.parseFloat(secondConnector.height),
      secondCardTop: rect(".offset-field-stop-2 > div").top,
      triggerRight: rect(".offset-wireframe-trigger").right,
      portraitLeft: portrait.left,
      leftNote: rect(".offset-portrait-annotations span:nth-child(2)").left,
      rightNote: rect(".offset-portrait-annotations span:nth-child(1)").left,
      portraitWidth: portrait.width,
    };
  });
  expect(Math.abs(details.lineStart - details.firstNode)).toBeLessThan(2);
  expect(Math.abs(details.lineEnd - details.secondNode)).toBeLessThan(2);
  expect(details.connectorEnd).toBeGreaterThanOrEqual(details.cardTop);
  expect(details.connectorEnd - details.cardTop).toBeLessThan(12);
  expect(details.secondConnectorEnd - details.secondCardTop).toBeGreaterThanOrEqual(0);
  expect(details.secondConnectorEnd - details.secondCardTop).toBeLessThan(3);
  expect(details.triggerRight).toBeLessThan(details.portraitLeft);
  expect(details.leftNote).toBeGreaterThanOrEqual(details.portraitLeft);
  expect(details.rightNote).toBeGreaterThan(details.portraitLeft + details.portraitWidth * .7);
});

test("timeline draws when reached from an About link", async ({ page }) => {
  await page.goto("/#about");
  await page.locator(".offset-field-path").scrollIntoViewIfNeeded();
  await expect(page.locator(".offset-field-note")).toHaveAttribute("data-visible", "true");
  await expect.poll(() => page.locator(".offset-field-path-line:visible").evaluate((line) => getComputedStyle(line).strokeDashoffset)).toBe("0px");
  await expect.poll(() => page.locator(".offset-field-path-ribbon:visible").getAttribute("d")).toMatch(/^M /);
});

test("project index filters, searches, and opens the full case study", async ({ page }) => {
  await page.goto("/my-projects");
  await page.getByRole("button", { name: "Web App", exact: true }).click();
  await expect(page.getByRole("link", { name: /BidStrike/ })).toBeVisible();
  await page.getByRole("link", { name: /BidStrike/ }).click();
  await expect(page).toHaveURL(/\/my-projects\/9$/);
  await expect(page.getByRole("heading", { level: 1, name: /BidStrike/ })).toBeVisible();
  await page.goBack();
  await page.getByRole("searchbox", { name: "Search projects" }).fill("no-such-project");
  await expect(page.getByText("No matching work.")).toBeVisible();
  await page.getByRole("button", { name: /Clear filters/ }).click();
  await expect(page.getByRole("link", { name: /Mirror Wallpapers/ })).toBeVisible();
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations.filter((violation) => ["serious", "critical"].includes(violation.impact || ""))).toEqual([]);
});

test("case study keeps its project links accessible while reading", async ({ page }, testInfo) => {
  await page.goto("/my-projects/11");
  await expect(page.getByRole("heading", { level: 1, name: /Mirror Wallpapers/ })).toBeVisible();
  await expect(page.getByRole("heading", { name: "What needed solving" })).toBeVisible();
  await expect(page.getByRole("navigation", { name: /Mirror Wallpapers project links/ }).getByRole("link", { name: /Source code/ })).toBeVisible();
  await expect(page.locator(".study-gallery figure")).toHaveCount(5);
  await expect(page.locator(".study-gallery figure").nth(0)).toContainText("lock screen");
  await expect(page.locator(".study-gallery figure").nth(1)).toContainText("home screen");
  await expect(page.getByRole("link", { name: /Open OmniMart case study/ })).toHaveAttribute("href", "/my-projects/10");
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
  await page.goto("/#lab");
  const card = page.getByRole("button", { name: "Open Signal paths experiment" });
  await expect(page.locator("#lab")).toBeInViewport();
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
  await page.goto("/", { waitUntil: "networkidle" });
  const omni = page.locator(".showcase-omni");
  await page.locator("#work").evaluate((section) => section.scrollIntoView({ behavior: "instant", block: "start" }));
  await expect(page.locator("#work")).toBeInViewport();
  await omni.getByRole("button", { name: "Cart", exact: true }).click();
  await expect(omni.locator(".showcase-browser-top")).toContainText("Cart");
  await page.goto("/", { waitUntil: "networkidle" });
  await page.locator("#lab").evaluate((section) => section.scrollIntoView({ behavior: "instant", block: "start" }));
  await expect(page.locator("#lab")).toBeInViewport();
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
  await signal.getByRole("button", { name: /Place sample bid/ }).click();
  await expect(signal.getByRole("status")).toContainText("Both views show the updated price");
  await expect(signal.locator(".lab-bid-states")).toContainText("₹4,300");
  await page.keyboard.press("Escape");
  await expect(signal).toBeHidden();
  await page.getByRole("button", { name: "Open Color study experiment" }).click();
  await page.getByRole("button", { name: "Use Sage accent" }).click();
  await page.keyboard.press("Escape");
  await page.goto("/my-projects");
  await expect.poll(() => page.evaluate(() => document.documentElement.style.getPropertyValue("--offset-orange").trim())).toBe("#7ba78c");
  await expect.poll(() => page.evaluate(() => Number.parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--portfolio-tracking")))).toBeLessThan(1);
  await page.goto("/", { waitUntil: "networkidle" });
  await page.locator("#lab").evaluate((section) => section.scrollIntoView({ behavior: "instant", block: "start" }));
  await expect(page.locator("#lab")).toBeInViewport();
  await page.getByRole("button", { name: "Open Motion type experiment" }).click();
  await page.getByRole("button", { name: "Reset site" }).click();
  await page.keyboard.press("Escape");
  await expect.poll(() => page.evaluate(() => document.documentElement.style.getPropertyValue("--offset-orange").trim())).toBe("#e9702c");
  await expect.poll(() => page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue("--portfolio-tracking").trim())).toBe("0px");
});

test("video work has four direct pieces and opens from the About role", async ({ page }) => {
  await page.goto("/#about", { waitUntil: "networkidle" });
  const videoRole = page.getByRole("link", { name: /Occasional video maker/ });
  await videoRole.scrollIntoViewIfNeeded();
  await videoRole.click();
  await expect(page).toHaveURL(/\/motion$/);
  await expect(page.getByRole("heading", { level: 1, name: /Stories in.*motion/ })).toBeVisible();
  await expect(page.locator(".motion-page-piece")).toHaveCount(4);
  await expect(page.locator(".motion-page-piece").first().getByRole("button", { name: /Play/ })).toBeVisible();
  await expect(page.locator(".motion-page-piece").first().getByRole("link", { name: /Watch on YouTube/ })).toHaveAttribute("href", /youtube\.com\/watch\?v=/);
});

test("quick view offers a direct reading path back to the experience", async ({ page }) => {
  await page.goto("/quick");
  await expect(page.getByRole("heading", { level: 1, name: /Sandeep.*Kumar/ })).toBeVisible();
  await expect(page.locator(".quick-view-projects article")).toHaveCount(3);
  await expect(page.locator(".quick-view-projects article").first()).toContainText("BidStrike");
  await expect(page.getByRole("heading", { name: "Experience & education" })).toBeVisible();
  await expect(page.getByText("Developer at TCS")).toBeVisible();
  await expect(page.getByRole("button", { name: /Save quick profile as PDF/ })).toBeVisible();
  await expect(page.getByRole("link", { name: /Request full résumé/ })).toHaveAttribute("href", /mailto:/);
  await page.getByRole("navigation", { name: "Portfolio view" }).getByRole("link", { name: "Experience" }).click();
  await expect(page).toHaveURL(/\/$/);
});

test("build file view reveals and restores section decisions", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/", { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "Open build file" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-wireframe", "true");
  await expect(page.locator(".offset-work")).toHaveAttribute("data-build-note", /Three products/);
  await expect(page.getByRole("button", { name: "Close build file" }).first()).toBeVisible();
  await page.getByRole("button", { name: "Close build file" }).first().click();
  await expect(page.locator("html")).toHaveAttribute("data-wireframe", "false");
});

test("desktop work preview has stable text and opens its case study", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name.includes("mobile"), "Mouse interaction check");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const row = page.locator(".showcase-omni");
  await row.scrollIntoViewIfNeeded();
  const bounds = await row.boundingBox();
  expect(bounds).not.toBeNull();
  const idleHead = await row.locator(".showcase-head").boundingBox();
  await page.mouse.move(bounds!.x + bounds!.width / 2, bounds!.y + 100);
  await expect.poll(async () => (await row.locator(".showcase-head").boundingBox())!.x).toBeCloseTo(idleHead!.x, 0);
  expect((await row.boundingBox())!.width).toBe(bounds!.width);
  await row.getByRole("button", { name: "Cart", exact: true }).click();
  await expect(row.locator(".showcase-browser-top")).toContainText("Cart");
  await row.getByRole("link", { name: "View OmniMart case study" }).click();
  await expect(page).toHaveURL(/\/my-projects\/10$/);
});

test("desktop navigation reaches home sections from work", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name.includes("mobile"), "Desktop navigation check");
  await page.goto("/");
  await page.getByRole("navigation", { name: "Primary navigation" }).getByRole("link", { name: "Projects" }).click();
  await expect(page).toHaveURL(/\/my-projects$/);
  await page.getByRole("navigation", { name: "Primary navigation" }).getByRole("link", { name: "About" }).click();
  await expect(page).toHaveURL(/\/#about$/);
  await expect(page.locator("#about")).toBeInViewport();
  await page.getByRole("navigation", { name: "Primary navigation" }).getByRole("link", { name: "Build" }).click();
  await expect(page).toHaveURL(/\/#skills$/);
  await expect(page.locator("#skills")).toBeInViewport();
});

test("the home link starts at the top and browser Back keeps reading position", async ({ page }, testInfo) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  const openProjects = async () => {
    if (testInfo.project.name.includes("mobile")) {
      await page.getByRole("button", { name: "Open navigation menu" }).click();
      await page.getByRole("navigation", { name: "Mobile navigation" }).getByRole("link", { name: "Projects" }).click();
    } else {
      await page.getByRole("navigation", { name: "Primary navigation" }).getByRole("link", { name: "Projects" }).click();
    }
  };
  await page.goto("/", { waitUntil: "networkidle" });
  await page.locator("#about").evaluate((section) => section.scrollIntoView({ behavior: "instant", block: "start" }));
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(500);
  await openProjects();
  await page.getByRole("link", { name: "Sandeep Kumar homepage" }).click();
  await expect(page).toHaveURL(/\/$/);
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
  await page.locator("#about").scrollIntoViewIfNeeded();
  await expect(page.locator("#about")).toBeInViewport();
  await openProjects();
  await expect(page).toHaveURL(/\/my-projects$/);
  await page.goBack();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.locator("#about")).toBeInViewport();
});

test("color study preview and contact email respond on hover", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name.includes("mobile"), "Desktop hover check");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/#lab");
  const preview = page.locator(".offset-lab-color-block");
  await expect(page.locator("#lab")).toBeInViewport();
  await page.getByRole("button", { name: "Open Color study experiment" }).hover();
  await expect.poll(() => preview.evaluate((element) => getComputedStyle(element).backgroundColor)).toBe("rgb(115, 152, 189)");
  await page.goto("/#contact");
  await expect(page.locator("#contact")).toBeInViewport();
  const email = page.locator(".offset-contact-direct a");
  await email.hover();
  await expect.poll(() => email.evaluate((element) => getComputedStyle(element).color)).toBe("rgb(243, 240, 235)");
});

test("build map connects tools to project evidence", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/", { waitUntil: "networkidle" });
  await page.locator("#skills").evaluate((section) => section.scrollIntoView({ behavior: "instant", block: "start" }));
  await expect(page.locator(".build-map-stage")).toHaveCount(5);
  await page.getByRole("button", { name: "PostgreSQL" }).click();
  await expect(page.locator(".build-evidence-links a", { hasText: "BidStrike" })).toHaveAttribute("data-related", "true");
  await expect(page.locator(".build-evidence-links a", { hasText: "Mirror Wallpapers" })).toHaveAttribute("data-related", "false");
  await page.getByRole("button", { name: "CSS motion" }).click();
  await expect(page.locator(".build-evidence-links a", { hasText: "The Lab" })).toHaveAttribute("data-related", "true");
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
  await expect(page.getByRole("navigation", { name: "Mobile navigation" }).getByRole("link", { name: "Projects" })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("button", { name: "Open navigation menu" })).toBeFocused();
  await page.getByRole("button", { name: "Open navigation menu" }).click();
  await page.getByRole("navigation", { name: "Mobile navigation" }).getByRole("link", { name: "Projects" }).click();
  await expect(page).toHaveURL(/\/my-projects$/);
});

test("all main routes fit the viewport", async ({ page }) => {
  for (const route of ["/", "/quick", "/my-projects", "/my-projects/11"]) {
    await page.goto(route);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow, `${route} horizontal overflow`).toBeLessThanOrEqual(1);
  }
});

test("footer assistant opens on demand", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Ask about Sandeep's work" }).click();
  await expect(page.getByRole("button", { name: "Close chat" })).toBeVisible();
  await page.getByRole("button", { name: /Summarize BidStrike/ }).click();
  await expect(page.getByRole("log", { name: "Krypton conversation" })).toContainText("BidStrike");
  await page.getByRole("button", { name: "Close chat" }).click();
  await expect(page.getByRole("region", { name: "Krypton portfolio assistant" })).toBeHidden();
});
