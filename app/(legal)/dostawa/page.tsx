export default function DostawaPage() {
    return (
        <div className="space-y-6 text-zinc-300 font-light text-sm leading-relaxed">
            <h1 className="text-3xl text-white font-display font-bold uppercase mb-8">Czas i Koszt Dostawy</h1>

            <h3 className="text-white font-bold mt-4">Metody dostawy</h3>
            <ul className="list-disc pl-5 space-y-2">
                <li><strong>Kurier (InPost/DPD):</strong> 15PLN</li>
                <li><strong>Paczkomaty InPost:</strong> 13PLN</li>
            </ul>

            <h3 className="text-white font-bold mt-4">Czas realizacji</h3>
            <p>Produkty dostępne "od ręki" wysyłamy w ciągu 24-48h w dni robocze.</p>
            <p>Produkty <strong>PRE-ORDER</strong> wysyłane są zgodnie z datą podaną na stronie produktu.</p>

            <h3 className="text-white font-bold mt-4">Wysyłka zagraniczna</h3>
            <p>Obecnie realizujemy wysyłkę tylko na terenie Polski. Stay tuned for worldwide shipping.</p>
        </div>
    );
}