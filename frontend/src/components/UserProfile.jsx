import React, { useState, useEffect } from "react";
import { apiRequest } from "../api/apiService";
import "./UserProfile.css";

const ProfilePage = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [newUsername, setNewUsername] = useState("");
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");

    const [merchantData, setMerchantData] = useState({
        businessName: "",
        address: "",
        city: "",
        postalCode: "",
        country: "",
        description: ""
    });

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await apiRequest("/users/me", "GET");
                if (!response.ok) throw new Error("Greška pri dohvaćanju podataka");

                const data = await response.json();
                setUser(data);
                setNewUsername(data.username);

                if (data.role === "ROLE_MERCHANT") {
                    setMerchantData({
                        businessName: data.businessName || "",
                        address: data.address || "",
                        city: data.city || "",
                        postalCode: data.postalCode || "",
                        country: data.country || "",
                        description: data.description || ""
                    });
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);


    const handlePasswordChange = async (e) => {
        e.preventDefault();

        if (!oldPassword || !newPassword) {
            alert("Popuni sva polja");
            return;
        }

        try {
            const response = await apiRequest(
                "/users/change-password",
                "POST",
                {
                    password: oldPassword,
                    newPassword: newPassword
                }
            );

            if (!response.ok) {
                const message = await response.text();
                throw new Error(message || "Greška pri promjeni lozinke");
            }

            alert("Lozinka uspješno promijenjena");
            setOldPassword("");
            setNewPassword("");
        } catch (err) {
            alert(err.message);
        }
    };

    const handleMerchantChange = (e) => {
        const { name, value } = e.target;
        setMerchantData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleMerchantUpdate = async (e) => {
        e.preventDefault();

        try {
            const response = await apiRequest(
                "/merchant/update-info",
                "POST",
                merchantData
            );

            if (!response.ok) {
                throw new Error("Greška pri spremanju podataka");
            }

            alert("Podaci uspješno ažurirani");

            setUser(prev => ({
                ...prev,
                ...merchantData
            }));
        } catch (err) {
            alert(err.message);
        }
    };

    if (loading) return <p>Učitavanje...</p>;
    if (error) return <p>Greška: {error}</p>;

    const isMerchant = user.role === "ROLE_MERCHANT";

    return (
        <div className="user-div">
            <h1>Moj profil</h1>

            <section>
                <h2>Podaci o korisniku</h2>
                <p><strong>Username:</strong> {user.username}</p>
                <p><strong>Email:</strong> {user.email}</p>
            </section>

            {isMerchant && (
                <section>
                    <h2>Podaci o poslovanju</h2>
                    <form onSubmit={handleMerchantUpdate}>
                        <input
                            type="text"
                            name="businessName"
                            placeholder="Business name"
                            value={merchantData.businessName}
                            onChange={handleMerchantChange}
                        />
                        <input
                            type="text"
                            name="address"
                            placeholder="Address"
                            value={merchantData.address}
                            onChange={handleMerchantChange}
                        />
                        <input
                            type="text"
                            name="city"
                            placeholder="City"
                            value={merchantData.city}
                            onChange={handleMerchantChange}
                        />
                        <input
                            type="text"
                            name="postalCode"
                            placeholder="Postal code"
                            value={merchantData.postalCode}
                            onChange={handleMerchantChange}
                        />
                        <input
                            type="text"
                            name="country"
                            placeholder="Country"
                            value={merchantData.country}
                            onChange={handleMerchantChange}
                        />
                        <textarea
                            name="description"
                            placeholder="Description"
                            value={merchantData.description}
                            onChange={handleMerchantChange}
                        />
                        <button type="submit">Spremi podatke</button>
                    </form>
                </section>
            )}


            <hr />

            <section>
                <h2>Promjena lozinke</h2>
                <form onSubmit={handlePasswordChange}>
                    <input
                        type="password"
                        placeholder="Stara lozinka"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Nova lozinka"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <button type="submit">Promijeni lozinku</button>
                </form>
            </section>
        </div>
    );
};

export default ProfilePage;
