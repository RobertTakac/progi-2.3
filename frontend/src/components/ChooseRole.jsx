import React from 'react';
import './AuthForms.css'; 

const ChooseRole = ({ action, onSelect }) => {
  return (
    <div className="auth-container">
      <h2>{action === 'login' ? 'Prijavi se' : 'Registriraj se'} kao:</h2>
      
      <div className="role-selection">
        <button 
          className="role-button" 
          onClick={() => onSelect('user')}
        >
          Korisnik
        </button>
        <button 
          className="role-button" 
          onClick={() => onSelect('trader')}
        >
          Trgovac
        </button>
      </div>
    </div>
  );
};

export default ChooseRole;