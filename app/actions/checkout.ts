"use server";

import { stripe } from "@/lib/stripe";
import { redirect } from "next/navigation";
import { getProductBySlug } from "@/lib/product";

export async function createCheckoutSession(formData: FormData) {
    // 1. Ustalanie URL (Musi być HTTPS na produkcji)
    // Jeśli nie ustawiłeś zmiennej w Vercel, zadziała localhost, ale zdjęcia w Stripe mogą się nie wyświetlić (błąd 500 jednak zniknie).
    const origin = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    const isMultiItem = formData.get("isMultiItem") === "true";
    const deliveryMethod = (formData.get("deliveryMethod") as string) || "courier";
    const paczkomatCode = (formData.get("paczkomatCode") as string) || "";

    let lineItems = [];
    let metadata: Record<string, string | number> = {};

    try {
        if (isMultiItem) {
            // --- A. LOGIKA KOSZYKA ---
            const cartDataString = formData.get("cartData") as string;
            if (!cartDataString) throw new Error("Koszyk jest pusty");

            const cartItemsRaw = JSON.parse(cartDataString);

            const validatedItems = cartItemsRaw.map((item: any) => {
                const realProduct = getProductBySlug(item.productSlug);

                if (!realProduct) {
                    throw new Error(`Produkt ${item.productSlug} nie istnieje.`);
                }

                // --- FIX: TWORZENIE ABSOLUTNEGO URL DO ZDJĘCIA ---
                // Stripe wywali błąd 500, jeśli wyślesz mu "/bluza.webp". Musi być "https://.../bluza.webp"
                const imageUrl = realProduct.image.startsWith("http")
                    ? realProduct.image
                    : `${origin}${realProduct.image}`;

                return {
                    price_data: {
                        currency: realProduct.currency,
                        product_data: {
                            name: item.name,
                            images: [imageUrl], // <--- Teraz wysyłamy poprawny link
                        },
                        unit_amount: realProduct.price,
                    },
                    quantity: item.quantity,
                    slug: item.productSlug
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
            // --- B. LOGIKA POJEDYNCZA (KUP TERAZ) ---
            const productSlug = formData.get("productSlug") as string;
            const size = formData.get("size") as string;

            const product = getProductBySlug(productSlug);

            if (!product) {
                console.error("Critical Error: Produkt nieznany", productSlug);
                throw new Error("Produkt nie istnieje");
            }

            const isPreorder = !!product.preorderDate;
            const finalName = `${product.name} [${size}]${isPreorder ? ' (PRE-ORDER)' : ''}`;

            // --- FIX: TWORZENIE ABSOLUTNEGO URL DO ZDJĘCIA ---
            const imageUrl = product.image.startsWith("http")
                ? product.image
                : `${origin}${product.image}`;

            lineItems = [{
                price_data: {
                    currency: product.currency,
                    product_data: {
                        name: finalName,
                        images: [imageUrl], // <--- Teraz wysyłamy poprawny link
                    },
                    unit_amount: product.price,
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
            success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${origin}/`,
            metadata: metadata,
            phone_number_collection: { enabled: true },
            shipping_address_collection: { allowed_countries: ["PL"] },
            locale: "pl",
        });

        if (session.url) {
            redirect(session.url);
        }

    } catch (error) {
        console.error("STRIPE CHECKOUT ERROR:", error);
        throw error;
    }
}