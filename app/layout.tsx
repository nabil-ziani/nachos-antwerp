import { Josefin_Sans, Playfair_Display } from 'next/font/google'
import { RestaurantProvider } from '@/contexts/restaurant-context'
import { PaymentProvider } from '@/contexts/payment-context'
import { Suspense } from 'react'
import Loading from './loading'

const josefin_sans = Josefin_Sans({
  weight: ['100', '200', '300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-josefin_sans',
  display: 'swap',
  adjustFontFallback: false,
})

const playfair_display = Playfair_Display({
  weight: ['400', '500', '600', '700', '800', '900', '700'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-playfair_display',
  display: 'swap',
  adjustFontFallback: false,
})

import "./globals.css";
import '@/styles/confirmation.css';

import "@/app/styles/css/plugins/bootstrap.min.css";
import "@/app/styles/css/plugins/swiper.min.css";
import "@/app/styles/css/plugins/font-awesome.min.css";
import { register } from "swiper/element/bundle";
// register Swiper custom elements
register();

import '@/app/styles/scss/style.scss';

import AppData from "@/data/app.json";
import { ToastContainer } from 'react-toastify'

export const metadata = {
  title: {
    default: AppData.settings.siteName,
    template: "%s | " + AppData.settings.siteName,
  },
  description: AppData.settings.siteDescription,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${josefin_sans.variable} ${playfair_display.variable}`}>
      <body style={{ "backgroundImage": "url(" + AppData.settings.bgImage + ")" }}>
        <div className="tst-main-overlay"></div>
        <RestaurantProvider>
          <PaymentProvider>
            <div id="tst-app" className="tst-app">
              <Suspense fallback={<Loading />}>
                {children}
              </Suspense>
              <ToastContainer />
            </div>
          </PaymentProvider>
        </RestaurantProvider>
      </body>
    </html>
  );
}
