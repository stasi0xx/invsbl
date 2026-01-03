
import { Hero } from "@/components/Hero";
import {ProductShowcase} from "@/components/ProductShowcase";

export default function Home() {
    return (
        <main className="min-h-screen w-full bg-[#09090b]">

            {/* 1. HERO - Wyjęte z kontenera z paddingiem.
            Teraz dotyka krawędzi ekranu i headera.
            Klasa object-center w Hero.tsx zadba o to, by zdjęcie trzymało środek. */}
            <Hero />

            <ProductShowcase />

        </main>
    );
}