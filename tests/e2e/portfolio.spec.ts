import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("home presents work and contact with accessible structure", async ({ page }, testInfo) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1, name: /Sandeep.*Kumar/ })).toBeVisible();
  await expect(page.locator(".offset-hero-canvas")).toContainText("Programmer / Developer at TCS");
  await expect(page.getByRole("heading", { name: /Work that.*holds up/ })).toBeVisible();
  await expect(page.locator(".showcase-row").first()).toHaveClass(/showcase-bid/);
  const shortcuts = page.getByRole("navigation", { name: "Profile shortcuts" });
  if (!testInfo.project.name.includes("mobile")) {
    await expect(shortcuts.getByRole("link", { name: "1-page profile" })).toHaveAttribute(
      "href",
      "/quick",
    );
  }
  await expect(shortcuts.getByRole("link", { name: /Résumé PDF/ })).toHaveAttribute(
    "href",
    "/sandeep-kumar-resume.pdf",
  );
  await expect(page.getByRole("link", { name: /Download résumé \(PDF\)/ })).toHaveAttribute(
    "href",
    "/sandeep-kumar-resume.pdf",
  );
  await expect(page.getByRole("heading", { level: 3, name: "Experience" })).toBeVisible();
  await expect(page.locator(".experience")).toContainText("Tata Consultancy Services");
  await expect(page.locator(".print-header-time")).toHaveCount(0);
  await expect(page.getByLabel("Name")).toBeVisible();
  await expect(page.getByLabel("Email", { exact: true })).toBeVisible();
  await expect(page.getByLabel("Your Message...")).toBeVisible();
  const results = await new AxeBuilder({ page }).analyze();
  expect(
    results.violations.filter((violation) =>
      ["serious", "critical"].includes(violation.impact || ""),
    ),
  ).toEqual([]);
});

test("hero moves directly into selected work", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name.includes("mobile"), "Desktop composition check");
  await page.goto("/");
  await expect(page.locator(".offset-hero").locator("..")).not.toHaveClass(/pin-spacer/);
  await expect(page.getByRole("link", { name: "Selected work" })).toHaveAttribute("href", "#work");
  await expect(page.locator(".offset-intro-stage")).toHaveCount(0);
});

test("desktop hero shifts without detaching the portrait from the next section", async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name.includes("mobile"), "Desktop scroll composition check");
  await page.goto("/");
  test.skip(
    !(await page.evaluate(() => CSS.supports("animation-timeline", "view()"))),
    "Scroll timelines are unavailable",
  );
  const band = page.locator(".offset-hero-band");
  const initial = await band.evaluate((element) => getComputedStyle(element).transform);
  await page.evaluate(() => window.scrollTo({ top: 360, behavior: "instant" }));
  await expect
    .poll(() => band.evaluate((element) => getComputedStyle(element).transform))
    .not.toBe(initial);
  const portraitBottom = await page
    .locator(".offset-hero-portrait picture")
    .evaluate((element) => element.getBoundingClientRect().bottom);
  const heroBottom = await page
    .locator(".offset-hero")
    .evaluate((element) => element.getBoundingClientRect().bottom);
  expect(portraitBottom).toBeGreaterThanOrEqual(heroBottom);
});

test("desktop file details stay aligned without covering the portrait", async ({
  page,
}, testInfo) => {
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
      lineEnd:
        firstStage.getBoundingClientRect().left +
        Number.parseFloat(line.left) +
        Number.parseFloat(line.width),
      firstNode: rect(".build-map-stage-index").left + 16,
      secondNode: rect(".build-map-stage:nth-child(2) .build-map-stage-index").left + 16,
      connectorEnd:
        stop.getBoundingClientRect().top +
        Number.parseFloat(connector.top) +
        Number.parseFloat(connector.height),
      cardTop: rect(".offset-field-stop-1 > div").top,
      secondConnectorEnd:
        secondStop.getBoundingClientRect().top +
        Number.parseFloat(secondConnector.top) +
        Number.parseFloat(secondConnector.height),
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
  expect(details.rightNote).toBeGreaterThan(details.portraitLeft + details.portraitWidth * 0.7);
});

test("timeline draws when reached from an About link", async ({ page }) => {
  await page.goto("/#about");
  await page.locator(".offset-field-path").scrollIntoViewIfNeeded();
  await expect(page.locator(".offset-field-note")).toHaveAttribute("data-visible", "true");
  await expect
    .poll(() =>
      page
        .locator(".offset-field-path-line:visible")
        .evaluate((line) => getComputedStyle(line).strokeDashoffset),
    )
    .toBe("0px");
  await expect
    .poll(() => page.locator(".offset-field-path-ribbon:visible").getAttribute("d"))
    .toMatch(/^M /);
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
  expect(
    results.violations.filter((violation) =>
      ["serious", "critical"].includes(violation.impact || ""),
    ),
  ).toEqual([]);
});

test("case study keeps its project links accessible while reading", async ({ page }, testInfo) => {
  await page.goto("/my-projects/11");
  await expect(page.getByRole("heading", { level: 1, name: /Mirror Wallpapers/ })).toBeVisible();
  await expect(page.getByRole("heading", { name: "What needed solving" })).toBeVisible();
  const mirrorLinks = page.getByRole("navigation", { name: /Mirror Wallpapers project links/ });
  await expect(mirrorLinks.getByRole("link", { name: /Source code/ })).toHaveCount(0);
  await expect(mirrorLinks.getByText(/Private repository/)).toBeVisible();
  await expect(page.locator(".study-gallery-story figure")).toHaveCount(5);
  await expect(page.locator(".study-gallery-story figure").nth(0)).toContainText("lock screen");
  await expect(page.locator(".study-gallery-story figure").nth(1)).toContainText("home screen");
  await expect(page.getByRole("link", { name: /Open OmniMart case study/ })).toHaveAttribute(
    "href",
    "/my-projects/10",
  );
  await page.goto("/my-projects/10");
  const actions = page.getByRole("navigation", { name: /OmniMart project links/ });
  await expect(actions.getByRole("link", { name: /Live demo/ })).toBeVisible();
  await expect(actions.getByRole("link", { name: /Source code/ })).toBeVisible();
  await expect(page.getByRole("link", { name: /src\/proxy\.ts/ })).toHaveAttribute(
    "href",
    "https://github.com/MrUnknownji/omni-mart/blob/main/src/proxy.ts",
  );
  await page.evaluate(() => window.scrollTo({ top: 2000, behavior: "instant" }));
  await expect
    .poll(() => actions.evaluate((bar) => Math.round(bar.getBoundingClientRect().top)))
    .toBe(testInfo.project.name.includes("mobile") ? 64 : 72);
});

test("case study pins a compact screen story to vertical scrolling", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name.includes("mobile"), "Pinned sequence is a wide-screen treatment");
  await page.goto("/my-projects/11");
  await page.getByRole("link", { name: /Browse product screens/ }).click();
  await expect(page).toHaveURL(/#screens$/);
  const story = page.locator(".study-gallery-story");
  const track = story.locator(".study-gallery-track");
  await expect(story.locator("figure")).toHaveCount(5);
  const layout = await story.evaluate((element) => ({
    top: element.getBoundingClientRect().top + scrollY,
    travel:
      (element as HTMLElement).offsetHeight -
      element.querySelector<HTMLElement>(".study-gallery-stage")!.offsetHeight,
  }));
  await page.evaluate((top) => scrollTo({ top, behavior: "instant" }), layout.top - 72);
  const start = await track.evaluate((element) => getComputedStyle(element).transform);
  await page.evaluate(
    (top) => scrollTo({ top, behavior: "instant" }),
    layout.top - 72 + layout.travel * 0.55,
  );
  await expect
    .poll(() => track.evaluate((element) => getComputedStyle(element).transform))
    .not.toBe(start);
  await expect
    .poll(() =>
      story
        .locator(".study-gallery-stage")
        .evaluate((element) => Math.round(element.getBoundingClientRect().top)),
    )
    .toBe(72);
  await expect(
    story
      .locator("figure")
      .nth(1)
      .getByRole("link", { name: /Open full image/ }),
  ).toHaveAttribute("href", /cloudinary/);
  expect(
    await story
      .locator("figure")
      .nth(1)
      .getByRole("link")
      .evaluate((element) => element.getBoundingClientRect().width),
  ).toBeLessThan(800);
});

test("case study screens stack without motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/my-projects/11");
  await expect(page.locator(".study-gallery-stage")).toHaveCSS("position", "static");
  await expect(page.locator(".study-gallery-frame")).toHaveCount(5);
  await expect(page.getByRole("button", { name: "Next screenshot" })).toHaveCount(0);
});

test("sticky work rail follows the current project", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name.includes("mobile"), "The mobile rail is deliberately compact");
  await page.goto("/");
  await page.locator(".showcase-mirror").scrollIntoViewIfNeeded();
  await expect(page.locator(".offset-work-rail span")).toContainText("Mirror Wallpapers");
  await page.locator(".showcase-omni").scrollIntoViewIfNeeded();
  await expect(page.locator(".offset-work-rail span")).toContainText("OmniMart");
});

test("two-bids study shows a lost update and how server authority prevents it", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/#lab", { waitUntil: "networkidle" });
  await page.getByRole("button", { name: /Two bids, one price/ }).click();
  const race = page.getByRole("dialog", { name: "Two bids, one price experiment" });
  await expect(race.getByRole("group", { name: "Server rule" })).toBeVisible();
  await race.getByRole("button", { name: /Send both bids/ }).click();
  await expect(race.getByRole("status")).toContainText("lost update");
  await expect(race.getByRole("list", { name: "Event log" })).toContainText("overwriting");
  await race.getByRole("button", { name: /Server authority/ }).click();
  await race.getByRole("slider", { name: /Bidder B latency/ }).fill("500");
  await race.getByRole("button", { name: /Send both bids/ }).click();
  await expect(race.getByRole("status")).toContainText("₹4,350");
  await expect(race.getByRole("list", { name: "Event log" })).toContainText("retries at ₹4,350");
  await race.getByRole("button", { name: /Drop the reply to A/ }).click();
  await race.getByRole("button", { name: /Send both bids/ }).click();
  await expect(race.getByRole("status")).toContainText("outbid its own winning bid");
  await race.getByRole("button", { name: /Authority \+ request IDs/ }).click();
  await race.getByRole("button", { name: /Send both bids/ }).click();
  await expect(race.getByRole("status")).toContainText("same request ID");
  await page.keyboard.press("Escape");
  await expect(race).toBeHidden();
});

test("work previews and lab studies respond to visitors", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/", { waitUntil: "networkidle" });
  const omni = page.locator(".showcase-omni");
  await page
    .locator("#work")
    .evaluate((section) => section.scrollIntoView({ behavior: "instant", block: "start" }));
  await expect(page.locator("#work")).toBeInViewport();
  await omni.getByRole("button", { name: "Cart", exact: true }).click();
  await expect(omni.locator(".showcase-browser-top")).toContainText("Cart");
  await page.goto("/", { waitUntil: "networkidle" });
  await page
    .locator("#lab")
    .evaluate((section) => section.scrollIntoView({ behavior: "instant", block: "start" }));
  await expect(page.locator("#lab")).toBeInViewport();
  await page.getByRole("button", { name: /Motion type/ }).click();
  const lab = page.getByRole("dialog", { name: "Motion type experiment" });
  await expect(lab).toBeVisible();
  await expect(lab.getByRole("slider", { name: "Letter spacing" })).toBeVisible();
  await lab.getByRole("slider", { name: "Letter spacing" }).fill("14");
  await page.keyboard.press("Escape");
  await expect(lab).toBeHidden();
  await page.getByRole("button", { name: /Color study/ }).click();
  await page.getByRole("button", { name: "Use Sage accent" }).click();
  await page.keyboard.press("Escape");
  await page.goto("/my-projects");
  await expect
    .poll(() =>
      page.evaluate(() =>
        document.documentElement.style.getPropertyValue("--offset-orange").trim(),
      ),
    )
    .toBe("#7ba78c");
  await expect
    .poll(() =>
      page.evaluate(() =>
        Number.parseFloat(
          getComputedStyle(document.documentElement).getPropertyValue("--portfolio-tracking"),
        ),
      ),
    )
    .toBeLessThan(1);
  await page.goto("/", { waitUntil: "networkidle" });
  await page
    .locator("#lab")
    .evaluate((section) => section.scrollIntoView({ behavior: "instant", block: "start" }));
  await expect(page.locator("#lab")).toBeInViewport();
  await page.getByRole("button", { name: /Motion type/ }).click();
  await page.getByRole("button", { name: "Reset site" }).click();
  await page.keyboard.press("Escape");
  await expect
    .poll(() =>
      page.evaluate(() =>
        document.documentElement.style.getPropertyValue("--offset-orange").trim(),
      ),
    )
    .toBe("#e9702c");
  await expect
    .poll(() =>
      page.evaluate(() =>
        getComputedStyle(document.documentElement).getPropertyValue("--portfolio-tracking").trim(),
      ),
    )
    .toBe("0px");
});

test("video work has four direct pieces and opens from the About role", async ({ page }) => {
  await page.goto("/#about", { waitUntil: "networkidle" });
  const videoRole = page.getByRole("link", { name: /Creative coder & video/ });
  await videoRole.scrollIntoViewIfNeeded();
  await videoRole.click();
  await expect(page).toHaveURL(/\/motion$/);
  await expect(page.getByRole("heading", { level: 1, name: /Stories in.*motion/ })).toBeVisible();
  await expect(page.locator(".motion-page-piece")).toHaveCount(4);
  await expect(
    page.locator(".motion-page-piece").first().getByRole("button", { name: /Play/ }),
  ).toBeVisible();
  await expect(
    page
      .locator(".motion-page-piece")
      .first()
      .getByRole("link", { name: /Watch on YouTube/ }),
  ).toHaveAttribute("href", /youtube\.com\/watch\?v=/);
});

test("video player is permitted by the page security policy", async ({ page }) => {
  const response = await page.goto("/motion");
  expect(response?.headers()["content-security-policy"]).toContain(
    "frame-src https://www.youtube-nocookie.com",
  );
  await page.locator(".motion-page-piece").first().getByRole("button", { name: /Play/ }).click();
  await expect(page.locator(".motion-page-piece").first().locator("iframe")).toHaveAttribute(
    "src",
    /youtube-nocookie\.com\/embed\//,
  );
});

test("1-page profile leads with experience and links the résumé", async ({ page }, testInfo) => {
  await page.goto("/quick");
  await expect(page.getByRole("heading", { level: 1, name: /Sandeep.*Kumar/ })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Experience & education" })).toBeVisible();
  await expect(
    page.getByText("Programmer / Developer, Tata Consultancy Services (TCS)"),
  ).toBeVisible();
  await expect(page.locator(".quick-view-projects article")).toHaveCount(4);
  await expect(page.locator(".quick-view-projects article").first()).toContainText("BidStrike");
  await expect(page.getByRole("button", { name: /Print this page/ })).toBeVisible();
  const resume = await page.request.get("/sandeep-kumar-resume.pdf");
  expect(resume.ok()).toBe(true);
  expect(resume.headers()["content-type"]).toContain("application/pdf");
  if (testInfo.project.name.includes("mobile")) {
    await page.getByRole("button", { name: "Open navigation menu" }).click();
    await page
      .getByRole("navigation", { name: "Mobile navigation" })
      .getByRole("link", { name: "Full portfolio" })
      .click();
  } else {
    await page
      .getByRole("navigation", { name: "Profile shortcuts" })
      .getByRole("link", { name: "Full portfolio" })
      .click();
  }
  await expect(page).toHaveURL(/\/$/);
});

test("build file view reveals and restores section decisions", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/", { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "Open build file" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-wireframe", "true");
  await expect(page.locator(".offset-work")).toHaveAttribute("data-build-note", /Four products/);
  await expect(page.getByRole("button", { name: "Close build file" }).first()).toBeVisible();
  await page.getByRole("button", { name: "Close build file" }).first().click();
  await expect(page.locator("html")).toHaveAttribute("data-wireframe", "false");
});

test("desktop work preview has stable text and opens its case study", async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name.includes("mobile"), "Mouse interaction check");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const row = page.locator(".showcase-omni");
  await row.scrollIntoViewIfNeeded();
  const bounds = await row.boundingBox();
  expect(bounds).not.toBeNull();
  const idleHead = await row.locator(".showcase-head").boundingBox();
  await page.mouse.move(bounds!.x + bounds!.width / 2, bounds!.y + 100);
  await expect
    .poll(async () => (await row.locator(".showcase-head").boundingBox())!.x)
    .toBeCloseTo(idleHead!.x, 0);
  expect((await row.boundingBox())!.width).toBe(bounds!.width);
  await row.getByRole("button", { name: "Cart", exact: true }).click();
  await expect(row.locator(".showcase-browser-top")).toContainText("Cart");
  await row.getByRole("link", { name: "View OmniMart case study" }).click();
  await expect(page).toHaveURL(/\/my-projects\/10$/);
});

test("desktop navigation reaches home sections from work", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name.includes("mobile"), "Desktop navigation check");
  await page.goto("/");
  await page
    .getByRole("navigation", { name: "Primary navigation" })
    .getByRole("link", { name: "Projects" })
    .click();
  await expect(page).toHaveURL(/\/my-projects$/);
  await page
    .getByRole("navigation", { name: "Primary navigation" })
    .getByRole("link", { name: "About" })
    .click();
  await expect(page).toHaveURL(/\/#about$/);
  await expect(page.locator("#about")).toBeInViewport();
  await page
    .getByRole("navigation", { name: "Primary navigation" })
    .getByRole("link", { name: "Build" })
    .click();
  await expect(page).toHaveURL(/\/#build$/);
  await expect(page.locator("#build")).toBeInViewport();
});

test("the home link starts at the top and browser Back keeps reading position", async ({
  page,
}, testInfo) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  const openProjects = async () => {
    if (testInfo.project.name.includes("mobile")) {
      await page.getByRole("button", { name: "Open navigation menu" }).click();
      await page
        .getByRole("navigation", { name: "Mobile navigation" })
        .getByRole("link", { name: "Projects" })
        .click();
    } else {
      await page
        .getByRole("navigation", { name: "Primary navigation" })
        .getByRole("link", { name: "Projects" })
        .click();
    }
  };
  await page.goto("/", { waitUntil: "networkidle" });
  await page
    .locator("#about")
    .evaluate((section) => section.scrollIntoView({ behavior: "instant", block: "start" }));
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(500);
  await openProjects();
  await page.getByRole("link", { name: "Sandeep Kumar Full-stack developer" }).click();
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
  await page.getByRole("button", { name: /Color study/ }).hover();
  await expect
    .poll(() => preview.evaluate((element) => getComputedStyle(element).backgroundColor))
    .toBe("rgb(115, 152, 189)");
  await page.goto("/#contact");
  await expect(page.locator("#contact")).toBeInViewport();
  const email = page.locator(".offset-contact-direct a");
  await email.hover();
  await expect
    .poll(() => email.evaluate((element) => getComputedStyle(element).color))
    .toBe("rgb(243, 240, 235)");
});

test("build map connects tools to project evidence", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/", { waitUntil: "networkidle" });
  await page
    .locator("#build")
    .evaluate((section) => section.scrollIntoView({ behavior: "instant", block: "start" }));
  await expect(page.locator(".build-map-stage")).toHaveCount(5);
  await page.getByRole("button", { name: "Socket.io" }).click();
  await expect(page.locator(".build-evidence-links a", { hasText: "BidStrike" })).toHaveAttribute(
    "data-related",
    "true",
  );
  await expect(
    page.locator(".build-evidence-links a", { hasText: "Mirror Wallpapers" }),
  ).toHaveAttribute("data-related", "false");
  await page.getByRole("button", { name: "CSS motion" }).click();
  await expect(page.locator(".build-evidence-links a", { hasText: "The Lab" })).toHaveAttribute(
    "data-related",
    "true",
  );
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
  await expect(
    page
      .getByRole("navigation", { name: "Mobile navigation" })
      .getByRole("link", { name: "Projects" }),
  ).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("button", { name: "Open navigation menu" })).toBeFocused();
  await page.getByRole("button", { name: "Open navigation menu" }).click();
  await page
    .getByRole("navigation", { name: "Mobile navigation" })
    .getByRole("link", { name: "Projects" })
    .click();
  await expect(page).toHaveURL(/\/my-projects$/);
});

test("all main routes fit the viewport", async ({ page }) => {
  for (const route of ["/", "/quick", "/my-projects", "/my-projects/11"]) {
    await page.goto(route);
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - window.innerWidth,
    );
    expect(overflow, `${route} horizontal overflow`).toBeLessThanOrEqual(1);
  }
});

test("footer assistant opens on demand", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Ask about my work" }).click();
  await expect(page.getByRole("button", { name: "Close chat" })).toBeVisible();
  await page.getByRole("button", { name: /Summarize BidStrike/ }).click();
  await expect(page.getByRole("log", { name: "Krypton conversation" })).toContainText("BidStrike");
  await page.getByRole("button", { name: "Close chat" }).click();
  await expect(page.getByRole("region", { name: "Krypton portfolio assistant" })).toBeHidden();
});

test("content-visibility size hints stay close to the real section heights", async ({ page }) => {
  // Below-the-fold sections skip rendering until needed; their placeholder sizes must match
  // reality or the scrollbar jumps and Back restores the wrong reading position.
  for (const [route, selectors] of [
    ["/", [".offset-work", ".offset-lab", ".offset-about", ".offset-contact"]],
    ["/my-projects", [".print-index-grid"]],
  ] as const) {
    await page.goto(route, { waitUntil: "networkidle" });
    await page.addStyleTag({
      content: `${selectors.join(",")} { content-visibility: visible !important; }`,
    });
    for (const selector of selectors) {
      const { real, hint } = await page.locator(selector).evaluate((element) => ({
        real: element.getBoundingClientRect().height,
        hint: Number.parseFloat(
          getComputedStyle(element).containIntrinsicHeight.replace("auto", ""),
        ),
      }));
      expect(
        Math.abs(real - hint) / real,
        `${route} ${selector}: ${real}px vs ${hint}px`,
      ).toBeLessThan(0.15);
    }
  }
});

test("preview controls inside a project card work without opening the case study", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/", { waitUntil: "networkidle" });
  const ticker = page.locator(".showcase-bid-ticker");
  await ticker.evaluate((element) => element.scrollIntoView({ block: "center" }));
  await ticker.getByRole("button", { name: "Preview next bid update" }).click();
  await expect(ticker.locator("strong")).toHaveText("₹4,300");
  await expect(page).toHaveURL(/\/$/);

  const mirror = page.locator(".showcase-mirror");
  await mirror.evaluate((element) => element.scrollIntoView({ block: "center" }));
  await mirror.locator(".showcase-wallpaper[data-active='false']").first().click();
  await expect(mirror.locator(".showcase-media-controls button").nth(1)).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await expect(page).toHaveURL(/\/$/);
});

test("project index filters by shared technology", async ({ page }) => {
  await page.goto("/my-projects");
  const stack = page.getByRole("group", { name: "Filter projects by technology" });
  await stack.getByRole("button", { name: "React Native" }).click();
  await expect(page.locator(".print-index-card")).toHaveCount(2);
  await expect(page.getByRole("status")).toHaveText(/2 of \d+ projects shown/);
  await stack.getByRole("button", { name: "React Native" }).click();
  await expect(page.locator(".print-index-card")).toHaveCount(8);
});

test("mobile header keeps an email shortcut", async ({ page }, testInfo) => {
  test.skip(!testInfo.project.name.includes("mobile"), "Mobile header check");
  await page.goto("/");
  await expect(page.getByRole("link", { name: "Email Sandeep" })).toHaveAttribute(
    "href",
    /^mailto:/,
  );
});

test("studio reel plays muted in view and pauses without opening the case study", async ({
  page,
}) => {
  await page.goto("/", { waitUntil: "networkidle" });
  const film = page.locator(".showcase-film");
  await film.evaluate((element) => element.scrollIntoView({ block: "center" }));
  const video = film.locator("video");
  await expect
    .poll(() => video.evaluate((element: HTMLVideoElement) => element.paused))
    .toBe(false);
  expect(await video.evaluate((element: HTMLVideoElement) => element.muted)).toBe(true);

  await film.getByRole("button", { name: "Pause reel" }).click();
  await expect(film.getByRole("button", { name: "Play reel" })).toBeVisible();
  expect(await video.evaluate((element: HTMLVideoElement) => element.paused)).toBe(true);
  await expect(page).toHaveURL(/\/$/);
});

test("store preview follows the pointer through the card link", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name.includes("mobile"), "Pointer scrubbing is a desktop feature");
  await page.goto("/", { waitUntil: "networkidle" });
  const omni = page.locator(".showcase-omni");
  const media = omni.locator(".showcase-media");
  await media.scrollIntoViewIfNeeded();
  const { width, height } = (await media.boundingBox())!;
  // The case-study link covers the preview; hovering it must still move through the screens.
  await media.hover({ position: { x: width * 0.95, y: height / 2 } });
  await expect(omni.locator(".showcase-media-controls button").last()).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await media.hover({ position: { x: width * 0.05, y: height / 2 } });
  await expect(omni.locator(".showcase-media-controls button").first()).toHaveAttribute(
    "aria-pressed",
    "true",
  );
});
