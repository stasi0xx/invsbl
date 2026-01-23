"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image"; // <--- 1. Importujemy Image
import { Menu, ShoppingBag, X, Search } from "lucide-react";
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

                if (currentScrollY > lastScrollY && currentScrollY > 50) {
                    setIsVisible(false);
                } else {
                    setIsVisible(true);
                }
                setLastScrollY(currentScrollY);
            }
        };

        window.addEventListener("scroll", controlNavbar);
        return () => window.removeEventListener("scroll", controlNavbar);
    }, [lastScrollY]);

    // Blokada scrollowania gdy menu otwarte
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
    }, [isMobileMenuOpen]);

    return (
        <>
            {/* HEADER WRAPPER */}
            <header
                className={clsx(
                    "fixed top-0 left-0 w-full z-[80] transition-transform duration-300 ease-in-out",
                    isVisible ? "translate-y-0" : "-translate-y-full"
                )}
            >
                {/* TOP BAR */}
                <div className="w-full bg-[#d9f99d] text-[#1a2e05] text-[10px] md:text-xs font-bold text-center py-2 uppercase tracking-widest relative z-[81]">
                    Darmowa wysyłka od 300 PLN • Wysyłka w 24h
                </div>

                {/* GŁÓWNY PASEK */}
                <div className="bg-transparent w-full px-4 md:px-8 h-16 md:h-20 flex items-center justify-between relative z-[81]">

                    {/* LEWA: Burger */}
                    <div className="flex items-center gap-4 w-1/3">
                        <button
                            onClick={() => setIsMobileMenuOpen(true)}
                            className="p-3 -ml-3 hover:bg-white/5 rounded-full transition-colors active:scale-95 touch-manipulation"
                            aria-label="Otwórz menu"
                        >
                            <Menu className="w-6 h-6 text-[#f4f4f5]" />
                        </button>

                        <button className="hidden md:block p-2 hover:bg-white/5 rounded-full transition-colors text-[#a1a1aa] hover:text-[#f4f4f5]">
                            <Search className="w-5 h-5" />
                        </button>
                    </div>

                    {/* ŚRODEK: LOGO (ZMIANA TUTAJ) */}
                    <div className="w-1/3 flex justify-center pointer-events-none">
                        <Link
                            href="/"
                            className="pointer-events-auto hover:opacity-80 transition-opacity"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            {/* Używamy Next Image dla optymalizacji */}
                            {/* width/height ustawiamy proporcjonalnie do oryginału, ale klasy CSS kontrolują wyświetlanie */}
                            <Image
                                src="/logo.png"
                                alt="INVSBL Logo"
                                width={150} // Orientacyjna szerokość oryginału
                                height={40} // Orientacyjna wysokość
                                className="h-6 md:h-8 w-auto object-contain" // h-6 (mobile) / h-8 (desktop) - logo dopasuje się automatycznie
                                priority // Logo ładujemy priorytetowo
                            />
                        </Link>
                    </div>

                    {/* PRAWA: Koszyk */}
                    <div className="flex items-center justify-end gap-4 w-1/3">
                        <button
                            onClick={openCart}
                            className="relative group p-3 -mr-3 hover:bg-white/5 rounded-full transition-colors active:scale-95 touch-manipulation"
                            aria-label="Otwórz koszyk"
                        >
                            <ShoppingBag className="w-6 h-6 text-[#f4f4f5] group-hover:text-[#d9f99d] transition-colors" />

                            {cartCount > 0 && (
                                <span className="absolute top-1 right-1 bg-[#d9f99d] text-[#1a2e05] text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full animate-bounce-short">
                    {cartCount}
                  </span>
                            )}
                        </button>
                    </div>
                </div>
            </header>

            {/* MENU MOBILNE (OVERLAY) */}
            <div
                className={clsx(
                    "fixed inset-0 z-[90] bg-[#09090b] transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)]",
                    isMobileMenuOpen
                        ? "translate-y-0 opacity-100 pointer-events-auto"
                        : "-translate-y-full opacity-0 pointer-events-none"
                )}
            >
                <div className="flex items-center justify-between p-4 md:p-8 border-b border-white/10">
                    <span className="text-[#a1a1aa] text-sm tracking-widest uppercase">Menu</span>
                    <button
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="p-3 -mr-3 hover:bg-white/5 rounded-full text-[#f4f4f5]"
                    >
                        <X className="w-8 h-8" />
                    </button>
                </div>

                <nav className="flex flex-col items-center justify-center h-[calc(100vh-100px)] space-y-6 p-8 w-full">
                    {[
                        { name: "Strona Główna", href: "/" },
                        { name: "Sklep", href: "/#products" },
                        { name: "Kontakt", href: "/kontakt" },
                    ].map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="text-3xl md:text-4xl font-display font-bold text-[#f4f4f5] hover:text-[#d9f99d] transition-colors text-center w-full"
                        >
                            {item.name}
                        </Link>
                    ))}

                    <div className="mt-8 pt-8 border-t border-white/10 w-full max-w-xs flex justify-center gap-6">
                        <Link href="/regulamin" className="text-[#a1a1aa] text-xs uppercase hover:text-white transition-colors">Regulamin</Link>
                        <Link href="/polityka-prywatnosci" className="text-[#a1a1aa] text-xs uppercase hover:text-white transition-colors">Prywatność</Link>
                    </div>
                </nav>
            </div>
        </>
    );
}