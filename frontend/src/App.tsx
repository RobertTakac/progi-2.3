// imports na vrhu
import MerchantDashboard from './pages/MerchantDashboard'
import MerchantPublic from './pages/MerchantPublic'
import MerchantGuard from './routes/MerchantGuard'
import { Routes, Route, Link } from 'react-router-dom'
import { useAuth } from './auth/AuthContext'
import Home from './pages/Home'
import AuthCallback from './pages/AuthCallback'
import Login from './pages/Login'
import Register from './pages/Register'
import ClientProfile from './pages/ClientProfile'
import Listings from './pages/Listings'
import NewListing from './pages/NewListing'
import AuthGuard from './routes/AuthGuard'




export default function App() {
  const { user, isAuthenticated, isLoading, signIn, signOut } = useAuth()

  return (
    <div className="min-h-screen flex flex-col">
      {/* NAVBAR */}
      {isAuthenticated && (
        <Link to="/profile" className="hover:text-blue-400 transition-colors">Profil</Link>
      )}


    <header className="bg-slate-900 text-white shadow-md">
  <div className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
    {/* Lijevi blok za simetriju */}
    <div className="w-1/3" />

    {/* Sredina – veliki naslov */}
    <Link
      to="/"
      className="font-extrabold text-5xl tracking-wider text-white uppercase flex-1 text-center drop-shadow-lg"
      style={{ letterSpacing: '2px' }}
    >
      GearShare
    </Link>

    {/* Desno – auth gumbi */}
    <nav className="w-1/3 flex items-center justify-end space-x-4 text-lg">
      {isLoading && <span className="text-sm text-gray-300">Provjera…</span>}

      {!isAuthenticated ? (
        <>
          <button
            onClick={() => signIn()}
            className="px-4 py-2 rounded bg-white/10 hover:bg-white/20 transition text-white font-medium"
          >
            Prijavi se
          </button>
          <Link
            to="/register"
            className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white font-medium transition"
          >
            Registracija
          </Link>
        </>
      ) : (
        <>
          <Link to="/profile" className="hover:text-blue-400 transition-colors">Profil</Link>
          <span className="text-sm text-gray-300">{user?.profile?.name || user?.profile?.email}</span>
          <button
            onClick={signOut}
            className="px-3 py-1.5 rounded border border-white/30 hover:bg-white/10 transition"
          >
            Odjava
          </button>
        </>
      )}
    </nav>
  </div>
</header>

      {/* ROUTES */}
      <main className="flex-1">
        <Routes>
          {/* Privatno: samo za trgovce */}
          <Route element={<MerchantGuard />}>
          <Route path="/merchant" element={<MerchantDashboard />} />
          </Route>

        {/* Javni profil trgovca */}
          <Route path="/m/:merchantId" element={<MerchantPublic />} />

          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<ClientProfile />} />
          <Route path="/listings" element={<Listings />} />
          <Route path="/listings/new" element={<NewListing />} />
          {/* OIDC callback */}
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route element={<AuthGuard />}>
          <Route path="/profile" element={<ClientProfile />} />
          </Route>

        </Routes>
      </main>

      {/* FOOTER */}
      <footer className="border-t mt-12">
        <div className="max-w-6xl mx-auto px-4 py-8 text-sm text-gray-500">
          © {new Date().getFullYear()} GearShare
        </div>
      </footer>
    </div>
  )
}
