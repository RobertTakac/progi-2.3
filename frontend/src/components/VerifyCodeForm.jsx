import React, { useState } from 'react';
import './AuthForms.css';
const BASE_URL = import.meta.env.VITE_BASE_URL;

const VerifyCodeForm = ({ email, onSuccess, onCancel }) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch(`${BASE_URL}/auth/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email, verificationCode: code })
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'greska');
      }

      onSuccess(); 

    } catch (error) {
      console.error('greska', error);
      setError(error.message);
    }
  };

  return (
    <div className="auth-container">
      <h2>Verificiraj Račun</h2>
      <p className="verify-info">
        Unesite verifikacijski kod koji smo poslali na:
        <strong> {email || 'vašu e-poštu'}</strong>
      </p>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="verify-code">Verifikacijski Kod</label>
          <input 
            type="text" 
            id="verify-code" 
            value={code} 
            onChange={(e) => setCode(e.target.value)} 
            required 
          />
        </div>
        
        {error && <p className="error-message">{error}</p>}
        
        <button type="submit" className="button-primary">Potvrdi Kod</button>
      </form>

      <div className="form-switch">
        <p>Pogrešan email? <span onClick={onCancel}>Vrati se</span></p>
      </div>
    </div>
  );
};

export default VerifyCodeForm;