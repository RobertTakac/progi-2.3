type Listing = {
  id: string
  createdAt: string
  title: string
  category: string
  description: string
  availableFrom: string
  availableTo: string
  pricePerDay: number
  deposit?: number
  pickupLocation: string
  returnLocation: string
  imageDataUrl: string
}

const LS_KEY = 'gs_listings'


export default function Listings() {
  const raw = localStorage.getItem(LS_KEY)
  const listings: Listing[] = raw ? JSON.parse(raw) : []

  return (
    <div className="max-w-6xl mx-auto p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Oglasi</h1>
        <a
          href="/listings/new"
          className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white"
        >
          + Novi oglas
        </a>
      </div>

      {listings.length === 0 ? (
        <p className="text-gray-600">Još nema oglasa. Objavi prvi! 😊</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((l) => (
            <article key={l.id} className="border rounded-xl overflow-hidden bg-white shadow-sm">
              <img src={l.imageDataUrl} alt={l.title} className="h-48 w-full object-cover" />
              <div className="p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">{l.title}</h3>
                  <span className="text-sm px-2 py-0.5 rounded bg-slate-100">{l.category}</span>
                </div>
                <p className="text-sm text-gray-600 line-clamp-2">{l.description}</p>
                <p className="text-sm">
                  <strong>Razdoblje:</strong> {l.availableFrom} – {l.availableTo}
                </p>
                <p className="text-sm">
                  <strong>Preuzimanje:</strong> {l.pickupLocation}
                </p>
                <p className="text-sm">
                  <strong>Povrat:</strong> {l.returnLocation}
                </p>
                <div className="flex items-center justify-between pt-2">
                  <span className="text-base font-bold">{l.pricePerDay.toFixed(2)} € / dan</span>
                  {l.deposit && l.deposit > 0 && (
                    <span className="text-sm text-gray-500">Kaucija: {l.deposit.toFixed(2)} €</span>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
