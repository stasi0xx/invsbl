"use client";

import { useCart } from "@/context/CartContext";
import { createCheckoutSession } from "@/app/actions/checkout";
import { ShoppingBag, Zap, Truck, Box } from "lucide-react";
import { useState } from "react";
import dynamic from "next/dynamic";
import { clsx } from "clsx";
import { SizeChartModal } from "@/components/SizeChartModal"; // <--- 1. Import Modala

interface ProductSize {
    label: string;
    available: boolean;
}

interface Product {
    id: string;
    name: string;
    price: number;
    currency: string;
    sizes: ProductSize[];
}

const InPostMap = dynamic(() => import("@/components/InPostMap").then(mod => mod.InPostMap), {
    ssr: false,
    loading: () => <div className="h-[300px] w-full bg-zinc-900 animate-pulse flex items-center justify-center text-xs text-zinc-500">ŁADOWANIE MAPY...</div>
});

export function ProductActions({ product }: { product: Product }) {
    const { addItem, openCart } = useCart();

    const [isAdding, setIsAdding] = useState(false);
    const [deliveryMethod, setDeliveryMethod] = useState<"courier" | "inpost">("courier");
    const [selectedPoint, setSelectedPoint] = useState<any>(null);
    const [selectedSize, setSelectedSize] = useState<string | null>(null);

    // 2. Stan otwarcia tabeli rozmiarów
    const [isChartOpen, setIsChartOpen] = useState(false);

    const isSizeSelected = !!selectedSize;
    const isBuyNowDisabled = !isSizeSelected || (deliveryMethod === "inpost" && !selectedPoint);

    const handleAddToCart = () => {
        if (!isSizeSelected) return;

        setIsAdding(true);
        addItem({
            id: `${product.id}-${selectedSize}`,
            productSlug: product.id,
            name: `${product.name} [${selectedSize}]`,
            price: product.price,
            currency: product.currency,
            quantity: 1,
        });

        setTimeout(() => {
            setIsAdding(false);
            openCart();
        }, 500);
    };

    return (
        <>
            {/* 3. Wstawiamy Modal (jest domyślnie ukryty, pokaże się po zmianie stanu) */}
            <SizeChartModal
                isOpen={isChartOpen}
                onClose={() => setIsChartOpen(false)}
                productName={product.name}
            />

            <div className="flex flex-col gap-8 w-full mt-6">

                {/* SELEKTOR ROZMIARU */}
                <div>
                    <div className="flex justify-between items-center mb-3">
                        <span className="text-xs font-bold uppercase tracking-widest text-zinc-500">Wybierz Rozmiar</span>

                        {/* 4. Przycisk otwierający modal */}
                        <button
                            onClick={() => setIsChartOpen(true)}
                            className="text-xs text-zinc-400 underline hover:text-white transition-colors"
                        >
                            Tabela Rozmiarów
                        </button>
                    </div>

                    <div className="flex gap-3">
                        {product.sizes.map((size) => (
                            <button
                                key={size.label}
                                onClick={() => size.available && setSelectedSize(size.label)}
                                disabled={!size.available}
                                className={clsx(
                                    "w-12 h-12 flex items-center justify-center border text-sm font-bold transition-all relative overflow-hidden",
                                    !size.available
                                        ? "border-white/5 text-zinc-600 cursor-not-allowed bg-white/5"
                                        : selectedSize === size.label
                                            ? "bg-acid border-acid text-[#1a2e05]"
                                            : "border-white/20 text-white hover:border-white"
                                )}
                            >
                                {size.label}
                                {!size.available && (
                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                        <div className="w-[140%] h-[1px] bg-zinc-600 rotate-45 transform origin-center" />
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>
                    {!isSizeSelected && (
                        <p className="text-[10px] text-acid mt-2 animate-pulse hidden">Wybierz rozmiar, aby kontynuować</p>
                    )}
                </div>

                {/* WYBÓR DOSTAWY */}
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
                                ? "bg-[#ffc000] text-black"
                                : "text-[#a1a1aa] hover:text-white"
                        )}
                    >
                        <Box className="w-4 h-4" />
                        Paczkomat
                    </button>
                </div>

                {/* MAPA INPOST */}
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

                {/* BUTTONY AKCJI */}
                <div className="flex flex-col md:flex-row gap-3 w-full">
                    <button
                        type="button"
                        onClick={handleAddToCart}
                        disabled={isAdding || !isSizeSelected}
                        className={clsx(
                            "flex-1 border border-white/20 font-display font-bold py-4 px-6 flex items-center justify-center gap-2 transition-all uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed",
                            isSizeSelected ? "hover:border-acid hover:text-acid text-white" : "text-zinc-500 border-white/10"
                        )}
                    >
                        <ShoppingBag className="w-5 h-5" />
                        {isAdding ? "Dodawanie..." : !isSizeSelected ? "Wybierz Rozmiar" : "Do Koszyka"}
                    </button>

                    <form action={createCheckoutSession} className="flex-1">
                        <input type="hidden" name="productSlug" value={product.id} />
                        <input type="hidden" name="productName" value={`${product.name} [${selectedSize || ''}]`} />
                        <input type="hidden" name="priceAmount" value={product.price} />
                        <input type="hidden" name="priceCurrency" value={product.currency} />
                        <input type="hidden" name="deliveryMethod" value={deliveryMethod} />
                        <input type="hidden" name="paczkomatCode" value={selectedPoint?.name || ""} />
                        <input type="hidden" name="size" value={selectedSize || ""} />

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
                            {!isSizeSelected ? (
                                "Wybierz Rozmiar"
                            ) : deliveryMethod === "inpost" && !selectedPoint ? (
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
        </>
    );
}