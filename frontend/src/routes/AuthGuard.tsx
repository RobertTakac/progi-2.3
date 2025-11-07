import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'

export default function AuthGuard() {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) return <div className="p-8">Učitavanje…</div>
  if (!isAuthenticated) return <Navigate to="/login" replace />

  return <Outlet />
}
