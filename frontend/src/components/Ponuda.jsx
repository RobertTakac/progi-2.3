import React, { useState, useEffect } from 'react';
import './MojiOglasi.css';
import { apiRequest } from '../api/apiService';
import './Ponuda.css';

const Ponuda = ({ currentUser }) => {
  const [availableAds, setAvailableAds] = useState([]);
  const [loading, setLoading] = useState(true);

    const [showReservationModal, setShowReservationModal] = useState(false);
    const [selectedListing, setSelectedListing] = useState(null);
    const [reservationData, setReservationData] = useState({
        startDate: '',
        endDate: '',
        quantity: 1
    });

    const [keyword, setKeyword] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');

    const categories = [
        'Kampiranje i boravak u prirodi',
        'Planinarenje i trekking',
        'Biciklizam',
        'Vodeni sportovi',
        'Zimski sportovi',
        'Penjanje i alpinizam',
        'Fitness i trening',
        'Timski sportovi',
        'Sportska odjeća i zaštitna oprema',
        'Navigacija i sigurnosna oprema'
    ];

    const fetchPublicAds = async () => {
        setLoading(true);
        try {
            let endpoint;


            if (!selectedCategory && !keyword) {
                endpoint = '/listing/all';
            } else {

                endpoint = '/listing/';
                const params = new URLSearchParams();

                if (selectedCategory) {
                    params.append('category', selectedCategory);
                }
                if (keyword) {
                    params.append('keyword', keyword);
                }

                const queryString = params.toString();
                if (queryString) {
                    endpoint += '?' + queryString;
                }
            }

            const res = await apiRequest(endpoint, 'GET');

            if (res && res.ok) {
                const data = await res.json();
                setAvailableAds(data);
            }
        } catch (error) {
            console.error("Greška pri dohvaćanju ponude:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = () => {
        fetchPublicAds();
    };

    const handleClearFilters = () => {
        setKeyword('');
        setSelectedCategory('');
    };

    const handleReserveClick = (listing) => {
        setSelectedListing(listing);
        setShowReservationModal(true);
        setReservationData({
            startDate: '',
            endDate: '',
            quantity: 1
        });
    };

    const handleReservationSubmit = async (e) => {
        e.preventDefault();

        if (!currentUser) {
            alert('Morate biti prijavljeni za rezervaciju!');
            return;
        }


        const reservationStart = new Date(reservationData.startDate);
        const reservationEnd = new Date(reservationData.endDate);
        const availableFrom = selectedListing.availableFrom ? new Date(selectedListing.availableFrom) : null;
        const availableUntil = selectedListing.availableUntil ? new Date(selectedListing.availableUntil) : null;


        if (reservationStart >= reservationEnd) {
            alert('Datum početka mora biti prije datuma završetka!');
            return;
        }


        if (availableFrom && reservationStart < availableFrom) {
            alert(`Oprema je dostupna tek od ${availableFrom.toLocaleDateString('hr-HR')}!`);
            return;
        }

        if (availableUntil && reservationEnd > availableUntil) {
            alert(`Oprema je dostupna samo do ${availableUntil.toLocaleDateString('hr-HR')}!`);
            return;
        }

        try {
            const payload = {
                listingID: selectedListing.id,
                startDate: reservationData.startDate,
                endDate: reservationData.endDate,
                quantity: reservationData.quantity
            };

            const res = await apiRequest('/client/create-reservation', 'POST', payload);

            if (res && res.ok) {
                alert(`Rezervacija za ${selectedListing.title} uspješno poslana!`);
                setShowReservationModal(false);
                setSelectedListing(null);
            } else {
                alert('Greška pri slanju rezervacije. Pokušajte ponovo.');
            }
        } catch (error) {
            console.error("Greška pri rezervaciji:", error);
            alert('Greška pri slanju rezervacije.');
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

        <div className="search-filter-section">
            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Pretraži opremu..."
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    className="search-input"
                />
            </div>

            <div className="filter-row">
                <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="category-select"
                >
                    <option value="">Sve kategorije</option>
                    {categories.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>

                <button onClick={handleSearch} className="search-btn">
                    Pretraži
                </button>

                <button onClick={handleClearFilters} className="clear-btn">
                    Očisti filtere
                </button>
            </div>
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
                    onClick={() => handleReserveClick(item)}
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

        {showReservationModal && (
            <div className="modal-overlay" onClick={() => setShowReservationModal(false)}>
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                    <h2>Rezerviraj: {selectedListing?.title}</h2>
                    <form onSubmit={handleReservationSubmit}>
                        <div className="form-group">
                            <label>Datum početka:</label>
                            <input
                                type="datetime-local"
                                value={reservationData.startDate}
                                onChange={(e) => setReservationData({...reservationData, startDate: e.target.value})}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Datum završetka:</label>
                            <input
                                type="datetime-local"
                                value={reservationData.endDate}
                                onChange={(e) => setReservationData({...reservationData, endDate: e.target.value})}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Količina:</label>
                            <input
                                type="number"
                                min="1"
                                value={reservationData.quantity}
                                onChange={(e) => setReservationData({...reservationData, quantity: parseInt(e.target.value)})}
                                required
                            />
                        </div>

                        <div className="modal-actions">
                            <button type="submit" className="submit-btn">Potvrdi rezervaciju</button>
                            <button type="button" className="cancel-btn" onClick={() => setShowReservationModal(false)}>
                                Odustani
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        )}
    </div>
  );
};

export default Ponuda;