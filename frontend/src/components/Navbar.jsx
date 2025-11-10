import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { assets, DUMMY_USER_STATE } from "../assets/assets";
import "./Navbar.css";
import Modal from "./Modal";
import ChooseRole from "./ChooseRole";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import VerifyCodeForm from "./VerifyCodeForm";

const Navbar = () => {
  const [currentUser, setCurrentUser] = useState(
    DUMMY_USER_STATE.currentlyLoggedIn
  );

  const [modalView, setModalView] = useState(null);

  const [selectedRole, setSelectedRole] = useState(null);

  const [emailToVerify, setEmailToVerify] = useState(null);

  const openModal = (view) => {
    setModalView(view);
    setSelectedRole(null);
  };

  const closeModal = () => {
    setModalView(null);
    setSelectedRole(null);
  };

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
  };

  const switchForm = (newView) => {
    setModalView(newView);
  };

  const handleVerificationNeeded = (email) => {
    setEmailToVerify(email);
    setModalView("verify");
  };

  const handleLoginSuccess = (userData) => {
    setCurrentUser(userData);
    closeModal();
  };

  const handleSignOut = () => {
    setCurrentUser(null);
  };

  const baseLinks = [
    { name: "Home", path: "/" },
    { name: "Lokacije", path: "/lokacije" },
  ];

  let navigationLinks = [...baseLinks];

  if (currentUser) {
    if (currentUser.type === "merchant") {
      navigationLinks.push({ name: "Moji Oglasi", path: "/moji-oglasi" });
    }
  }

  return (
    <>
      <nav className="navbar">
        <Link to="/" className="navbar-logo">
          <img src={assets.logo} alt="Logo" className="logo-image" />
        </Link>
        <div className="navbar-links">
          {navigationLinks.map((link) => (
            <Link key={link.name} to={link.path} className="nav-item">
              {link.name}
            </Link>
          ))}
        </div>

        <div className="navbar-auth">
          {currentUser ? (
            <button onClick={handleSignOut} className="nav-item button-primary">
              Sign Out
            </button>
          ) : (
            <>
              <button
                onClick={() => openModal("login")}
                className="nav-item button-secondary"
              >
                Prijavi se
              </button>
              <button
                onClick={() => openModal("signup")}
                className="nav-item button-primary"
              >
                Registriraj se
              </button>
            </>
          )}
        </div>
      </nav>

      <Modal isOpen={!!modalView} onClose={closeModal}>
        {!selectedRole && (
          <ChooseRole action={modalView} onSelect={handleRoleSelect} />
        )}

        {selectedRole && modalView === "login" && (
          <LoginForm
            role={selectedRole}
            onSwitch={() => switchForm("signup")}
            onSuccess={handleLoginSuccess}
          />
        )}

        {selectedRole && modalView === "signup" && (
          <SignupForm
            role={selectedRole}
            onSwitch={() => switchForm("login")}
            onSuccess={handleVerificationNeeded}
          />
        )}

        {modalView === "verify" && (
          <VerifyCodeForm
            email={emailToVerify}
            onSuccess={() => switchForm("login")}
            onCancel={() => {
              openModal("signup");
            }}
          />
        )}
      </Modal>
    </>
  );
};

export default Navbar;
