import { getProductBySlug, PRODUCTS } from "@/lib/product";
import { notFound } from "next/navigation";
import { ProductActions } from "@/components/ProductActions";
import { ProductGallery } from "@/components/ProductGallery";
import { Metadata } from "next";

// 1. Dynamiczne Metadata dla każdego produktu
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
    const { slug } = await params;
    const product = getProductBySlug(slug);

    if (!product) return {};

    return {
        title: product.name,
        description: product.description,
        openGraph: {
            title: product.name,
            description: product.description,
            images: [{ url: product.image }], // Pamiętaj, żeby to był pełny URL w produkcji
            type: 'website',
        },
    };
}

export async function generateStaticParams() {
    return PRODUCTS.map((product) => ({
        slug: product.slug,
    }));
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
    const { slug } = await params;
    const product = getProductBySlug(slug);

    if (!product) {
        return notFound();
    }

    // 2. Struktura JSON-LD dla Google'a
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.name,
        image: product.image, // Tutaj też przydałby się pełny URL z domeną
        description: product.description,
        brand: {
            '@type': 'Brand',
            name: 'INVSBL',
        },
        offers: {
            '@type': 'Offer',
            url: `${process.env.NEXT_PUBLIC_BASE_URL}/product/${product.slug}`,
            priceCurrency: product.currency.toUpperCase(),
            price: (product.price / 100).toFixed(2),
            itemCondition: 'https://schema.org/NewCondition',
            availability: product.sizes.some(s => s.available)
                ? 'https://schema.org/InStock'
                : 'https://schema.org/OutOfStock',
        },
    };

    return (
        <div className="min-h-screen pt-24 pb-12 px-0 md:px-8 max-w-[1400px] mx-auto">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <div className="grid grid-cols-1 md:grid-cols-12 gap-0 md:gap-12 lg:gap-16">

                {/* LEWA KOLUMNA - GALERIA */}
                <div className="md:col-span-7 lg:col-span-8">
                    <ProductGallery images={product.images} productName={product.name} />
                </div>

                {/* PRAWA KOLUMNA - TOR DLA STICKY */}
                {/* Musi być relatywna i pusta (tylko wrapper), żeby rozciągnęła się na całą wysokość galerii */}
                <div className="md:col-span-5 lg:col-span-4 px-4 md:px-0 mt-8 md:mt-0 relative h-full">

                    {/* WŁAŚCIWY ELEMENT STICKY */}
                    {/* Zasada działania:
                        1. sticky top-32 -> przykleja się 128px od góry.
                        2. max-h-[calc(100vh-10rem)] -> ogranicza wysokość do widocznego ekranu (z marginesami).
                        3. overflow-y-auto -> włącza scroll wewnątrz TEGO boxa, jeśli treść jest za długa.
                    */}
                    <div className="sticky top-32 max-h-[calc(100vh-10rem)] overflow-y-auto no-scrollbar flex flex-col gap-6">

                        {/* HEADER */}
                        <div className="border-b border-white/10 pb-4 shrink-0">
                            <h1 className="text-3xl md:text-5xl font-display font-black uppercase tracking-tighter mb-2 text-white leading-none">
                                {product.name}
                            </h1>
                            <div className="text-2xl text-acid font-mono">
                                {(product.price / 100).toFixed(2)} {product.currency.toUpperCase()}
                            </div>
                        </div>

                        {/* AKCJE - ZAWSZE WIDOCZNE (bo są wysoko w hierarchii scrolla) */}
                        <div className="shrink-0">
                            <ProductActions product={product} />
                        </div>

                        {/* DŁUGA TREŚĆ - SCROLLOWALNA WEWNĄTRZ */}
                        <div className="space-y-6 text-[#a1a1aa] font-light text-sm pb-8">
                            <p className="leading-relaxed">
                                {product.description}
                            </p>

                            <div className="space-y-2 pt-4 border-t border-white/10">
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

                            <div className="mt-4 pt-6 border-t border-white/10 grid grid-cols-2 gap-4 text-[10px] text-zinc-500 uppercase tracking-wider text-center">
                                <div className="border border-white/5 py-2">Wysyłka 24h</div>
                                <div className="border border-white/5 py-2">30 dni na zwrot</div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}