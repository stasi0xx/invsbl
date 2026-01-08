"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { clsx } from "clsx";
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";

interface ProductGalleryProps {
    images: string[];
    productName: string;
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
    // --- STATE ---
    const [activeMobileImage, setActiveMobileImage] = useState(0); // Dla karuzeli mobile
    const [isModalOpen, setIsModalOpen] = useState(false);         // Czy lightbox jest otwarty
    const [modalImageIndex, setModalImageIndex] = useState(0);     // Aktualne zdjęcie w lightboxie

    const scrollRef = useRef<HTMLDivElement>(null);

    // --- MOBILE LOGIC ---
    const handleScroll = () => {
        if (scrollRef.current) {
            const { scrollLeft, clientWidth } = scrollRef.current;
            const index = Math.round(scrollLeft / clientWidth);
            setActiveMobileImage(index);
        }
    };

    const scrollToMobileIndex = (index: number) => {
        if (scrollRef.current) {
            const width = scrollRef.current.clientWidth;
            scrollRef.current.scrollTo({ left: width * index, behavior: "smooth" });
        }
    };

    const handleMobilePrev = (e: React.MouseEvent) => {
        e.preventDefault();
        if (activeMobileImage > 0) scrollToMobileIndex(activeMobileImage - 1);
    };

    const handleMobileNext = (e: React.MouseEvent) => {
        e.preventDefault();
        if (activeMobileImage < images.length - 1) scrollToMobileIndex(activeMobileImage + 1);
    };


    // --- DESKTOP LIGHTBOX LOGIC ---

    const openModal = (index: number) => {
        setModalImageIndex(index);
        setIsModalOpen(true);
        document.body.style.overflow = "hidden"; // Blokujemy scrollowanie strony pod spodem
    };

    const closeModal = useCallback(() => {
        setIsModalOpen(false);
        document.body.style.overflow = "unset"; // Odblokowujemy scroll
    }, []);

    const nextModalImage = useCallback((e?: React.MouseEvent) => {
        e?.stopPropagation();
        setModalImageIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0)); // Loop (opcjonalnie)
    }, [images.length]);

    const prevModalImage = useCallback((e?: React.MouseEvent) => {
        e?.stopPropagation();
        setModalImageIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1)); // Loop (opcjonalnie)
    }, [images.length]);

    // Obsługa klawiatury (A11y & Power Users)
    useEffect(() => {
        if (!isModalOpen) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") closeModal();
            if (e.key === "ArrowRight") nextModalImage();
            if (e.key === "ArrowLeft") prevModalImage();
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isModalOpen, closeModal, nextModalImage, prevModalImage]);


    return (
        <div className="w-full relative">

            {/* =========================================
          1. DESKTOP GRID (MD+)
      ========================================= */}
            <div className="hidden md:grid grid-cols-2 gap-4">
                {images.map((img, i) => (
                    <div
                        key={i}
                        onClick={() => openModal(i)}
                        className="relative aspect-[3/4] bg-zinc-900 overflow-hidden group cursor-zoom-in"
                    >
                        <Image
                            src={img}
                            alt={`${productName} view ${i + 1}`}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                            sizes="(max-width: 768px) 100vw, 50vw"
                            priority={i === 0}
                        />
                        {/* Overlay informujący o możliwości powiększenia */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                            <div className="bg-black/50 backdrop-blur-sm p-3 rounded-full text-white">
                                <ZoomIn className="w-6 h-6" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* =========================================
          2. MOBILE CAROUSEL (< MD)
      ========================================= */}
            <div className="md:hidden relative group">
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

                {/* Strzałki Mobile */}
                <>
                    <button
                        onClick={handleMobilePrev}
                        disabled={activeMobileImage === 0}
                        className={clsx(
                            "absolute left-4 top-1/2 -translate-y-1/2 z-20",
                            "p-2 rounded-full bg-black/20 backdrop-blur-md text-white border border-white/10",
                            "transition-all duration-300 active:scale-95 hover:bg-black/40",
                            activeMobileImage === 0 ? "opacity-0 pointer-events-none" : "opacity-100"
                        )}
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>

                    <button
                        onClick={handleMobileNext}
                        disabled={activeMobileImage === images.length - 1}
                        className={clsx(
                            "absolute right-4 top-1/2 -translate-y-1/2 z-20",
                            "p-2 rounded-full bg-black/20 backdrop-blur-md text-white border border-white/10",
                            "transition-all duration-300 active:scale-95 hover:bg-black/40",
                            activeMobileImage === images.length - 1 ? "opacity-0 pointer-events-none" : "opacity-100"
                        )}
                    >
                        <ChevronRight className="w-6 h-6" />
                    </button>
                </>

                {/* Wskaźniki Mobile */}
                <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-10 pointer-events-none">
                    {images.map((_, i) => (
                        <div
                            key={i}
                            className={clsx(
                                "h-1.5 rounded-full transition-all duration-300 shadow-sm",
                                i === activeMobileImage ? "w-6 bg-acid" : "w-1.5 bg-black/50 backdrop-blur-sm"
                            )}
                        />
                    ))}
                </div>
            </div>

            {/* =========================================
          3. FULLSCREEN LIGHTBOX (MODAL)
      ========================================= */}
            {isModalOpen && (
                <div
                    className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center animate-in fade-in duration-200"
                    onClick={closeModal} // Kliknięcie w tło zamyka
                >
                    {/* Przycisk Zamknij (Absolutnie w rogu ekranu) */}
                    <button
                        onClick={closeModal}
                        className="absolute top-6 right-6 p-2 text-zinc-400 hover:text-white transition-colors z-50"
                    >
                        <X className="w-8 h-8" />
                        <span className="sr-only">Close</span>
                    </button>

                    {/* Kontener na zdjęcie (Kliknięcie w niego NIE zamyka) */}
                    <div
                        className="relative w-full h-full max-w-7xl max-h-screen p-4 md:p-10 flex items-center justify-center"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Obraz */}
                        <div className="relative w-full h-full">
                            <Image
                                src={images[modalImageIndex]}
                                alt={`Zoomed view ${modalImageIndex + 1}`}
                                fill
                                className="object-contain"
                                quality={100}
                                priority
                            />
                        </div>
                    </div>

                    {/* Nawigacja w Modalu (Strzałki) */}
                    <button
                        onClick={prevModalImage}
                        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 p-3 text-white/50 hover:text-white hover:bg-white/10 rounded-full transition-all"
                    >
                        <ChevronLeft className="w-8 h-8 md:w-12 md:h-12" />
                    </button>

                    <button
                        onClick={nextModalImage}
                        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 p-3 text-white/50 hover:text-white hover:bg-white/10 rounded-full transition-all"
                    >
                        <ChevronRight className="w-8 h-8 md:w-12 md:h-12" />
                    </button>

                    {/* Licznik zdjęć */}
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-zinc-400 font-mono text-sm tracking-widest">
                        {modalImageIndex + 1} / {images.length}
                    </div>
                </div>
            )}

        </div>
    );
}