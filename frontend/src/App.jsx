import React, { useState } from 'react';
import { Routes, Route, useNavigate , Navigate} from 'react-router-dom';

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
import UserProfile from "./components/UserProfile.jsx";
import ListingsMap from "./components/ListingsMap.jsx";
import HomeRouter from './components/HomeRouter';
import {apiRequest} from "./api/apiService.js";


const App = () => {

  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

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

    const handleLoginSuccess = async (loginData) => {
        console.log("Login response:", loginData);


        const token = loginData.token || loginData.accessToken;

        if (!token) {
            console.error("No token received from login");
            return;
        }


        localStorage.setItem("token", token);


        try {
            const response = await apiRequest('/users/me');

            if (!response) {
                console.error("Failed to fetch user (401 or network error)");
                return;
            }

            if (!response.ok) {
                throw new Error(`Status ${response.status}`);
            }

            const user = await response.json();
            console.log("Fetched user from /users/me:", user);


            setCurrentUser(user);
            localStorage.setItem("user", JSON.stringify(user));

        } catch (err) {
            console.error("Error fetching user after login:", err);

            localStorage.removeItem("token");
            localStorage.removeItem("user");
            setCurrentUser(null);
        }

        closeModal();
        navigate('/', { replace: true });
    };
  const handleVerificationNeeded = (email) => {
    setEmailToVerify(email);
    setModalView('verify');
  };
  const handleSignOut = () => {
    setCurrentUser(null);
    localStorage.removeItem("user"); 
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

  return (
    <div className='App'>
      <Navbar 
        currentUser={currentUser}
        openLoginModal={openModal} 
        handleSignOut={handleSignOut} 
      />
      <main>
          <Routes>
              <Route
                  path="/"
                  element={<HomeRouter currentUser={currentUser} openLoginModal={openModal} />}
              />

              <Route
                  path="/moji-oglasi"
                  element={
                      currentUser?.role === 'ROLE_MERCHANT' ? (
                          <MojiOglasi currentUser={currentUser} />
                      ) : (
                          <Navigate to="/" replace />
                      )
                  }
              />
              <Route path="/ponuda" element={<Ponuda currentUser={currentUser} />} />
          <Route path="/oauth2/redirect" element={<OAuth2Redirect setCurrentUser={handleLoginSuccess}/>} />
            <Route path="/profil" element={<UserProfile currentUser={currentUser} />} />
            <Route path="/mapa" element={<ListingsMap />} />
        </Routes>
      </main>
      <Modal isOpen={!!modalView} onClose={closeModal}>
        {renderModalContent()}
      </Modal>
    </div>
  )
}

export default App
