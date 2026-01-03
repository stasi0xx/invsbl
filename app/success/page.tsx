import { stripe } from "@/lib/stripe";
import Link from "next/link";
import { redirect } from "next/navigation";

interface SuccessPageProps {
    searchParams: Promise<{
        session_id?: string;
    }>;
}

export default async function SuccessPage({ searchParams }: SuccessPageProps) {
    // 1. Wyciągamy session_id z URL (Next.js 16: searchParams to Promise!)
    const { session_id } = await searchParams;

    // Jeśli ktoś wchodzi tu bez płacenia -> wypad na główną
    if (!session_id) {
        redirect("/");
    }

    // 2. Weryfikujemy sesję w Stripe (Server-Side)
    // To nam da email klienta i status płatności
    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (session.status !== "complete") {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center text-red-500 font-mono">
                <h1>PAYMENT ERROR. STATUS: {session.status?.toUpperCase()}</h1>
                <Link href="/" className="mt-4 underline">RETURN</Link>
            </div>
        );
    }

    // Dane klienta (może być null, jeśli nie podał)
    const customerEmail = session.customer_details?.email || "Unknown Entity";

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background text-text-primary text-center">

            {/* Animowane kółko sukcesu - prosty CSS */}
            <div className="w-24 h-24 rounded-full border-2 border-acid flex items-center justify-center mb-8 animate-fade-in">
                <span className="text-acid text-4xl">✓</span>
            </div>

            <h1 className="font-display text-4xl md:text-6xl uppercase mb-2 animate-slide-up">
                Order Confirmed
            </h1>

            <p className="font-mono text-text-secondary mb-8 animate-slide-up [animation-delay:100ms]">
                Welcome to the club.
            </p>

            {/* Tabela z detalami - surowy styl */}
            <div className="w-full max-w-md border border-white/10 bg-surface p-6 mb-12 text-left font-mono text-sm animate-slide-up [animation-delay:200ms]">
                <div className="flex justify-between py-2 border-b border-white/5">
                    <span className="text-text-secondary">ORDER ID</span>
                    <span className="truncate max-w-[150px]">{session.id.slice(-8).toUpperCase()}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-white/5">
                    <span className="text-text-secondary">EMAIL</span>
                    <span>{customerEmail}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-white/5">
                    <span className="text-text-secondary">AMOUNT</span>
                    <span className="text-acid">
            {(session.amount_total! / 100).toFixed(2)} {session.currency?.toUpperCase()}
          </span>
                </div>
                <div className="flex justify-between py-2 pt-4">
                    <span className="text-text-secondary">STATUS</span>
                    <span className="text-acid blink">PAID / PROCESSING</span>
                </div>
            </div>

            <Link
                href="/"
                className="text-sm font-mono tracking-widest hover:text-acid transition-colors animate-slide-up [animation-delay:400ms]"
            >
                ← RETURN TO BASE
            </Link>
        </div>
    );
}