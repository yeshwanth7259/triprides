import { test, expect } from '@playwright/test';

test.describe('Homestays & Google Maps Direct Contact Tests (Read-Only)', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/homestays', { waitUntil: 'domcontentloaded' });
  });

  test('Homestays directory loads with StayEasy layout and curated stay cards', async ({ page }) => {
    // Check StayEasy style hero banner & heading
    await expect(page.getByRole('heading', { name: /Discover Handpicked Villas, Stays & Nature Retreats/i })).toBeVisible({ timeout: 15000 });
    await expect(page.getByText(/StayEasy Handpicked Homes & Villas/i).first()).toBeVisible();

    // Verify Google Maps direct action buttons exist on stay cards
    const mapsButtons = page.getByRole('button', { name: /View on Google Maps/i });
    const count = await mapsButtons.count();
    expect(count).toBeGreaterThan(0);
  });

  test('Pricing tags are hidden and replaced with Direct Google Maps navigation', async ({ page }) => {
    // Check that direct host contact indicators are visible
    const contactBadge = page.getByText(/Zero commission|Direct host contact on Google Maps/i).first();
    await expect(contactBadge).toBeVisible({ timeout: 15000 });

    // Ensure mock price per night labels are NOT rendered on stay cards
    const pricePerNightElements = page.getByText(/₹\s*[0-9]+[\s]*\/[\s]*night/i);
    await expect(pricePerNightElements).toHaveCount(0);
  });

  test('Google Maps button exists and is clickable for direct owner contact', async ({ page }) => {
    const firstMapBtn = page.getByRole('button', { name: /View on Google Maps/i }).first();
    await expect(firstMapBtn).toBeVisible({ timeout: 15000 });
    await expect(firstMapBtn).toBeEnabled();
  });

});
