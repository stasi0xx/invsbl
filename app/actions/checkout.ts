"use server";

import { stripe } from "@/lib/stripe";
import { redirect } from "next/navigation";
import { getProductBySlug } from "@/lib/product";

export async function createCheckoutSession(formData: FormData) {
    // 1. Ustalanie URL powrotnego (Najbezpieczniejsza metoda)
    const origin = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    const isMultiItem = formData.get("isMultiItem") === "true";
    const deliveryMethod = (formData.get("deliveryMethod") as string) || "courier";
    const paczkomatCode = (formData.get("paczkomatCode") as string) || "";

    let lineItems = [];
    let metadata: Record<string, string | number> = {};

    if (isMultiItem) {
        // --- A. LOGIKA DLA KOSZYKA (SECURE MODE) ---
        const cartDataString = formData.get("cartData") as string;
        if (!cartDataString) throw new Error("Koszyk jest pusty");

        const cartItemsRaw = JSON.parse(cartDataString);

        // Mapujemy asynchronicznie, żeby zweryfikować każdy produkt
        // UWAGA: Weryfikujemy cenę każdego produktu z osobna!
        const validatedItems = cartItemsRaw.map((item: any) => {
            // item.productSlug musi być zapisany w CartContext
            const realProduct = getProductBySlug(item.productSlug);

            if (!realProduct) {
                throw new Error(`Produkt o slug ${item.productSlug} nie istnieje lub został wycofany.`);
            }

            return {
                price_data: {
                    currency: realProduct.currency, // Bierzemy z serwera
                    product_data: {
                        name: item.name, // Nazwa z rozmiarem (np. z koszyka) jest OK, bo to tylko label
                        images: [realProduct.image], // Dodajemy zdjęcie do checkoutu
                    },
                    unit_amount: realProduct.price, // <--- KLUCZOWE: Cena z serwera!
                },
                quantity: item.quantity,
                slug: item.productSlug // pomocniczo do metadanych
            };
        });

        lineItems = validatedItems;

        metadata = {
            type: "cart_checkout",
            items_count: validatedItems.length,
            product_slugs: validatedItems.map((i: any) => i.slug).join(","),
            delivery_method: deliveryMethod,
            paczkomat_code: paczkomatCode,
        };

    } else {
        // --- B. LOGIKA DLA POJEDYNCZEGO PRODUKTU (SECURE MODE) ---
        const productSlug = formData.get("productSlug") as string;
        const size = formData.get("size") as string;

        // 1. Pobieramy produkt z "bazy" (pliku)
        const product = getProductBySlug(productSlug);

        if (!product) {
            throw new Error("Produkt nie istnieje");
        }

        // 2. Budujemy nazwę (User wybiera rozmiar, ale bazowa nazwa pochodzi z serwera)
        const isPreorder = !!product.preorderDate;
        const finalName = `${product.name} [${size}]${isPreorder ? ' (PRE-ORDER)' : ''}`;

        lineItems = [{
            price_data: {
                currency: product.currency,
                product_data: {
                    name: finalName,
                    images: [product.image],
                },
                unit_amount: product.price, // <--- KLUCZOWE: Cena z serwera, ignorujemy formData
            },
            quantity: 1,
        }];

        metadata = {
            type: "single_checkout",
            product_slug: productSlug,
            size: size || "N/A",
            delivery_method: deliveryMethod,
            paczkomat_code: paczkomatCode,
        };
    }

    // --- TWORZENIE SESJI STRIPE ---
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card", "blik", "p24"],
        line_items: lineItems,
        mode: "payment",
        // Używamy zmiennej origin zdefiniowanej na początku (z env)
        success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${origin}/`,
        metadata: metadata,
        phone_number_collection: { enabled: true },
        shipping_address_collection: { allowed_countries: ["PL"] },
        // Opcjonalnie: wymuś język polski w checkout
        locale: "pl",
    });

    if (session.url) {
        redirect(session.url);
    }
}