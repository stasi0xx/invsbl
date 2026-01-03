import { NextResponse } from "next/server";
import { resend } from "@/lib/resend";

export async function GET() {
    console.log("🚀 Rozpoczynam TEST wysyłki maila...");

    // 1. Sprawdź czy klucz jest widoczny
    if (!process.env.RESEND_API_KEY) {
        console.error("❌ BŁĄD: Brak RESEND_API_KEY w zmiennych środowiskowych!");
        return NextResponse.json({ error: "Missing API Key" }, { status: 500 });
    }

    try {
        console.log("📧 Próba wysyłki przez Resend...");

        const { data, error } = await resend.emails.send({
            // WAŻNE: Tutaj wpisz to, co ustawiłeś w Resend
            // Jeśli masz zweryfikowaną domenę: 'INVSBL <kontakt@twoja-domena.pl>'
            // Jeśli NIE masz domeny: 'onboarding@resend.dev'
            from: 'INVSBL <orders@szkolaonline.com>',

            // WAŻNE: Wyślij na SWÓJ prywatny mail
            to: ['stanislaw.korycki.w@gmail.com'],

            subject: 'Test integracji Resend (Next.js)',
            html: '<h1>To jest test</h1><p>Jeśli to widzisz, Resend działa!</p>',
        });

        if (error) {
            console.error("🔥 RESEND ZWRÓCIŁ BŁĄD:", error);
            return NextResponse.json({ success: false, error }, { status: 400 });
        }

        console.log("✅ SUKCES! Mail wysłany. ID:", data?.id);
        return NextResponse.json({ success: true, id: data?.id });

    } catch (err: any) {
        console.error("💀 BŁĄD KRYTYCZNY:", err);
        return NextResponse.json({ success: false, message: err.message }, { status: 500 });
    }
}