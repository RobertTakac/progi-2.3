import axios from "axios";
import { API_BASE_URL, ENDPOINTS, isTokenValid } from "../utils/constants";

export const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json"
    }
});

const tokenExpired = () => {
    console.error("Token expired. Logging out.");

    localStorage.removeItem("token");
    localStorage.removeItem("tokenExpiration");

    window.location.href = "/?login=true";
};

apiClient.interceptors.request.use(
    (config) => {
        const data = isTokenValid();
        if (data.isValid) {
            config.headers.Authorization = `Bearer ${data.token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            tokenExpired();
        }

        return Promise.reject(error);
    }
);

/*
 *  API Calls
 */

// Login/register
export const apiLogin = async (email, password, role) => {
    try {
        const res = await apiClient.post(ENDPOINTS.LOGIN, {
            email, password, role
        });

        if (res.data.token && res.data.expiresIn) {
            localStorage.setItem("token", res.data.token);

            const expirationDate = new Date().getTime() + res.data.expiresIn;
            localStorage.setItem("tokenExpiration", expirationDate);
        } else {
            console.error("Backend indicated success - but token+expirationTime received?!");
            throw new Error("Login success but no token/exptime received");
        }

        console.log("Login success: ", res.data);
        return res.data;
    } catch (err) {
        console.error("Login error: ", err.response?.data || err.message);
        throw err;
    }
}

export const getAllListings = async() => {
    try {
        const res = await apiClient.get(ENDPOINTS.ALL_LISTINGS);
        return res.data;
    } catch (err) {
        console.error("Fetching listings error: ", err.response?.data || err.message);
        throw err;
    }
}

export const getMerchantAllListings = async() => {
    try {
        const res = await apiClient.get(ENDPOINTS.MERCHANT_ALL_LISTINGS);
        return res.data;
    } catch (err) {
        console.error("Fetching merchant listings error: ", err.response?.data || err.message);
        throw err;
    }
}

export const newListing = async(listing) => {
    try {
        const res = await apiClient.post(ENDPOINTS.LISTING, listing);
        return res.data;
    } catch(err) {
        console.error("Create new listing error: ", err.response?.data || err.message);
        throw err;
    }
}

export const verify = async(verifData) => {
    try {
        const res = await apiClient.post(ENDPOINTS.VERIFY, verifData);
        return res.data;
    } catch(err) {
        console.error("Verification error: ", err.response?.data || err.message);
        throw err;
    }
}

export const clientSignup = async(data) => {
    try {
        const res = await apiClient.post(ENDPOINTS.CLIENT_SIGNUP, data);
        return res.data;
    } catch(err) {
        console.error("Client signup error: ", err.response?.data || err.message);
        throw err;
    }
}

export const merchantSignup = async(data) => {
    try {
        const res = await apiClient.post(ENDPOINTS.MERCHANT_SIGNUP, data);
        return res.data;
    } catch(err) {
        console.error("Merchant signup error: ", err.response?.data || err.message);
        throw err;
    }
}

export const merchantUpdateListing = async(adData, prodImg) => {
    try {
        const formData = new FormData();

        if (prodImg) {
            formData.append('prodImg', prodImg);
        }

        const jsonBlob = new Blob([ JSON.stringify(adData) ], { type: "application/json" });
        formData.append("dto", jsonBlob);

        const res = await apiClient.post(ENDPOINTS.MERCHANT_UPDATE_LISTING, formData, {
            headers: {
                "Content-Type": undefined
            }
        });
        return res.data;
    } catch(err) {
        console.error("Merchant update listing error: ", err.response?.data || err.message);
        throw err;
    }
}

export const merchantCreateListing = async(adData, prodImg) => {
    try {
        const formData = new FormData();

        if (prodImg) {
            formData.append('prodImg', prodImg);
        } else {
            throw new Error("Image must be set!");
        }

        const jsonBlob = new Blob([ JSON.stringify(adData) ], { type: "application/json" });
        formData.append("dto", jsonBlob);

        const res = await apiClient.post(ENDPOINTS.MERCHANT_CREATE_LISTING, formData, {
            headers: {
                "Content-Type": undefined
            }
        });
        return res.data;
    } catch(err) {
        console.error("Merchant create listing error: ", err.response?.data || err.message);
        throw err;
    }
}

export const merchantDeleteListing = async(listing) => {
    try {
        await apiClient.delete(`${ENDPOINTS.MERCHANT_DELETE_LISTING}/${listing}`);
    } catch(err) {
        console.error("Merchant delete listing error: ", err.response?.data || err.message);
        throw err;
    }
}

export const getAllCategories = async () => {
    try {
        const res = await apiClient.get(ENDPOINTS.ALL_CATEGORIES);
        return res.data;
    } catch(err) {
        console.error("Get all categories error: ", err.response?.data || err.message);
        throw err;
    }
}

export const newCategory = async (data) => {
    try {
        const res = await apiClient.post(ENDPOINTS.NEW_CATEGORY, data);
        return res.data;
    } catch(err) {
        console.error("Create new category error: ", err.response?.data || err.message);
        throw err;
    }
}

export const deleteCategory = async (delId) => {
    try {
        await apiClient.delete(`${ENDPOINTS.NEW_CATEGORY}/${delId}`);
    } catch(err) {
        console.error("Delete category error: ", err.response?.data || err.message);
        throw err;
    }
}