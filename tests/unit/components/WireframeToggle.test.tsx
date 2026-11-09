// @vitest-environment jsdom
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import WireframeToggle from "@/components/WireframeToggle";

afterEach(cleanup);

describe("WireframeToggle", () => {
  it("switches build-file mode on the document and back off", () => {
    const { unmount } = render(<WireframeToggle />);
    const toggle = screen.getByRole("button", { name: /Open build file/ });

    fireEvent.click(toggle);
    expect(document.documentElement.dataset.wireframe).toBe("true");
    expect(toggle).toHaveProperty("ariaPressed", "true");
    // The floating exit is portalled to <body> so it stays reachable on long pages.
    const exits = screen.getAllByRole("button", { name: /Close build file/ });
    expect(exits).toHaveLength(2);

    fireEvent.click(exits[1]);
    expect(document.documentElement.dataset.wireframe).toBe("false");

    unmount();
    expect(document.documentElement.dataset.wireframe).toBeUndefined();
  });

  it("can leave out the floating exit when the toggle stays in view", () => {
    render(<WireframeToggle floatingExit={false} />);
    fireEvent.click(screen.getByRole("button", { name: /Open build file/ }));

    expect(screen.getAllByRole("button", { name: /Close build file/ })).toHaveLength(1);
  });
});
