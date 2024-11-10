"use client"

import { Restaurant } from '@/lib/types'

interface LocationSwitchModalProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
    alternativeRestaurant: Restaurant | null
    postalCode: string
}

export function LocationSwitchModal({
    isOpen,
    onClose,
    onConfirm,
    alternativeRestaurant,
    postalCode
}: LocationSwitchModalProps) {
    if (!isOpen || !alternativeRestaurant) return null

    return (
        <div className="tst-modal-overlay">
            <div className="tst-modal">
                <h4>Andere Locatie Beschikbaar</h4>
                <p>
                    We zien dat ons restaurant in {alternativeRestaurant.name} bezorgt in {postalCode}.
                    Wil je je bestelling overzetten naar deze locatie?
                </p>
                <div className="tst-modal-actions">
                    <button className="tst-btn tst-btn-secondary" onClick={onClose}>
                        Annuleren
                    </button>
                    <button className="tst-btn" onClick={onConfirm}>
                        Wijzig Locatie
                    </button>
                </div>
            </div>
        </div>
    )
} 