import { useState, useRef, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import toast from 'react-hot-toast';

// Fix for default marker icon missing in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// A component to handle map clicks and marker dragging
const LocationMarker = ({ position, setPosition, onLocationFound }) => {
    const markerRef = useRef(null);

    const map = useMapEvents({
        click(e) {
            setPosition(e.latlng);
            onLocationFound(e.latlng);
            map.flyTo(e.latlng, map.getZoom());
        },
        locationfound(e) {
            setPosition(e.latlng);
            onLocationFound(e.latlng);
            map.flyTo(e.latlng, map.getZoom());
        },
    });

    const eventHandlers = useMemo(
        () => ({
            dragend() {
                const marker = markerRef.current;
                if (marker != null) {
                    const newPos = marker.getLatLng();
                    setPosition(newPos);
                    onLocationFound(newPos);
                }
            },
        }),
        [setPosition, onLocationFound],
    );

    return position === null ? null : (
        <Marker
            draggable={true}
            eventHandlers={eventHandlers}
            position={position}
            ref={markerRef}
        >
            <Popup minWidth={90}>
                <span className="font-bold text-sm">Delivery Location</span><br />
                <span className="text-xs text-gray-500">Drag me to adjust.</span>
            </Popup>
        </Marker>
    );
};

const LocationMapPicker = ({ onAddressSelect }) => {
    // Default to somewhere central if browser location fails (e.g., center of India)
    const defaultCenter = { lat: 20.5937, lng: 78.9629 };
    const [position, setPosition] = useState(defaultCenter);
    const [loadingAddress, setLoadingAddress] = useState(false);
    const mapRef = useRef(null);

    // Initialize map and try to get user's current location once
    const handleMapLoad = (mapInstance) => {
        mapRef.current = mapInstance;
        if (navigator.geolocation) {
            toast.loading("Finding your location...", { id: 'geoToast' });
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    const currentObj = { lat: pos.coords.latitude, lng: pos.coords.longitude };
                    mapInstance.flyTo(currentObj, 16); // Zoom in on the user
                    setPosition(currentObj);
                    handleLocationFound(currentObj);
                    toast.success("Location found!", { id: 'geoToast' });
                },
                (err) => {
                    console.log("Geolocation error:", err);
                    toast.dismiss('geoToast');
                    // Fallback to manual selection
                    toast.error("Could not get your location. Please click on the map.", { icon: '📍' });
                },
                { timeout: 10000, enableHighAccuracy: true }
            );
        }
    };


    const handleLocationFound = async (latlng) => {
        setLoadingAddress(true);
        try {
            // Reverse Geocoding using Nominatim (OpenStreetMap)
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latlng.lat}&lon=${latlng.lng}`
            );
            const data = await response.json();

            if (data && data.address) {
                // Create a structured object to pass back to the Address form
                const addressData = {
                    lat: latlng.lat,
                    lng: latlng.lng,
                    street: data.address.road || data.address.neighbourhood || data.address.suburb || data.display_name.split(',')[0],
                    city: data.address.city || data.address.town || data.address.county || '',
                    state: data.address.state || '',
                    landmark: data.address.amenity || data.address.building || '',
                    raw: data.display_name
                };
                onAddressSelect(addressData);
            } else {
                toast.error("Could not fetch address details for this location.");
            }
        } catch (error) {
            console.error("Reverse Geocoding error:", error);
            toast.error("Network error while trying to fetch address details.");
        } finally {
            setLoadingAddress(false);
        }
    };

    return (
        <div className="flex flex-col h-full w-full rounded-xl overflow-hidden border border-gray-200 relative group animate-fade-in">

            {/* Instruction Overlay */}
            <div className="absolute top-4 right-4 z-[400] bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg border border-gray-100 flex items-center gap-2 pointer-events-none transition-opacity opacity-100 group-hover:opacity-20">
                <svg className="w-5 h-5 text-indigo-500 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                </svg>
                <span className="text-xs font-bold text-gray-700">Drag pin or click to set location</span>
            </div>

            {loadingAddress && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-indigo-100 z-[500] overflow-hidden">
                    <div className="h-full bg-indigo-600 animate-pulse w-full"></div>
                </div>
            )}

            <MapContainer
                center={defaultCenter}
                zoom={4}
                scrollWheelZoom={true}
                className="w-full h-80 md:h-[400px] z-10"
                ref={handleMapLoad}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <LocationMarker position={position} setPosition={setPosition} onLocationFound={handleLocationFound} />
            </MapContainer>
        </div>
    );
};

export default LocationMapPicker;
