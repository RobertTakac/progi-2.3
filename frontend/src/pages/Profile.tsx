import { useAuth } from '../auth/AuthContext'

export default function Profile() {
  const { user, isAuthenticated, isLoading, signOut, signIn } = useAuth()

  if (isLoading) {
    return <div className="p-8 text-center">Učitavanje…</div>
  }

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto p-8 text-center">
        <p className="mb-4">Moraš biti prijavljen/a.</p>
        <button
          onClick={() => signIn()}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg"
        >
          🔐 Prijavi se
        </button>
      </div>
    )
  }

  // podaci iz OIDC profila
  const name = (user?.profile as any)?.name as string | undefined
  const email = (user?.profile as any)?.email as string | undefined
  const picture = (user?.profile as any)?.picture as string | undefined

  // uloga koju smo (za sada) spremili lokalno prilikom registracije
  const role = localStorage.getItem('userRole') ?? undefined

  return (
    <div className="max-w-md mx-auto p-8 text-center">
      <h1 className="text-3xl font-bold mb-6">Tvoj profil</h1>

      {picture && (
        <img
          src={picture}
          alt="avatar"
          className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
        />
      )}

      <p className="text-lg">
        <strong>Ime:</strong> {name || '—'}
      </p>
      <p className="text-lg">
        <strong>Email:</strong> {email || '—'}
      </p>

      {role && (
        <p className="mt-2 text-sm text-gray-500">
          <strong>Uloga:</strong> {role === 'merchant' ? 'Trgovac' : 'Klijent'}
        </p>
      )}

      <button
        onClick={() => signOut()}
        className="mt-6 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg"
      >
        🚪 Odjava
      </button>
    </div>
  )
}
