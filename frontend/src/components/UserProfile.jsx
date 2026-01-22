import React, { useState, useEffect } from "react";

const ProfilePage = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Stanja za izmjenu
    const [newUsername, setNewUsername] = useState("");
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetch("/backend/ruta"); // tvoja backend ruta
                if (!response.ok) {
                    throw new Error("Greška pri dohvaćanju podataka");
                }
                const data = await response.json(); // očekuje JSON s username i email
                setUser(data);
                setNewUsername(data.username); // inicijalno stanje za username
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    // Promjena usernamea
    const handleUsernameChange = async (e) => {
        e.preventDefault();

        // Ovdje ide API poziv za promjenu usernamea
        // fetch("/backend/change-username", { method: "POST", body: JSON.stringify({ newUsername }) })

        setUser((prev) => ({ ...prev, username: newUsername }));
        alert("Username uspješno promijenjen");
    };

    // Promjena passworda
    const handlePasswordChange = async (e) => {
        e.preventDefault();

        if (!oldPassword || !newPassword) {
            alert("Popuni sva polja");
            return;
        }

        // Ovdje ide API poziv za promjenu lozinke
        // fetch("/backend/change-password", { method: "POST", body: JSON.stringify({ oldPassword, newPassword }) })

        alert("Password uspješno promijenjen");
        setOldPassword("");
        setNewPassword("");
    };

    if (loading) return <p>Učitavanje...</p>;
    if (error) return <p>Greška: {error}</p>;

    return (
        <div>
            <h1>Moj profil</h1>

            <section>
                <h2>Podaci o korisniku</h2>
                <p><strong>Username:</strong> {user.username}</p>
                <p><strong>Email:</strong> {user.email}</p>
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
