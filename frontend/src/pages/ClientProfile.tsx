//uvoz potrebnih funkcija i biblioteka
import { useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod' //provjera unosa
import { zodResolver } from '@hookform/resolvers/zod'
import { useAuth } from '../auth/AuthContext' //dohvacanje podataka o trenutno logiranom korisniku 

const Schema = z.object({  //pravila validacije forme
  fullName: z.string().min(2, 'Unesi ime i prezime'), //barem 2 znaka
  location: z.string().min(2, 'Unesi lokaciju (grad, država)'), //lokacija je obavezna
  email: z.string().email('Unesi ispravan e-mail'), //email mora bit valjan
})
type FormValues = z.infer<typeof Schema>

/** funkcija generira da svaki korisnik ima jedinstveni ključ  */
const profileKey = (id: string) => `gs_client_profile_${id}`

export default function ClientProfile() {
  //dohvatimo korisnika koji je prijavljen
  const { user } = useAuth()
  const userId = useMemo( //odredujemo ID korisniku 
    () => (user?.profile as any)?.email || (user?.profile as any)?.sub || 'me',
    [user]
  )
  //podaci iz prijave, ime i email
  const name = (user?.profile as any)?.name as string | undefined
  const email = (user?.profile as any)?.email as string | undefined

  const {
    register, handleSubmit, reset,
    formState: { errors, isSubmitting }
  } = useForm<FormValues>({
    resolver: zodResolver(Schema),
    defaultValues: { fullName: '', location: '', email: '' },
  })

  //kad se stranica ucita, pokusavamo ucitati spremljene podatke
  // učitaj iz localStorage ili iz OIDC profila
  //ako ne postoje, popunimo ih podacima iz prijave
  useEffect(() => {
    const raw = localStorage.getItem(profileKey(userId))  //citamo spremljeni profil
    if (raw) {
      try {
        reset(JSON.parse(raw) as FormValues)
        return
      } catch {}
    }
      // ako nema spremljenih podataka, popunimo s imenom i emailom iz prijave
    reset({ fullName: name ?? '', location: '', email: email ?? '' })
  }, [userId, name, email, reset])
  // Kad se forma posalje spremimo podatke u localStorage
  const onSubmit = async (values: FormValues) => {
    localStorage.setItem(profileKey(userId), JSON.stringify(values))
    alert('Profil spremljen ✅')
  }

  return (
    <div className="max-w-xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Profil klijenta</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium mb-1">Ime i prezime</label>
          <input
            id="fullName" {...register('fullName')}
            className="w-full border rounded-lg px-3 py-2"
            placeholder="npr. Ana Horvat"
          />
          {errors.fullName && <p className="text-sm text-red-600 mt-1">{errors.fullName.message}</p>}
        </div>

        <div>
          <label htmlFor="location" className="block text-sm font-medium mb-1">Lokacija</label>
          <input
            id="location" {...register('location')}
            className="w-full border rounded-lg px-3 py-2"
            placeholder="npr. Zagreb, Hrvatska"
          />
          {errors.location && <p className="text-sm text-red-600 mt-1">{errors.location.message}</p>}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1">Kontakt e-mail</label>
          <input
            id="email" type="email" {...register('email')}
            className="w-full border rounded-lg px-3 py-2"
            placeholder="npr. ana@example.com"
          />
          {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>}
        </div>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 rounded bg-slate-900 text-white disabled:opacity-60"
          >
            {isSubmitting ? 'Spremam…' : 'Spremi profil'}
          </button>
          <button
            type="button"
            onClick={() => reset({ fullName: name ?? '', location: '', email: email ?? '' })}
            className="px-4 py-2 rounded border"
          >
            Vrati na početne vrijednosti
          </button>
        </div>
      </form>

      <p className="text-xs text-gray-500 mt-6">
        Ove podatke trgovci vide kad rezerviraš opremu (ime, lokacija i e-mail za kontakt).
      </p>
    </div>
  )
}
