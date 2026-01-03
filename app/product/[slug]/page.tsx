import { notFound } from "next/navigation";
import { PRODUCTS, getProductBySlug } from "@/lib/product";
import Link from "next/link";
import {BuyButton} from "@/components/BuyButton";
import {CheckoutForm} from "@/components/CheckoutForm";

// 1. To sprawia, że strony są statyczne (Ultra Fast)
export function generateStaticParams() {
    return PRODUCTS.map((product) => ({
        slug: product.slug,
    }));
}

export default async function ProductPage({
                                              params,
                                          }: {
    params: Promise<{ slug: string }>; // W Next 15/16 params są Promise'em!
}) {
    const { slug } = await params;
    const product = getProductBySlug(slug);

    if (!product) {
        notFound(); // Zwraca stronę 404
    }

    // Formatowanie ceny (proste, na razie)
    const formattedPrice = new Intl.NumberFormat('pl-PL', {
        style: 'currency',
        currency: product.currency,
    }).format(product.price / 100);

    return (
        <div className="min-h-screen grid md:grid-cols-2">

            {/* LEWA STRONA: Zdjęcie (Placeholder) */}
            <div className="bg-surface relative h-[50vh] md:h-screen w-full flex items-center justify-center border-b md:border-b-0 md:border-r border-white/5">
        <span className="text-text-secondary font-mono text-xs uppercase tracking-widest">
            [ IMAGE PLACEHOLDER: {product.name} ]
        </span>
                {/* Tutaj w przyszłości wejdzie next/image */}
            </div>

            {/* PRAWA STRONA: Detale */}
            <div className="flex flex-col justify-center p-8 md:p-20">

                {/* Breadcrumb (Nawigacja) */}
                <Link href="/" className="text-text-secondary hover:text-acid mb-12 text-sm font-mono tracking-wider transition-colors">
                    ← BACK TO BASE
                </Link>

                {/* Tytuł */}
                <h1 className="font-display text-4xl md:text-6xl font-black uppercase leading-none mb-4 text-text-primary">
                    {product.name}
                </h1>

                {/* Cena */}
                <div className="text-2xl font-mono text-acid mb-8 border-l-2 border-acid pl-4">
                    {formattedPrice}
                </div>

                {/* Opis */}
                <p className="text-text-secondary leading-relaxed mb-8 max-w-md">
                    {product.description}
                </p>

                {/* Cechy (Features) */}
                <ul className="mb-12 space-y-2">
                    {product.features.map((feature, i) => (
                        <li key={i} className="flex items-center text-sm text-text-primary font-mono">
                            <span className="w-1.5 h-1.5 bg-acid mr-3"></span>
                            {feature}
                        </li>
                    ))}
                </ul>

                {/* Przycisk Kupowania (Na razie atrapa) */}
                <div className="mt-8">
                    <CheckoutForm slug={product.slug} />
                </div>

            </div>
        </div>
    );
}