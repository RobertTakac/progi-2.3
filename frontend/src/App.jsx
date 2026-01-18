import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import HomePage from './components/HomePage';
import MojiOglasi from './components/MojiOglasi';
import Ponuda from './components/Ponuda'; 
import Modal from './components/Modal'; 
import ChooseRole from './components/ChooseRole';
import LoginForm from './components/LoginForm';
import SignupForm from './components/SignupForm';
import VerifyCodeForm from './components/VerifyCodeForm';
import OAuth2Redirect from "./components/OAuth2Redirect";


const App = () => {

  const [currentUser, setCurrentUser] = useState(null);
  const [modalView, setModalView] = useState(null); 
  const [selectedRole, setSelectedRole] = useState(null);
  const [emailToVerify, setEmailToVerify] = useState(null);

  const openModal = (view) => {
    setModalView(view);
    setSelectedRole(null); 
    setEmailToVerify(null); 
  };
  const closeModal = () => {
    setModalView(null);
    setSelectedRole(null);
    setEmailToVerify(null); 
  };

  const handleRoleSelect = (role) => setSelectedRole(role);
  const switchForm = (newView) => setModalView(newView);

  const handleLoginSuccess = (userData) => {
    setCurrentUser(userData);
    closeModal(); 
  };
  const handleVerificationNeeded = (email) => {
    setEmailToVerify(email);
    setModalView('verify');
  };
  const handleSignOut = () => setCurrentUser(null);

  const renderModalContent = () => {
    if (!selectedRole && modalView !== 'verify') {
        return <ChooseRole action={modalView} onSelect={handleRoleSelect} />;
    } else if (selectedRole && modalView === 'login') {
        return <LoginForm role={selectedRole} onSwitch={() => switchForm('signup')} onSuccess={handleLoginSuccess} />;
    } else if (selectedRole && modalView === 'signup') {
        return <SignupForm role={selectedRole} onSwitch={() => switchForm('login')} onSuccess={handleVerificationNeeded} />;
    } else if (modalView === 'verify') {
        return <VerifyCodeForm email={emailToVerify} onSuccess={() => switchForm('login')} onCancel={() => openModal('signup')} />;
    }
    return null;
  };

  return (
    <div className='App'>
      <Navbar 
        currentUser={currentUser}
        openLoginModal={openModal} 
        handleSignOut={handleSignOut} 
      />
      <main>
        <Routes>
          <Route path="/" element={<HomePage currentUser={currentUser} openLoginModal={openModal} />} />
          <Route path="/moji-oglasi" element={<MojiOglasi />} />
          <Route path="/ponuda" element={<Ponuda />} />
            <Route path="/oauth2/redirect" element={<OAuth2Redirect setCurrentUser={handleLoginSuccess} />} />
        </Routes>
      </main>
      <Modal isOpen={!!modalView} onClose={closeModal}>
        {renderModalContent()}
      </Modal>
    </div>
  )
}

export default App
