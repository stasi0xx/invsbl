"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { PRODUCTS } from "@/lib/product";

export function ProductShowcase() {
    return (
        <section id="products" className="w-full max-w-7xl mx-auto px-4 md:px-8 py-24 md:py-32">

            {/* Nagłówek sekcji */}
            <div className="flex items-end justify-between mb-12 border-b border-white/10 pb-6">
                <h2 className="font-display text-4xl md:text-6xl font-black uppercase tracking-tighter text-white">
                    Selected <span className="text-acid">Items</span>
                </h2>
                <span className="hidden md:block text-zinc-500 font-mono text-xs uppercase tracking-widest">
              Limited Stock / Worldwide Shipping
          </span>
            </div>

            {/* Grid Produktów (Duże Bloki) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-8">
                {PRODUCTS.map((product) => (
                    <Link
                        key={product.id}
                        href={`/product/${product.slug}`}
                        className="group block relative"
                    >
                        {/* A. KONTENER ZDJĘCIA */}
                        <div className="relative aspect-[3/4] w-full overflow-hidden bg-zinc-900 border border-white/5 mb-6">

                            {/* Zdjęcie Produktu */}
                            <Image
                                src={product.image}
                                alt={product.name}
                                fill
                                className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out opacity-90 group-hover:opacity-100"
                                sizes="(max-width: 768px) 100vw, 50vw"
                            />
                            {product.preorderDate && (
                                <div className="absolute top-4 left-4 z-10">
            <span className="bg-yellow-500 text-black text-[10px] font-bold px-2 py-1 uppercase tracking-widest">
                Pre-Order
            </span>
                                </div>
                            )}

                            {/* Overlay na hoverze (Subtelny) */}
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-300" />

                            {/* Badge "ZOBACZ" pojawiający się na zdjęciu */}
                            <div className="absolute bottom-6 right-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                          <span className="bg-acid text-[#1a2e05] font-bold text-xs px-4 py-2 uppercase tracking-widest flex items-center gap-2">
                              Zobacz Detale <ArrowUpRight className="w-4 h-4" />
                          </span>
                            </div>
                        </div>

                        {/* B. DANE PRODUKTU */}
                        <div className="flex flex-col gap-2">
                            <div className="flex justify-between items-start">
                                <h3 className="font-display text-2xl md:text-3xl font-bold uppercase tracking-tight text-white group-hover:text-acid transition-colors">
                                    {product.name}
                                </h3>
                                <span className="font-mono text-xl text-acid">
                              {(product.price / 100).toFixed(2)} {product.currency.toUpperCase()}
                          </span>
                            </div>

                            {/* Krótki opis */}
                            <p className="text-zinc-500 text-sm font-mono uppercase tracking-wide max-w-[90%]">
                                {product.description.slice(0, 80)}...
                            </p>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Info pod spodem */}
            <div className="mt-24 text-center border-t border-white/10 pt-12">
                <p className="text-zinc-600 text-xs uppercase tracking-[0.3em] mb-4">
                    Designed in Poland • Fabricated for future
                </p>
            </div>

        </section>
    );
}