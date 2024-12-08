export const isTuesday = () => {
    return new Date().getDay() === 2; // 0 is Sunday, 2 is Tuesday
};

export const getTacoTuesdayDiscount = (items: any[]) => {
    if (!isTuesday()) return 0;

    // Count total number of tacos including quantities
    const tacoCount = items
        .filter(item => item.title.toLowerCase().includes('taco'))
        .reduce((total, item) => total + (item.quantity || 1), 0);

    // If we have at least 2 tacos, give discount for half of them
    if (tacoCount >= 2) {
        const tacosToDiscount = Math.floor(tacoCount / 2);
        const tacoItems = items
            .filter(item => item.title.toLowerCase().includes('taco'))
            .slice(0, 1); // We only need one item since we'll multiply by quantity

        return tacoItems[0].price * tacosToDiscount;
    }

    return 0;
};

export const shouldShowTacoTuesdayReminder = (items: any[]) => {
    if (!isTuesday()) return false;

    const tacoCount = items
        .filter(item => item.title.toLowerCase().includes('taco'))
        .reduce((total, item) => total + (item.quantity || 1), 0);

    console.log('tacoCount including quantities:', tacoCount);
    return tacoCount < 2;
}; 