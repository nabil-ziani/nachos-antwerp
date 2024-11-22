import { test, expect } from '@playwright/test';

test.describe.skip('Error Handling Tests', () => {
    test('TC-25: Verify error message for invalid email format', async ({ page }) => {
        await page.goto('/checkout');
        await page.fill('input[name="email"]', 'invalid-email');
        await page.click('button#proceed-to-checkout');
        const errorMessage = page.locator('.error-message');
        await expect(errorMessage).toContainText('Ongeldige mailadres');
    });

    test('TC-26: Verify error messages for incomplete form submissions', async ({ page }) => {
        await page.goto('/checkout');
        await page.click('button#proceed-to-checkout');
        const errorMessages = page.locator('.error-message');
        await expect(errorMessages).toHaveCount(7); // Assuming 7 required fields
    });
});
