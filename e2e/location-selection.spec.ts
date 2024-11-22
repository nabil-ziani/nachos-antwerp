import { test, expect } from '@playwright/test';

test.describe('Location Selection Tests', () => {
    test('TC-01: Restaurant location is set based on geolocation (permission granted)', async ({ page }) => {
        // Navigate to the homepage
        await page.goto('/');

        // Mock geolocation to a specific latitude and longitude
        await page.context().grantPermissions(['geolocation']);
        await page.context().setGeolocation({ latitude: 51.1959213503892, longitude: 4.44430151333821, accuracy: 100 });

        // Reload the page to apply the geolocation
        await page.reload();

        // Check if the restaurant is set based on geolocation
        const restaurantSelector = page.locator('[data-testid="restaurant-selector"]');
        await expect(restaurantSelector).toHaveText("🍴 Nacho's Berchem", { timeout: 10000 });
    });

    test('TC-02: Default restaurant is selected if geolocation fails', async ({ page }) => {
        // Navigate to the homepage
        await page.goto('/');

        // Deny geolocation
        await page.context().grantPermissions([]);

        // Check if the first restaurant (Nacho's Merksem) is selected by default
        const restaurantSelector = page.locator('[data-testid="restaurant-selector"]');
        await expect(restaurantSelector).toHaveText("🍴 Nacho's Merksem", { timeout: 10000 });
    });

    test('TC-03: Customer can manually change restaurant location', async ({ page }) => {
        // Navigate to the homepage
        await page.goto('/');

        // Mock geolocation to a specific latitude and longitude
        await page.context().grantPermissions(['geolocation']);
        await page.context().setGeolocation({ latitude: 51.1959213503892, longitude: 4.44430151333821, accuracy: 100 });

        // Reload the page to apply the geolocation
        await page.reload();

        // Initially check if the restaurant is set based on geolocation
        const restaurantSelector = page.locator('[data-testid="restaurant-selector"]');
        await expect(restaurantSelector).toHaveText("🍴 Nacho's Berchem", { timeout: 10000 });

        // Manually change the restaurant
        await restaurantSelector.click();
        const merksemOption = page.locator('[data-testid="option-🍴-nacho\'s-merksem"]');
        await merksemOption.click();

        // Verify the restaurant has been changed manually
        await expect(restaurantSelector).toHaveText("🍴 Nacho's Merksem", { timeout: 10000 });
    });
});
