import { Page } from "playwright/test";

export async function fillCheckoutForm(page: Page, details: any) {
    await page.fill(`input#checkout-firstname`, details.firstname);
    await page.fill(`input#checkout-lastname`, details.lastname);
    await page.fill(`input#checkout-email`, details.email);
    await page.fill(`input#checkout-tel`, details.tel);
    await page.fill(`input#checkout-postcode`, details.postcode);
    await page.fill(`input#checkout-city`, details.city);
    await page.fill(`input#checkout-address`, details.address);

    if (details.company) {
        await page.fill(`input#checkout-company`, details.company);
        await page.fill(`input#checkout-vatNumber`, details.vatNumber);
    }

    if (details.message) {
        await page.fill('textarea[name="message"]', details.message);
    }

    await page.click(`[data-testid="${details.deliveryMethod}-radio"]`, { force: true });
    await page.click(`[data-testid="${details.paymentMethod}-radio"]`, { force: true });
}

/*
export async function verifyEmailContent(mailosaurClient, serverId, expectedContent) {
    const email = await mailosaurClient.messages.get(serverId, {
        sentTo: expectedContent.email
    });

    expect(email.subject).toContain('Order Confirmation');
    expect(email.html.body).toContain(expectedContent.address);
    expect(email.html.body).toContain(expectedContent.deliveryMethod === 'pickup' ? 'Restaurant Address' : expectedContent.address);
}
*/