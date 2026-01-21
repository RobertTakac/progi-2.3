import { useState } from 'react';
import './AuthForms.css';
import { apiLogin } from "../services/apiService";

const LoginForm = ({ role, onSwitch, onSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await apiLogin(email, password, role);
      onSuccess(res);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-container">
      <h2>Prijava ({role === 'user' ? 'Korisnik' : 'Trgovac'})</h2>
      
      <button
        onClick={() => {
          window.location.href ="https://progi-2-3-backend.onrender.com/oauth2/authorization/google";
        }}
      >
        Sign up / Login with Google
      </button>

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