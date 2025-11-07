import { createContext, useContext, useEffect, useState } from 'react'
import { userManager } from './oidc'

type AuthState = {
  isAuthenticated: boolean
  isLoading: boolean
  user: any | null
  signIn: () => void
  signOut: () => void
}

const AuthCtx = createContext<AuthState | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    userManager.getUser().then(u => {
      setUser(u)
      setLoading(false)
    })
  }, [])

  const signIn = () => userManager.signinRedirect()
  const signOut = () => userManager.signoutRedirect({ post_logout_redirect_uri: window.location.origin })

  return (
    <AuthCtx.Provider value={{ isAuthenticated: !!user, isLoading: loading, user, signIn, signOut }}>
      {children}
    </AuthCtx.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthCtx)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
