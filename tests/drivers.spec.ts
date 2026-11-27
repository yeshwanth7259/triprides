import { test, expect } from '@playwright/test';

test.describe('White Board Drivers & Chauffeur Verification Tests (Read-Only)', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/white-board-drivers', { waitUntil: 'domcontentloaded' });
  });

  test('DriveU style temporary driver page loads with 4 trust pillars and packages', async ({ page }) => {
    // Check main DriveU style headline
    await expect(page.getByRole('heading', { name: /Hire Temporary & Professional Drivers at Your Convenience/i })).toBeVisible({ timeout: 15000 });

    // Verify 4 Trust Pillars are visible
    await expect(page.getByText('100% Verified Trust').first()).toBeVisible();
    await expect(page.getByText('Secure & Skilled').first()).toBeVisible();
    await expect(page.getByText('Versatile & On-Demand').first()).toBeVisible();
    await expect(page.getByText('Punctual & Supported').first()).toBeVisible();

    // Verify official helpline contact number is present on the page
    const pageText = await page.innerText('body');
    expect(pageText).toContain('72593 35286');
  });

  test('Driver packages and transparent tariffs are displayed', async ({ page }) => {
    // Verify transparent packages
    await expect(page.getByText(/Local City \(4 Hours\)/i).first()).toBeVisible({ timeout: 15000 });
    await expect(page.getByText(/₹499/i).first()).toBeVisible();
    await expect(page.getByText(/Local City \(8 Hours\)/i).first()).toBeVisible();
    await expect(page.getByText(/₹899/i).first()).toBeVisible();
  });

  test('Driver onboarding modal contains file uploads for DL front, back and photo', async ({ page }) => {
    // Click Driver Onboarding button
    const onboardBtn = page.getByRole('button', { name: /Driver Onboarding \(Join as Driver\)/i }).first();
    await expect(onboardBtn).toBeVisible({ timeout: 15000 });
    await onboardBtn.click();

    // Verify DL Front upload
    await expect(page.getByText(/DL Front Copy/i).first()).toBeVisible({ timeout: 15000 });

    // Verify DL Back upload
    await expect(page.getByText(/DL Back Copy/i).first()).toBeVisible({ timeout: 15000 });

    // Verify Driver photo upload
    await expect(page.getByText(/Driver Profile Photo/i).first()).toBeVisible({ timeout: 15000 });
  });

});
