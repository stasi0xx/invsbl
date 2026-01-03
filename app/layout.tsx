import type { Metadata } from "next";
import { Unbounded, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header"; // <--- Importujemy Header
import { CartProvider } from "@/context/CartContext"; // <--- NOWE
import { CartDrawer } from "@/components/CartDrawer";

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

            <main className="pt-[100px]">
                {children}
            </main>
        </CartProvider>

        </body>
        </html>
    );
}