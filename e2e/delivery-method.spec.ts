import { test, expect } from '@playwright/test';

test.describe.skip('Delivery Method Tests', () => {
    test('TC-17: Verify selection between pickup and delivery', async ({ page }) => {
        await page.goto('/checkout');
        await page.click('input#pickup');
        await expect(page.locator('input#pickup')).toBeChecked();
        await page.click('input#delivery');
        await expect(page.locator('input#delivery')).toBeChecked();
    });

    test('TC-18: Verify minimum order validation is bypassed for pickup', async ({ page }) => {
        await page.goto('/checkout');
        await page.click('input#pickup');
        await page.click('button#proceed-to-checkout');
        const errorMessage = page.locator('.tst-form-status.error');
        await expect(errorMessage).toBeHidden();
    });

    test('TC-19: Verify error for unsupported postal codes on delivery', async ({ page }) => {
        await page.goto('/checkout');
        await page.click('input#delivery');
        await page.fill('input[name="postcode"]', '9999');
        await page.click('button#proceed-to-checkout');
        const errorMessage = page.locator('.tst-form-status.error');
        await expect(errorMessage).toContainText('We bezorgen niet in 9999.');
    });
});
