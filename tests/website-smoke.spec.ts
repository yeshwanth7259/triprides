import { test, expect } from '@playwright/test';

const routes = [
  '/',
  '/homestays',
  '/white-board-drivers',
  '/invoice',
  '/vehicles',
  '/pricing'
];

test.describe('BookMyRoute production smoke tests', () => {

  for (const route of routes) {
    test(`Verify page: ${route}`, async ({ page }) => {
      const response = await page.goto(route);

      expect(response).not.toBeNull();
      expect(response!.status()).toBeLessThan(400);

      await expect(page.locator('body')).toBeVisible();

      const content = await page.locator('body').innerText();
      expect(content.trim().length).toBeGreaterThan(0);

      console.log(`PASS: ${route}`);
    });
  }

  test('Check homepage navigation links', async ({ page }) => {
    await page.goto('/');

    const links = page.locator('a[href]');
    expect(await links.count()).toBeGreaterThan(0);

    console.log(
      'Homepage links:',
      await links.count()
    );
  });

  test('Check mobile responsiveness', async ({ page }) => {
    await page.goto('/');

    const dimensions = await page.evaluate(() => ({
      viewport: document.documentElement.clientWidth,
      content: document.documentElement.scrollWidth
    }));

    expect(dimensions.content).toBeLessThanOrEqual(
      dimensions.viewport + 2
    );
  });

});
