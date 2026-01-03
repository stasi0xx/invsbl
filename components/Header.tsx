"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, ShoppingBag, X, Search, User } from "lucide-react";
import { clsx } from "clsx";
import { useCart } from "@/context/CartContext";

export function Header() {
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { openCart, cartCount } = useCart();

    // Logika "Smart Header"
    useEffect(() => {
        const controlNavbar = () => {
            if (typeof window !== "undefined") {
                const currentScrollY = window.scrollY;

                if (currentScrollY > lastScrollY && currentScrollY > 100) {
                    // Scrollujemy w DÓŁ -> Ukryj
                    setIsVisible(false);
                } else {
                    // Scrollujemy w GÓRĘ -> Pokaż
                    setIsVisible(true);
                }
                setLastScrollY(currentScrollY);
            }
        };

        window.addEventListener("scroll", controlNavbar);
        return () => window.removeEventListener("scroll", controlNavbar);
    }, [lastScrollY]);

    // Zapobiegamy scrollowaniu strony, gdy otwarte jest menu mobilne
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
    }, [isMobileMenuOpen]);

    return (
        <>
            {/* Pływający kontener nagłówka */}
            <header
                className={clsx(
                    "fixed top-0 left-0 w-full z-50 transition-transform duration-300 ease-in-out border-b border-white/10",
                    isVisible ? "translate-y-0" : "-translate-y-full"
                )}
            >
                {/* 1. TOP BAR (Pasek powiadomień) */}
                <div className="w-full bg-[#d9f99d] text-[#1a2e05] text-[10px] md:text-xs font-bold text-center py-2 uppercase tracking-widest">
                    Darmowa wysyłka od 300 PLN • Wysyłka w 24h
                </div>

                {/* 2. GŁÓWNY HEADER */}
                <div className="bg-[#09090b]/90 backdrop-blur-md w-full px-4 md:px-8 h-16 md:h-20 flex items-center justify-between relative">

                    {/* LEWA STRONA: Burger & Szukajka (Desktop) */}
                    <div className="flex items-center gap-4 w-1/3">
                        <button
                            onClick={() => setIsMobileMenuOpen(true)}
                            className="p-2 hover:bg-white/5 rounded-full transition-colors"
                        >
                            <Menu className="w-6 h-6 text-[#f4f4f5]" />
                        </button>

                        {/* Opcjonalna ikonka szukania na desktopie */}
                        <button className="hidden md:block p-2 hover:bg-white/5 rounded-full transition-colors text-[#a1a1aa] hover:text-[#f4f4f5]">
                            <Search className="w-5 h-5" />
                        </button>
                    </div>

                    {/* ŚRODEK: Logotyp */}
                    <div className="w-1/3 flex justify-center">
                        <Link href="/" className="group" onClick={() => setIsMobileMenuOpen(false)}>
                            {/* Tutaj docelowo wstawisz <Image src="/logo.svg" ... /> */}
                            <span className="font-display text-2xl md:text-3xl font-black tracking-tighter text-[#f4f4f5] group-hover:text-[#d9f99d] transition-colors">
                INVSBL
              </span>
                        </Link>
                    </div>

                    {/* PRAWA STRONA: Koszyk */}
                    <div className="flex items-center justify-end gap-4 w-1/3">
                        {/* Zmieniamy Link na button */}
                        <button
                            onClick={openCart} // <--- Tu jest zmiana
                            className="relative group p-2 hover:bg-white/5 rounded-full transition-colors"
                        >
                            <ShoppingBag className="w-6 h-6 text-[#f4f4f5] group-hover:text-[#d9f99d] transition-colors" />

                            {/* Licznik dynamiczny */}
                            {cartCount > 0 && (
                                <span className="absolute top-0 right-0 bg-[#d9f99d] text-[#1a2e05] text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full animate-bounce-short">
                    {cartCount}
                  </span>
                            )}
                        </button>
                    </div>
                </div>
            </header>

            {/* 3. MENU MOBILNE (FULLSCREEN OVERLAY) */}
            <div
                className={clsx(
                    "fixed inset-0 z-[60] bg-[#09090b] transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)]",
                    isMobileMenuOpen ? "translate-y-0" : "-translate-y-full"
                )}
            >
                {/* Nagłówek Menu Mobilnego */}
                <div className="flex items-center justify-between p-4 md:p-8 border-b border-white/10">
                    <span className="text-[#a1a1aa] text-sm tracking-widest uppercase">Menu</span>
                    <button
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="p-2 hover:bg-white/5 rounded-full text-[#f4f4f5]"
                    >
                        <X className="w-8 h-8" />
                    </button>
                </div>

                {/* Linki */}
                <nav className="flex flex-col items-center justify-center h-[calc(100vh-100px)] space-y-6 md:space-y-8 p-8">
                    {[
                        { name: "Strona Główna", href: "/" },
                        { name: "Sklep / Drop", href: "/#products" }, // Zakładam kotwicę, ale może być /shop
                        { name: "Misja / O Nas", href: "/about" },
                        { name: "Śledzenie Zamówienia", href: "https://inpost.pl/sledzenie-przesylek", external: true },
                        { name: "Kontakt", href: "/contact" },
                    ].map((item, i) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            target={item.external ? "_blank" : "_self"}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="text-3xl md:text-5xl font-display font-bold text-[#f4f4f5] hover:text-[#d9f99d] transition-colors tracking-tight"
                        >
                            {item.name}
                        </Link>
                    ))}

                    <div className="mt-12 w-full h-[1px] bg-white/10 max-w-md" />

                    <div className="flex gap-6 mt-8">
                        <Link href="/terms" className="text-[#a1a1aa] text-sm hover:text-white">Regulamin</Link>
                        <Link href="/privacy" className="text-[#a1a1aa] text-sm hover:text-white">Polityka Prywatności</Link>
                    </div>
                </nav>
            </div>
        </>
    );
}