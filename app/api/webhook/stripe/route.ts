import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { db } from "@/db"; // Import Twojej bazy
import { orders } from "@/db/schema"; // Import tabeli
import { resend } from "@/lib/resend";
import { OrderTemplate } from "@/components/emails/OrderTemplate";

export async function POST(req: Request) {
    const body = await req.text();
    const signature = (await headers()).get("Stripe-Signature") as string;
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!webhookSecret) {
        return new NextResponse("Missing STRIPE_WEBHOOK_SECRET", { status: 500 });
    }

    let event;

    // 1. Weryfikacja czy to na pewno Stripe (Security)
    try {
        event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: any) {
        console.error(`❌ Webhook signature verification failed.`, err.message);
        return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
    }

    // 2. Obsługa zdarzenia: Płatność udana
    if (event.type === "checkout.session.completed") {
        const session = event.data.object as any;

        console.log(`💰 Payment success: ${session.id}`);

        // Wyciągamy dane z metadanych (to co wysłaliśmy w checkout.ts)
        const { product_slug, delivery_method, paczkomat_code } = session.metadata || {};

        // Dane klienta
        const customerEmail = session.customer_details?.email;
        const customerName = session.customer_details?.name;
        const amountTotal = session.amount_total;
        const currency = session.currency;

        // Adres (dla kuriera)
        const shippingDetails = session.shipping_details || session.customer_details;

        if (!customerEmail || !product_slug) {
            console.error("❌ Missing metadata or email");
            return new NextResponse("Missing data", { status: 400 });
        }

        try {
            // A. ZAPIS DO BAZY DANYCH (NEON)
            await db.insert(orders).values({
                stripeSessionId: session.id,
                customerEmail: customerEmail,
                customerName: customerName,
                customerPhone: session.customer_details?.phone || "",
                shippingAddress: shippingDetails, // Drizzle sam to zrzuci do JSON
                deliveryMethod: delivery_method || "unknown",
                paczkomatCode: paczkomat_code || null,
                productSlug: product_slug,
                amountTotal: amountTotal,
                currency: currency,
                status: "paid",
            });

            console.log("✅ Order saved to DB");

            // B. WYSYŁKA MAILA (RESEND)
            await resend.emails.send({
                from: 'INVSBL <orders@szkolaonline.com>', // W produkcji zmień na swoją domenę!
                to: [customerEmail], // Wysyłamy do klienta
                subject: `Order Confirmed #${session.id.slice(-5).toUpperCase()}`,
                react: OrderTemplate({
                    orderId: session.id.slice(-8).toUpperCase(),
                    products: product_slug, // Tu można pobrać ładną nazwę z products.ts
                    amount: `${(amountTotal / 100).toFixed(2)} ${currency.toUpperCase()}`,
                    paczkomat: paczkomat_code
                }) as React.ReactElement,
            });

            console.log("✅ Email sent");

        } catch (error) {
            console.error("🔥 Error saving order/sending email:", error);
            return new NextResponse("Internal Server Error", { status: 500 });
        }
    }

    return new NextResponse(null, { status: 200 });
}