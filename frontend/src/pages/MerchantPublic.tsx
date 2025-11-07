import { useMemo } from 'react'
import { useParams } from 'react-router-dom'

type Merchant = { id: string; name: string; address: string; phone: string; email: string; rating: number }
type Listing = {
  id: string; merchantId: string; title: string; description: string; category: string;
  availableFrom: string; availableTo: string; pricePerDay: number; deposit?: number;
  pickupLocation: string; returnLocation: string; imageDataUrl: string; createdAt: string;
}

const LS_MERCHANTS = 'gs_merchants'
const LS_LISTINGS  = 'gs_listings'

export default function MerchantPublic() {
  const { merchantId } = useParams()

  const { merchant, listings } = useMemo(() => {
    const merchants: Merchant[] = JSON.parse(localStorage.getItem(LS_MERCHANTS) || '[]')
    const m = merchants.find(x => x.id === merchantId) || null
    const all: Listing[] = JSON.parse(localStorage.getItem(LS_LISTINGS) || '[]')
    const ls = all.filter(x => x.merchantId === merchantId)
    return { merchant: m, listings: ls }
  }, [merchantId])

  if (!merchant) {
    return <div className="max-w-4xl mx-auto p-8">Trgovac nije pronađen.</div>
  }

  return (
    <div className="max-w-6xl mx-auto p-8 space-y-8">
      <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">{merchant.name}</h1>
          <p className="text-slate-600">{merchant.address}</p>
          <p className="text-slate-600">{merchant.phone} · {merchant.email}</p>
        </div>
        <div className="text-yellow-500 text-xl">
          {'★'.repeat(merchant.rating)}{'☆'.repeat(5 - merchant.rating)}
        </div>
      </header>

      <section>
        <h2 className="text-xl font-semibold mb-4">Katalog</h2>
        {listings.length === 0 ? (
          <p className="text-gray-600">Trenutno nema dostupnih oglasa.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((l) => (
              <article key={l.id} className="border rounded-xl overflow-hidden bg-white shadow-sm">
                <img src={l.imageDataUrl} alt={l.title} className="h-44 w-full object-cover" />
                <div className="p-4 space-y-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">{l.title}</h3>
                    <span className="text-xs px-2 py-0.5 rounded bg-slate-100">{l.category}</span>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2">{l.description}</p>
                  <p className="text-sm"><strong>Razdoblje:</strong> {l.availableFrom} – {l.availableTo}</p>
                  <div className="flex items-center justify-between pt-2">
                    <span className="font-bold">{l.pricePerDay.toFixed(2)} € / dan</span>
                    {l.deposit && l.deposit > 0 && (
                      <span className="text-sm text-gray-500">Kaucija: {l.deposit.toFixed(2)} €</span>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
