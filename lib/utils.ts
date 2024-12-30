export const isTuesday = () => {
    return new Date().getDay() === 2; // 0 is Sunday, 2 is Tuesday
};

export const getTacoTuesdayDiscount = (items: any[]) => {
    if (!isTuesday()) return 0;

    // Filter taco items and calculate their total prices including variations
    const tacoItems = items
        .filter(item => item.title.toLowerCase().includes('taco'))
        .map(item => {
            const variationsTotal = item.selectedVariations
                ? Object.values(item.selectedVariations).flat().reduce((total: number, variation: any) =>
                    total + (variation.price || 0) * (variation.quantity || 1), 0)
                : 0;

            return {
                ...item,
                totalPrice: item.price + variationsTotal,
                quantity: item.quantity || 1
            };
        });

    // Calculate total number of tacos
    const tacoCount = tacoItems.reduce((total, item) => total + item.quantity, 0);

    if (tacoCount >= 2) {
        // Sort tacos by total price (including variations) to find the cheapest ones
        const sortedTacos = tacoItems.flatMap(item =>
            Array(item.quantity).fill({ ...item, singlePrice: item.totalPrice })
        ).sort((a, b) => a.singlePrice - b.singlePrice);

        // Calculate how many tacos should be discounted (half of total, rounded down)
        const tacosToDiscount = Math.floor(tacoCount / 2);

        // Sum up the prices of the cheapest tacos
        const discountAmount = sortedTacos
            .slice(0, tacosToDiscount)
            .reduce((total, item) => total + item.singlePrice, 0);

        return discountAmount;
    }

    return 0;
};

export const shouldShowTacoTuesdayReminder = (items: any[]) => {
    if (!isTuesday()) return false;

    const tacoCount = items
        .filter(item => item.title.toLowerCase().includes('taco'))
        .reduce((total, item) => total + (item.quantity || 1), 0);

    return tacoCount < 2;
}; 