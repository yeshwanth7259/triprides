import { test, expect } from '@playwright/test';

test.describe('Admin Panel & Abandoned Lead Capture Tests (Read-Only)', () => {
  test('Admin dashboard loads with control center, metrics, and leads table', async ({ page }) => {
    const response = await page.goto('/admin');
    expect(response).not.toBeNull();
    expect(response!.status()).toBeLessThan(400);

    // Verify key UI elements in admin panel
    await expect(page.getByRole('heading', { name: /Leads & Booking Management Dashboard/i })).toBeVisible();
    await expect(page.getByText('Admin Control Center')).toBeVisible();
    await expect(page.getByText('Total Enquiries')).toBeVisible();
    await expect(page.getByRole('button', { name: /Left Mid-Way/i })).toBeVisible();
  });

  test('Floating Actions widget displays both support call and WhatsApp buttons', async ({ page }) => {
    await page.goto('/');
    
    // Check call helpline link in floating action widget
    const floatingCall = page.locator('a[aria-label="Call 24/7 Helpline"]');
    await expect(floatingCall).toBeVisible();

    // Check WhatsApp link in floating action widget
    const floatingWa = page.locator('a[aria-label="Chat on WhatsApp"]');
    await expect(floatingWa).toBeVisible();
  });
});
