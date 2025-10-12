"use client";
import { useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L, { LatLng } from "leaflet";
import "leaflet/dist/leaflet.css";
import { FaCheck, FaTimes } from "react-icons/fa";

const defaultIcon = L.icon({
    iconUrl: "/marker-icon.png",
    shadowUrl: "/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = defaultIcon;

interface LocationPickerMapProps {
  onClose: () => void;
  onLocationSelect: (coords: { lat: number, lng: number }, address: string) => void;
}

// Component to handle map events
function MapEvents({ setMarkerPosition }: { 
    setMarkerPosition: (position: LatLng) => void 
}) {
  useMapEvents({
    click(e) {
      setMarkerPosition(e.latlng); // Move the marker to the clicked position
    },
  });
  return null;
}

export default function LocationPickerMap({ onClose, onLocationSelect }: LocationPickerMapProps) {
  const [markerPosition, setMarkerPosition] = useState<LatLng | null>(null);
  const [address, setAddress] = useState("Кликнете върху картата, за да изберете място...");
  const [isLoadingAddress, setIsLoadingAddress] = useState(false);

  const getAddressFromCoords = async (coords: LatLng) => {
    setIsLoadingAddress(true);
    setAddress("Търсене на адрес...");
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${coords.lat}&lon=${coords.lng}&addressdetails=1&zoom=18&accept-language=bg`);
      const data = await res.json();
      
      if (data && data.display_name) {
        const parts = data.display_name.split(',').slice(0, 3);
        setAddress(parts.join(', '));
      } else {
        setAddress("Не е намерен адрес за тази локация.");
      }
    } catch (error) {
      setAddress("Грешка при търсене на адрес.");
    } finally {
      setIsLoadingAddress(false);
    }
  };
  
  const handleConfirm = () => {
    if (markerPosition) {
      onLocationSelect({ lat: markerPosition.lat, lng: markerPosition.lng }, address);
    }
  };

  const handleSetPosition = (position: LatLng) => {
    setMarkerPosition(position);
    getAddressFromCoords(position);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex flex-col animate-fade-in-up">
      <div className="bg-background/80 backdrop-blur-lg p-4 text-center text-foreground shadow-md">
        <h3 className="font-semibold">Избор на местоположение</h3>
        <p className="text-sm text-muted-foreground h-5">{address}</p>
      </div>

      <MapContainer center={[42.6977, 23.3219]} zoom={13} className="flex-grow">
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <MapEvents setMarkerPosition={handleSetPosition} />
        {markerPosition && <Marker position={markerPosition} />}
      </MapContainer>

      <div className="p-4 bg-background/80 backdrop-blur-lg flex justify-center gap-4 shadow-up">
        <button onClick={onClose} className="flex items-center gap-2 px-6 py-3 bg-red-600/80 text-white rounded-full font-semibold shadow-lg hover:bg-red-700 transition">
          <FaTimes /> Отказ
        </button>
        <button 
          onClick={handleConfirm}
          disabled={!markerPosition || isLoadingAddress}
          className="flex items-center gap-2 px-6 py-3 bg-primary/80 text-white rounded-full font-semibold shadow-lg hover:bg-primary transition disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          <FaCheck /> Готово
        </button>
      </div>
    </div>
  );
}