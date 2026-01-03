"use client";

import { useFormStatus } from "react-dom";
import { createCheckoutSession } from "@/app/actions/checkout";

function SubmitButton() {
    const { pending } = useFormStatus();

    return (
        <button
            type="submit"
            disabled={pending}
            className="w-full bg-acid text-acid-foreground font-bold py-5 hover:scale-[1.02] active:scale-95 transition-all duration-300 uppercase tracking-widest text-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
            {pending ? "PROCESSING..." : "SECURE CHECKOUT"}
        </button>
    );
}

export function BuyButton({ slug }: { slug: string }) {
    return (
        <form action={createCheckoutSession}>
            <input type="hidden" name="slug" value={slug} />
            <SubmitButton />
            <p className="text-center text-xs text-text-secondary mt-3 font-mono">
                SECURED BY STRIPE • BLIK / CARD / APPLE PAY
            </p>
        </form>
    );
}