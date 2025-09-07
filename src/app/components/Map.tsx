"use client";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect, useState } from "react";

// Fix за иконата (по подразбиране липсва в React Leaflet)
const DefaultIcon = L.icon({
  iconUrl: "/marker-icon.png",
  shadowUrl: "/marker-shadow.png",
});
L.Marker.prototype.options.icon = DefaultIcon;

export default function MapComponent() {
  const [position, setPosition] = useState<[number, number]>([42.6977, 23.3219]); // София център

  // Взимаме текущо местоположение
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setPosition([pos.coords.latitude, pos.coords.longitude]);
        },
        (err) => console.error("Грешка при геолокация:", err),
        { enableHighAccuracy: true }
      );
    }
  }, []);

  return (
    <MapContainer center={position} zoom={14} className="h-[80vh] w-full rounded-xl shadow-lg">
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      <Marker position={position}>
        <Popup>Тук се намираш 🎯</Popup>
      </Marker>
    </MapContainer>
  );
}