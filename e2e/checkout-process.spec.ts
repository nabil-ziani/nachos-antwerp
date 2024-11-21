import { test, expect } from '@playwright/test';

test.describe.skip('Checkout Process Tests', () => {
    test('TC-07: Verify checkout page displays all required fields', async ({ page }) => {
        await page.goto('/');
        const requiredFields = ['firstname', 'lastname', 'email', 'tel', 'postcode', 'city', 'address'];
        for (const field of requiredFields) {
            await expect(page.locator(`input[name="${field}"]`)).toBeVisible();
        }
    });

    test('TC-08: Verify error for minimum order price not met', async ({ page }) => {
        await page.goto('/checkout');
        await page.fill('input[name="postcode"]', '2600');
        await page.click('button#proceed-to-checkout');
        const errorMessage = page.locator('.tst-form-status.error');
        await expect(errorMessage).toContainText('Minimum bestelbedrag niet bereikt');
    });

    test('TC-09: Verify no error for pickup orders', async ({ page }) => {
        await page.goto('/checkout');
        await page.click('input#pickup');
        await page.click('button#proceed-to-checkout');
        const errorMessage = page.locator('.tst-form-status.error');
        await expect(errorMessage).toBeHidden();
    });

    test('TC-10: Verify successful checkout with valid input', async ({ page }) => {
        await page.goto('/checkout');
        await page.fill('input[name="firstname"]', 'John');
        await page.fill('input[name="lastname"]', 'Doe');
        await page.fill('input[name="email"]', 'john.doe@example.com');
        await page.fill('input[name="tel"]', '1234567890');
        await page.fill('input[name="postcode"]', '2600');
        await page.fill('input[name="city"]', 'Berchem');
        await page.fill('input[name="address"]', 'Diksmuidelaan 170');
        await page.click('button#proceed-to-checkout');
        await expect(page).toHaveURL(/order-confirmation/);
    });
});
