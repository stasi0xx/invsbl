"use client";

import { useCart } from "@/context/CartContext";
import { X, Trash2, ShoppingBag, Truck, Box } from "lucide-react";
import { clsx } from "clsx";
import { createCheckoutSession } from "@/app/actions/checkout";
import { useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";

// Importujemy mapę tak, żeby ładowała się TYLKO w przeglądarce (ssr: false)
const InPostMap = dynamic(() => import("@/components/InPostMap").then(mod => mod.InPostMap), {
    ssr: false,
    loading: () => <div className="h-[400px] w-full bg-zinc-900 animate-pulse flex items-center justify-center text-xs">ŁADOWANIE MAPY...</div>
});

export function CartDrawer() {
    const { isCartOpen, closeCart, items, removeItem, cartTotal } = useCart();

    // Stan lokalny koszyka - wybór dostawy dotyczy CAŁEGO zamówienia
    const [deliveryMethod, setDeliveryMethod] = useState<"courier" | "inpost">("courier");
    const [selectedPoint, setSelectedPoint] = useState<any>(null);

    // Walidacja: Czy można przejść do płatności?
    const isCheckoutDisabled = deliveryMethod === "inpost" && !selectedPoint;

    return (
        <>
            {/* 1. Tło (Backdrop) */}
            <div
                onClick={closeCart}
                className={clsx(
                    "fixed inset-0 bg-black/60 backdrop-blur-sm z-[90] transition-opacity duration-300",
                    isCartOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                )}
            />

            {/* 2. Panel Boczny (Drawer) */}
            <div
                className={clsx(
                    "fixed top-0 right-0 h-full w-full max-w-[450px] bg-[#09090b] border-l border-white/10 z-[100] shadow-2xl transform transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col",
                    isCartOpen ? "translate-x-0" : "translate-x-full"
                )}
            >
                {/* NAGŁÓWEK */}
                <div className="flex items-center justify-between p-6 border-b border-white/10 shrink-0">
                    <h2 className="font-display text-xl font-bold flex items-center gap-2">
                        TWOJE ZAMÓWIENIE <span className="text-acid text-sm">({items.length})</span>
                    </h2>
                    <button onClick={closeCart} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                        <X className="w-6 h-6 text-[#a1a1aa]" />
                    </button>
                </div>

                {/* LISTA PRODUKTÓW (Scrollowalna) */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {items.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-50">
                            <ShoppingBag className="w-16 h-16" />
                            <p className="font-display">Twój koszyk jest pusty</p>
                        </div>
                    ) : (
                        <>
                            {/* Produkty */}
                            <div className="space-y-6 mb-8">
                                {items.map((item) => (
                                    <div key={item.id} className="flex gap-4 animate-fade-in">
                                        <div className="relative w-20 h-24 bg-zinc-900 rounded border border-white/5 flex-shrink-0 flex items-center justify-center overflow-hidden">
                                            {/* Dodajemy sprawdzenie, czy item.image istnieje */}
                                            {item.image ? (
                                                <Image
                                                    src={item.image}
                                                    alt={item.name}
                                                    fill
                                                    className="object-cover" // Zamiast propa objectFit, używamy klasy Tailwind
                                                />
                                            ) : (
                                                <span className="text-xs text-zinc-700">IMG</span>
                                            )}
                                        </div>

                                        <div className="flex-1 flex flex-col justify-between py-1">
                                            <div>
                                                <h3 className="font-bold text-sm text-white uppercase">{item.name}</h3>
                                                <p className="text-xs text-[#a1a1aa] mt-1">Ilość: {item.quantity}</p>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-acid font-mono">{(item.price / 100).toFixed(2)} {item.currency}</span>
                                                <button
                                                    onClick={() => removeItem(item.id)}
                                                    className="text-red-500 hover:text-red-400 text-xs flex items-center gap-1 transition-colors"
                                                >
                                                    <Trash2 className="w-3 h-3" /> USUŃ
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* --- LOGISTYKA W KOSZYKU --- */}
                            <div className="pt-6 border-t border-white/10">
                                <h3 className="text-sm uppercase font-bold text-[#a1a1aa] mb-4 tracking-wider">Metoda dostawy</h3>

                                {/* Wybór metody */}
                                <div className="flex gap-3 mb-4">
                                    <button
                                        onClick={() => setDeliveryMethod("courier")}
                                        className={clsx(
                                            "flex-1 flex items-center justify-center gap-2 py-3 text-sm font-bold uppercase transition-all rounded border",
                                            deliveryMethod === "courier"
                                                ? "bg-white text-black border-white"
                                                : "bg-transparent text-[#a1a1aa] border-white/10 hover:border-white/30"
                                        )}
                                    >
                                        <Truck className="w-4 h-4" />
                                        Kurier
                                    </button>
                                    <button
                                        onClick={() => setDeliveryMethod("inpost")}
                                        className={clsx(
                                            "flex-1 flex items-center justify-center gap-2 py-3 text-sm font-bold uppercase transition-all rounded border",
                                            deliveryMethod === "inpost"
                                                ? "bg-[#ffc000] text-black border-[#ffc000]"
                                                : "bg-transparent text-[#a1a1aa] border-white/10 hover:border-white/30"
                                        )}
                                    >
                                        <Box className="w-4 h-4" />
                                        Paczkomat
                                    </button>
                                </div>

                                {/* Mapa (tylko dla InPost) */}
                                {deliveryMethod === "inpost" && (
                                    <div className="animate-fade-in border border-white/10 rounded overflow-hidden mb-4">
                                        {selectedPoint ? (
                                            <div className="p-3 bg-[#ffc000]/10 border border-[#ffc000] flex items-center justify-between">
                                                <div>
                                                    <p className="text-[#ffc000] text-[10px] font-bold uppercase">Punkt odbioru:</p>
                                                    <p className="text-white font-mono text-sm">{selectedPoint.name}</p>
                                                </div>
                                                <button
                                                    onClick={() => setSelectedPoint(null)}
                                                    className="text-xs underline text-[#a1a1aa] hover:text-white"
                                                >
                                                    Zmień
                                                </button>
                                            </div>
                                        ) : (
                                            // Mapa w koszyku
                                            <div className="h-[300px]"> {/* Wymuszamy mniejszą wysokość w drawerze */}
                                                <InPostMap onSelect={(point) => setSelectedPoint(point)} />
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>

                {/* STOPKA (Checkout) */}
                {items.length > 0 && (
                    <div className="p-6 border-t border-white/10 bg-[#09090b] shrink-0">
                        <div className="flex justify-between items-center mb-6">
                            <span className="text-[#a1a1aa] uppercase text-sm">Suma</span>
                            <span className="font-display text-xl font-bold">{(cartTotal / 100).toFixed(2)} PLN</span>
                        </div>

                        <form action={createCheckoutSession}>
                            <input type="hidden" name="cartData" value={JSON.stringify(items)} />
                            <input type="hidden" name="isMultiItem" value="true" />

                            {/* Przekazujemy wybraną metodę i kod z koszyka */}
                            <input type="hidden" name="deliveryMethod" value={deliveryMethod} />
                            <input type="hidden" name="paczkomatCode" value={selectedPoint?.name || ""} />

                            <button
                                type="submit"
                                disabled={isCheckoutDisabled}
                                className={clsx(
                                    "w-full font-display font-bold py-4 transition-all tracking-widest uppercase",
                                    isCheckoutDisabled
                                        ? "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                                        : "bg-acid text-[#1a2e05] hover:bg-[#bef264]"
                                )}
                            >
                                {isCheckoutDisabled ? "Wybierz Punkt Odbioru" : "Przejdź do płatności"}
                            </button>
                        </form>
                        <p className="text-center text-[10px] text-[#a1a1aa] mt-3">
                            Bezpieczne płatności przez Stripe
                        </p>
                    </div>
                )}
            </div>
        </>
    );
}