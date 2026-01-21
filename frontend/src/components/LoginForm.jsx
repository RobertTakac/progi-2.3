import React, { useState } from 'react';
import './AuthForms.css';
import { apiRequest } from '../api/apiService';

const LoginForm = ({ role, onSwitch, onSuccess }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await apiRequest('/auth/login', 'POST', {
                email,
                password,

            });

            if (!res || !res.ok) {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(errorData.message || `Greška: ${res.status}`);
            }

            const data = await res.json();

            if (data.token) {
                localStorage.setItem('token', data.token);

            }

            onSuccess(data);

        } catch (err) {
            console.error('Greška pri prijavi:', err);
            setError(err.message || 'Prijava nije uspjela. Provjerite podatke.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <h2>Prijava ({role === 'user' ? 'Korisnik' : 'Trgovac'})</h2>

            <button
                className="google-btn"
                disabled={loading}
                onClick={() => {
                    window.location.href = `${import.meta.env.VITE_BASE_URL}/oauth2/authorization/google?prompt=select_account`;
                }}
            >
                Prijava putem Google-a
            </button>

            <div className="form-separator">
                <span>ILI</span>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="login-email">Email</label>
                    <input
                        type="email"
                        id="login-email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={loading}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="login-password">Lozinka</label>
                    <input
                        type="password"
                        id="login-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={loading}
                    />
                </div>

                {error && <p className="error-message">{error}</p>}

                <button
                    type="submit"
                    className="button-primary"
                    disabled={loading}
                >
                    {loading ? 'Prijava u tijeku...' : 'Prijavi se'}
                </button>
            </form>

            <div className="form-switch">
                <p>
                    Nemate račun? <span onClick={onSwitch}>Registrirajte se</span>
                </p>
            </div>
        </div>
    );
};

export default LoginForm;