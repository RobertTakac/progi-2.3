import { useEffect } from 'react'
import { userManager } from '../auth/oidc'

export default function AuthCallback() {
  useEffect(() => {
    userManager.signinRedirectCallback().then(() => {
      window.location.replace('/profile')
    })
  }, [])
  return <div className="p-8">Dovršavam prijavu…</div>

}
