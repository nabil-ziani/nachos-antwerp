'use client';

import { useRestaurant } from '@/contexts/restaurant-context';
import { useCart } from '@/hooks/useCart';

export function MinimumOrderInfo({ postcode }: { postcode: string }) {
    const { findRestaurantByPostalCode } = useRestaurant();
    const { cartTotal } = useCart();
    
    const { minimumAmount } = findRestaurantByPostalCode(postcode);
    
    if (!minimumAmount) return null;
    
    const remaining = minimumAmount - cartTotal;
    
    return (
        <div className="minimum-order-info">
            {remaining > 0 ? (
                <p className="text-warning">
                    Nog €{remaining.toFixed(2)} te bestellen voor levering in {postcode}
                </p>
            ) : (
                <p className="text-success">
                    Minimum bestelbedrag bereikt voor {postcode}
                </p>
            )}
            <small>
                Minimum bestelbedrag: €{minimumAmount.toFixed(2)}
            </small>
        </div>
    );
}
