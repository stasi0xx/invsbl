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
    let metadata: Record<string, string | number> = {};

    if (isMultiItem && cartDataString) {
        // --- A. LOGIKA DLA KOSZYKA (WIELE PRODUKTÓW) ---
        // Tutaj rozmiar jest już zaszyty w "name" produktu (np. "Bluza [L]")
        // bo tak zapisaliśmy go w CartContext w poprzednim kroku.

        const cartItems = JSON.parse(cartDataString);

        lineItems = cartItems.map((item: any) => ({
            price_data: {
                currency: item.currency,
                product_data: {
                    name: item.name, // Tu będzie np. "CONCRETE HOODIE [L]"
                },
                unit_amount: item.price,
            },
            quantity: item.quantity,
        }));

        // Metadane dla koszyka
        metadata = {
            type: "cart_checkout",
            items_count: cartItems.length,
            // Lista ID produktów dla statystyk
            product_slugs: cartItems.map((i: any) => i.productSlug).join(","),
            delivery_method: (formData.get("deliveryMethod") as string) || "courier",
            paczkomat_code: (formData.get("paczkomatCode") as string) || "",
        };

    } else {
        // --- B. LOGIKA DLA POJEDYNCZEGO PRODUKTU (KUP TERAZ) ---
        const productSlug = formData.get("productSlug") as string;
        const priceAmount = parseFloat(formData.get("priceAmount") as string);
        const priceCurrency = formData.get("priceCurrency") as string;
        const productName = formData.get("productName") as string; // To zawiera nazwę z rozmiarem (z frontend)
        const deliveryMethod = formData.get("deliveryMethod") as string;
        const paczkomatCode = formData.get("paczkomatCode") as string;

        // NOWOŚĆ: Pobieramy rozmiar osobno
        const size = formData.get("size") as string;

        lineItems = [{
            price_data: {
                currency: priceCurrency,
                product_data: { name: productName }, // Wyświetli się klientowi w Stripe
                unit_amount: priceAmount,
            },
            quantity: 1,
        }];

        metadata = {
            type: "single_checkout",
            product_slug: productSlug,
            size: size || "N/A", // <--- ZAPISUJEMY ROZMIAR W METADANYCH
            delivery_method: deliveryMethod,
            paczkomat_code: paczkomatCode || "",
        };
    }

    // Tworzymy sesję Stripe
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card", "blik", "p24"], // Dodałem p24 dla pewności w PL
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