import React, { useState, useEffect } from "react";
import { apiRequest } from "../api/apiService";
import "./AdminPanel.css";

const AdminPanel = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Dohvati reportove s backend-a
    useEffect(() => {
        const fetchReports = async () => {
            try {
                const response = await apiRequest("/admin/get-reports", "GET");

                if (!response.ok) {
                    throw new Error(`Greška: ${response.status}`);
                }

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

    if (loading) return <p>Učitavanje reportova...</p>;
    if (error) return <p style={{ color: "red" }}>Greška: {error}</p>;

    return (
        <div className="admin-panel">
            <h1>Admin Panel - Reportovi</h1>

            {reports.length === 0 ? (
                <p>Nema reportova.</p>
            ) : (
                <table className="reports-table">
                    <thead>
                    <tr>
                        <th>Reservation ID</th>
                        <th>Opis</th>
                    </tr>
                    </thead>
                    <tbody>
                    {reports.map((report, index) => (
                        <tr key={index}>
                            <td>{report.reservationID}</td>
                            <td>{report.description}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default AdminPanel;
