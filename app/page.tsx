import { PRODUCTS } from "@/lib/product";
import Link from "next/link";
import {Hero} from "@/components/Hero";

export default function Home() {
  return (
      <section className="h-screen w-full flex flex-col items-center justify-center p-4">

        <Hero />

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