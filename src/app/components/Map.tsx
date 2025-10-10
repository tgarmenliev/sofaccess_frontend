// components/Map.tsx

"use client";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect, useRef } from "react";
import { Report } from "../map/page";

// 🔄 ПРОМЯНА: Премахваме стандартната икона, ще създадем наша.
// const DefaultIcon = L.icon({ ... });
// L.Marker.prototype.options.icon = DefaultIcon;

// ✨ НОВО: Създаваме къстъм икона за проблемите (червена точка)
const problemIcon = new L.DivIcon({
  html: `<span class="flex h-4 w-4">
           <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
           <span class="relative inline-flex rounded-full h-4 w-4 bg-red-500 border-2 border-white"></span>
         </span>`,
  className: "", // Tailwind класовете са в HTML-a
  iconSize: [16, 16],
  iconAnchor: [8, 8], // Центрираме иконата
});

// ✨ НОВО: Икона за "достъпни" места (зелена точка) - за бъдеща употреба
const safeIcon = new L.DivIcon({
    html: `<span class="relative flex h-4 w-4">
            <span class="relative inline-flex rounded-full h-4 w-4 bg-green-500 border-2 border-white"></span>
           </span>`,
    className: "",
    iconSize: [16, 16],
    iconAnchor: [8, 8],
});


// ✨ НОВО: Пропс за компонента
interface MapProps {
  reports: Report[];
  selectedReport: Report | null;
  onPopupClose: () => void;
}

export default function MapComponent({ reports, selectedReport, onPopupClose }: MapProps) {
  // ✨ НОВО: Създаваме референции към маркерите, за да можем да ги управляваме (напр. да отворим popup)
  const markerRefs = useRef<{ [key: number]: L.Marker | null }>({});
  const mapRef = useRef<L.Map>(null);

  // ✨ НОВО: useEffect, който се задейства, когато се избере репорт от списъка
  useEffect(() => {
    if (selectedReport && mapRef.current) {
      const marker = markerRefs.current[selectedReport.id];
      if (marker) {
        // Плавно преместване на картата до маркера
        mapRef.current.flyTo(marker.getLatLng(), 16, { // 16 е добро ниво на зуум
          animate: true,
          duration: 1,
        });
        // Отваряме неговия popup
        marker.openPopup();
      }
    }
  }, [selectedReport]);


  return (
    // 🔄 ПРОМЯНА: Добавяме ref към MapContainer
    <MapContainer
      center={[42.6977, 23.3219]} // София център
      zoom={13}
      className="h-full w-full" // Заема цялото налично пространство
      ref={mapRef}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      
      {/* ✨ НОВО: Итерираме през всички сигнали и създаваме маркер за всеки */}
      {reports.map((report) => (
        <Marker
          key={report.id}
          position={[report.lat, report.lng]}
          // ✨ НОВО: ref, за да можем да достъпим маркера по-късно
          ref={(el) => { markerRefs.current[report.id] = el; }}
          // ✨ НОВО: Избираме икона според типа на сигнала
          icon={report.type === 'safe' ? safeIcon : problemIcon}
          eventHandlers={{
            popupclose: onPopupClose, // Когато popup се затвори ръчно, нулираме state-a
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
    </MapContainer>
  );
}