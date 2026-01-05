import type { Metadata } from "next";
import { Unbounded, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header"; // <--- Importujemy Header
import { CartProvider } from "@/context/CartContext"; // <--- NOWE
import { CartDrawer } from "@/components/CartDrawer";
import {Footer} from "@/components/Footer";

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
    title: "INVSBL | Streetwear from Future",
    description: "Concrete. Acid. Visibility.",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="pl">
        <body className="...">
        <CartProvider>
            <Header />
            <CartDrawer />

            <div className="flex flex-col min-h-screen">
                {/* ZMIANA TUTAJ: */}
                {/* 1. Zmieniono <main> na <div> (żeby nie dublować main z page.tsx) */}
                {/* 2. USUNIĘTO klasę pt-[100px] - teraz Hero wjedzie pod header */}
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