import React from "react";
import { useNavigate } from "react-router-dom"; 
import { assets} from "../assets/assets";
import { FiArrowRight } from "react-icons/fi";
import "./HomePage.css";

const HomePage = ({ currentUser, openLoginModal }) => {

  const navigate = useNavigate();

  const handleButtonClick = () => {
    if (currentUser) {
      navigate('/ponuda'); 
    } else {
      openLoginModal('login'); 
    }
  };

  return (
    <div className="home-container">
      <div className="home-banner-container">
        <div className="home-text-section">
          <h1 className="primary-heading">Iznajmi sportsku opremu bez brige</h1>
          <p className="primary-text">
            Pronađi, rezerviraj i preuzmi sportsku opremu na jednom mjestu.
            <br />
            Jednostavno, brzo i sigurno, bilo da si klijent ili trgovac.
          </p>
          <button className="secondary-button" onClick={handleButtonClick}>
            Pogledaj ponudu <FiArrowRight />{" "}
          </button>
        </div>
        <div className="home-image-section">
          <img src={assets.CyclingImage} alt="" />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
