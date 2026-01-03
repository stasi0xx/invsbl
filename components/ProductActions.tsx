"use client";

import { useCart } from "@/context/CartContext";
import { createCheckoutSession } from "@/app/actions/checkout";
import { ShoppingBag, Zap, Truck, Box, CheckCircle } from "lucide-react";
import { useState } from "react";
import dynamic from "next/dynamic";

// Importujemy mapę tak, żeby ładowała się TYLKO w przeglądarce (ssr: false)
const InPostMap = dynamic(() => import("@/components/InPostMap").then(mod => mod.InPostMap), {
    ssr: false,
    loading: () => <div className="h-[400px] w-full bg-zinc-900 animate-pulse flex items-center justify-center text-xs">ŁADOWANIE MAPY...</div>
});
import { clsx } from "clsx";

interface Product {
    id: string;
    name: string;
    price: number;
    currency: string;
}

export function ProductActions({ product }: { product: Product }) {
    const { addItem, openCart } = useCart();
    const [isAdding, setIsAdding] = useState(false);

    // Stan wybranej metody dostawy i punktu
    const [deliveryMethod, setDeliveryMethod] = useState<"courier" | "inpost">("courier");
    const [selectedPoint, setSelectedPoint] = useState<any>(null);

    // Funkcja "Dodaj do koszyka" (tylko wrzuca produkt, dostawa wybierana w koszyku)
    const handleAddToCart = () => {
        setIsAdding(true);
        addItem({
            id: product.id,
            productSlug: product.id,
            name: product.name,
            price: product.price,
            currency: product.currency,
            quantity: 1,
        });

        setTimeout(() => {
            setIsAdding(false);
            openCart();
        }, 500);
    };

    // Walidacja dla "Kup Teraz"
    const isBuyNowDisabled = deliveryMethod === "inpost" && !selectedPoint;

    return (
        <div className="flex flex-col gap-6 w-full mt-6">

            {/* 1. SEKCJA WYBORU DOSTAWY (Dla Kup Teraz) */}
            <div className="flex gap-4 p-1 bg-white/5 rounded-lg border border-white/10">
                <button
                    onClick={() => setDeliveryMethod("courier")}
                    className={clsx(
                        "flex-1 flex items-center justify-center gap-2 py-3 text-sm font-bold uppercase transition-all rounded",
                        deliveryMethod === "courier"
                            ? "bg-white text-black"
                            : "text-[#a1a1aa] hover:text-white"
                    )}
                >
                    <Truck className="w-4 h-4" />
                    Kurier
                </button>
                <button
                    onClick={() => setDeliveryMethod("inpost")}
                    className={clsx(
                        "flex-1 flex items-center justify-center gap-2 py-3 text-sm font-bold uppercase transition-all rounded",
                        deliveryMethod === "inpost"
                            ? "bg-[#ffc000] text-black" // Kolor InPostu
                            : "text-[#a1a1aa] hover:text-white"
                    )}
                >
                    <Box className="w-4 h-4" />
                    Paczkomat
                </button>
            </div>

            {/* 2. MAPA (Pojawia się tylko gdy wybrano InPost) */}
            {deliveryMethod === "inpost" && (
                <div className="animate-fade-in border border-white/10 rounded overflow-hidden">
                    {selectedPoint ? (
                        <div className="p-4 bg-[#ffc000]/10 border border-[#ffc000] flex items-center justify-between">
                            <div>
                                <p className="text-[#ffc000] text-xs font-bold uppercase">Wybrany punkt:</p>
                                <p className="text-white font-mono text-lg">{selectedPoint.name}</p>
                                <p className="text-[#a1a1aa] text-xs">{selectedPoint.address_details?.street} {selectedPoint.address_details?.building_number}</p>
                            </div>
                            <button
                                onClick={() => setSelectedPoint(null)}
                                className="text-xs underline text-[#a1a1aa] hover:text-white"
                            >
                                Zmień
                            </button>
                        </div>
                    ) : (
                        <InPostMap onSelect={(point) => setSelectedPoint(point)} />
                    )}
                </div>
            )}

            {/* 3. PRZYCISKI AKCJI */}
            <div className="flex flex-col md:flex-row gap-3 w-full">

                {/* BUTTON: DO KOSZYKA */}
                <button
                    type="button" // Ważne: żeby nie wysyłał formularza poniżej
                    onClick={handleAddToCart}
                    disabled={isAdding}
                    className="flex-1 border border-white/20 hover:border-acid hover:text-acid text-white font-display font-bold py-4 px-6 flex items-center justify-center gap-2 transition-all uppercase tracking-wider disabled:opacity-50"
                >
                    <ShoppingBag className="w-5 h-5" />
                    {isAdding ? "Dodawanie..." : "Do Koszyka"}
                </button>

                {/* BUTTON: KUP TERAZ (Formularz) */}
                <form action={createCheckoutSession} className="flex-1">
                    <input type="hidden" name="productSlug" value={product.id} />
                    <input type="hidden" name="productName" value={product.name} />
                    <input type="hidden" name="priceAmount" value={product.price} />
                    <input type="hidden" name="priceCurrency" value={product.currency} />

                    {/* Przekazujemy wybraną metodę i kod */}
                    <input type="hidden" name="deliveryMethod" value={deliveryMethod} />
                    <input type="hidden" name="paczkomatCode" value={selectedPoint?.name || ""} />

                    <button
                        type="submit"
                        disabled={isBuyNowDisabled}
                        className={clsx(
                            "w-full font-display font-bold py-4 px-6 flex items-center justify-center gap-2 transition-all uppercase tracking-wider h-full",
                            isBuyNowDisabled
                                ? "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                                : "bg-acid text-[#1a2e05] hover:bg-[#bef264]"
                        )}
                    >
                        {isBuyNowDisabled ? (
                            "Wybierz Paczkomat"
                        ) : (
                            <>
                                <Zap className="w-5 h-5 fill-current" />
                                Kup Teraz
                            </>
                        )}
                    </button>
                </form>

            </div>
        </div>
    );
}