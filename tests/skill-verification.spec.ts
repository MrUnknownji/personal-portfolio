import { test, expect } from '@playwright/test';

test('skill cards verification', async ({ page }) => {
  await page.goto('http://localhost:3000');

  // Wait for the hero section skills container
  const skillsContainer = page.locator('.skills-container');
  await expect(skillsContainer).toBeVisible();

  // Wait for animations
  await page.waitForTimeout(3000);

  // Hover over a skill card to see the effect.
  // The skill cards have the class 'skill-card' on the wrapper div in HeroContent.tsx,
  // but inside SkillCard.tsx they have the 'group' class.
  // We should target the element that has the hover effect.
  const firstSkillCard = page.locator('.skill-card').first();

  // Make sure it's visible before hovering
  await expect(firstSkillCard).toBeVisible();

  await firstSkillCard.hover();
  await page.waitForTimeout(1000);

  await page.screenshot({ path: 'verification/skill-cards.png', fullPage: true });
});
