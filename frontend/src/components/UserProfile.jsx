import React, { useState } from "react";

const UserProfile = ({ currentUser }) => {
    const [username, setUsername] = useState(currentUser.username);
    const [email] = useState(currentUser.email);

    const [newUsername, setNewUsername] = useState(username);

    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");

    const handleUsernameChange = (e) => {
        e.preventDefault();

        // Ovdje bi išao API poziv
        setUsername(newUsername);
        alert("Username uspješno promijenjen");
    };

    const handlePasswordChange = (e) => {
        e.preventDefault();

        if (!oldPassword || !newPassword) {
            alert("Popuni sva polja");
            return;
        }

        // Ovdje bi išao API poziv koji provjerava staru lozinku
        alert("Password uspješno promijenjen");

        setOldPassword("");
        setNewPassword("");
    };

    return (
        <div>
            <h1>Moj profil</h1>

            <section>
                <h2>Podaci o korisniku</h2>
                <p><strong>Username:</strong> {username}</p>
                <p><strong>Email:</strong> {email}</p>
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

export default UserProfile;
