import { useAuth } from '../auth/AuthContext'

export default function Register() {
  const { signIn } = useAuth()

  // lokalna funkcija koja sprema odabranu ulogu prije redirekcije
  const handleRegister = (role: 'client' | 'merchant') => {
    localStorage.setItem('userRole', role)
    signIn() // pokreće OAuth2.0 prijavu
  }

  return (
    <div className="max-w-md mx-auto p-8 text-center">
      <h1 className="text-3xl font-bold mb-6">Registracija</h1>
      <p className="text-gray-600 mb-6">Odaberi ulogu za svoj račun:</p>

      <div className="flex flex-col gap-3">
        <button
          onClick={() => handleRegister('client')}
          className="px-6 py-3 rounded bg-blue-600 hover:bg-blue-700 text-white transition"
        >
          👤 Registriraj se kao klijent
        </button>

        <button
          onClick={() => handleRegister('merchant')}
          className="px-6 py-3 rounded bg-emerald-600 hover:bg-emerald-700 text-white transition"
        >
          🏪 Registriraj se kao trgovac
        </button>
      </div>

      <p className="mt-6 text-sm text-gray-500">
        Već imaš račun?{' '}
        <button onClick={() => signIn()} className="underline hover:text-blue-500 transition">
          Prijavi se
        </button>
      </p>
    </div>
  )
}
