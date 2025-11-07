import { useAuth } from '../auth/AuthContext'

export default function Login() {
  const { signIn } = useAuth()  //uzimamo funkciju signIn koje pokrece OAuth2.0 prijavu
  return (  //sve iza returna se prikazuje na ekranu
    //centriran sadrzaj
    <div className="max-w-md mx-auto p-8 text-center">  
    {/*naslov stranice*/}
      <h1 className="text-3xl font-bold mb-6">Prijava</h1>
      {/* gumb koji pokrece prijavu*/}
      <button onClick={signIn} className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg">
        Prijavi se putem Googlea
      </button>
    </div>
  )
}
