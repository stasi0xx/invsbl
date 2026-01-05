"use client";

import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { clsx } from "clsx";

interface SizeChartProps {
    isOpen: boolean;
    onClose: () => void;
    productName: string; // Potrzebujemy nazwy, żeby wiedzieć czy pokazać tabelę bluzy czy spodni
}

export function SizeChartModal({ isOpen, onClose, productName }: SizeChartProps) {
    const [isVisible, setIsVisible] = useState(false);

    // Obsługa animacji wejścia/wyjścia
    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
            document.body.style.overflow = "hidden"; // Blokujemy scroll strony
        } else {
            const timer = setTimeout(() => setIsVisible(false), 300); // Czekamy aż animacja wyjścia się skończy
            document.body.style.overflow = "unset";
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    if (!isVisible && !isOpen) return null;

    // Prosta logika wykrywania typu produktu
    const isHoodie = productName.toLowerCase().includes("hoodie");
    const isPants = productName.toLowerCase().includes("pants") || productName.toLowerCase().includes("sweatpants");

    return (
        <>
            {/* 1. BACKDROP (TŁO) */}
            <div
                onClick={onClose}
                className={clsx(
                    "fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] transition-opacity duration-300",
                    isOpen ? "opacity-100" : "opacity-0"
                )}
            />

            {/* 2. MODAL (OKNO) */}
            <div className={clsx(
                "fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[101] w-full max-w-lg px-4 transition-all duration-300 transform",
                isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0"
            )}>

                <div className="bg-[#09090b] border border-white/20 p-6 md:p-8 relative shadow-2xl">

                    {/* Przycisk Zamknij */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>

                    {/* Nagłówek */}
                    <h3 className="font-display text-2xl font-bold uppercase text-white mb-2">
                        Tabela Rozmiarów
                    </h3>
                    <p className="text-zinc-500 text-xs font-mono uppercase tracking-widest mb-8">
                        {isHoodie ? "Heavyweight Hoodie (Boxy Fit)" : isPants ? "Heavyweight Sweatpants (Relaxed)" : "Standard Sizing"}
                    </p>

                    {/* TABELA BLUZY */}
                    {isHoodie && (
                        <div className="w-full overflow-x-auto">
                            <table className="w-full text-sm text-left font-mono">
                                <thead>
                                <tr className="border-b border-white/10 text-zinc-500 text-xs">
                                    <th className="py-2">Rozmiar</th>
                                    <th className="py-2">Szerokość (cm)</th>
                                    <th className="py-2">Długość (cm)</th>
                                </tr>
                                </thead>
                                <tbody className="text-zinc-300">
                                <tr className="border-b border-white/5"><td className="py-3 font-bold text-white">S</td><td>62</td><td>68</td></tr>
                                <tr className="border-b border-white/5"><td className="py-3 font-bold text-white">M</td><td>65</td><td>71</td></tr>
                                <tr className="border-b border-white/5"><td className="py-3 font-bold text-white">L</td><td>68</td><td>74</td></tr>
                                <tr className="border-b border-white/5"><td className="py-3 font-bold text-white">XL</td><td>71</td><td>77</td></tr>
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* TABELA SPODNIE */}
                    {isPants && (
                        <div className="w-full overflow-x-auto">
                            <table className="w-full text-sm text-left font-mono">
                                <thead>
                                <tr className="border-b border-white/10 text-zinc-500 text-xs">
                                    <th className="py-2">Rozmiar</th>
                                    <th className="py-2">Pas (cm)</th>
                                    <th className="py-2">Długość (cm)</th>
                                </tr>
                                </thead>
                                <tbody className="text-zinc-300">
                                <tr className="border-b border-white/5"><td className="py-3 font-bold text-white">S</td><td>38-42</td><td>104</td></tr>
                                <tr className="border-b border-white/5"><td className="py-3 font-bold text-white">M</td><td>40-44</td><td>106</td></tr>
                                <tr className="border-b border-white/5"><td className="py-3 font-bold text-white">L</td><td>42-46</td><td>108</td></tr>
                                <tr className="border-b border-white/5"><td className="py-3 font-bold text-white">XL</td><td>44-48</td><td>110</td></tr>
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* INFO O TOLERANCJI */}
                    <div className="mt-6 pt-4 border-t border-white/10 text-[10px] text-zinc-600 uppercase tracking-wide">
                        <p>Tolerancja wymiarów +/- 2cm.</p>
                        <p>Mierzone na płasko.</p>
                    </div>

                </div>
            </div>
        </>
    );
}