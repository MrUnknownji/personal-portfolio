// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
  useRouter: () => ({ push: vi.fn(), prefetch: vi.fn() }),
}));

const { default: Header } = await import("@/components/Header");

afterEach(cleanup);

describe("Header mobile menu", () => {
  it("locks page scroll, keeps Tab inside the menu, and restores focus on Escape", () => {
    render(<Header workPreviewImage="/images/portfolio/home.webp" projectCount={7} />);
    const menuButton = screen.getByRole("button", { name: "Open navigation menu" });

    fireEvent.click(menuButton);
    expect(document.documentElement.style.overflow).toBe("hidden");
    const links = screen
      .getByRole("navigation", { name: "Mobile navigation" })
      .querySelectorAll("a");
    expect(Array.from(links, (link) => link.textContent)).toContain("Résumé PDF↓");

    // Tab from the last link wraps to the menu button; Shift+Tab from the button wraps back.
    links[links.length - 1].focus();
    fireEvent.keyDown(window, { key: "Tab" });
    expect(document.activeElement).toBe(
      screen.getByRole("button", { name: "Close navigation menu" }),
    );
    fireEvent.keyDown(window, { key: "Tab", shiftKey: true });
    expect(document.activeElement).toBe(links[links.length - 1]);

    fireEvent.keyDown(window, { key: "Escape" });
    expect(screen.queryByRole("navigation", { name: "Mobile navigation" })).toBeNull();
    expect(document.documentElement.style.overflow).toBe("");
    expect(document.activeElement).toBe(
      screen.getByRole("button", { name: "Open navigation menu" }),
    );
  });
});
