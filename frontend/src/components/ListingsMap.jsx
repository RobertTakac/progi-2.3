import { MapContainer, TileLayer, Marker, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import { useEffect, useState } from 'react';
import {apiRequest} from "../api/apiService.js";


delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

function ListingsMap() {
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchListings = async () => {
            try {
                setLoading(true);
                const response = await apiRequest('/listing/all');

                if (!response) {

                    return;
                }

                if (!response.ok) {
                    throw new Error(`Server responded with status ${response.status}`);
                }

                const data = await response.json();
                setListings(data || []);
            } catch (err) {
                console.error("Cannot load listings for map:", err);
                setError("Ne mogu učitati oglase. Pokušajte kasnije.");
            } finally {
                setLoading(false);
            }
        };

        fetchListings();
    }, []);

    if (loading) {
        return <div style={{ height: '500px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            Učitavam oglase na karti...
        </div>;
    }

    if (error) {
        return <div style={{ height: '500px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'red' }}>
            {error}
        </div>;
    }

    return (
        <div style={{ height: '90vh', width: '100%', margin: '20px 0' }}>
            <MapContainer

                center={[45.815, 15.98]}
                zoom={11}

                scrollWheelZoom={true}
                style={{ height: '100%', width: '100%' }}
            >
                <TileLayer
                    attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {listings
                    .filter(l =>

                        typeof l.pickupLatitude === 'number' &&
                        typeof l.pickupLongitude === 'number'
                    )
                    .map((listing) => (
                        <Marker

                            key={listing.id}
                            position={[listing.pickupLatitude, listing.pickupLongitude]}
                        >

                            <
                                Tooltip direction="auto" offset={[12, -15]}
                            >
                                {listing.title}
                            </Tooltip>
                        </Marker>
                    ))}
            </MapContainer>
        </div>
    );
}

export default ListingsMap;