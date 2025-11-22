from playwright.sync_api import sync_playwright, expect

def verify_projects_page():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        print("Navigating to Projects page...")
        try:
            page.goto("http://localhost:3000/my-projects", timeout=60000)

            # Wait for title
            print("Waiting for Title...")
            expect(page.get_by_role("heading", name="My Projects")).to_be_visible(timeout=30000)

            # Wait for search input
            print("Waiting for Search...")
            expect(page.get_by_placeholder("Search projects...")).to_be_visible()

            # Wait for at least one project card
            print("Waiting for Project Cards...")
            page.wait_for_selector(".project-card-container", timeout=10000)

            print("Waiting for animations/loader to finish...")
            page.wait_for_timeout(5000)

            # Take screenshot
            print("Taking screenshot...")
            page.screenshot(path="verification/projects_ui.png", full_page=True)
            print("Screenshot saved to verification/projects_ui.png")

        except Exception as e:
            print(f"Error: {e}")
            page.screenshot(path="verification/error_projects_verify.png")
            raise e
        finally:
            browser.close()

if __name__ == "__main__":
    verify_projects_page()
