import type { Metadata } from "next";
import { Geist, Geist_Mono, Unbounded } from "next/font/google"; // Import Unbounded
import "./globals.css";

// 1. Konfiguracja Geist (Body)
const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

// 2. Konfiguracja Unbounded (Nagłówki - Streetwear vibe)
const unbounded = Unbounded({
    variable: "--font-unbounded", // To mapujemy w CSS jako --font-display
    subsets: ["latin"],
    weight: ["400", "700", "900"], // Tylko potrzebne wagi
});

export const metadata: Metadata = {
    title: "STREETWEAR_BRAND™",
    description: "Limited Drop 001",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <head>
            <link rel="stylesheet" href="https://geowidget.inpost.pl/inpost-geowidget.css" />
        </head>
        <body
            className={`${geistSans.variable} ${geistMono.variable} ${unbounded.variable} antialiased`}
        >
        <main className="min-h-screen flex flex-col">
            {/* Tutaj w przyszłości wstrzykniemy Navbar */}
            {children}
        </main>
        </body>
        </html>
    );
}