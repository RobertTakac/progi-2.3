import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '../auth/AuthContext'

/** Model podataka za profil trgovca */
type Merchant = {
  id: string
  name: string
  address: string
  phone: string
  email: string
  rating: number // 1–5
}

/*podaci za oglas*/
type Listing = {
  id: string
  merchantId: string
  title: string
  description: string
  category: string
  availableFrom: string
  availableTo: string
  pricePerDay: number
  deposit?: number
  pickupLocation: string
  returnLocation: string
  imageDataUrl: string
  createdAt: string
}

const LS_MERCHANTS = 'gs_merchants'
const LS_LISTINGS  = 'gs_listings'

function loadMerchants(): Merchant[] {
  const raw = localStorage.getItem(LS_MERCHANTS)
  return raw ? JSON.parse(raw) : []
}
function saveMerchants(data: Merchant[]) {
  localStorage.setItem(LS_MERCHANTS, JSON.stringify(data))
}
function loadListings(): Listing[] {
  const raw = localStorage.getItem(LS_LISTINGS)
  return raw ? JSON.parse(raw) : []
}
function saveListings(data: Listing[]) {
  localStorage.setItem(LS_LISTINGS, JSON.stringify(data))
}

export default function MerchantDashboard() {
  const { user } = useAuth()
  /*jedinstveni ID trgovca*/
  const merchantId = useMemo(() => {
    // bez backenda koristimo email kao stabilan ID
    return (user?.profile as any)?.email || 'demo-merchant'
  }, [user])

  const [merchant, setMerchant] = useState<Merchant | null>(null)
  const [myListings, setMyListings] = useState<Listing[]>([])
  const [preview, setPreview] = useState<string>('')

  // forme
  const [mForm, setMForm] = useState({
    name: (user?.profile as any)?.name || 'Moj dućan sporta',
    address: '',
    phone: '',
    email: (user?.profile as any)?.email || '',
    rating: 5,
  })
  const [lForm, setLForm] = useState({
    title: '',
    description: '',
    category: 'Skije',
    availableFrom: '',
    availableTo: '',
    pricePerDay: '',
    deposit: '',
    pickupLocation: '',
    returnLocation: '',
    imageDataUrl: '',
  })

  // učitaj postojeće podatke
  useEffect(() => {
    const merchants = loadMerchants()
    let me = merchants.find(m => m.id === merchantId) || null
    if (!me) {
      me = {
        id: merchantId,
        name: mForm.name,
        address: '',
        phone: '',
        email: mForm.email,
        rating: 5,
      }
      merchants.push(me)
      saveMerchants(merchants)
    }
    setMerchant(me)
    setMForm({
      name: me.name,
      address: me.address,
      phone: me.phone,
      email: me.email,
      rating: me.rating,
    })

    const all = loadListings()
    setMyListings(all.filter(l => l.merchantId === merchantId))
  }, [merchantId])
//spremi izmjene profila trgovca u localStorageu
  const handleMerchantSave = () => {
    if (!merchant) return
    const merchants = loadMerchants()
    const idx = merchants.findIndex(m => m.id === merchant.id)
    merchants[idx] = { ...merchant, ...mForm }
    saveMerchants(merchants)
    setMerchant(merchants[idx])
    alert('Profil trgovca spremljen ✅')
  }
//ucitavanje slike u oglas
  const onImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const dataUrl = reader.result as string
      setPreview(dataUrl)
      setLForm(prev => ({ ...prev, imageDataUrl: dataUrl }))
    }
    reader.readAsDataURL(file)
  }

  const handleListingCreate = () => {
    const price = Number(lForm.pricePerDay || 0)
    //provjera obaveznih polja
    if (!lForm.title || !lForm.description || !lForm.availableFrom || !lForm.availableTo || !price || !lForm.pickupLocation || !lForm.returnLocation || !lForm.imageDataUrl) {
      alert('Ispuni sva obavezna polja i dodaj sliku.')
      return
    }

    const deposit = lForm.deposit ? Number(lForm.deposit) : 0
    const newListing: Listing = {
      id: crypto.randomUUID(),
      merchantId,
      title: lForm.title,
      description: lForm.description,
      category: lForm.category,
      availableFrom: lForm.availableFrom,
      availableTo: lForm.availableTo,
      pricePerDay: price,
      deposit,
      pickupLocation: lForm.pickupLocation,
      returnLocation: lForm.returnLocation,
      imageDataUrl: lForm.imageDataUrl,
      createdAt: new Date().toISOString(),
    }

    const all = loadListings()
    all.unshift(newListing)
    saveListings(all)
    setMyListings(all.filter(l => l.merchantId === merchantId))

    // reset forme
    setLForm({
      title: '',
      description: '',
      category: 'Skije',
      availableFrom: '',
      availableTo: '',
      pricePerDay: '',
      deposit: '',
      pickupLocation: '',
      returnLocation: '',
      imageDataUrl: '',
    })
    setPreview('')
    alert('Oglas objavljen ✅')
  }

  const handleDelete = (id: string) => {
    const all = loadListings().filter(l => l.id !== id)
    saveListings(all)
    setMyListings(all.filter(l => l.merchantId === merchantId))
  }

  return (
    <div className="max-w-6xl mx-auto p-8 space-y-10">
      <h1 className="text-3xl font-bold">Trgovački dashboard</h1>

      {/* PROFIL TRGOVCA */}
      <section className="grid md:grid-cols-2 gap-6">
        <div className="border rounded-xl p-5 bg-white">
          <h2 className="text-xl font-semibold mb-4">Osnovne informacije</h2>

          <div className="space-y-3">
            <div>
              <label className="block text-sm mb-1">Naziv trgovca</label>
              <input className="w-full border rounded px-3 py-2" value={mForm.name}
                onChange={e => setMForm(s => ({ ...s, name: e.target.value }))} />
            </div>
            <div>
              <label className="block text-sm mb-1">Adresa</label>
              <input className="w-full border rounded px-3 py-2" value={mForm.address}
                onChange={e => setMForm(s => ({ ...s, address: e.target.value }))} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm mb-1">Telefon</label>
                <input className="w-full border rounded px-3 py-2" value={mForm.phone}
                  onChange={e => setMForm(s => ({ ...s, phone: e.target.value }))} />
              </div>
              <div>
                <label className="block text-sm mb-1">E-mail</label>
                <input className="w-full border rounded px-3 py-2" value={mForm.email}
                  onChange={e => setMForm(s => ({ ...s, email: e.target.value }))} />
              </div>
            </div>
            <div>
              <label className="block text-sm mb-1">Ocjena (1–5)</label>
              <input type="number" min={1} max={5} className="w-full border rounded px-3 py-2" value={mForm.rating}
                onChange={e => setMForm(s => ({ ...s, rating: Number(e.target.value) }))} />
            </div>
            <button onClick={handleMerchantSave} className="mt-2 px-4 py-2 rounded bg-slate-900 text-white">
              Spremi profil
            </button>
          </div>
        </div>

        <div className="border rounded-xl p-5 bg-white">
          <h2 className="text-xl font-semibold mb-4">Objavi novi oglas</h2>
          <div className="grid md:grid-cols-2 gap-3">
            <div className="md:col-span-2">
              <label className="block text-sm mb-1">Naziv opreme</label>
              <input className="w-full border rounded px-3 py-2"
                value={lForm.title} onChange={e => setLForm(s => ({ ...s, title: e.target.value }))} />
            </div>
            <div>
              <label className="block text-sm mb-1">Vrsta</label>
              <select className="w-full border rounded px-3 py-2"
                value={lForm.category} onChange={e => setLForm(s => ({ ...s, category: e.target.value }))}>
                <option>Skije</option><option>Snowboard</option><option>Bicikl</option><option>Kajak</option><option>Drugo</option>
              </select>
            </div>
            <div>
              <label className="block text-sm mb-1">Cijena €/dan</label>
              <input type="number" className="w-full border rounded px-3 py-2"
                value={lForm.pricePerDay} onChange={e => setLForm(s => ({ ...s, pricePerDay: e.target.value }))} />
            </div>
            <div>
              <label className="block text-sm mb-1">Kaucija (opcija)</label>
              <input type="number" className="w-full border rounded px-3 py-2"
                value={lForm.deposit} onChange={e => setLForm(s => ({ ...s, deposit: e.target.value }))} />
            </div>
            <div>
              <label className="block text-sm mb-1">Dostupno od</label>
              <input type="date" className="w-full border rounded px-3 py-2"
                value={lForm.availableFrom} onChange={e => setLForm(s => ({ ...s, availableFrom: e.target.value }))} />
            </div>
            <div>
              <label className="block text-sm mb-1">Dostupno do</label>
              <input type="date" className="w-full border rounded px-3 py-2"
                value={lForm.availableTo} onChange={e => setLForm(s => ({ ...s, availableTo: e.target.value }))} />
            </div>
            <div>
              <label className="block text-sm mb-1">Lokacija preuzimanja</label>
              <input className="w-full border rounded px-3 py-2"
                value={lForm.pickupLocation} onChange={e => setLForm(s => ({ ...s, pickupLocation: e.target.value }))} />
            </div>
            <div>
              <label className="block text-sm mb-1">Lokacija povrata</label>
              <input className="w-full border rounded px-3 py-2"
                value={lForm.returnLocation} onChange={e => setLForm(s => ({ ...s, returnLocation: e.target.value }))} />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm mb-1">Slika opreme</label>
              <input type="file" accept="image/*" onChange={onImageChange} />
              {preview && <img src={preview} alt="preview" className="mt-2 w-full max-w-sm rounded-xl border" />}
            </div>
            {/*Kreiraj oglas*/}
            <div className="md:col-span-2">
              <button onClick={handleListingCreate} className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white">
                Objavi oglas
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* MOJI OGLASI */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Moji oglasi</h2>
          {/*link otvara javnu stranicu trgovca tj katalog u novom tabu*/}
          {merchant && (
            <a
              href={`/m/${encodeURIComponent(merchant.id)}`}
              className="text-blue-600 hover:underline"
              target="_blank"
            >
              Otvori javni profil →
            </a>
          )}
        </div>
        {/*ako nema oglasa, prikazi poruku*/}
        {myListings.length === 0 ? (
          <p className="text-gray-600">Još nemaš objavljenih oglasa.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {myListings.map(l => (
              <article key={l.id} className="border rounded-xl overflow-hidden bg-white shadow-sm">
                <img src={l.imageDataUrl} alt={l.title} className="h-44 w-full object-cover" />
                <div className="p-4 space-y-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">{l.title}</h3>
                    <span className="text-xs px-2 py-0.5 rounded bg-slate-100">{l.category}</span>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2">{l.description}</p>
                  <p className="text-sm"><strong>Razdoblje:</strong> {l.availableFrom} – {l.availableTo}</p>
                  <p className="text-sm"><strong>Preuzimanje:</strong> {l.pickupLocation}</p>
                  <p className="text-sm"><strong>Povrat:</strong> {l.returnLocation}</p>
                  <div className="flex items-center justify-between pt-2">
                    <span className="font-bold">{l.pricePerDay.toFixed(2)} € / dan</span>
                    {l.deposit && l.deposit > 0 && (
                      <span className="text-sm text-gray-500">Kaucija: {l.deposit.toFixed(2)} €</span>
                    )}
                  </div>
                  {/*brisanje oglasa*/}
                  <button onClick={() => handleDelete(l.id)} className="mt-2 text-sm text-red-600 hover:underline">
                    Obriši
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
