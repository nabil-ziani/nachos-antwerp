import { Suspense } from 'react'

export default function Loading() {
    return (
        <Suspense>
            <div className="tst-loading-overlay">
                <div className="tst-loading-content">
                    <div className="tst-loading-dots">
                        <div className="tst-dot"></div>
                        <div className="tst-dot"></div>
                        <div className="tst-dot"></div>
                    </div>
                    <h3>Laden<span>...</span></h3>
                </div>
            </div>
        </Suspense>
    )
} 