from playwright.sync_api import sync_playwright, expect

def verify_hero_section():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            # Wait for the page to load
            page.goto("http://localhost:3000", timeout=60000)

            # Wait for the hero section content to be visible
            # "Available for hire" badge
            expect(page.get_by_text("Available for hire")).to_be_visible()

            # Title
            expect(page.get_by_role("heading", name="Sandeep Kumar")).to_be_visible()

            # Subtitle - use a more specific selector
            expect(page.locator(".hero-subtitle")).to_have_text("Full Stack Developer")

            # Skill cards should be visible - target the one in hero section specifically if possible, or just check count
            # But since strict mode is complaining about duplicates (one in hero, one in about maybe?), we can use first()
            expect(page.get_by_text("Problem Solving").first).to_be_visible()

            # Take a screenshot
            page.screenshot(path="verification/hero_verification_final.png", full_page=True)
            print("Screenshot taken successfully.")

        except Exception as e:
            print(f"Verification failed: {e}")
        finally:
            browser.close()

if __name__ == "__main__":
    verify_hero_section()
