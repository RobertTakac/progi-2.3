import React, { useState, useEffect } from "react";
import { apiRequest } from '../api/apiService';
import "./UserProfile.css";

const ProfilePage = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [newUsername, setNewUsername] = useState("");
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await apiRequest("/users/me", 'GET');
                if (!response.ok) throw new Error("Greška pri dohvaćanju podataka");

                const data = await response.json();
                setUser(data);
                setNewUsername(data.username);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    const handleUsernameChange = async (e) => {
        e.preventDefault();

        try {
            const response = await apiRequest("/change-username", "PUT", { username: newUsername });
            if (!response.ok) throw new Error("Greška pri promjeni usernamea");

            setUser(prev => ({ ...prev, username: newUsername }));
            alert("Username uspješno promijenjen");
        } catch (err) {
            alert(err.message);
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();

        if (!oldPassword || !newPassword) {
            alert("Popuni sva polja");
            return;
        }

        try {
            const response = await apiRequest(
                "/change-password",
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


    if (loading) return <p>Učitavanje...</p>;
    if (error) return <p>Greška: {error}</p>;

    // Provjera je li korisnik merchant
    const isMerchant = user.role === "ROLE_MERCHANT";

    return (
        <div className="user-div">
            <h1>Moj profil</h1>

            <section>
                <h2>Podaci o korisniku</h2>
                <p><strong>Username:</strong> {user.username}</p>
                <p><strong>Email:</strong> {user.email}</p>

                {isMerchant && (
                    <>
                        <p><strong>Business Name:</strong> {user.businessName}</p>
                        <p><strong>Address:</strong> {user.address}</p>
                        <p><strong>City:</strong> {user.city}</p>
                        <p><strong>Postal Code:</strong> {user.postalCode}</p>
                        <p><strong>Country:</strong> {user.country}</p>
                        <p><strong>Description:</strong> {user.description}</p>
                    </>
                )}
            </section>

            <hr />

            <section>
                <h2>Promjena usernamea</h2>
                <form onSubmit={handleUsernameChange}>
                    <input
                        type="text"
                        value={newUsername}
                        onChange={(e) => setNewUsername(e.target.value)}
                        placeholder="Novi username"
                    />
                    <button type="submit">Spremi username</button>
                </form>
            </section>

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
