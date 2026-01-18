import type { Metadata } from "next";
import { Unbounded, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { CartProvider } from "@/context/CartContext";
import { CartDrawer } from "@/components/CartDrawer";
import { Footer } from "@/components/Footer";
import { GoogleTagManager } from "@next/third-parties/google"; // <--- OFICJALNA BIBLIOTEKA
import Script from "next/script";
import {MicrosoftClarity} from "@/components/analytics/MicrosoftClarity"; // <--- Do Clarity

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
        {/* GTM ładuje się asynchronicznie, nie blokując renderowania */}
        {process.env.NEXT_PUBLIC_GTM_ID && (
            <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GTM_ID} />
        )}

        {/* Microsoft Clarity - Mapa kliknięć */}
        {process.env.NEXT_PUBLIC_CLARITY_ID && (
            <Script id="microsoft-clarity" strategy="afterInteractive">
                {`
                            (function(c,l,a,r,i,t,y){
                                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
                            })(window, document, "clarity", "script", "${process.env.NEXT_PUBLIC_CLARITY_ID}");
                        `}
            </Script>
        )}
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