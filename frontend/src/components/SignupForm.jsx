import React, { useState } from 'react';
import './AuthForms.css';
const BASE_URL = import.meta.env.VITE_BASE_URL;
import { clientSignup, merchantSignup } from "../services/apiService";

const SignupForm = ({ role, onSwitch, onSuccess }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [username, setUsername] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);


    const [businessName, setBusinessName] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [country, setCountry] = useState('Hrvatska'); 
    const [description, setDescription] = useState('');

    const isMerchant = role === 'merchant';

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError('Lozinke se ne podudaraju');
            return;
        }

        if (isMerchant) {
            if (!businessName.trim() || !address.trim() || !city.trim()) {
                setError('Molimo unesite naziv tvrtke, adresu i grad');
                return;
            }
        }

        setError('');
        setLoading(true);

        try {
            let payload = {
                email,
                username,
                password,
            };

            if (isMerchant) {
                payload = {
                    ...payload,
                    businessName,
                    address,
                    city,
                    postalCode,
                    country,
                    description,
                };

                const res = await merchantSignup(payload);
            } else {
                const res = await clientSignup(payload);
            }

            onSuccess(email);

        } catch (err) {
            console.error('Greška pri registraciji:', err);
            setError(err.message || 'Nešto je pošlo po zlu');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <h2>Registracija ({role === 'user' ? 'Korisnik' : 'Trgovac'})</h2>

            <button
                disabled={loading}
                onClick={() => {
                    window.location.href = `${BASE_URL}/oauth2/authorization/google?prompt=select_account`;
                }}
            >
                Registracija / Prijava putem Google-a
            </button>

            <div className="form-separator">
                <span>ILI</span>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="signup-email">Email</label>
                    <input
                        type="email"
                        id="signup-email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={loading}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="signup-username">Korisničko ime</label>
                    <input
                        type="text"
                        id="signup-username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        disabled={loading}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="signup-password">Lozinka</label>
                    <input
                        type="password"
                        id="signup-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={loading}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="signup-confirm-password">Potvrdi lozinku</label>
                    <input
                        type="password"
                        id="signup-confirm-password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        disabled={loading}
                    />
                </div>


                {isMerchant && (
                    <>
                        <div className="form-group">
                            <label htmlFor="businessName">Naziv tvrtke / obrta *</label>
                            <input
                                type="text"
                                id="businessName"
                                value={businessName}
                                onChange={(e) => setBusinessName(e.target.value)}
                                required
                                disabled={loading}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="address">Adresa *</label>
                            <input
                                type="text"
                                id="address"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                required
                                disabled={loading}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="city">Grad *</label>
                            <input
                                type="text"
                                id="city"
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                                required
                                disabled={loading}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="postalCode">Poštanski broj</label>
                            <input
                                type="text"
                                id="postalCode"
                                value={postalCode}
                                onChange={(e) => setPostalCode(e.target.value)}
                                disabled={loading}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="country">Država</label>
                            <input
                                type="text"
                                id="country"
                                value={country}
                                onChange={(e) => setCountry(e.target.value)}
                                disabled={loading}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="description">Kratki opis (npr. što nudite)</label>
                            <textarea
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={3}
                                disabled={loading}
                            />
                        </div>
                    </>
                )}

                {error && <p className="error-message">{error}</p>}

                <button type="submit" className="button-primary" disabled={loading}>
                    {loading ? 'Slanje...' : 'Registriraj se'}
                </button>
            </form>

            <div className="form-switch">
                <p>
                    Već imate račun? <span onClick={onSwitch}>Prijavite se</span>
                </p>
            </div>
        </div>
    );
};

export default SignupForm;