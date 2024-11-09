interface NotificationBannerProps {
    message: string;
    isVisible: boolean;
    onClose?: () => void;
}

export function NotificationBanner({ message, isVisible, onClose }: NotificationBannerProps) {
    if (!isVisible) return null;
    
    return (
        <div className="tst-notification-banner">
            <div className="container">
                <span>{message}</span>
                {onClose && (
                    <button onClick={onClose} className="tst-notification-close">
                        ×
                    </button>
                )}
            </div>
        </div>
    );
} 