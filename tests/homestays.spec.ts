import { test, expect } from '@playwright/test';

test.describe('Homestays & Google Maps Direct Contact Tests (Read-Only)', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/homestays', { waitUntil: 'domcontentloaded' });
  });

  test('Homestays directory loads with verified stay cards', async ({ page }) => {
    await expect(page.getByText(/All India Homestays/i).first()).toBeVisible({ timeout: 15000 });

    // Verify Google Maps direct action buttons exist on stay cards
    const mapsButtons = page.getByRole('button', { name: /View on Google Maps/i });
    const count = await mapsButtons.count();
    expect(count).toBeGreaterThan(0);
  });

  test('Pricing tags are hidden and replaced with Direct Owner Contact badge', async ({ page }) => {
    // Check that direct contact badges are visible
    const contactBadge = page.getByText(/Check Live Rates & Discuss with Owner/i).first();
    await expect(contactBadge).toBeVisible({ timeout: 15000 });

    // Ensure mock price per night labels are NOT rendered on stay cards
    const pricePerNightElements = page.getByText(/₹\s*[0-9]+[\s]*\/[\s]*night/i);
    await expect(pricePerNightElements).toHaveCount(0);
  });

  test('Google Maps button exists and is clickable for direct owner contact', async ({ page }) => {
    const firstMapButton = page.getByRole('button', { name: /View on Google Maps/i }).first();
    await expect(firstMapButton).toBeVisible({ timeout: 15000 });
    await expect(firstMapButton).toBeEnabled();
  });

});
