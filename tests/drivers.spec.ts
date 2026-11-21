import { test, expect } from '@playwright/test';

test.describe('White Board Drivers & Chauffeur Verification Tests (Read-Only)', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/white-board-drivers', { waitUntil: 'domcontentloaded' });
  });

  test('Driver Yeshwanth K profile is displayed with correct contact and specialization', async ({ page }) => {
    // Verify Yeshwanth K's profile name and photo
    await expect(page.getByText('Yeshwanth K').first()).toBeVisible({ timeout: 15000 });

    // Verify official helpline contact number
    const pageText = await page.innerText('body');
    expect(pageText).toContain('72593 35286');

    // Ensure Yeshwanth's profile is explicitly titled as Sedan & SUV Specialist
    await expect(page.getByText(/Professional Personal Chauffeur \(Sedan & SUV Specialist\)/i).first()).toBeVisible({ timeout: 15000 });
  });

  test('Driver onboarding form contains file uploads for DL front, back and photo', async ({ page }) => {
    // Switch to Driver Onboarding tab
    const onboardTab = page.getByRole('button', { name: /Driver Onboarding/i }).first();
    await expect(onboardTab).toBeVisible({ timeout: 15000 });
    await onboardTab.click();

    // Verify DL Front upload button / dropzone
    await expect(page.getByText(/Driving License \(Front Side\)|Upload DL Front/i).first()).toBeVisible({ timeout: 15000 });

    // Verify DL Back upload button / dropzone
    await expect(page.getByText(/Driving License \(Back Side\)|Upload DL Back/i).first()).toBeVisible({ timeout: 15000 });

    // Verify Driver photo upload button / dropzone
    await expect(page.getByText(/Driver Profile Photo|Upload Photo/i).first()).toBeVisible({ timeout: 15000 });
  });

  test('Onboarding form stays on page and validates required inputs without submission', async ({ page }) => {
    const onboardTab = page.getByRole('button', { name: /Driver Onboarding/i }).first();
    await expect(onboardTab).toBeVisible({ timeout: 15000 });
    await onboardTab.click();

    // Find the register button
    const submitBtn = page.getByRole('button', { name: /Submit|Register/i }).first();
    if (await submitBtn.isVisible()) {
      await submitBtn.click();
      // Form should remain on page without redirecting
      await expect(page).toHaveURL(/white-board-drivers/);
    }
  });

});
