"use server";

import { stripe } from "@/lib/stripe";
import { redirect } from "next/navigation";
import { getProductBySlug } from "@/lib/product";

export async function createCheckoutSession(formData: FormData) {
    const slug = formData.get("slug") as string;
    const deliveryMethod = formData.get("deliveryMethod") as string; // 'courier' | 'inpost'
    const paczkomatCode = formData.get("paczkomatCode") as string;

    const product = getProductBySlug(slug);
    if (!product) throw new Error("Product not found");

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    // DEFINIUJEMY KOSZTY WYSYŁKI DYNAMICZNIE
    let shippingRateData;

    if (deliveryMethod === "inpost") {
        // Jeśli Paczkomat - sztywna cena, nazwa zawiera kod punktu
        shippingRateData = {
            type: "fixed_amount",
            fixed_amount: { amount: 1299, currency: "pln" }, // 12.99 PLN
            display_name: `Paczkomat InPost (${paczkomatCode})`,
        };
    } else {
        // Jeśli Kurier
        shippingRateData = {
            type: "fixed_amount",
            fixed_amount: { amount: 1599, currency: "pln" }, // 15.99 PLN
            display_name: "Kurier DPD",
        };
    }

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card", "blik", "p24"],

        // ZAWSZE zbieramy adres rozliczeniowy (billing).
        // Przy kurierze służy też jako dostawa.
        shipping_address_collection: {
            allowed_countries: ["PL"],
        },

        phone_number_collection: { enabled: true },

        // DYNAMICZNA OPCJA WYSYŁKI
        shipping_options: [
            {
                shipping_rate_data: {
                    ...shippingRateData,
                    delivery_estimate: {
                        minimum: { unit: "business_day", value: 2 },
                        maximum: { unit: "business_day", value: 3 },
                    },
                } as any, // rzutowanie by TypeScript nie marudził
            }
        ],

        line_items: [
            {
                price_data: {
                    currency: product.currency,
                    product_data: {
                        name: product.name,
                        images: [`${baseUrl}${product.image}`],
                        description: product.description,
                    },
                    unit_amount: product.price,
                },
                quantity: 1,
            },
        ],

        // KLUCZOWE: Zapisujemy kod paczkomatu w metadanych sesji
        metadata: {
            product_slug: product.slug,
            delivery_method: deliveryMethod,
            paczkomat_code: paczkomatCode || "", // To pójdzie do bazy w webhooku
        },

        mode: "payment",
        success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${baseUrl}/product/${product.slug}`,
    });

    if (!session.url) throw new Error("Failed to create session");
    redirect(session.url);
}