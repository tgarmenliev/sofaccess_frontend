"use client";
import { useState, useRef, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import L, { LatLng } from "leaflet";
import "leaflet/dist/leaflet.css";
import toast, { Toaster } from 'react-hot-toast';
import { FaCheck, FaTimes, FaLocationArrow, FaExclamationTriangle } from "react-icons/fa";

const defaultIcon = L.icon({
    iconUrl: "/marker-icon.png",
    shadowUrl: "/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = defaultIcon;

const userLocationIcon = new L.DivIcon({
  html: `<div style="position: relative; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center;">
           <div style="position: absolute; width: 24px; height: 24px; border-radius: 50%; background-color: #3b82f6; opacity: 0.3;"></div>
           <div style="position: relative; width: 12px; height: 12px; border-radius: 50%; background-color: #3b82f6; border: 2px solid white;"></div>
         </div>`,
  className: "",
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});


const SOFIA_BOUNDING_BOX = {
  minLat: 42.63,
  maxLat: 42.75,
  minLng: 23.20,
  maxLng: 23.45,
};

const isWithinSofia = (lat: number, lng: number): boolean => {
  return (
    lat >= SOFIA_BOUNDING_BOX.minLat &&
    lat <= SOFIA_BOUNDING_BOX.maxLat &&
    lng >= SOFIA_BOUNDING_BOX.minLng &&
    lng <= SOFIA_BOUNDING_BOX.maxLng
  );
};

interface LocationPickerMapProps {
  onClose: () => void;
  onLocationSelect: (coords: { lat: number, lng: number }, address: string) => void;
}

// Component to handle map click events
function MapEvents({ onMapClick }: { onMapClick: (position: LatLng) => void }) {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng);
    },
  });
  return null;
}

// Component for centering the map on user's location
function CenterOnUserButton({ onGeolocationError }: { onGeolocationError: (message: string) => void }) {
  const map = useMap();
  const buttonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (buttonRef.current) {
      L.DomEvent.disableClickPropagation(buttonRef.current);
    }
  }, []);

  const handleCenter = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        if (!isWithinSofia(latitude, longitude)) {
          onGeolocationError("Вашето местоположение е извън София.");
          return;
        }
        map.flyTo([latitude, longitude], 16);
      },
      (err) => {
        if (err.code === err.PERMISSION_DENIED) {
          onGeolocationError("Достъпът до местоположението е отказан.");
        } else {
          onGeolocationError("Неуспешно зареждане на местоположението.");
        }
      }
    );
  };

  return (
    <div ref={buttonRef} className="absolute bottom-5 right-5 z-[1000]">
       <button
          onClick={handleCenter}
          className="backdrop-blur-lg bg-white/50 dark:bg-black/50 border border-white/30 dark:border-black/30 text-foreground p-3 rounded-full shadow-lg hover:scale-110 transition-transform"
          title="Намери ме"
        >
          <FaLocationArrow size={20} />
        </button>
    </div>
  );
}

export default function LocationPickerMap({ onClose, onLocationSelect }: LocationPickerMapProps) {
  const [markerPosition, setMarkerPosition] = useState<LatLng | null>(null);
  const [currentUserPosition, setCurrentUserPosition] = useState<LatLng | null>(null);
  const [address, setAddress] = useState("Кликнете върху картата, за да изберете място...");
  const [isLoadingAddress, setIsLoadingAddress] = useState(false);

  useEffect(() => {
    navigator.geolocation?.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        if (isWithinSofia(latitude, longitude)) {
          setCurrentUserPosition(new LatLng(latitude, longitude));
        }
      },
      (err) => {
        console.warn("Geolocation not available on map load:", err.message);
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 60000 }
    );
  }, []);

  const handleToastError = (message: string) => {
    toast.custom((t) => (
      <div
        className={`${
          t.visible ? 'animate-slide-in-down' : 'animate-leave'
        } relative max-w-md w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg pointer-events-auto ring-1 ring-black dark:ring-gray-700 ring-opacity-5 overflow-hidden`}
      >
        <div className="p-4 flex items-start">
          <div className="flex-shrink-0">
            <FaExclamationTriangle className="h-6 w-6 text-yellow-500" />
          </div>
          <div className="ml-3 flex-1">
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Предупреждение</p>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{message}</p>
          </div>
        </div>
        <div className="h-1 bg-yellow-400 absolute bottom-0 left-0" style={{ animation: `shrink 4s linear forwards` }}></div>
      </div>
    ), { duration: 4000 });
  };

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
    } catch (err) {
      console.error("Error fetching address:", err);
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

  const handleMapClick = (position: LatLng) => {
    if (isWithinSofia(position.lat, position.lng)) {
      setMarkerPosition(position);
      getAddressFromCoords(position);
    } else {
      handleToastError("Избраното място е извън София. Моля, изберете точка в рамките на града.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex flex-col animate-fade-in-up">
      <Toaster position="top-center" containerClassName="pt-4" />
      
      <div className="bg-gray-100/80 dark:bg-gray-900/80 backdrop-blur-lg p-4 text-center text-foreground shadow-md border-b border-gray-200/50 dark:border-gray-700/50">
        <h3 className="font-semibold">Избор на местоположение</h3>
        <p className="text-sm text-muted-foreground h-5">{address}</p>
      </div>

      <MapContainer center={[42.6977, 23.3219]} zoom={13} className="flex-grow" zoomControl={false}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <MapEvents onMapClick={handleMapClick} />
        
        {markerPosition && <Marker position={markerPosition} />}

        {currentUserPosition && (
          <Marker position={currentUserPosition} icon={userLocationIcon} />
        )}

        <CenterOnUserButton onGeolocationError={handleToastError} />
      </MapContainer>

      <div className="p-4 bg-gray-100/80 dark:bg-gray-900/80 backdrop-blur-lg flex justify-center gap-4 shadow-up border-t border-gray-200/50 dark:border-gray-700/50">
        <button onClick={onClose} className="flex items-center gap-2 px-6 py-3 bg-red-600/80 text-white rounded-full font-semibold shadow-lg hover:bg-red-700 transition">
          <FaTimes /> Отказ
        </button>
        <button 
          onClick={handleConfirm}
          disabled={!markerPosition || isLoadingAddress}
          className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-full font-semibold shadow-lg hover:bg-green-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          <FaCheck /> Готово
        </button>
      </div>
    </div>
  );
}