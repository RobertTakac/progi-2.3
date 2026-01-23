export const API_BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:8080";

export const ENDPOINTS = {
    LOGIN: "/auth/login",
    VERIFY: "/auth/verify",
    CLIENT_SIGNUP: "/auth/client-signup",
    MERCHANT_SIGNUP: '/auth/merchant-signup',
    ALL_LISTINGS: "/listing/all",
    MERCHANT_ALL_LISTINGS: "/merchant/get-all-listings",
    MERCHANT_UPDATE_LISTING: "/merchant/updateListing",
    MERCHANT_CREATE_LISTING: "/merchant/create-listing",
    MERCHANT_DELETE_LISTING: "/merchant/deleteListing",
    ALL_CATEGORIES: "/listing/categories",
    NEW_CATEGORY: "/admin/categories",
    DELETE_CATEGORY: "/admin/categories",
    USER_IMAGES: "/userImages"
};

export const ERROR_MSGS = {
    NETWORK_ERROR: "Couldn't connect to backend",
    GENERIC_ERROR: "Something went wrong. Please try again"
};

export const tokenData = (isValid, token) => ({
    isValid,
    token
});

export const isTokenValid = () => {
    const token = localStorage.getItem("token");
    const tokenExpiration = localStorage.getItem("tokenExpiration");

    if (token && tokenExpiration) {
        const currTime = new Date().getTime();
        const tokenExpirationNum = Number(tokenExpiration);

        if (currTime <= tokenExpirationNum) {
            return tokenData(true, token);
        } else {
            return tokenData(false);
        }
    }

    return tokenData(false);
}