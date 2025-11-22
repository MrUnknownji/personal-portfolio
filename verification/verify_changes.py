from playwright.sync_api import sync_playwright

def verify_footer_arrow():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context()
        page = context.new_page()

        # Navigate to the home page
        page.goto("http://localhost:3000")

        # Scroll to bottom to see footer
        page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
        page.wait_for_timeout(1000) # Wait for animations

        # Locate footer links
        # Specifically check "Projects" link which should show arrow on Home page
        projects_link = page.locator("footer a").filter(has_text="Projects")

        if projects_link.count() > 0:
            print("Projects link found")
            # Hover to trigger the arrow expansion
            projects_link.hover()
            page.wait_for_timeout(500)
            page.screenshot(path="/home/jules/verification/footer_arrow_hover.png")

            # Move mouse away
            page.mouse.move(0, 0)
            page.wait_for_timeout(500)
            page.screenshot(path="/home/jules/verification/footer_arrow_normal.png")
        else:
            print("Projects link not found in footer")

        # Navigate to projects page
        page.goto("http://localhost:3000/my-projects")
        page.wait_for_timeout(1000)

        # Check sticky header and UI
        page.screenshot(path="/home/jules/verification/projects_ui_improved.png")

        # Filter UI - "Frontend" is a valid category. Use a less strict locator if needed.
        # The button text is likely "Frontend" but might have extra whitespace or elements.
        frontend_btn = page.get_by_role("button", name="Frontend")
        if frontend_btn.count() > 0:
             frontend_btn.click()
             page.wait_for_timeout(1000)
             page.screenshot(path="/home/jules/verification/projects_ui_filtered.png")
        else:
             print("Frontend button not found")

        browser.close()

if __name__ == "__main__":
    verify_footer_arrow()
