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
                <inpost-geowidget
                    token={'eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJzQlpXVzFNZzVlQnpDYU1XU3JvTlBjRWFveFpXcW9Ua2FuZVB3X291LWxvIn0.eyJleHAiOjIwODI3OTY5MzYsImlhdCI6MTc2NzQzNjkzNiwianRpIjoiMjBkMzAzNzUtNjMxYy00OWM4LWJhNDktM2ZhYzdkMTk3ZjEyIiwiaXNzIjoiaHR0cHM6Ly9sb2dpbi5pbnBvc3QucGwvYXV0aC9yZWFsbXMvZXh0ZXJuYWwiLCJzdWIiOiJmOjEyNDc1MDUxLTFjMDMtNGU1OS1iYTBjLTJiNDU2OTVlZjUzNTpMVUgyRWlSREtWRWVKSlRBTmlGZlRELWFyLVVEd0VVdU91THhycmhNbWdjIiwidHlwIjoiQmVhcmVyIiwiYXpwIjoic2hpcHgiLCJzZXNzaW9uX3N0YXRlIjoiNmQ4ODM2ZmMtOTQ2Ny00NjMwLThmYzctZjNmMWMwYTNhYWYwIiwic2NvcGUiOiJvcGVuaWQgYXBpOmFwaXBvaW50cyIsInNpZCI6IjZkODgzNmZjLTk0NjctNDYzMC04ZmM3LWYzZjFjMGEzYWFmMCIsImFsbG93ZWRfcmVmZXJyZXJzIjoiaW52c2JsLnZlcmNlbC5hcHAiLCJ1dWlkIjoiMjAyNjRhY2MtNjdjMi00YWU3LTg2ZWQtMjc2Y2UyNWQ1YTU2In0.n4PKHnRwUIPiKwaWFvbTOhLoTxpSYD98GIrCMqUHagWa88LRjwpfBcYdgLrcT7aG0H3NJhlCO6jj1juxzwhKAjsY6XKj_legKPMnC1JOE3jmk8jLdyUJ1VXTNny4ckzt1Zwi6fhdAitE7UVs2S5mhiiSKbni6qH4lhW5megcYp9k17RSqyRh6D3dau_rrS59YRBJ4dZRTzGaXD93sf0rHjaVlUB4263biF_ljnOttNIosVzruRylbvQJPr7v_ZY0i6KzTRj37bIn0N9JxHzFU-_Fu6JYqfX2Tj3K8mOVR1ZXaVQznOq55q6K3IeKFh3K764D8ZVLW1RaolZnlEmzuw'}
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