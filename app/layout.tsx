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
        <body
            className={`${geistSans.variable} ${geistMono.variable} ${unbounded.variable} antialiased bg-[#09090b] text-[#f4f4f5]`}
        >
        <CartProvider>
            <Header />
            <CartDrawer /> {/* <--- KOSZYK JEST ZAWSZE W STRUKTURZE */}

            <div className="flex flex-col min-h-screen">
                <main className="flex-1 pt-[100px]">
                    {children}
                </main>

                {/* 3. Wstaw Stopkę tutaj */}
                <Footer />
            </div>
        </CartProvider>

        </body>
        </html>
    );
}