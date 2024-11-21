import { test, expect } from '@playwright/test';

test.describe.skip('Payment Method Tests', () => {
    test('TC-20: Verify selection between cash and Payconiq', async ({ page }) => {
        await page.goto('/checkout');
        await page.click('input#cash');
        await expect(page.locator('input#cash')).toBeChecked();
        await page.click('input#payconiq');
        await expect(page.locator('input#payconiq')).toBeChecked();
    });

    test('TC-21: Verify redirection to confirmation page for cash payment', async ({ page }) => {
        await page.goto('/checkout');
        await page.fill('input[name="firstname"]', 'John');
        await page.fill('input[name="lastname"]', 'Doe');
        await page.fill('input[name="email"]', 'john.doe@example.com');
        await page.fill('input[name="tel"]', '1234567890');
        await page.fill('input[name="postcode"]', '2600');
        await page.fill('input[name="city"]', 'Berchem');
        await page.fill('input[name="address"]', 'Diksmuidelaan 170');
        await page.click('input#cash');
        await page.click('button#proceed-to-checkout');
        await expect(page).toHaveURL(/order-confirmation/);
    });

    test('TC-22: Verify redirection to payment page for Payconiq', async ({ page }) => {
        await page.goto('/checkout');
        await page.fill('input[name="firstname"]', 'John');
        await page.fill('input[name="lastname"]', 'Doe');
        await page.fill('input[name="email"]', 'john.doe@example.com');
        await page.fill('input[name="tel"]', '1234567890');
        await page.fill('input[name="postcode"]', '2600');
        await page.fill('input[name="city"]', 'Berchem');
        await page.fill('input[name="address"]', 'Diksmuidelaan 170');
        await page.click('input#payconiq');
        await page.click('button#proceed-to-checkout');
        await expect(page).toHaveURL(/payment/);
        const qrCode = page.locator('.tst-payment-qr img');
        await expect(qrCode).toBeVisible();
    });

    test('TC-23: Verify redirection to confirmation page after Payconiq payment', async ({ page }) => {
        // This test would require simulating a successful payment, which might involve mocking the payment API.
    });

    test('TC-24: Verify confirmation page text based on payment status', async ({ page }) => {
        // This test would require simulating both successful and failed payments.
    });
});
