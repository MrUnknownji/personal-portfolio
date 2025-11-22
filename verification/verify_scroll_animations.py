
from playwright.sync_api import Page, expect, sync_playwright
import time

def verify_animations(page: Page):
    # 1. Verify Home Page Scroll
    page.goto("http://localhost:3000")

    # Wait for initial load
    page.wait_for_load_state("networkidle")
    time.sleep(1) # wait for entrance animations
    page.screenshot(path="verification/home_top.png")

    # Scroll to About Me
    page.evaluate("window.scrollTo(0, 1000)")
    time.sleep(1.5) # Wait for scroll and animation
    page.screenshot(path="verification/home_about.png")

    # Scroll to Bottom (Footer)
    page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
    time.sleep(1.5)
    page.screenshot(path="verification/home_footer.png")

    # 2. Verify My Projects Page
    page.goto("http://localhost:3000/my-projects")
    page.wait_for_load_state("networkidle")
    time.sleep(1.5) # Wait for staggered entrance
    page.screenshot(path="verification/projects_page_entrance.png")

    # Verify Project Modal
    cards = page.locator(".project-card-container")
    if cards.count() > 0:
        cards.first.click()
        expect(page.locator("[role='dialog']")).to_be_visible()
        time.sleep(1) # Wait for modal animation
        page.screenshot(path="verification/project_modal_open.png")

        # Close modal
        page.locator("[aria-label='Close project details']").click()
        time.sleep(1) # Wait for close animation

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page(viewport={"width": 1280, "height": 800})
        try:
            verify_animations(page)
        except Exception as e:
            print(f"Error: {e}")
        finally:
            browser.close()
