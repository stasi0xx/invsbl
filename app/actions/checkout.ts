"use server";

import { stripe } from "@/lib/stripe";
import { redirect } from "next/navigation";
import { getProductBySlug } from "@/lib/product";

export async function createCheckoutSession(formData: FormData) {
    const origin = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const isMultiItem = formData.get("isMultiItem") === "true";
    const deliveryMethod = (formData.get("deliveryMethod") as string) || "courier";
    const paczkomatCode = (formData.get("paczkomatCode") as string) || "";

    let lineItems = [];
    let metadata: Record<string, string | number> = {};
    let sessionUrl = "";

    try {
        if (isMultiItem) {
            // --- KOSZYK ---
            const cartDataString = formData.get("cartData") as string;
            if (!cartDataString) throw new Error("Koszyk jest pusty");

            const cartItemsRaw = JSON.parse(cartDataString);

            lineItems = cartItemsRaw.map((item: any) => {
                const realProduct = getProductBySlug(item.productSlug);
                if (!realProduct) throw new Error(`Produkt ${item.productSlug} nie istnieje.`);

                return {
                    price_data: {
                        currency: realProduct.currency,
                        product_data: {
                            name: item.name,
                            // images: [] <--- WYŁĄCZONE DLA BEZPIECZEŃSTWA (Image URL Error Prevention)
                        },
                        unit_amount: realProduct.price,
                    },
                    quantity: item.quantity,
                    slug: item.productSlug
                };
            });

            metadata = {
                type: "cart_checkout",
                items_count: lineItems.length,
                delivery_method: deliveryMethod,
                paczkomat_code: paczkomatCode,
            };

        } else {
            // --- POJEDYNCZY PRODUKT ---
            const productSlug = formData.get("productSlug") as string;
            const size = formData.get("size") as string;
            const product = getProductBySlug(productSlug);

            if (!product) throw new Error("Produkt nie istnieje");

            const isPreorder = !!product.preorderDate;
            const finalName = `${product.name} [${size}]${isPreorder ? ' (PRE-ORDER)' : ''}`;

            lineItems = [{
                price_data: {
                    currency: product.currency,
                    product_data: {
                        name: finalName,
                        // images: [] <--- WYŁĄCZONE DLA BEZPIECZEŃSTWA
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

        console.log("Tworzenie sesji Stripe (Automatic Methods)...");

        const session = await stripe.checkout.sessions.create({

            automatic_payment_methods: { enabled: true },

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
            sessionUrl = session.url;
        }

    } catch (error) {
        console.error("KRYTYCZNY BŁĄD STRIPE:", error);
        throw error;
    }

    if (sessionUrl) {
        redirect(sessionUrl);
    }
}