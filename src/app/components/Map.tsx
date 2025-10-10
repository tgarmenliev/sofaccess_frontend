// components/Map.tsx

"use client";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L, { LatLng } from "leaflet";
import { useEffect, useRef, useState } from "react";
import { Report } from "../map/page";

const problemIcon = new L.DivIcon({
  html: `<div style="width: 16px; height: 16px; background-color: #ef4444; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 5px rgba(0,0,0,0.5);"></div>`,
  className: "",
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

const safeIcon = new L.DivIcon({
  html: `<div style="width: 16px; height: 16px; background-color: #22c55e; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 5px rgba(0,0,0,0.5);"></div>`,
  className: "",
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

const userLocationIcon = new L.DivIcon({
  html: `<div style="position: relative; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center;">
           <div style="position: absolute; width: 24px; height: 24px; border-radius: 50%; background-color: #3b82f6; opacity: 0.3;"></div>
           <div style="position: relative; width: 12px; height: 12px; border-radius: 50%; background-color: #3b82f6; border: 2px solid white;"></div>
         </div>`,
  className: "",
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});


interface MapProps {
  reports: Report[];
  selectedReport: Report | null;
  onPopupClose: () => void;
}

export default function MapComponent({ reports, selectedReport, onPopupClose }: MapProps) {
  const markerRefs = useRef<{ [key: number]: L.Marker | null }>({});
  const mapRef = useRef<L.Map>(null);
  const [userPosition, setUserPosition] = useState<LatLng | null>(null);
  const hasCenteredOnUser = useRef(false);

  useEffect(() => {
    navigator.geolocation?.getCurrentPosition(
      (pos) => {
        const newPos = new LatLng(pos.coords.latitude, pos.coords.longitude);
        setUserPosition(newPos);
        
        if (mapRef.current && !hasCenteredOnUser.current) {
          mapRef.current.flyTo(newPos, 15);
          hasCenteredOnUser.current = true;
        }
      },
      (err) => console.error("Geolocation error:", err),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }, []);

  useEffect(() => {
    if (selectedReport && mapRef.current) {
      const marker = markerRefs.current[selectedReport.id];
      if (marker) {
        mapRef.current.flyTo(marker.getLatLng(), 16, { animate: true, duration: 1 });
        marker.openPopup();
      }
    }
  }, [selectedReport]);


  return (
    <MapContainer center={[42.6977, 23.3219]} zoom={13} className="h-full w-full" ref={mapRef}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; OpenStreetMap' />
      
      {reports.map((report) => (
        <Marker key={report.id} position={[report.lat, report.lng]}
          ref={(el) => { markerRefs.current[report.id] = el; }}
          icon={report.type === 'safe' ? safeIcon : problemIcon}
          eventHandlers={{
            // Add a click event handler to each marker
            click: (e) => {
              mapRef.current?.flyTo(e.latlng, 16);
            },
            popupclose: onPopupClose,
          }}
        >
          <Popup>
            <div className="font-sans">
              <h3 className="font-bold text-lg mb-1">{report.title}</h3>
              <p className="text-base mb-2">{report.description}</p>
              <p className="text-sm text-gray-500 capitalize border-t pt-1">
                Тип: <strong>{report.type}</strong>
              </p>
            </div>
          </Popup>
        </Marker>
      ))}

      {userPosition && (
        <Marker position={userPosition} icon={userLocationIcon}>
          <Popup>Ти си тук 📍</Popup>
        </Marker>
      )}
    </MapContainer>
  );
}