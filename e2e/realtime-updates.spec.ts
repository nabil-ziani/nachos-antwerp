import { createClient } from '@/utils/supabase/server';
import { test, expect } from '@playwright/test';
import { v4 as uuidv4 } from 'uuid';

test.skip('Application handles real-time payment status updates', async ({ page }) => {
    const uniqueOrderId = `order-${uuidv4()}`;

    // Simulate a real-time update from Supabase
    const supabase = await createClient();
    await supabase
        .from('orders')
        .update({ payment_status: 'completed' })
        .eq('order_id', uniqueOrderId);

    // Verify that the application responds to the real-time update
    await page.waitForURL(`/order-confirmation/${uniqueOrderId}`, { timeout: 10000 });

    const successMessage = page.locator('[data-testid="completed-icon"]');
    await expect(successMessage).toBeVisible();
}); 