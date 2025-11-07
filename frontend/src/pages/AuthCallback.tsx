//uvoz Reactovog hook useEffect koji omogucava pokretanje kod kad se komponenta ucita
import { useEffect } from 'react'
//uvoz userManager objekta iz OAuth2.0, on upravlja cijelom autentifikacijom
import { userManager } from '../auth/oidc'

//callback stranica na koju nas sustav vraca automatski kad zavrsi korisnik prijavu kod servisa npr. Google
export default function AuthCallback() {
  useEffect(() => {

    //funkcija procita podatke koje je OAuth2.0 poslao i spremi ih u localStorage tako da korisnik bude prijavljen u aplikaciji
    userManager.signinRedirectCallback().then(() => {
      window.location.replace('/profile')   //kad je prijava uspjesna, automatski se preusmjerava korisnik na stranicu profila
    })
  }, [])
  return <div className="p-8">Dovršavam prijavu…</div>  //dotad se korisniku prikazuje ova poruka
}
