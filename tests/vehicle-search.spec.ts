import { test, expect } from '@playwright/test';

test.describe('Vehicle Fare & Autocomplete Functional Tests (Read-Only)', () => {

  test('Pickup and destination autocomplete behaves correctly on 1-letter typing', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    // Locate the destination input
    const destInput = page.locator('input[placeholder*="Type 1 letter"]').first();
    await expect(destInput).toBeVisible({ timeout: 15000 });

    // Type 'c' to trigger 1-letter autocomplete dropdown
    await destInput.focus();
    await destInput.fill('c');

    // Autocomplete dropdown should display matching places
    const dropdownItem = page.getByText(/Coorg|Chikmagalur|Chennai/i).first();
    await expect(dropdownItem).toBeVisible({ timeout: 10000 });

    // Select the place
    await dropdownItem.click();
    await expect(destInput).not.toHaveValue('');
  });

  test('Vehicle category switching updates active models and pricing tariff badges', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    // Switch to Tempo Traveller category button
    const ttTab = page.getByRole('button', { name: /Tempo Traveller/i }).first();
    await expect(ttTab).toBeVisible({ timeout: 15000 });
    await ttTab.click();

    // Verify rate per km tariff badge is rendered in the search card (e.g. ₹21/km)
    const rateBadge = page.locator('span.text-\\[\\#FF7020\\], span:has-text("/km")').first();
    await expect(rateBadge).toBeVisible({ timeout: 15000 });
  });

  test('WhatsApp quote button includes official BookMyRoute helpline reference', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    // Verify the Email & WhatsApp CTA button is present and read-only inspected
    const quoteButton = page.getByRole('button', { name: /Send Quote to Email & WhatsApp|Get Instant Quote on WhatsApp/i }).first();
    await expect(quoteButton).toBeVisible({ timeout: 15000 });

    const pageText = await page.innerText('body');
    expect(pageText).toContain('72593 35286');
  });

});
