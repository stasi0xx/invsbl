"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";

interface InPostMapProps {
    onSelect: (point: any) => void;
}

export function InPostMap({ onSelect }: InPostMapProps) {
    const [isSdkLoaded, setIsSdkLoaded] = useState(false);
    const mapContainerRef = useRef<HTMLDivElement>(null);

    // 1. Pobieramy Token (Zabezpieczenie: .env lub hardcoded string)
    const token = process.env.NEXT_PUBLIC_INPOST_TOKEN || 'TWOJ_TOKEN_JEZELI_NIE_MASZ_ENV';

    // 2. Sprawdzamy, czy skrypt już przypadkiem nie istnieje (np. z innej podstrony)
    useEffect(() => {
        const existingScript = document.querySelector('script[src*="inpost-geowidget"]');
        if (existingScript) {
            console.log("✅ SDK InPost wykryte (było już załadowane)");
            setIsSdkLoaded(true);
        }
    }, []);

    // 3. Rejestracja callbacka (global function dla widgetu)
    useEffect(() => {
        // @ts-ignore
        window.onPointSelect = (point: any) => {
            console.log("📍 Wybrano punkt:", point);
            onSelect(point);
        };
        return () => {
            // @ts-ignore
            delete window.onPointSelect;
        };
    }, [onSelect]);

    // 4. Renderowanie widgetu (Manual Injection)
    useEffect(() => {
        if (isSdkLoaded && mapContainerRef.current && token) {
            const container = mapContainerRef.current;

            // Sprawdzamy, czy widget już tam jest, żeby go nie dublować
            if (container.innerHTML !== "") return;

            console.log("🛠️ Wstrzykiwanie widgetu InPost do DOM...");

            const widget = document.createElement("inpost-geowidget");
            widget.setAttribute("token", token);
            widget.setAttribute("onpoint", "onPointSelect");
            widget.setAttribute("config", "parcelCollect");
            widget.setAttribute("language", "pl");

            container.appendChild(widget);
        }
    }, [isSdkLoaded, token]);

    return (
        <div className="w-full border border-acid/50 p-1 bg-black relative min-h-[400px]">
            <Script
                src="https://geowidget.inpost.pl/inpost-geowidget.js"
                strategy="lazyOnload"
                onLoad={() => {
                    console.log("✅ SDK InPost załadowane (zdarzenie onLoad)");
                    setIsSdkLoaded(true);
                }}
                onError={(e) => console.error("❌ Błąd ładowania skryptu InPost:", e)}
            />

            {/* Kontener mapy */}
            <div
                ref={mapContainerRef}
                className="w-full h-[400px] bg-zinc-900"
            >
                {!isSdkLoaded && (
                    <div className="h-full flex items-center justify-center text-text-secondary text-xs animate-pulse">
                        ŁADOWANIE MAPY...
                    </div>
                )}
            </div>

            <p className="text-xs text-center mt-2 text-text-secondary">Wybierz punkt na mapie</p>
        </div>
    );
}