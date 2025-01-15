import { CheckoutFormValues, CartItem, Restaurant } from '@/types';

export function createOrderData(
    orderId: string,
    values: CheckoutFormValues,
    totalAmount: number,
    cartItems: CartItem[],
    selectedRestaurant: Restaurant | null,
    //coordinates: { latitude: number; longitude: number } | null
) {
    return {
        orderId: orderId,
        paymentMethod: values.paymentMethod,
        paymentStatus: values.paymentMethod === 'cash' ? 'completed' : 'pending',
        amount: totalAmount,
        customerName: `${values.firstName} ${values.lastName}`,
        customerEmail: values.email,
        customerPhone: values.tel,
        customerCompany: values.company,
        customerVatNumber: values.vatNumber,
        deliveryMethod: values.deliveryMethod,
        deliveryAddress: values.deliveryMethod === 'delivery' ? {
            street: values.address,
            city: values.city,
            postcode: values.postcode
        } : null,
        orderItems: cartItems.map(item => ({
            title: item.title,
            price: item.price,
            quantity: item.quantity,
            total: item.price * item.quantity,
            currency: item.currency,
            image: item.image,
            selectedVariations: item.selectedVariations || null
        })),
        restaurantId: selectedRestaurant?.id,
        notes: values.message,
        //latitude: coordinates?.latitude || null,
        //longitude: coordinates?.longitude || null,
    };
}