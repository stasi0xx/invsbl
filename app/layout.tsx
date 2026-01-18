import type { Metadata } from "next";
import { Unbounded, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { CartProvider } from "@/context/CartContext";
import { CartDrawer } from "@/components/CartDrawer";
import { Footer } from "@/components/Footer";

// --- ANALITYKA ---
import { GoogleTagManager, GoogleAnalytics } from "@next/third-parties/google"; // <--- GA4 i GTM z jednej paczki
import { MicrosoftClarity } from "@/components/analytics/MicrosoftClarity"; // <--- Twój komponent Client Side

const unbounded = Unbounded({
    variable: "--font-unbounded",
    subsets: ["latin"],
});

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'),
    title: {
        default: "INVSBL | Streetwear from Future",
        template: "%s | INVSBL"
    },
    description: "Concrete. Acid. Visibility. Premium streetwear made in Poland.",
    openGraph: {
        type: 'website',
        locale: 'pl_PL',
        siteName: 'INVSBL',
    }
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="pl">
        <body className={`${unbounded.variable} ${geistSans.variable} ${geistMono.variable} antialiased bg-black text-white`}>

        {/* 1. Google Tag Manager (Do Pixeli FB, TikToka, reklam itp.) */}
        {process.env.NEXT_PUBLIC_GTM_ID && (
            <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GTM_ID} />
        )}

        {/* 2. Google Analytics 4 (Kluczowe dla e-commerce: sprzedaż, ruch) */}
        {process.env.NEXT_PUBLIC_GA_ID && (
            <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
        )}

        {/* 3. Microsoft Clarity (Mapy cieplne i nagrania sesji) */}
        <MicrosoftClarity />

        <CartProvider>
            <Header />
            <CartDrawer />

            <div className="flex flex-col min-h-screen">
                <div className="flex-1">
                    {children}
                </div>
                <Footer />
            </div>
        </CartProvider>
        </body>
        </html>
    );
}