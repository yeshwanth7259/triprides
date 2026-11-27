import { test, expect } from '@playwright/test';

test.describe('Admin Panel & Abandoned Lead Capture Tests (Read-Only)', () => {
  test('Admin dashboard loads with stats and navigation', async ({ page }) => {
    const response = await page.goto('/admin');
    expect(response).not.toBeNull();
    expect(response!.status()).toBeLessThan(400);

    // Verify key UI elements in admin panel
    await expect(page.locator('text=BookMyRoute Admin')).toBeVisible();
    await expect(page.locator('text=Leads Management')).toBeVisible();
    await expect(page.locator('text=Total Inquiries')).toBeVisible();
    await expect(page.locator('text=Abandoned Leads')).toBeVisible();
  });

  test('Floating Actions widget displays both support call and WhatsApp buttons', async ({ page }) => {
    await page.goto('/');
    
    // Check call helpline link
    const callBtn = page.locator('a[href^="tel:"]');
    await expect(callBtn.first()).toBeVisible();

    // Check WhatsApp link
    const waBtn = page.locator('a[href*="wa.me"]');
    await expect(waBtn.first()).toBeVisible();
  });
});
