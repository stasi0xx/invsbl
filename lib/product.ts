// src/lib/products.ts

export type Product = {
    id: string;
    name: string;
    slug: string;
    price: number; // Cena w groszach (np. 25000 = 250.00 PLN)
    currency: string;
    description: string;
    features: string[]; // Lista cech (gramatura, krój)
    image: string; // Na razie placeholder, potem podmienisz na prawdziwe
};

export const PRODUCTS: Product[] = [
    {
        id: "prod_001",
        name: "CONCRETE HOODIE",
        slug: "concrete-hoodie-v1",
        price: 34900, // 349.00 PLN
        currency: "pln",
        description: "Zbroja na miejską dżunglę. Gramatura 480gsm. Niezniszczalna.",
        features: [
            "480gsm Heavyweight Cotton",
            "Boxy Fit / Dropped Shoulders",
            "Acid Wash Finish",
            "Made in Poland"
        ],
        image: "/CONCRETE HOODIE.webp", // Wrzuć cokolwiek do folderu /public
    },
    {
        id: "prod_002",
        name: "VOID TEE",
        slug: "void-tee-v1",
        price: 15900, // 159.00 PLN
        currency: "pln",
        description: "T-shirt czarniejszy niż twoja przyszłość. Mercerizowana bawełna.",
        features: [
            "280gsm Heavy Jersey",
            "Oversized Fit",
            "Silicon Softener Wash",
            "No Branding (Inside Tag Only)"
        ],
        image: "/placeholder-tee.jpg",
    }
];

// Helper do pobierania produktu po slugu (użyjemy na stronie produktu)
export function getProductBySlug(slug: string): Product | undefined {
    return PRODUCTS.find((p) => p.slug === slug);
}