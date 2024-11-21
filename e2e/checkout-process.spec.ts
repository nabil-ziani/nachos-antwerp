import { test, expect } from '@playwright/test';
import { fillCheckoutForm } from './utils';
import { v4 as uuidv4 } from 'uuid';

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
        // ***** Preparations *****
        const uniqueOrderId = `order-${uuidv4()}`;
        const mockQrCodeUrl = 'https://via.placeholder.com/150';

        // Intercept the Payconiq API request and mock the response
        await page.route('/api/payconiq/create-payment', (route) => {
            route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({
                    paymentId: uniqueOrderId,
                    _links: {
                        qrcode: { href: mockQrCodeUrl },
                        deeplink: { href: 'mock-deeplink-url' }
                    }
                })
            });
        });

        // ***** Start of the test *****
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
            paymentMethod: 'payconiq',
        });

        // Place order
        await page.click('[data-testid="place-order-button"]', { force: true });

        // Store the QR code URL in localStorage
        await page.evaluate(({ orderId, qrCodeUrl }) => {
            localStorage.setItem(`payment_${orderId}`, qrCodeUrl);
        }, { orderId: uniqueOrderId, qrCodeUrl: mockQrCodeUrl });

        // Wait for customer to be redirected to the payment page
        await page.waitForURL(`/payment/${uniqueOrderId}`, { timeout: 10000 });

        // Verify the QR code is displayed on the payment page
        const qrCode = page.locator('[data-testid="payment-qr-code"]');
        await expect(qrCode).toBeVisible({ timeout: 10000 });

        // Simulate the callback from Payconiq
        await page.evaluate(async (orderId) => {
            const response = await fetch('/api/payconiq/callback', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    paymentId: orderId,
                    status: 'SUCCEEDED'
                })
            });
            const result = await response.json();
            console.log('Callback response:', result);
        }, uniqueOrderId);

        // Wait for customer to be redirected to the confirmation page
        await page.waitForURL(`/order-confirmation/${uniqueOrderId}`, { timeout: 10000 });

        // Verify the success message is displayed on the confirmation page
        const successMessage = page.locator('[data-testid="completed-icon"]');
        await expect(successMessage).toBeVisible();
    });

    test('Customer can place a Payconiq order for delivery', async ({ page }) => {
        // ***** Preparations *****
        const uniqueOrderId = `order-${uuidv4()}`;
        const mockQrCodeUrl = 'https://via.placeholder.com/150';

        // Intercept the Payconiq API request and mock the response
        await page.route('/api/payconiq/create-payment', (route) => {
            route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({
                    paymentId: uniqueOrderId,
                    _links: {
                        qrcode: { href: mockQrCodeUrl },
                        deeplink: { href: 'mock-deeplink-url' }
                    }
                })
            });
        });

        // ***** Start of the test *****
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
            paymentMethod: 'payconiq',
        });

        // Place order
        await page.click('[data-testid="place-order-button"]', { force: true });

        // Store the QR code URL in localStorage
        await page.evaluate(({ orderId, qrCodeUrl }) => {
            localStorage.setItem(`payment_${orderId}`, qrCodeUrl);
        }, { orderId: uniqueOrderId, qrCodeUrl: mockQrCodeUrl });

        // Wait for customer to be redirected to the payment page
        await page.waitForURL(`/payment/${uniqueOrderId}`, { timeout: 10000 });

        // Verify the QR code is displayed on the payment page
        const qrCode = page.locator('[data-testid="payment-qr-code"]');
        await expect(qrCode).toBeVisible({ timeout: 10000 });

        // Simulate the callback from Payconiq
        await page.evaluate(async (orderId) => {
            const response = await fetch('/api/payconiq/callback', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    paymentId: orderId,
                    status: 'SUCCEEDED'
                })
            });
            const result = await response.json();
            console.log('Callback response:', result);
        }, uniqueOrderId);

        // Wait for customer to be redirected to the confirmation page
        await page.waitForURL(`/order-confirmation/${uniqueOrderId}`, { timeout: 10000 });

        // Verify the success message is displayed on the confirmation page
        const successMessage = page.locator('[data-testid="completed-icon"]');
        await expect(successMessage).toBeVisible();
    });

    test.skip('Company places an order and receives an invoice', async ({ page }) => {
        // TODO: Implement this test
    });
});

// TODO: Add tests for the following scenarios:
// - Customer places an order and receives a confirmation email
// - Customer places an order and receives a failed payment email
// - Customer places an order and cancels the payment
// - Company places an order and receives an invoice

