import logo from "./logo.svg";

export const assets = {
    logo
}

export const DUMMY_USER_STATE = {
    // Slučaj 1: NITI JEDAN KORISNIK NIJE PRIJAVLJEN (Current: NULL)
    // currentlyLoggedIn: null, 

    // Slučaj 2: KORISNIK JE PRIJAVLJEN (Current: USER)
    // currentlyLoggedIn: { type: 'user', username: 'Korisnik123' }, 

    // Slučaj 3: TRGOVAC JE PRIJAVLJEN (Current: MERCHANT)
    currentlyLoggedIn: { type: 'merchant', username: 'TrgovacOpremom' }, 
};