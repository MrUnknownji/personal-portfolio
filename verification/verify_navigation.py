import time
from playwright.sync_api import sync_playwright, expect

def verify_navigation():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={'width': 1280, 'height': 800})
        page = context.new_page()

        print("Navigating to Projects page...")
        page.goto("http://localhost:3000/my-projects", timeout=60000)

        # Wait for content to load
        print("Waiting for page content...")
        # The logo alt text is "Logo" and aria-label is "Homepage"
        expect(page.get_by_role("link", name="Homepage")).to_be_visible(timeout=30000)
        print("Found Header Logo.")

        expect(page.get_by_text("My Projects")).to_be_visible(timeout=30000)
        print("Found 'My Projects' text.")

        # Scroll to footer to check arrows
        page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
        time.sleep(2) # Give time for any scroll animations

        # Screenshot Footer on Projects Page
        page.screenshot(path="verification/projects_footer.png")
        print("Screenshotted Projects footer.")

        print("Navigating to Home...")
        # Click the Logo Link (aria-label="Homepage")
        home_link = page.get_by_role("link", name="Homepage")
        home_link.click()

        # Wait for transition
        print("Waiting for transition to Home...")
        time.sleep(3)

        # Check if we are at the top (Hero Section)
        # 'Hello, I'm' should be visible
        try:
            expect(page.get_by_text("Hello, I'm")).to_be_visible(timeout=20000)
            print("Found Hero section text.")
        except Exception as e:
            print(f"Error finding Hero text: {e}")
            page.screenshot(path="verification/error_home_hero.png")
            raise e

        # Verify scroll position is near top
        scroll_y = page.evaluate("window.scrollY")
        print(f"Scroll Y after navigation to Home: {scroll_y}")

        if scroll_y > 100:
            print("FAIL: Did not scroll to top correctly.")
        else:
            print("PASS: Scrolled to top correctly.")

        page.screenshot(path="verification/home_hero.png")

        browser.close()

if __name__ == "__main__":
    verify_navigation()
