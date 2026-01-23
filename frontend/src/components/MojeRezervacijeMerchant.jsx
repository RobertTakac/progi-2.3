import React, { useState, useEffect } from 'react';
import { apiRequest } from '../api/apiService';
import './AdminPanel.css';

const MojeRezervacijeMerchant = () => {
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showReportModal, setShowReportModal] = useState(false);
    const [selectedReservation, setSelectedReservation] = useState(null);
    const [reportData, setReportData] = useState({
        description: ''
    });

    const fetchReservations = async () => {
        setLoading(true);
        try {
            const res = await apiRequest('/merchant/reservations', 'GET');
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

    const handleApprove = async (reservationID) => {
        try {
            const res = await apiRequest(`/merchant/approve?reservationID=${reservationID}`, 'POST');
            if (res && res.ok) {
                alert('Rezervacija odobrena!');
                fetchReservations();
            } else {
                alert('Greška pri odobravanju rezervacije.');
            }
        } catch (error) {
            console.error('Greška pri odobravanju:', error);
            alert('Greška pri odobravanju rezervacije.');
        }
    };

    const handleDisapprove = async (reservationID) => {
        try {
            const res = await apiRequest(`/merchant/disapprove?reservationID=${reservationID}`, 'POST');
            if (res && res.ok) {
                alert('Rezervacija odbijena!');
                fetchReservations();
            } else {
                alert('Greška pri odbijanju rezervacije.');
            }
        } catch (error) {
            console.error('Greška pri odbijanju:', error);
            alert('Greška pri odbijanju rezervacije.');
        }
    };

    const handleReportClick = (reservation) => {
        setSelectedReservation(reservation);
        setShowReportModal(true);
        setReportData({ description: '' });
    };

    const handleSubmitReport = async (e) => {
        e.preventDefault();

        try {
            const payload = {
                reservationID: selectedReservation.reservationID,
                description: reportData.description
            };

            const res = await apiRequest('/merchant/report-user', 'POST', payload);

            if (res && res.ok) {
                alert('Prijava uspješno poslana!');
                setShowReportModal(false);
                setSelectedReservation(null);
                fetchReservations();
            } else {
                alert('Greška pri slanju prijave.');
            }
        } catch (error) {
            console.error('Greška pri prijavi:', error);
            alert('Greška pri slanju prijave.');
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
                        <th>Klijent</th>
                        <th>Početak</th>
                        <th>Završetak</th>
                        <th>Količina</th>
                        <th>Status</th>
                        <th>Akcija</th>
                    </tr>
                    </thead>
                    <tbody>
                    {reservations.map((reservation) => (
                        <tr key={reservation.reservationID}>
                            <td>{reservation.reservationID}</td>
                            <td>{reservation.listing?.title || 'N/A'}</td>
                            <td>{reservation.clientUsername}</td>
                            <td>{new Date(reservation.startDate).toLocaleDateString('hr-HR')}</td>
                            <td>{new Date(reservation.endDate).toLocaleDateString('hr-HR')}</td>
                            <td>{reservation.quantity}</td>
                            <td>{reservation.status}</td>
                            <td>
                                {reservation.status === 'ACTIVE' ? (
                                    <button
                                        onClick={() => handleReportClick(reservation)}
                                        className="rate-btn"
                                    >
                                        Prijavi
                                    </button>
                                ) : reservation.status === 'WAITING' ? (
                                    <div style={{ display: 'flex', gap: '5px' }}>
                                        <button
                                            onClick={() => handleApprove(reservation.reservationID)}
                                            className="approve-btn"
                                        >
                                            Odobri
                                        </button>
                                        <button
                                            onClick={() => handleDisapprove(reservation.reservationID)}
                                            className="decline-btn"
                                        >
                                            Odbij
                                        </button>
                                    </div>
                                ) : (
                                    <span>-</span>
                                )}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            ) : (
                <p>Nemate rezervacija.</p>
            )}

            {showReportModal && (
                <div className="modal-overlay" onClick={() => setShowReportModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h2>Prijavi problem</h2>
                        <p><strong>Oprema:</strong> {selectedReservation?.listing?.title}</p>
                        <p><strong>Klijent:</strong> {selectedReservation?.clientUsername}</p>

                        <form onSubmit={handleSubmitReport}>
                            <div className="form-group">
                                <label>Opis problema:</label>
                                <textarea
                                    value={reportData.description}
                                    onChange={(e) => setReportData({ ...reportData, description: e.target.value })}
                                    rows="6"
                                    placeholder="Opišite problem s rezervacijom..."
                                    required
                                />
                            </div>

                            <div className="modal-actions">
                                <button type="submit" className="submit-btn">Pošalji prijavu</button>
                                <button type="button" className="cancel-btn" onClick={() => setShowReportModal(false)}>
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

export default MojeRezervacijeMerchant;