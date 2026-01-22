import React from "react";
import { assets } from "../assets/assets";
import "./HomePage.css";

const HomePageAdmin = ({ currentUser }) => {
    return (
        <div className="home-container">
            <div className="home-banner-container">
                <div className="home-text-section">
                    <h1 className="primary-heading">Admin panel – {currentUser?.username || ''}</h1>
                    <p className="primary-text">
                        Pregled korisnika, oglasa, statistike i moderacije platforme.
                    </p>

                </div>
                <div className="home-image-section">
                    <img src={assets.CyclingImage} alt="" />
                </div>
            </div>
        </div>
    );
};

export default HomePageAdmin;