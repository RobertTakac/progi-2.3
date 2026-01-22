import React from "react";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { FiArrowRight } from "react-icons/fi";
import "./HomePage.css";

const HomePageUser = ({ currentUser, openLoginModal }) => {
    const navigate = useNavigate();

    const handleButtonClick = () => {
        navigate('/ponuda');
    };

    return (
        <div className="home-container">
            <div className="home-banner-container">
                <div className="home-text-section">
                    <h1 className="primary-heading">Dobrodošli natrag, {currentUser?.username || 'korisniče'}!</h1>
                    <p className="primary-text">
                        Spremni za novu avanturu? Pronađite savršenu opremu za sebe.
                    </p>
                    <button className="secondary-button" onClick={handleButtonClick}>
                        Pogledaj ponudu <FiArrowRight />
                    </button>
                </div>
                <div className="home-image-section">
                    <img src={assets.CyclingImage} alt="" />
                </div>
            </div>
        </div>
    );
};

export default HomePageUser;