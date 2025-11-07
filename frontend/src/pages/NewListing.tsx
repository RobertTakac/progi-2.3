import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'

const ListingSchema = z.object({
  title: z.string().min(2, 'Unesi naziv opreme'),
  category: z.string().min(2, 'Odaberi vrstu opreme'),
  description: z.string().min(10, 'Opis treba imati barem 10 znakova'),
  availableFrom: z.string().min(1, 'Odaberite datum'),
  availableTo: z.string().min(1, 'Odaberite datum'),
  pricePerDay: z.coerce.number().positive('Cijena mora biti veća od 0'),
  deposit: z.union([z.coerce.number().nonnegative(), z.literal('')]).optional(),
  pickupLocation: z.string().min(2, 'Unesi lokaciju preuzimanja'),
  returnLocation: z.string().min(2, 'Unesi lokaciju povrata'),
  imageDataUrl: z.string().min(1, 'Dodaj sliku opreme'),
})

type FormValues = z.infer<typeof ListingSchema>

type Listing = {
  id: string
  createdAt: string
} & FormValues

const LS_KEY = 'gs_listings'

export default function NewListing() {
  const navigate = useNavigate()
  const [preview, setPreview] = useState<string>('')

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(ListingSchema),
    defaultValues: {
      category: 'Skije',
      imageDataUrl: '',
    },
  })

  const onImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const dataUrl = reader.result as string
      setPreview(dataUrl)
      setValue('imageDataUrl', dataUrl, { shouldValidate: true })
    }
    reader.readAsDataURL(file)
  }

  const onSubmit = async (values: FormValues) => {
    // normaliziraj kauciju (prazna -> 0)
    const deposit =
      values.deposit === '' || values.deposit === undefined ? 0 : Number(values.deposit)

    const newListing: Listing = {
      ...values,
      deposit,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    }

    const raw = localStorage.getItem(LS_KEY)
    const list: Listing[] = raw ? JSON.parse(raw) : []
    list.unshift(newListing)
    localStorage.setItem(LS_KEY, JSON.stringify(list))

    alert('Oglas objavljen ✅')
    navigate('/listings')
  }

  return (
    <div className="max-w-3xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Objavi novi oglas</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-1">
          <label className="block text-sm font-medium mb-1">Naziv opreme</label>
          <input className="w-full border rounded-lg px-3 py-2"
            placeholder="npr. Skije Atomic Redster"
            {...register('title')} />
          {errors.title && <p className="text-sm text-red-600 mt-1">{errors.title.message}</p>}
        </div>

        <div className="md:col-span-1">
          <label className="block text-sm font-medium mb-1">Vrsta opreme</label>
          <select className="w-full border rounded-lg px-3 py-2" {...register('category')}>
            <option>Skije</option>
            <option>Snowboard</option>
            <option>Bicikl</option>
            <option>Kajak</option>
            <option>Drugo</option>
          </select>
          {errors.category && <p className="text-sm text-red-600 mt-1">{errors.category.message}</p>}
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Opis</label>
          <textarea className="w-full border rounded-lg px-3 py-2 min-h-[120px]"
            placeholder="Stanje, veličina, dodatna oprema…"
            {...register('description')} />
          {errors.description && <p className="text-sm text-red-600 mt-1">{errors.description.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Dostupno od</label>
          <input type="date" className="w-full border rounded-lg px-3 py-2" {...register('availableFrom')} />
          {errors.availableFrom && <p className="text-sm text-red-600 mt-1">{errors.availableFrom.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Dostupno do</label>
          <input type="date" className="w-full border rounded-lg px-3 py-2" {...register('availableTo')} />
          {errors.availableTo && <p className="text-sm text-red-600 mt-1">{errors.availableTo.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Cijena po danu (EUR)</label>
          <input type="number" step="0.01" className="w-full border rounded-lg px-3 py-2"
            placeholder="npr. 25" {...register('pricePerDay')} />
          {errors.pricePerDay && <p className="text-sm text-red-600 mt-1">{errors.pricePerDay.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Kaucija (opcionalno, EUR)</label>
          <input type="number" step="0.01" className="w-full border rounded-lg px-3 py-2"
            placeholder="npr. 100" {...register('deposit')} />
          {errors.deposit && <p className="text-sm text-red-600 mt-1">{errors.deposit.message as string}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Lokacija preuzimanja</label>
          <input className="w-full border rounded-lg px-3 py-2"
            placeholder="npr. Zagreb, Trg…"
            {...register('pickupLocation')} />
          {errors.pickupLocation && <p className="text-sm text-red-600 mt-1">{errors.pickupLocation.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Lokacija povrata</label>
          <input className="w-full border rounded-lg px-3 py-2"
            placeholder="npr. Zagreb, Trg…"
            {...register('returnLocation')} />
          {errors.returnLocation && <p className="text-sm text-red-600 mt-1">{errors.returnLocation.message}</p>}
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Slika opreme</label>
          <input type="file" accept="image/*" onChange={onImageChange} className="block" />
          <input type="hidden" {...register('imageDataUrl')} />
          {errors.imageDataUrl && <p className="text-sm text-red-600 mt-1">{errors.imageDataUrl.message}</p>}

          {preview && (
            <img
              src={preview}
              alt="Preview opreme"
              className="mt-3 w-full max-w-md rounded-xl border shadow"
            />
          )}
        </div>

        <div className="md:col-span-2 flex gap-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-5 py-2.5 rounded bg-slate-900 text-white disabled:opacity-60"
          >
            Objavi oglas
          </button>
          <button
            type="button"
            onClick={() => history.back()}
            className="px-5 py-2.5 rounded border"
          >
            Odustani
          </button>
        </div>
      </form>
    </div>
  )
}
