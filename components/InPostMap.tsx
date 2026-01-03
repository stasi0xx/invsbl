"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";

interface InPostMapProps {
    onSelect: (point: any) => void;
}

export function InPostMap({ onSelect }: InPostMapProps) {
    const [isReady, setIsReady] = useState(false);
    const widgetRef = useRef<HTMLElement>(null);

    useEffect(() => {
        // 1. Rejestrujemy funkcję globalną, którą wywoła InPost po wybraniu punktu
        // @ts-ignore
        window.onPointSelect = (point: any) => {
            console.log("📍 InPost V5 Point:", point);
            onSelect(point);
        };

        // Sprzątanie przy odmontowaniu
        return () => {
            // @ts-ignore
            delete window.onPointSelect;
        };
    }, [onSelect]);

    return (
        <div className="w-full border border-acid/50 p-1 bg-black relative min-h-[400px]">

            {/* 2. Ładujemy skrypt V5 */}
            <Script
                src="https://geowidget.inpost.pl/inpost-geowidget.js"
                strategy="afterInteractive"
                onLoad={() => setIsReady(true)}
                onError={() => console.error("❌ Błąd ładowania skryptu InPost")}
            />

            {/* 3. Renderujemy Web Component (V5) */}
            <div className={`w-full h-[400px] bg-zinc-900 transition-opacity duration-500 ${isReady ? 'opacity-100' : 'opacity-0'}`}>

                {/* @ts-ignore */}
                <inpost-geowidget
                    token={process.env.NEXT_PUBLIC_INPOST_TOKEN}
                    onpoint="onPointSelect"
                    config="parcelCollect"
                    language="pl"
                />
            </div>

            {!isReady && (
                <div className="absolute inset-0 flex items-center justify-center text-text-secondary text-xs animate-pulse">
                    LOADING V5 ENGINE...
                </div>
            )}

            <p className="text-xs text-center mt-2 text-text-secondary">Wybierz punkt na mapie</p>
        </div>
    );
}