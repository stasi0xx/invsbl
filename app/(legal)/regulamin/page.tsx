export default function RegulaminPage() {
    return (
        <div className="space-y-6 text-zinc-300 font-light text-sm leading-relaxed">
            <h1 className="text-3xl text-white font-display font-bold uppercase mb-8">Regulamin Sklepu</h1>

            <section>
                <h2 className="text-white font-bold uppercase mb-2">1. Postanowienia ogólne</h2>
                <p>Niniejszy regulamin określa zasady korzystania ze sklepu internetowego INVSBL działającego pod adresem invsblworldwide.com.</p>
                <p>Właścicielem sklepu jest: WeUnite Jan Hofman, NIP: 5842877195, Adres: ul. Gdyńska G lok. 9 80-340 Gdańsk.</p>
            </section>

            <section>
                <h2 className="text-white font-bold uppercase mb-2">2. Produkty i Pre-order</h2>
                <p>Sklep oferuje odzież typu streetwear, często w limitowanych nakładach (tzw. "dropy").</p>
                <p><strong>Zasady Pre-orderu:</strong> Niektóre produkty oznaczone jako "PRE-ORDER" są sprzedawane przed ich fizycznym wyprodukowaniem. Szacowana data wysyłki jest zawsze podana na karcie produktu. Klient zamawiając produkt pre-orderowy godzi się na dłuższy czas oczekiwania w zamian za gwarancję otrzymania produktu.</p>
            </section>

            <section>
                <h2 className="text-white font-bold uppercase mb-2">3. Płatności</h2>
                <p>Obsługujemy płatności poprzez system Stripe, co gwarantuje bezpieczeństwo transakcji. Dostępne metody to: Karty płatnicze (Visa, Mastercard), Apple Pay, Google Pay, Blik.</p>
            </section>
        </div>
    );
}