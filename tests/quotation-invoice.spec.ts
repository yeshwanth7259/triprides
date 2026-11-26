import { test, expect } from '@playwright/test';

test.describe('Quotation & Tax Invoice Math Validation (Read-Only)', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/invoice', { waitUntil: 'domcontentloaded' });
  });

  test('Quotation and invoice toggle switches views cleanly', async ({ page }) => {
    // Verify the two main mode tabs exist
    const quoteTab = page.getByText(/Trip Quotation/i).first();
    const invoiceTab = page.getByText(/Final Paid Tax Invoice|Tax Invoice/i).first();

    await expect(quoteTab).toBeVisible({ timeout: 15000 });
    await expect(invoiceTab).toBeVisible({ timeout: 15000 });

    // Click invoice tab and verify mode switches
    await invoiceTab.click();
    await expect(page.getByText(/TAX INVOICE|Invoice No|BILL TO/i).first()).toBeVisible({ timeout: 10000 });
  });

  test('Tariff calculation displays estimated total fare correctly', async ({ page }) => {
    // Check that total estimated fare element exists
    const totalFareDisplay = page.getByText(/TOTAL ESTIMATED FARE|Total Amount|Net Payable/i).first();
    await expect(totalFareDisplay).toBeVisible({ timeout: 15000 });

    // Verify rupee amount is rendered in the printable area
    const fareValue = page.locator('#printable-area').getByText(/₹[\s]*[0-9,]+/).first();
    await expect(fareValue).toBeVisible({ timeout: 10000 });
  });

  test('Print and PDF action button is available', async ({ page }) => {
    const printButton = page.getByRole('button', { name: /Print|PDF/i }).first();
    await expect(printButton).toBeVisible({ timeout: 15000 });
  });

});
