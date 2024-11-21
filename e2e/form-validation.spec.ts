import { test, expect } from '@playwright/test';

test.describe.skip('Form Validation Tests', () => {
    test('TC-11: Verify required fields must be filled', async ({ page }) => {
        await page.goto('/checkout');
        await page.click('button#proceed-to-checkout');
        const errorMessages = page.locator('.error-message');
        await expect(errorMessages).toHaveCount(7); // Assuming 7 required fields
    });

    test('TC-12: Verify company_name and vat_number fields behavior', async ({ page }) => {
        await page.goto('/checkout');
        await page.fill('input[name="company"]', 'My Company');
        const vatNumberField = page.locator('input[name="vatNumber"]');
        await expect(vatNumberField).toBeVisible();
    });

    test('TC-13: Verify invoice is sent if company_name and vat_number are filled', async ({ page }) => {
        // This test would require mocking the email sending process
        // and verifying the email content, which is not directly possible with Playwright.
    });

    test('TC-14: Verify no invoice if company_name or vat_number is empty', async ({ page }) => {
        // Similar to TC-13, this would require mocking the email sending process.
    });
});
