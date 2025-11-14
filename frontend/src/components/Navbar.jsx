import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { assets } from "../assets/assets";
import "./Navbar.css";
import Modal from "./Modal";
import ChooseRole from "./ChooseRole";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import VerifyCodeForm from "./VerifyCodeForm";

const Navbar = ({ currentUser, openLoginModal, handleSignOut }) => {

  const baseLinks = [
    { name: "Home", path: "/" },
    { name: "Lokacije", path: "/lokacije" },
    ...(currentUser ? [{ name: 'Ponuda', path: '/ponuda' }] : [])
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
                onClick={() => openLoginModal("login")}
                className="nav-item button-secondary"
              >
                Prijavi se
              </button>
              <button
                onClick={() => openLoginModal("signup")}
                className="nav-item button-primary"
              >
                Registriraj se
              </button>
            </>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navbar;
