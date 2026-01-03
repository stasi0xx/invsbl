import { PRODUCTS } from "@/lib/product";
import Link from "next/link";

export default function Home() {
  return (
      <section className="h-screen w-full flex flex-col items-center justify-center p-4">

        {/* Badge / Drop Info */}
        <div className="font-mono text-xs text-acid mb-4 tracking-widest uppercase border border-acid/20 px-3 py-1 rounded-full animate-fade-in">
          Drop 001 — Live Now
        </div>

        {/* Main Title - Brutal & Big */}
        <h1 className="font-display text-5xl md:text-8xl font-black text-center tracking-tighter uppercase leading-[0.85] animate-slide-up">
          Concrete <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-text-primary to-text-secondary">
          Dreams
        </span>
        </h1>

        {/* Description */}
        <p className="mt-8 text-text-secondary max-w-md text-center text-balance font-light animate-slide-up [animation-delay:200ms]">
          Ekskluzywna kolekcja dwóch artefaktów.
          Zaprojektowana w cieniu. Wykuta w kodzie.
        </p>

        {/* CTA Button */}
        <div className="mt-12 animate-slide-up [animation-delay:400ms]">
          <button className="bg-acid text-acid-foreground px-8 py-4 font-bold text-lg hover:scale-105 transition-transform duration-300 rounded-none skew-x-[-10deg]">
            <span className="skew-x-[10deg] block">ENTER SHOP</span>
          </button>
        </div>

          <div className="mt-20 grid gap-4 w-full max-w-md animate-slide-up [animation-delay:600ms]">
              {PRODUCTS.map((product) => (
                  <Link
                      key={product.id}
                      href={`/product/${product.slug}`}
                      className="group flex justify-between items-center border-b border-white/10 py-4 hover:border-acid transition-colors"
                  >
      <span className="font-display font-bold text-xl group-hover:text-acid transition-colors">
        {product.name}
      </span>
                      <span className="font-mono text-sm text-text-secondary">
        →
      </span>
                  </Link>
              ))}
          </div>

      </section>
  );
}