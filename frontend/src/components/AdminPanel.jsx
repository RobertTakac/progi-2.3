import React, { useState, useEffect } from "react";
import { apiRequest } from "../api/apiService";
import "./AdminPanel.css";

const AdminPanel = () => {
    const [reports, setReports] = useState([]);
    const [merchants, setMerchants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // --- Fetch reports ---
    useEffect(() => {
        const fetchReports = async () => {
            try {
                const response = await apiRequest("/admin/get-reports", "GET");
                if (!response.ok) throw new Error(`Greška: ${response.status}`);
                const data = await response.json();
                setReports(data);
            } catch (err) {
                setError(err.message || "Greška pri dohvaćanju reportova");
            } finally {
                setLoading(false);
            }
        };

        fetchReports();
    }, []);

    // --- Fetch merchants (ADMIN DTO) ---
    useEffect(() => {
        const fetchMerchants = async () => {
            try {
                const response = await apiRequest("/admin/get-merchants", "GET");
                if (!response.ok) throw new Error(`Greška: ${response.status}`);
                const data = await response.json();
                setMerchants(data);
            } catch (err) {
                console.error("Greška pri dohvaćanju merchanta:", err);
            }
        };

        fetchMerchants();
    }, []);

    const handleBanUser = async (reservationID) => {
        if (!window.confirm("Jeste li sigurni da želite banati korisnika?")) return;

        try {
            const response = await apiRequest(
                `/admin/ban-user-by-reservation?reservationID=${reservationID}`,
                "POST"
            );

            if (!response.ok) {
                const text = await response.text();
                throw new Error(text || `Greška: ${response.status}`);
            }

            alert("Korisnik je banan.");
            setReports(prev =>
                prev.filter(report => report.reservationID !== reservationID)
            );
        } catch (err) {
            alert(err.message || "Greška pri bananju korisnika");
        }
    };

    if (loading) return <p>Učitavanje...</p>;
    if (error) return <p style={{ color: "red" }}>Greška: {error}</p>;

    return (
        <div className="admin-panel">
            <h1>Admin Panel – Reportovi</h1>

            {reports.length === 0 ? (
                <p>Nema reportova.</p>
            ) : (
                <table className="reports-table">
                    <thead>
                    <tr>
                        <th>Reservation ID</th>
                        <th>Opis</th>
                        <th>Akcija</th>
                    </tr>
                    </thead>
                    <tbody>
                    {reports.map((report, index) => (
                        <tr key={index}>
                            <td>{report.reservationID}</td>
                            <td>{report.description}</td>
                            <td>
                                <button
                                    className="ban-button"
                                    onClick={() =>
                                        handleBanUser(report.reservationID)
                                    }
                                >
                                    Ban User
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}

            <h2 style={{ marginTop: "40px" }}>Trgovci i ocjene</h2>

            {merchants.length === 0 ? (
                <p>Nema trgovaca.</p>
            ) : (
                <table className="merchants-table">
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Business Name</th>
                        <th>City</th>
                        <th>Country</th>
                        <th>Average Rating</th>
                    </tr>
                    </thead>
                    <tbody>
                    {merchants.map(m => (
                        <tr key={m.id}>
                            <td>{m.id}</td>
                            <td>{m.businessName}</td>
                            <td>{m.city}</td>
                            <td>{m.country}</td>
                            <td>
                                {m.averageRating !== null
                                    ? m.averageRating
                                    : "N/A"}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default AdminPanel;
