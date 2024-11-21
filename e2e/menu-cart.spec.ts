import { test, expect } from '@playwright/test';

test.describe.skip('Menu and Cart Tests', () => {
    test('TC-04: Verify adding menu items to cart', async ({ page }) => {
        await page.goto('/menu');
        await page.click('button#add-to-cart-1'); // Assuming button has an ID
        const cartCount = page.locator('.cart-count');
        await expect(cartCount).toHaveText('1');
    });

    test('TC-05: Verify viewing cart with selected items', async ({ page }) => {
        await page.goto('/cart');
        const cartItems = page.locator('.cart-item');
        await expect(cartItems).toHaveCount(1);
    });

    test('TC-06: Verify removing items from cart', async ({ page }) => {
        await page.goto('/cart');
        await page.click('button#remove-from-cart-1');
        const cartItems = page.locator('.cart-item');
        await expect(cartItems).toHaveCount(0);
    });
});
