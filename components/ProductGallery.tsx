"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { clsx } from "clsx";

interface ProductGalleryProps {
    images: string[];
    productName: string;
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
    const [activeImage, setActiveImage] = useState(0);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Funkcja obsługująca scrollowanie na mobile (żeby aktualizować kropki)
    const handleScroll = () => {
        if (scrollRef.current) {
            const { scrollLeft, clientWidth } = scrollRef.current;
            const index = Math.round(scrollLeft / clientWidth);
            setActiveImage(index);
        }
    };

    return (
        <div className="w-full relative">

            {/* 1. GRID NA DESKTOP (MD+) */}
            {/* Ukryty na mobile, widoczny na desktopie. Prosty układ 2 kolumny. */}
            <div className="hidden md:grid grid-cols-2 gap-4">
                {images.map((img, i) => (
                    <div key={i} className="relative aspect-[3/4] bg-zinc-900 overflow-hidden group">
                        <Image
                            src={img}
                            alt={`${productName} view ${i + 1}`}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                            sizes="(max-width: 768px) 100vw, 50vw"
                            priority={i === 0} // Pierwsze zdjęcie ładujemy priorytetowo
                        />
                    </div>
                ))}
            </div>

            {/* 2. SWIPE CAROUSEL NA MOBILE (< MD) */}
            <div className="md:hidden relative group">

                {/* Kontener przewijania */}
                <div
                    ref={scrollRef}
                    onScroll={handleScroll}
                    className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide aspect-[3/4] bg-zinc-900"
                >
                    {images.map((img, i) => (
                        <div key={i} className="flex-shrink-0 w-full h-full relative snap-center">
                            <Image
                                src={img}
                                alt={`${productName} view ${i + 1}`}
                                fill
                                className="object-cover"
                                sizes="100vw"
                                priority={i === 0}
                            />
                        </div>
                    ))}
                </div>

                {/* Wskaźniki (Kropki) */}
                <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-10">
                    {images.map((_, i) => (
                        <div
                            key={i}
                            className={clsx(
                                "h-1.5 rounded-full transition-all duration-300 shadow-sm",
                                i === activeImage
                                    ? "w-6 bg-acid" // Aktywna kropka (szeroka, zielona)
                                    : "w-1.5 bg-black/50 backdrop-blur-sm" // Nieaktywna
                            )}
                        />
                    ))}
                </div>

                {/* Badge "Swipe" (znika po przewinięciu) */}
                {activeImage === 0 && (
                    <div className="absolute top-1/2 right-4 -translate-y-1/2 bg-black/30 backdrop-blur-md p-2 rounded-full animate-pulse pointer-events-none opacity-50">
                        <span className="sr-only">Swipe</span>
                        <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </div>
                )}

            </div>
        </div>
    );
}