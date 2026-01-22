import React, { useState, useEffect } from 'react';
import './MojiOglasi.css';
import { getAllListings } from '../services/apiService';
import { toast } from 'react-toastify';

const Ponuda = ({ currentUser }) => {
  const [availableAds, setAvailableAds] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPublicAds = async () => {
    setLoading(true);
    try {
      const data = await getAllListings();
      setAvailableAds(data);
    } catch (error) {
      console.error("Greška pri dohvaćanju ponude:", error);
      toast.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPublicAds();
  }, []);

  return (
    <div className="ponuda-page">
      <div className="ads-header">
        <h2>Dostupna Oprema</h2>
        <p>Pronađi savršenu opremu za svoju sljedeću avanturu</p>
      </div>

      <div className="grid-container">
        {loading ? (
          <p style={{ gridColumn: '1/-1', textAlign: 'center' }}>Učitavanje oglasa...</p>
        ) : availableAds.length > 0 ? (
          availableAds.map((item) => (
            <div className="card public-card" key={item.id}>
              <div className="card-image-wrapper">
                <img 
                  src={item.imageUrl || "https://placehold.co/600x400?text=Nema+slike"} 
                  alt={item.title} 
                />
                {item.pickupCity && (
                  <span className="location-badge"> {item.pickupCity}</span>
                )}
              </div>
              
              <div className="card-content">
                <div className="card-header-info">
                  <h1>{item.title}</h1>
                  <p className="price-tag">
                    €{Number(item.dailyPrice || 0).toFixed(2)} <span>/ dan</span>
                  </p>
                </div>
                
                <p className="description-text">
                  {item.description}
                </p>
                
                <div className="card-footer">
                  {item.availableUntil && (
                    <span className="availability"> 
                      Dostupno do: {new Date(item.availableUntil).toLocaleDateString('hr-HR')}
                    </span>
                  )}
                  {item.merchantID && (       // trenutno prikazuje id trgovca, promijeniti u ime
                    <span className="owner-info"> ID Trgovca: {item.merchantID}</span>
                  )}
                  
                  <button 
                    className="reserve-btn" 
                    onClick={() => alert(`Rezervacija za ${item.title} poslana trgovcu!`)}
                  >
                    Rezerviraj
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '50px' }}>
            <p>Trenutno nema dostupnih oglasa.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Ponuda;