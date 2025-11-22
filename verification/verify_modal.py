
from playwright.sync_api import Page, expect, sync_playwright
import time

def verify_project_modal(page: Page):
    page.goto("http://localhost:3000/my-projects")

    # Wait for the page to load and projects to appear
    page.wait_for_selector(".project-card-container", state="visible", timeout=10000)

    # Take a screenshot of the projects page
    page.screenshot(path="verification/projects_page.png")

    # Click on the first project card
    first_card = page.locator(".project-card-container").first
    first_card.click()

    # Wait for the modal to appear
    modal = page.locator("[role='dialog']")
    expect(modal).to_be_visible(timeout=5000)

    # Wait a bit for animations to complete
    time.sleep(1)

    # Take a screenshot of the modal
    page.screenshot(path="verification/project_modal.png")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            verify_project_modal(page)
        except Exception as e:
            print(f"Error: {e}")
        finally:
            browser.close()
