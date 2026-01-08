export type ProductSize = {
    label: string;
    available: boolean;
};

export type Product = {
    id: string;
    name: string;
    slug: string;
    price: number;
    currency: string;
    description: string;
    features: string[];
    image: string;
    images: string[];
    sizes: ProductSize[]; // <--- NOWOŚĆ: Tablica rozmiarów
};

export const PRODUCTS: Product[] = [
    {
        id: "prod_hoodie",
        name: "INVISIBLE SCRIPT HEAVYWEIGHT HOODIE",
        slug: "invisible-script-hoodie",
        price: 34900,
        currency: "pln",
        description: "Heavyweight Cotton Hoodie.Gramatura 480gsm.",
        features: [
            "480gsm Heavyweight Cotton",
            "Boxy Fit / Dropped Shoulders",
            "Invisible Script Embroidery",
            "Made in Poland"
        ],
        image: "/bluza-zlozone.webp",
        images: [
            "/bluza-zlozone.webp",
            "/bluza-przod.webp",
            "/bluza-tyl.webp", // Pamiętaj o podmianie na tył

        ],
        // Definiujemy dostępność (np. L wyprzedane)
        sizes: [
            { label: "XS", available: true },
            { label: "S", available: true },
            { label: "M", available: true },
            { label: "L", available: true }, // WYPRZEDANE
            { label: "XL", available: true },
        ]
    },
    {
        id: "prod_pants",
        name: "INVISIBLE SCRIPT HEAVYWEIGHT SWEATPANTS",
        slug: "invisible-script-sweatpants",
        price: 29900,
        currency: "pln",
        description: "Idealne do kompletu. Ciężka bawełna, krój relaxed.",
        features: [
            "480gsm Heavyweight Cotton",
            "Relaxed Fit / Stacked Hem",
            "Deep Pockets",
            "Invisible Script Print"
        ],
        image: "/spodnie-przod.webp",
        images: [
            "/spodnie-przod.webp",
            "/spodnie-tyl.webp",
        ],
        sizes: [
            { label: "XS", available: true },
            { label: "S", available: true },
            { label: "M", available: true },
            { label: "L", available: true },
            { label: "XL", available: true },
        ]
    }
];

export function getProductBySlug(slug: string): Product | undefined {
    return PRODUCTS.find((p) => p.slug === slug);
}