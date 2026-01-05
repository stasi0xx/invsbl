import { getProductBySlug, PRODUCTS } from "@/lib/product";
import { notFound } from "next/navigation";
import { ProductActions } from "@/components/ProductActions";
import { ProductGallery } from "@/components/ProductGallery"; // <--- Import Galerii

// Generowanie statycznych ścieżek dla lepszego SEO i wydajności
export async function generateStaticParams() {
    return PRODUCTS.map((product) => ({
        slug: product.slug,
    }));
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
    // Await params in Next.js 15+ (if applicable, safe to do)
    const { slug } = await params;
    const product = getProductBySlug(slug);

    if (!product) {
        return notFound();
    }

    return (
        <div className="min-h-screen pt-24 pb-12 px-0 md:px-8 max-w-[1400px] mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-0 md:gap-12 lg:gap-16">

                {/* LEWA KOLUMNA: Galeria Zdjęć (Zajmuje więcej miejsca na desktopie) */}
                <div className="md:col-span-7 lg:col-span-8">
                    <ProductGallery images={product.images} productName={product.name} />
                </div>

                {/* PRAWA KOLUMNA: Info i Zakup (Sticky) */}
                <div className="md:col-span-5 lg:col-span-4 px-4 md:px-0 mt-8 md:mt-0 relative">
                    <div className="sticky top-32">

                        {/* Nagłówek Produktu */}
                        <div className="mb-8 border-b border-white/10 pb-6">
                            <h1 className="text-3xl md:text-5xl font-display font-black uppercase tracking-tighter mb-2 text-white leading-none">
                                {product.name}
                            </h1>
                            <div className="text-2xl text-acid font-mono">
                                {(product.price / 100).toFixed(2)} {product.currency.toUpperCase()}
                            </div>
                        </div>

                        {/* Opis */}
                        <p className="text-[#a1a1aa] leading-relaxed mb-8 font-light text-sm md:text-base">
                            {product.description}
                        </p>

                        {/* Cechy (Bullet points) */}
                        <div className="mb-8 space-y-2">
                            <p className="text-xs uppercase tracking-widest text-zinc-500 font-bold mb-3">Specyfikacja</p>
                            <ul className="text-sm text-zinc-300 space-y-1 font-mono">
                                {product.features.map((feature, i) => (
                                    <li key={i} className="flex items-center gap-2">
                                        <span className="w-1 h-1 bg-acid rounded-full" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Akcje (Koszyk/Kup Teraz) */}
                        <ProductActions product={product} />

                        {/* Trust Badges */}
                        <div className="mt-8 pt-6 border-t border-white/10 grid grid-cols-2 gap-4 text-[10px] text-zinc-500 uppercase tracking-wider text-center">
                            <div className="border border-white/5 py-2">Wysyłka 24h</div>
                            <div className="border border-white/5 py-2">30 dni na zwrot</div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}