"use server";

import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export async function createCheckoutSession(formData: FormData) {
    const origin = (await headers()).get("origin") || "http://localhost:3000";

    // Sprawdzamy, czy to checkout z koszyka (wiele produktów)
    const cartDataString = formData.get("cartData") as string;
    const isMultiItem = formData.get("isMultiItem") === "true";

    let lineItems = [];
    let metadata = {};

    if (isMultiItem && cartDataString) {
        // --- LOGIKA DLA KOSZYKA (WIELE PRODUKTÓW) ---
        const cartItems = JSON.parse(cartDataString);

        lineItems = cartItems.map((item: any) => ({
            price_data: {
                currency: item.currency,
                product_data: {
                    name: item.name,
                },
                unit_amount: item.price,
            },
            quantity: item.quantity,
        }));

        // W przypadku wielu produktów, w metadanych zapiszemy ogólne info
        // lub możemy zapisać JSON string ID produktów (uwaga na limit znaków w Stripe Metadata!)
        metadata = {
            type: "cart_checkout",
            items_count: cartItems.length,
            // Możemy dodać product_slugs po przecinku dla analityki
            product_slugs: cartItems.map((i: any) => i.productSlug).join(","),
            delivery_method: formData.get("deliveryMethod") || "courier",
        };

    } else {
        // --- LOGIKA DLA POJEDYNCZEGO PRODUKTU (STARA) ---
        const productSlug = formData.get("productSlug") as string;
        const priceAmount = parseFloat(formData.get("priceAmount") as string);
        const priceCurrency = formData.get("priceCurrency") as string;
        const productName = formData.get("productName") as string;
        const deliveryMethod = formData.get("deliveryMethod") as string;
        const paczkomatCode = formData.get("paczkomatCode") as string;

        lineItems = [{
            price_data: {
                currency: priceCurrency,
                product_data: { name: productName },
                unit_amount: priceAmount,
            },
            quantity: 1,
        }];

        metadata = {
            product_slug: productSlug,
            delivery_method: deliveryMethod,
            paczkomat_code: paczkomatCode || "",
        };
    }

    // Tworzymy sesję
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card", "blik"],
        line_items: lineItems,
        mode: "payment",
        success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${origin}/`,
        metadata: metadata,
        phone_number_collection: { enabled: true },
        shipping_address_collection: { allowed_countries: ["PL"] },
    });

    if (session.url) {
        redirect(session.url);
    }
}