import { CheckoutFormValues, CartItem, Restaurant } from '@/lib/types';

export function createOrderData(
    orderId: string,
    values: CheckoutFormValues,
    totalAmount: number,
    cartItems: CartItem[],
    selectedRestaurant: Restaurant | null,
    //coordinates: { latitude: number; longitude: number } | null
) {
    return {
        order_id: orderId,
        payment_method: values.payment_method,
        payment_status: values.payment_method === 'cash' ? 'completed' : 'pending',
        amount: totalAmount,
        customer_name: `${values.firstname} ${values.lastname}`,
        customer_email: values.email,
        customer_phone: values.tel,
        customer_company: values.company,
        customer_vatnumber: values.vatNumber,
        delivery_method: values.delivery_method,
        delivery_address: values.delivery_method === 'delivery' ? {
            street: values.address,
            city: values.city,
            postcode: values.postcode
        } : null,
        order_items: cartItems.map(item => ({
            title: item.title,
            price: item.price,
            quantity: item.quantity,
            total: item.price * item.quantity,
            currency: item.currency,
            image: item.image
        })),
        restaurant_id: selectedRestaurant?.id,
        notes: values.message,
        //latitude: coordinates?.latitude || null,
        //longitude: coordinates?.longitude || null,
    };
}