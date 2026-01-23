import React from "react";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { FiArrowRight } from "react-icons/fi";
import "./HomePage.css";

const HomePageMerchant = ({ currentUser }) => {
    const navigate = useNavigate();

    return (
        <div className="home-container">
            <div className="home-banner-container">
                <div className="home-text-section">
                    <h1 className="primary-heading">Dobrodošli, trgovče {currentUser?.username || ''}!</h1>
                    <p className="primary-text">
                        Upravljajte oglasima, pratite rezervacije i zaradu na jednom mjestu.
                    </p>
                    <button
                        className="secondary-button"
                        onClick={() => navigate('/moji-oglasi')}
                    >
                        Moji oglasi <FiArrowRight />
                    </button>
                </div>
                <div className="home-image-section">
                    <img src={assets.CyclingImage} alt="" />
                </div>
            </div>
        </div>
    );
};

export default HomePageMerchant;