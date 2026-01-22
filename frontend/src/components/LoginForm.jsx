import React, { useState } from 'react';
import './AuthForms.css';
import { apiLogin } from '../services/apiService';

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
            const res = await apiLogin(email, password, role);
            onSuccess(res);
        } catch (err) {
            setError(err.message);
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