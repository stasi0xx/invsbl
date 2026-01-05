import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { db } from "@/db";
import { orders } from "@/db/schema";
import { resend } from "@/lib/resend";
import { OrderTemplate } from "@/components/emails/OrderTemplate";

export async function POST(req: Request) {
    const body = await req.text();
    const signature = (await headers()).get("Stripe-Signature") as string;
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!webhookSecret) return new NextResponse("Missing Secret", { status: 500 });

    let event;
    try {
        event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: any) {
        return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
    }

    if (event.type === "checkout.session.completed") {
        const session = event.data.object as any;

        // 1. Pobieramy pełną listę zakupionych produktów (Line Items) ze Stripe
        // To konieczne, bo w samym obiekcie session nie ma szczegółów koszyka
        const lineItems = await stripe.checkout.sessions.listLineItems(session.id);

        // Formatujemy przedmioty do zapisu w naszej bazie (JSONB)
        const orderItems = lineItems.data.map((item) => ({
            name: item.description, // Tutaj będzie np. "Hoodie [L]"
            quantity: item.quantity,
            amount: item.amount_total,
            currency: item.currency
        }));

        // Wyciągamy metadane (logistyka)
        const { delivery_method, paczkomat_code } = session.metadata || {};

        try {
            // 2. ZAPIS DO BAZY (Zaktualizowana struktura)
            const [newOrder] = await db.insert(orders).values({
                stripeSessionId: session.id,
                customerEmail: session.customer_details?.email,
                customerName: session.customer_details?.name,
                customerPhone: session.customer_details?.phone || "",
                shippingAddress: session.shipping_details || session.customer_details,

                deliveryMethod: delivery_method || "courier",
                paczkomatCode: paczkomat_code || null,

                items: orderItems, // <--- Zapisujemy całą listę zakupów

                amountTotal: session.amount_total,
                currency: session.currency,
                status: "paid",
            }).returning();

            // 3. E-MAIL POTWIERDZAJĄCY (Styl Industrialny)
            await resend.emails.send({
                from: 'INVSBL <orders@twojadomena.pl>', // Pamiętaj o weryfikacji domeny w Resend
                to: [session.customer_details?.email],
                subject: `Order Confirmed #${newOrder.id}`,
                react: OrderTemplate({
                    orderId: newOrder.id,
                    items: orderItems, // Przekazujemy listę do maila
                    amount: `${(session.amount_total / 100).toFixed(2)} ${session.currency.toUpperCase()}`,
                    deliveryMethod: delivery_method || "courier",
                    paczkomat: paczkomat_code
                }) as React.ReactElement,
            });

            console.log(`✅ Order #${newOrder.id} processed successfully`);

        } catch (error) {
            console.error("🔥 Error processing order:", error);
            return new NextResponse("Internal Server Error", { status: 500 });
        }
    }

    return new NextResponse(null, { status: 200 });
}