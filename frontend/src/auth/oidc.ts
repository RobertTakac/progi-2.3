import { UserManager, WebStorageStateStore } from 'oidc-client-ts'

const issuer  = import.meta.env.VITE_OAUTH_ISSUER
const clientId = import.meta.env.VITE_OAUTH_CLIENT_ID
const redirectUri = import.meta.env.VITE_OAUTH_REDIRECT_URI
const scope = import.meta.env.VITE_OAUTH_SCOPE || 'openid email profile'

export const userManager = new UserManager({
  authority: issuer,                // https://accounts.google.com
  client_id: clientId,              // iz Google Credentials
  redirect_uri: redirectUri,        // http://localhost:5173/auth/callback
  response_type: 'code',            // Authorization Code + PKCE
  scope,
  loadUserInfo: true,
  userStore: new WebStorageStateStore({ store: window.localStorage }),
})
