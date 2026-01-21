import React, { useState } from 'react';
import './AuthForms.css';
const BASE_URL = import.meta.env.VITE_BASE_URL;

const SignupForm = ({ role, onSwitch, onSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
   const [username, setUsername] = useState('');
 

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError('greska');
      return;
    }
    setError('');
    
    try {
      const res = await fetch(`${BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email,username, password, role })
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Registracija nije uspjela. Status: ' + res.status);
      }
      
      onSuccess(email); 

    } catch (error) {
      console.error('greska', error);
      setError(error.message);
    }
  };

  return (
    <div className="auth-container">
      <h2>Registracija ({role === 'user' ? 'Korisnik' : 'Trgovac'})</h2>

      <button
        onClick={() => {
          window.location.href ="https://backend-9p6u.onrender.com/oauth2/authorization/google";
        }}
      >
        Sign up / Login with Google
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
          />
        </div>
        <div className="form-group">
          <label htmlFor="signup-username">Username</label>
          <input 
            type="text" 
            id="signup-username" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            required 
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
          />
        </div>
        <div className="form-group">
          <label htmlFor="signup-confirm-password">Potvrdi Lozinku</label>
          <input 
            type="password" 
            id="signup-confirm-password" 
            value={confirmPassword} 
            onChange={(e) => setConfirmPassword(e.target.value)} 
            required 
          />
        </div>
        
        {error && <p className="error-message">{error}</p>}
        <button type="submit" className="button-primary">Registriraj se</button>
      </form>
      
      <div className="form-switch">
        <p>Već imate račun? <span onClick={onSwitch}>Prijavite se</span></p>
      </div>
    </div>
  );
};

export default SignupForm;