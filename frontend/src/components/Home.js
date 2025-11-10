import React from "react";
import CyclingImage from "../Assets/cycling.jpg";
import Navbar from "./Navbar";
import { FiArrowRight } from "react-icons/fi";

const Home = () => {
  return (
    <div className="home-container">
      <Navbar />
      <div className="home-banner-container">
        <div className="home-text-section">
          <h1 className="primary-heading">Iznajmi sportsku opremu bez brige</h1>
          <p className="primary-text">
            Pronađi, rezerviraj i preuzmi sportsku opremu na jednom mjestu.
            <br />
            Jednostavno, brzo i sigurno, bilo da si klijent ili trgovac.
          </p>
          <button className="secondary-button">
            Pogledaj ponudu <FiArrowRight />{" "}
          </button>
        </div>
        <div className="home-image-section">
          <img src={CyclingImage} alt="" />
        </div>
      </div>
    </div>
  );
};

export default Home;
