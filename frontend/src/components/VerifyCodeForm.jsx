import React, { useState } from 'react';
import './AuthForms.css';
import { apiRequest } from '../api/apiService';

const VerifyCodeForm = ({ email, onSuccess, onCancel }) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await apiRequest('/auth/verify', 'POST', { 
        email: email, 
        verificationCode: code 
      });

      if (!res || !res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Neispravan verifikacijski kod.');
      }

      onSuccess(); 
    } catch (error) {
      console.error('Greska pri verifikaciji:', error);
      setError(error.message);
    } finally {
      setLoading(false);
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
            disabled={loading} 
          />
        </div>
        
        {error && <p className="error-message">{error}</p>}
        
        <button 
          type="submit" 
          className="button-primary" 
          disabled={loading}
        >
          {loading ? 'Provjera...' : 'Potvrdi Kod'}
        </button>
      </form>

      <div className="form-switch">
        <p>Pogrešan email? <span onClick={onCancel}>Vrati se</span></p>
      </div>
    </div>
  );
};

export default VerifyCodeForm;