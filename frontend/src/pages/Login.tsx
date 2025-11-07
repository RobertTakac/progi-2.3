import { useAuth } from '../auth/AuthContext'

export default function Login() {
  const { signIn } = useAuth()
  return (
    <div className="max-w-md mx-auto p-8 text-center">
      <h1 className="text-3xl font-bold mb-6">Prijava</h1>
      <button onClick={signIn} className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg">
        Prijavi se putem Googlea
      </button>
    </div>
  )
}
