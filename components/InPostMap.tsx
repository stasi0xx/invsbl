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
                {/* UWAGA: 'token' jest wymagany w produkcji.
            W trybie bez tokenu mapa może działać w trybie "demo" lub wymagać sandboxa.
            Jeśli masz token z Managera Paczek, wpisz go w token="TWÓJ_TOKEN"
        */}
                {/*<inpost-geowidget
                    token={'eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJzQlpXVzFNZzVlQnpDYU1XU3JvTlBjRWFveFpXcW9Ua2FuZVB3X291LWxvIn0.eyJleHAiOjIwODI3OTY0MTAsImlhdCI6MTc2NzQzNjQxMCwianRpIjoiZjkxODQ3MjgtYjA1Ny00YjU4LWIwYWEtNDM5NTRlOTI1NTVmIiwiaXNzIjoiaHR0cHM6Ly9sb2dpbi5pbnBvc3QucGwvYXV0aC9yZWFsbXMvZXh0ZXJuYWwiLCJzdWIiOiJmOjEyNDc1MDUxLTFjMDMtNGU1OS1iYTBjLTJiNDU2OTVlZjUzNTpMVUgyRWlSREtWRWVKSlRBTmlGZlRELWFyLVVEd0VVdU91THhycmhNbWdjIiwidHlwIjoiQmVhcmVyIiwiYXpwIjoic2hpcHgiLCJzZXNzaW9uX3N0YXRlIjoiNzc2ZTU5OTgtZDMwNy00MjJmLWI3YmItNmZiZjYyMDRlMzY0Iiwic2NvcGUiOiJvcGVuaWQgYXBpOmFwaXBvaW50cyIsInNpZCI6Ijc3NmU1OTk4LWQzMDctNDIyZi1iN2JiLTZmYmY2MjA0ZTM2NCIsImFsbG93ZWRfcmVmZXJyZXJzIjoiaW52c2JsLnBsIiwidXVpZCI6IjIwMjY0YWNjLTY3YzItNGFlNy04NmVkLTI3NmNlMjVkNWE1NiJ9.N15FnHn4qMlFFIAS27qV2h1FbsR0iXaUby1c4H1EUWwPGmzXhTAiNf72AdQ5lKKaQJlen0TqczLgqdsyVKIMIzSnm_-uCOYNYTTAJEayy-RANmr6WR__9jipKq3hKCLPGdGOZ-z-Bn4nZpo-aqm4hC3TnmQ0lBN_L4xPi3dQyYc0deP-AeeSUwxLnlIGOwenHNkXszH31u83GLZlrE6TYb8ZhSN8AFrqBiNKtmyhjlT1zTUMR-w75MdJPRE5GGeFYjw3lZ6qg8aX90jv2CROI5f2shbs3jbGPAmig9ppQp4toQu-jQPdQTQgjtrH5xhFepbpQOjS6TTq9jh6nUCFTQ'}
                    onpoint="onPointSelect"
                    config="parcelCollect"
                    language="pl"
                />*/}
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