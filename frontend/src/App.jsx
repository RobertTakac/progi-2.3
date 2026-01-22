import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useSearchParams, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
import AuthorisationGuard from './components/AuthorisationGuard';
import RoleGuard from './components/RoleGuard';
import ControlBoard from './components/ControlBoard';


const App = () => {

  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [modalView, setModalView] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);
  const [emailToVerify, setEmailToVerify] = useState(null);

  const [searchParams, setSearchParams] = useSearchParams();

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
    console.log("Podaci pri prijavi:", userData);
    setCurrentUser(userData);
    closeModal();
  };
  const handleVerificationNeeded = (email) => {
    setEmailToVerify(email);
    setModalView('verify');
  };
  const handleSignOut = () => {
    setCurrentUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("tokenExpiration");
    navigate('/');
  };

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

  useEffect(() => {
    if (searchParams.get("login") === "true") {
      handleSignOut();
      openModal('login');

      searchParams.delete("login");
      setSearchParams(searchParams, { replace: true });
    }
  }, [searchParams, setSearchParams]);


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
          <Route path="/oauth2/redirect" element={<OAuth2Redirect setCurrentUser={handleLoginSuccess} />} />

          <Route element={<AuthorisationGuard handleSignOut={handleSignOut} openLoginModal={openModal} />}>
            <Route element={<RoleGuard user={currentUser} allowedRoles={["admin", "merchant"]} />}>
              <Route path="/moji-oglasi" element={<MojiOglasi currentUser={currentUser} />} />
            </Route>

            <Route element={<RoleGuard user={currentUser} allowedRoles={["admin", "merchant", "client"]} />}>
              <Route path="/ponuda" element={<Ponuda currentUser={currentUser} />} />
            </Route>

            <Route element={<RoleGuard user={currentUser} allowedRoles={["admin"]} />}>
              <Route path="/controlboard" element={<ControlBoard currentUser={currentUser} anchor="left" />} />
            </Route>
          </Route>

          <Route path="*" element={<h1>404: stranica nije pronadena</h1>} />
        </Routes>
      </main>

      <Modal isOpen={!!modalView} onClose={closeModal}>
        {renderModalContent()}
      </Modal>

      <ToastContainer position="top-right" autoClose={3000}></ToastContainer>
    </div>
  )
}

export default App
