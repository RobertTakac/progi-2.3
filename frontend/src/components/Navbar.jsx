import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { assets } from "../assets/assets";
import { FaBars, FaTimes } from "react-icons/fa";
import "./Navbar.css";

const Navbar = ({ currentUser, openLoginModal, handleSignOut }) => {

    const [isMenuOpen, setIsMenuOpen] = useState(false); 

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const closeMenu = () => setIsMenuOpen(false);

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
                <Link to="/" className="navbar-logo" onClick={closeMenu}>
                    <img src={assets.logo} alt="Logo" className="logo-image" />
                </Link>

                <div className="menu-icon" onClick={toggleMenu}>
                    {isMenuOpen ? <FaTimes /> : <FaBars />}
                </div>

              <div className={isMenuOpen ? "nav-menu active" : "nav-menu"}>
                <div className="navbar-links">
                    {navigationLinks.map((link) => (
                        <Link key={link.name} to={link.path} className="nav-item" onClick={closeMenu}>
                            {link.name}
                        </Link>
                    ))}
                </div>

                <div className="navbar-auth">
                    {currentUser ? (
                        <>
                            <Link to="/profil" className="nav-item button-secondary" onClick={closeMenu}>
                                Moj profil
                            </Link>

                            <button onClick={() => { handleSignOut(); closeMenu(); }} className="nav-item button-primary logout-btn">
                                Sign Out
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                onClick={() => { openLoginModal("login"); closeMenu(); }}
                                className="nav-item button-secondary"
                            >
                                Prijavi se
                            </button>
                            <button
                                onClick={() => { openLoginModal("signup"); closeMenu(); }}
                                className="nav-item button-primary"
                            >
                                Registriraj se
                            </button>
                        </>
                    )}
                </div>
              </div>
            </nav>
        </>
    );
};

export default Navbar;