import { NextResponse } from "next/server";
import { db } from "@/db";
import { orders } from "@/db/schema";
import { isNotNull, eq, and } from "drizzle-orm";
import { resend } from "@/lib/resend";
import { TrackingTemplate } from "@/components/emails/TrackingTemplate";

// Ważne: To zapobiega cache'owaniu odpowiedzi przez Vercel,
// dzięki temu skrypt zawsze sprawdzi aktualny stan bazy.
export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        // 1. Znajdź zamówienia do wysyłki
        // Warunki: Numer śledzenia JEST wpisany ORAZ status to 'paid' (czyli jeszcze nie 'shipped')
        const ordersToProcess = await db
            .select()
            .from(orders)
            .where(
                and(
                    isNotNull(orders.trackingNumber),
                    eq(orders.status, 'paid')
                )
            );

        if (ordersToProcess.length === 0) {
            return NextResponse.json({ message: "No orders to process" });
        }

        console.log(`📦 Znaleziono ${ordersToProcess.length} zamówień do wysyłki.`);

        const results = [];

        // 2. Pętla po zamówieniach
        for (const order of ordersToProcess) {
            const trackingUrl = `https://inpost.pl/sledzenie-przesylek?number=${order.trackingNumber}`;

            // A. Wyślij e-mail
            const { error } = await resend.emails.send({
                from: 'INVSBL <onboarding@szkolaonline.com>', // Zmień na swoją domenę jak zweryfikujesz
                to: [order.customerEmail],
                subject: `Shipping Update #${order.id} - Paczka w drodze`,
                react: TrackingTemplate({
                    orderId: order.id,
                    trackingNumber: order.trackingNumber!,
                    trackingUrl: trackingUrl,
                }) as React.ReactElement,
            });

            if (error) {
                console.error(`❌ Błąd wysyłki dla zamówienia #${order.id}`, error);
                results.push({ id: order.id, status: 'error', error });
                continue;
            }

            // B. Zaktualizuj status w bazie na 'shipped'
            await db
                .update(orders)
                .set({ status: 'shipped' })
                .where(eq(orders.id, order.id));

            console.log(`✅ Wysłano powiadomienie dla zamówienia #${order.id}`);
            results.push({ id: order.id, status: 'sent' });
        }

        return NextResponse.json({ success: true, processed: results });

    } catch (error) {
        console.error("🔥 Critical Error in Tracking Cron:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}