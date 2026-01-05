import Image from "next/image";
import Link from "next/link";
import { ArrowDown } from "lucide-react";

export function Hero() {
    return (
        <section className="relative h-[100dvh] w-full overflow-hidden bg-[#09090b]">

            {/* 1. OBRAZ TŁA */}
            <div className="absolute inset-0 w-full h-full">
                <Image
                    src="/hero-bg.webp"
                    alt="INVSBL Streetwear Collection"
                    fill
                    priority
                    className="object-cover object-center opacity-90"
                    quality={95}
                />
            </div>

            {/* 2. OVERLAY (Gradient) */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-[#09090b]/40 to-transparent z-10" />

            {/* Opcjonalnie: Delikatny noise/ziarno dla klimatu industrialnego */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-10 mix-blend-overlay"
                 style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }}>
            </div>

            {/* 3. TREŚĆ NA ŚRODKU */}
            {/* ZMIANA TUTAJ: Zmieniono pb-32 na pb-48. Tekst idzie w górę. */}
            <div className="relative z-20 h-full flex flex-col items-center justify-end pb-25 md:justify-center md:pb-0 px-4 text-center">

                {/* Badge / Tagline */}
                <span className="inline-block py-1 px-3 border border-white/20 rounded-full bg-black/30 backdrop-blur-md text-[10px] font-mono text-white tracking-widest mb-6 animate-fade-in-up">
          INVSBL S26
        </span>

                {/* Główny Nagłówek */}
                <h1 className="font-display text-4xl md:text-8xl font-black text-white tracking-tighter uppercase mb-6 drop-shadow-2xl animate-fade-in-up delay-100">
                    nowy drop <br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-500">
            już dostępny
          </span>
                </h1>

                {/* Opis */}
                <p className="text-zinc-300 max-w-md mx-auto text-sm md:text-base mb-10 leading-relaxed font-light animate-fade-in-up delay-200">
                    Tworzymy ubrania dla tych, którzy nie chcą zniknąć w tłumie.
                </p>

                {/* Przyciski */}
                <div className="flex flex-col md:flex-row gap-4 animate-fade-in-up delay-300 w-full md:w-auto px-8 md:px-0">
                    <Link
                        href="/#products"
                        className="bg-white text-[#1a2e05] font-display font-bold py-4 px-8 rounded hover:bg-[#bef264] transition-all uppercase tracking-wider text-center"
                    >
                        Zobacz Drop
                    </Link>
                    <Link
                        href="/about"
                        className="border border-white/20 bg-black/30 backdrop-blur-sm text-white font-display font-bold py-4 px-8 rounded hover:bg-white/10 transition-all uppercase tracking-wider text-center"
                    >
                        Nasza Misja
                    </Link>
                </div>

            </div>

            {/* Scroll Indicator (Opcjonalnie) */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 animate-bounce text-white/50 hidden md:block">
                <ArrowDown className="w-6 h-6" />
            </div>

        </section>
    );
}