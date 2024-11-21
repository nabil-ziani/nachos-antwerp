import { test, expect } from '@playwright/test';

test.describe.skip('Remember Details Tests', () => {
    test('TC-15: Verify fields are pre-filled when "remember details" is checked', async ({ page }) => {
        await page.goto('/checkout');
        await page.fill('input[name="firstname"]', 'John');
        await page.click('input#remember-details');
        await page.click('button#proceed-to-checkout');
        await page.goto('/checkout');
        const firstnameField = page.locator('input[name="firstname"]');
        await expect(firstnameField).toHaveValue('John');
    });

    test('TC-16: Verify fields are not pre-filled when "remember details" is unchecked', async ({ page }) => {
        await page.goto('/checkout');
        await page.fill('input[name="firstname"]', 'John');
        await page.click('button#proceed-to-checkout');
        await page.goto('/checkout');
        const firstnameField = page.locator('input[name="firstname"]');
        await expect(firstnameField).toHaveValue('');
    });
});
