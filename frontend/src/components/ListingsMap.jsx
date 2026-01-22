import { MapContainer, TileLayer, Marker, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import { useEffect, useState } from 'react';


delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

function ListingsMap() {
    const [listings, setListings] = useState([]);

    useEffect(() => {

        fetch('/listing/all')
            .then(res => res.json())
            .then(data => setListings(data || []))
            .catch(err => console.error("Cannot load listings for map", err));

    }, []);

    return (
        <div style={{ height: '500px', width: '100%', margin: '20px 0' }}>
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