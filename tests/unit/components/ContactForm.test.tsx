// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import Form from "@/components/ContactSectionComponents/Form";

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

const fill = (label: string, value: string) =>
  fireEvent.change(screen.getByLabelText(label), { target: { value } });

describe("contact form", () => {
  it("shows field errors and focuses the first invalid field instead of submitting", () => {
    const fetchSpy = vi.fn();
    vi.stubGlobal("fetch", fetchSpy);
    render(<Form onSubmitSuccess={vi.fn()} />);

    fireEvent.click(screen.getByRole("button", { name: /Send Message/ }));

    const name = screen.getByLabelText("Name");
    expect(name.getAttribute("aria-invalid")).toBe("true");
    expect(document.activeElement).toBe(name);
    expect(name.getAttribute("aria-describedby")).toBe("contact-name-error");
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("posts only the fields it collects and resets after success", async () => {
    const fetchSpy = vi.fn().mockResolvedValue(new Response(JSON.stringify({ ok: true })));
    vi.stubGlobal("fetch", fetchSpy);
    const onSuccess = vi.fn();
    render(<Form onSubmitSuccess={onSuccess} />);

    fill("Name", "Ada Lovelace");
    fill("Email", "ada@example.com");
    fill("Your Message...", "I would like to talk about a frontend role.");
    fireEvent.click(screen.getByRole("button", { name: /Send Message/ }));

    await waitFor(() => expect(onSuccess).toHaveBeenCalledOnce());
    const [url, init] = fetchSpy.mock.calls[0];
    expect(url).toBe("/api/contact");
    expect(JSON.parse(init.body)).toEqual({
      name: "Ada Lovelace",
      email: "ada@example.com",
      message: "I would like to talk about a frontend role.",
      company: "",
    });
    expect((screen.getByLabelText("Name") as HTMLInputElement).value).toBe("");
  });

  it("explains a server failure without losing what the visitor typed", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ message: "Too many messages. Please try again later." }), {
          status: 429,
        }),
      ),
    );
    render(<Form onSubmitSuccess={vi.fn()} />);

    fill("Name", "Ada Lovelace");
    fill("Email", "ada@example.com");
    fill("Your Message...", "Hello there, this is a message.");
    fireEvent.click(screen.getByRole("button", { name: /Send Message/ }));

    expect(await screen.findByRole("alert")).toHaveProperty(
      "textContent",
      "Too many messages. Please try again later.",
    );
    expect((screen.getByLabelText("Name") as HTMLInputElement).value).toBe("Ada Lovelace");
  });
});
