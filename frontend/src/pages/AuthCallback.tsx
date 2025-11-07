import { useEffect } from 'react'
import { userManager } from '../auth/oidc'

export default function AuthCallback() {
  useEffect(() => {
    userManager.signinRedirectCallback().then(() => {
      window.location.replace('/')
    })
  }, [])
  return <div className="p-8">Dovršavam prijavu…</div>
  window.location.replace('/profile')

}
