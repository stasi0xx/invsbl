import { PRODUCTS } from "@/lib/product";
import Link from "next/link";
import { Hero } from "@/components/Hero";

export default function Home() {
    return (
        <main className="min-h-screen w-full bg-[#09090b]">

            {/* 1. HERO - Wyjęte z kontenera z paddingiem.
            Teraz dotyka krawędzi ekranu i headera.
            Klasa object-center w Hero.tsx zadba o to, by zdjęcie trzymało środek. */}
            <Hero />

            {/* 2. LISTA PRODUKTÓW - Dopiero tutaj dajemy padding i centrowanie */}
            <section id="products" className="w-full max-w-7xl mx-auto px-4 py-24">
                <div className="grid gap-4 w-full max-w-md mx-auto animate-slide-up [animation-delay:600ms]">
                    {PRODUCTS.map((product) => (
                        <Link
                            key={product.id}
                            href={`/product/${product.slug}`}
                            className="group flex justify-between items-center border-b border-white/10 py-4 hover:border-acid transition-colors"
                        >
                        <span className="font-display font-bold text-xl group-hover:text-acid transition-colors">
                            {product.name}
                        </span>
                            <span className="font-mono text-sm text-text-secondary">
                            →
                        </span>
                        </Link>
                    ))}
                </div>
            </section>

        </main>
    );
}