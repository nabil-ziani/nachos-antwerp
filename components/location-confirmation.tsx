import { Restaurant } from '@/types';

interface LocationConfirmationProps {
    selectedRestaurant: Restaurant | null;
}

export const LocationConfirmation = ({ selectedRestaurant }: LocationConfirmationProps) => {
    if (!selectedRestaurant) return null;

    return (
        <div className="tst-location-confirmation">
            <div className="tst-location-icon">
                <i className="fas fa-map-marker-alt"></i>
            </div>
            <div className="tst-location-details">
                <h6>Je bestelt bij {selectedRestaurant.name}</h6>
                <p>{selectedRestaurant.address}</p>
            </div>
        </div>
    );
};