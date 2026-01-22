import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { assets } from "../assets/assets";
import "./Navbar.css";

const Navbar = ({ currentUser, openLoginModal, handleSignOut }) => {

    const getNavigationLinks = () => {
        if (!currentUser) {
            return [];
        }

        const role = currentUser.role;

        if (role === 'ROLE_ADMIN') {
            return [];
        }

        if (role === 'ROLE_CLIENT') {
            return [
                { name: "Lokacije", path: "/mapa" },
                { name: "Ponuda", path: "/ponuda" },
                { name: "Moje Rezervacije", path: "/moje-rezervacije-client" }
            ];
        }

        if (role === 'ROLE_MERCHANT') {
            return [
                { name: "Moji Oglasi", path: "/moji-oglasi" },
                { name: "Moje Rezervacije", path: "/moje-rezervacije-merchant" }
            ];
        }

        return [];
    };

    const navigationLinks = getNavigationLinks();

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
                        <>
                            <Link to="/profil" className="nav-item button-secondary">
                                Moj profil
                            </Link>

                            <button onClick={handleSignOut} className="nav-item button-primary">
                                Sign Out
                            </button>
                        </>
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