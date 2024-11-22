import { test, expect } from '@playwright/test';

test.describe('Menu and Cart Tests', () => {
    test('TC-04: Customer can add menu items to cart', async ({ page }) => {
        // Navigate to the menu page
        await page.goto('/menu');

        // Add item to cart
        await page.click('[data-testid="add-to-cart-quesadilla"]');

        // Verify cart count
        const cartCount = page.locator('[data-testid="cart-amount"]');
        await expect(cartCount).toHaveText('1');
    });

    test('TC-05: Customer can remove items from mini cart', async ({ page }) => {
        // Navigate to the menu page and add an item to the cart
        await page.goto('/menu');
        await page.click('[data-testid="add-to-cart-quesadilla"]');

        // Mini cart opens automatically when an item is added to the cart
        await page.waitForSelector('[data-testid="mini-cart"]', { state: 'visible' });

        // Remove item from mini cart
        await page.click('[data-testid="remove-from-cart-quesadilla"]', { force: true });

        // Wait for the cart count to update
        await page.waitForFunction(() => {
            const cartCountElement = document.querySelector('[data-testid="cart-amount"]');

            return cartCountElement && cartCountElement.textContent === '0';
        }, { timeout: 10000 });

        // Verify the cart is empty
        const cartCount = page.locator('[data-testid="cart-amount"]');
        await expect(cartCount).toHaveText('0');
    });
});
