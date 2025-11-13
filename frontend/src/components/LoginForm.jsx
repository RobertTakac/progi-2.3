import React, { useState } from 'react';
import './AuthForms.css';
const BASE_URL = import.meta.env.VITE_BASE_URL;

const LoginForm = ({ role, onSwitch, onSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role })
      });
      
      if (!res.ok) {
        let errorMsg = 'Prijava nije uspjela. Status: ' + res.status;
        
        try {
          const errorData = await res.json();
          errorMsg = errorData.message || errorMsg;
        } catch (jsonError) {
          console.warn('greska');
        }
        
        throw new Error(errorMsg);
      }

      const data = await res.json();
      
      onSuccess(data); 

    } catch (error) {
      console.error('greska', error);
      setError(error.message); 
    }
  };

  return (
    <div className="auth-container">
      <h2>Prijava ({role === 'user' ? 'Korisnik' : 'Trgovac'})</h2>
      
      <a href={`/api/auth/google?role=${role}`} className="oauth-button">
        Prijavi se putem Google-a
      </a>
      <div className="form-separator"><span>ILI</span></div>

      <form onSubmit={handleSubmit}>
         <div className="form-group">
          <label htmlFor="login-email">Email</label>
          <input 
            type="email" 
            id="login-email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
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
          />
        </div>

        {error && <p className="error-message">{error}</p>}
        <button type="submit" className="button-primary">
          Prijavi se (Email i Lozinka)
        </button>
      </form>
      
      <div className="form-switch">
        <p>Nemate račun? <span onClick={onSwitch}>Registrirajte se</span></p>
      </div>
    </div>
  );
};

export default LoginForm;