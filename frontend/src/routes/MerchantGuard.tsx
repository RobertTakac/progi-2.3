import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'

export default function MerchantGuard() {
  const { isAuthenticated, isLoading } = useAuth()
  const role = localStorage.getItem('userRole') // 'merchant' ili 'client'

  if (isLoading) return <div className="p-6">Učitavanje…</div>
  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (role !== 'merchant') return <Navigate to="/" replace />

  return <Outlet />
}
