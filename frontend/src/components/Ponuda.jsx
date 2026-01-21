import { useEffect, useState } from 'react';

import './MojiOglasi.css';
import { getAllListings } from '../services/apiService';

// const OFFER_MOCK_ADS = [
//   { id: 1, title: "Ronilačka oprema set", price: 65.00, location: "Pula", imageUrl: assets.diving, description: "Kompletan set za ljetno ronjenje." },
//   { id: 2, title: "Teniski reket Wilson", price: 10.00, location: "Rijeka", imageUrl: assets.racket, description: "Profesionalni reket za napredne igrače." },
//   { id: 3, title: "Kajak za 2 osobe", price: 40.00, location: "Zadar", imageUrl: assets.kayak, description: "Stabilan kajak za obiteljske izlete." },
// ];

const Ponuda = () => {
  const [ponude, setPonude] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const ponude = async () => {
      try {
        const res = await getAllListings();
        setPonude(res);
      } catch (err) {
        console.error("Pogreska pri dohvacanju ponuda: ", err);
        setError(err);
      } finally {
        setLoading(false)
      }
    }

    ponude();
  }, []);

  if (loading) return <div className='loading'>Ucitavanje ponuda...</div>;
  if (error) return <div className='error'>{error}</div>

  return (
    <div className="ponuda-container">
      <h2>Trenutna Ponuda Opreme</h2>      
      <div className="grid-container">
        {ponude.map((item) => (
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