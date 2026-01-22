import React, { useState, useEffect } from 'react';
import { apiRequest } from '../api/apiService';
import './AdminPanel.css';

const MojeRezervacijeClient = () => {
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showRatingModal, setShowRatingModal] = useState(false);
    const [selectedReservation, setSelectedReservation] = useState(null);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');

    const fetchReservations = async () => {
        setLoading(true);
        try {
            const res = await apiRequest('/client/reservations', 'GET');
            if (res && res.ok) {
                const data = await res.json();

                const activeReservations = data.filter(
                    reservation => new Date(reservation.endDate) >= new Date()
                );
                setReservations(activeReservations);
            }
        } catch (error) {
            console.error('Greška pri dohvaćanju rezervacija:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRateClick = (reservation) => {
        setSelectedReservation(reservation);
        setShowRatingModal(true);
        setRating(5);
        setComment('');
    };

    const handleSubmitRating = async (e) => {
        e.preventDefault();

        try {
            const payload = {
                reservationID: selectedReservation.reservationID,
                rating: rating,
                comment: comment
            };

            const res = await apiRequest('/client/rate-merchant', 'POST', payload);

            if (res && res.ok) {
                alert('Ocjena uspješno poslana!');
                setShowRatingModal(false);
                setSelectedReservation(null);
                fetchReservations();
            } else {
                alert('Greška pri slanju ocjene.');
            }
        } catch (error) {
            console.error('Greška pri ocjenjivanju:', error);
            alert('Greška pri slanju ocjene.');
        }
    };

    useEffect(() => {
        fetchReservations();
    }, []);

    return (
        <div style={{ padding: '20px' }}>
            <h1>Moje Rezervacije</h1>

            {loading ? (
                <p>Učitavanje...</p>
            ) : reservations.length > 0 ? (
                <table className="reports-table">
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Oprema</th>
                        <th>Trgovac</th>
                        <th>Početak</th>
                        <th>Završetak</th>
                        <th>Količina</th>
                        <th>Akcija</th>
                    </tr>
                    </thead>
                    <tbody>
                    {reservations.map((reservation) => (
                        <tr key={reservation.reservationID}>
                            <td>{reservation.reservationID}</td>
                            <td>{reservation.listing?.title || 'N/A'}</td>
                            <td>{reservation.merchantUsername}</td>
                            <td>{new Date(reservation.startDate).toLocaleDateString('hr-HR')}</td>
                            <td>{new Date(reservation.endDate).toLocaleDateString('hr-HR')}</td>
                            <td>{reservation.quantity}</td>
                            <td>
                                <button
                                    onClick={() => handleRateClick(reservation)}
                                    className="rate-btn"
                                >
                                    Ocijeni
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            ) : (
                <p>Nemate završenih rezervacija.</p>
            )}


            {showRatingModal && (
                <div className="modal-overlay" onClick={() => setShowRatingModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h2>Ocijeni trgovca</h2>
                        <p><strong>Oprema:</strong> {selectedReservation?.listing?.title}</p>
                        <p><strong>Trgovac:</strong> {selectedReservation?.merchantUsername}</p>

                        <form onSubmit={handleSubmitRating}>
                            <div className="form-group">
                                <label>Ocjena (1-5):</label>
                                <input
                                    type="number"
                                    min="1"
                                    max="5"
                                    value={rating}
                                    onChange={(e) => setRating(parseInt(e.target.value))}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Komentar:</label>
                                <textarea
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    rows="4"
                                    placeholder="Opišite vaše iskustvo..."
                                />
                            </div>

                            <div className="modal-actions">
                                <button type="submit" className="submit-btn">Pošalji ocjenu</button>
                                <button type="button" className="cancel-btn" onClick={() => setShowRatingModal(false)}>
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

export default MojeRezervacijeClient;