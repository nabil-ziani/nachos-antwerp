import { test, expect } from '@playwright/test';
import { fillCheckoutForm } from './utils';

test.describe('Checkout Process Tests', () => {
    test.skip('Customer can place a cash order for pickup', async ({ page }) => {
        // Navigate to the homepage
        await page.goto('/');

        // Select the correct restaurant
        const restaurantSelector = page.locator('[data-testid="restaurant-selector"]');
        await restaurantSelector.click();

        const berchemOption = page.locator('[data-testid="option-🍴-nacho\'s-berchem"]');
        await berchemOption.click();

        await expect(restaurantSelector).toHaveText("🍴 Nacho's Berchem");

        // Navigate to the menu page
        await page.click('[data-testid="nav-menu-link"]');

        // Add items to the cart
        await page.click('[data-testid="add-to-cart-quesadilla"]');

        // Go to checkout
        await page.click('[data-testid="go-to-checkout-button"]');

        // Fill in the checkout form
        await fillCheckoutForm(page, {
            firstname: 'John',
            lastname: 'Doe',
            email: 'john.doe@example.com',
            tel: '1234567890',
            postcode: '2600',
            city: 'Berchem',
            address: 'Diksmuidelaan 170',
            deliveryMethod: 'pickup',
            paymentMethod: 'cash',
        });

        // Place order
        await page.click('[data-testid="place-order-button"]', { force: true });

        // Wait for customer to be redirected to the order confirmation page
        await page.waitForURL(/order-confirmation/, { timeout: 10000 });

        // Verify the success message is displayed on the confirmation page
        const successMessage = page.locator('[data-testid="completed-icon"]');
        await expect(successMessage).toBeVisible();
    });

    test.skip('Customer can place a cash order for delivery', async ({ page }) => {
        // Navigate to the homepage
        await page.goto('/');

        // Select the correct restaurant
        const restaurantSelector = page.locator('[data-testid="restaurant-selector"]');
        await restaurantSelector.click();

        const berchemOption = page.locator('[data-testid="option-🍴-nacho\'s-berchem"]');
        await berchemOption.click();

        await expect(restaurantSelector).toHaveText("🍴 Nacho's Berchem");

        // Navigate to the menu page
        await page.click('[data-testid="nav-menu-link"]');

        // Add items to the cart
        await page.click('[data-testid="add-to-cart-quesadilla"]');

        // Go to checkout
        await page.click('[data-testid="go-to-checkout-button"]');

        // Fill in the checkout form
        await fillCheckoutForm(page, {
            firstname: 'John',
            lastname: 'Doe',
            email: 'john.doe@example.com',
            tel: '1234567890',
            postcode: '2600',
            city: 'Berchem',
            address: 'Diksmuidelaan 170',
            deliveryMethod: 'delivery',
            paymentMethod: 'cash',
        });

        // Place order
        await page.click('[data-testid="place-order-button"]', { force: true });

        // Wait for customer to be redirected to the order confirmation page
        await page.waitForURL(/order-confirmation/, { timeout: 10000 });

        // Verify the success message is displayed on the confirmation page
        const successMessage = page.locator('[data-testid="completed-icon"]');
        await expect(successMessage).toBeVisible();
    });

    test('Customer can place a Payconiq order for pickup', async ({ page }) => {
        // Navigate to the homepage
        await page.goto('/');

        // Select the correct restaurant
        const restaurantSelector = page.locator('[data-testid="restaurant-selector"]');
        await restaurantSelector.click();

        const berchemOption = page.locator('[data-testid="option-🍴-nacho\'s-berchem"]');
        await berchemOption.click();

        await expect(restaurantSelector).toHaveText("🍴 Nacho's Berchem");

        // Navigate to the menu page
        await page.click('[data-testid="nav-menu-link"]');

        // Add items to the cart
        await page.click('[data-testid="add-to-cart-quesadilla"]');

        // Go to checkout
        await page.click('[data-testid="go-to-checkout-button"]');

        // Fill in the checkout form
        await fillCheckoutForm(page, {
            firstname: 'John',
            lastname: 'Doe',
            email: 'john.doe@example.com',
            tel: '1234567890',
            postcode: '2600',
            city: 'Berchem',
            address: 'Diksmuidelaan 170',
            deliveryMethod: 'delivery',
            paymentMethod: 'cash',
        });

        // Place order
        await page.click('[data-testid="place-order-button"]', { force: true });

        // TODO: wait for customer to be redirected to the payment page
        await page.waitForURL(/order-confirmation/, { timeout: 10000 });

        // TODO: verify the QR code is displayed on the payment page
        const qrCode = page.locator('[data-testid="payment-qr-code"]');
        await expect(qrCode).toBeVisible();

        // TODO: verify the payment page has the correct data
        const paymentData = page.locator('[data-testid="payment-data"]');
        await expect(paymentData).toHaveText('1234567890');

        // Wait for customer to be redirected to the confirmation page
        await page.waitForURL(/order-confirmation/, { timeout: 10000 });

        // Verify the success message is displayed on the confirmation page
        const successMessage = page.locator('[data-testid="completed-icon"]');
        await expect(successMessage).toBeVisible();
    });

    test.skip('Customer can place a Payconiq order for delivery', async ({ page }) => {

    });

    test.skip('Company places an order and receives an invoice', async ({ page }) => {

    });
});

// TODO: Add tests for the following scenarios:
// - Customer places an order and receives a confirmation email
// - Customer places an order and receives a failed payment email
// - Customer places an order and cancels the payment
// - Company places an order and receives an invoice

