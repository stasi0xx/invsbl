"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { createCheckoutSession } from "@/app/actions/checkout";
import { InPostMap } from "./InPostMap";

function SubmitButton({ disabled }: { disabled: boolean }) {
    const { pending } = useFormStatus();
    return (
        <button
            type="submit"
            disabled={pending || disabled}
            className="w-full bg-acid text-acid-foreground font-bold py-5 mt-6 hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-widest text-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
            {pending ? "PROCESSING..." : "GO TO PAYMENT"}
        </button>
    );
}

export function CheckoutForm({ slug }: { slug: string }) {
    const [method, setMethod] = useState<"courier" | "inpost">("courier");
    const [selectedPoint, setSelectedPoint] = useState<any>(null);

    return (
        <div className="w-full p-6 border border-white/10 bg-surface/50 mt-8">
            <h3 className="font-display text-xl mb-4 uppercase">Delivery Method</h3>

            {/* 1. Wybór Metody */}
            <div className="grid grid-cols-2 gap-4 mb-6">
                <button
                    type="button"
                    onClick={() => { setMethod("courier"); setSelectedPoint(null); }}
                    className={`py-3 border text-sm font-mono transition-all ${
                        method === "courier"
                            ? "border-acid text-acid bg-acid/10"
                            : "border-white/20 text-text-secondary hover:border-white/40"
                    }`}
                >
                    COURIER (DPD)
                </button>
                <button
                    type="button"
                    onClick={() => setMethod("inpost")}
                    className={`py-3 border text-sm font-mono transition-all ${
                        method === "inpost"
                            ? "border-acid text-acid bg-acid/10"
                            : "border-white/20 text-text-secondary hover:border-white/40"
                    }`}
                >
                    PACZKOMAT 24/7
                </button>
            </div>

            {/* 2. Logika InPost */}
            {method === "inpost" && (
                <div className="mb-6 animate-fade-in">
                    {!selectedPoint ? (
                        <InPostMap onSelect={(point) => setSelectedPoint(point)} />
                    ) : (
                        <div className="bg-acid/10 border border-acid p-4 flex justify-between items-center">
                            <div>
                                <p className="text-xs text-acid mb-1">SELECTED POINT:</p>
                                <p className="font-bold text-xl">{selectedPoint.name}</p>
                                <p className="text-sm text-text-secondary">{selectedPoint.address?.line1}</p>
                            </div>
                            <button
                                onClick={() => setSelectedPoint(null)}
                                className="text-xs underline text-text-secondary hover:text-white"
                            >
                                CHANGE
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* 3. Formularz wysyłkowy */}
            <form action={createCheckoutSession}>
                <input type="hidden" name="slug" value={slug} />
                <input type="hidden" name="deliveryMethod" value={method} />
                {/* Przekazujemy kod paczkomatu tylko jeśli wybrano InPost */}
                <input type="hidden" name="paczkomatCode" value={selectedPoint?.name || ""} />

                {/* Blokujemy przycisk jeśli wybrano InPost ale nie wybrano punktu */}
                <SubmitButton disabled={method === "inpost" && !selectedPoint} />
            </form>

            <p className="text-center text-xs text-text-secondary mt-3 font-mono">
                SECURED BY STRIPE
            </p>
        </div>
    );
}