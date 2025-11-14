import React from 'react';
import './MojiOglasi.css';
import { assets} from "../assets/assets";

const OFFER_MOCK_ADS = [
  { id: 1, title: "Ronilačka oprema set", price: 65.00, location: "Pula", imageUrl: assets.diving, description: "Kompletan set za ljetno ronjenje." },
  { id: 2, title: "Teniski reket Wilson", price: 10.00, location: "Rijeka", imageUrl: assets.racket, description: "Profesionalni reket za napredne igrače." },
  { id: 3, title: "Kajak za 2 osobe", price: 40.00, location: "Zadar", imageUrl: assets.kayak, description: "Stabilan kajak za obiteljske izlete." },
];

const Ponuda = () => {
  return (
    <div className="ponuda-container">
      <h2>Trenutna Ponuda Opreme</h2>      
      <div className="grid-container">
        {OFFER_MOCK_ADS.map((item) => (
          <div className="card" key={item.id}>
            <img 
              src={item.imageUrl}
              alt={item.title}
            />
            <h1>{item.title}</h1>
            <p><strong>Cijena:</strong> €{item.price.toFixed(2)} / dan</p>
            <p><strong>Lokacija:</strong> {item.location}</p>
            <p>{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Ponuda;