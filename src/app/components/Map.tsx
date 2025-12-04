"use client";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L, { LatLng, LatLngExpression } from "leaflet";
import { useEffect, useRef, useState, useImperativeHandle, forwardRef } from "react";
import type { Report } from "../map/page";
import { FaLocationArrow } from "react-icons/fa";

interface MapProps {
  reports: Report[];
  selectedReport: Report | null;
  onPopupClose: () => void;
  onGeolocationError: (message: string) => void;
  onMarkerClick?: (report: Report) => void;
}

export interface MapComponentHandle {
  centerOnUser: () => void;
}

const highlightIcon = new L.DivIcon({
  html: `<div style="width: 24px; height: 24px; background-color: #f97316; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 15px rgba(249, 115, 22, 0.8); z-index: 1000;"></div>`,
  className: "",
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

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

const MapComponent = forwardRef<MapComponentHandle, MapProps>(
  ({ reports, selectedReport, onPopupClose, onGeolocationError, onMarkerClick }, ref) => {
    const markerRefs = useRef<{ [key: number]: L.Marker | null }>({});
    const mapRef = useRef<L.Map>(null);
    const [userPosition, setUserPosition] = useState<LatLng | null>(null);
    const hasCenteredOnUser = useRef(false);

    const initialCenter: LatLngExpression = selectedReport 
      ? [selectedReport.lat, selectedReport.lng] 
      : [42.6977, 23.3219];
    
    const initialZoom = selectedReport ? 17 : 13;

    const centerOnUser = () => {
      if (userPosition && mapRef.current) {
        mapRef.current.flyTo(userPosition, 17);
        return;
      }
      
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const newPos = new LatLng(pos.coords.latitude, pos.coords.longitude);
            setUserPosition(newPos);
            if (mapRef.current) {
              mapRef.current.flyTo(newPos, 17);
            }
          },
          (err) => {
            if (err.code === err.PERMISSION_DENIED) {
              onGeolocationError("Достъпът до местоположението е отказан. Моля, разрешете го от настройките на браузъра.");
            } else {
              onGeolocationError("Неуспешно зареждане на местоположението.");
            }
          }
        );
      } else {
        onGeolocationError("Геолокацията не се поддържа от този браузър.");
      }
    };

    useImperativeHandle(ref, () => ({
      centerOnUser,
    }));

    useEffect(() => {
      navigator.geolocation?.getCurrentPosition(
        (pos) => {
          const newPos = new LatLng(pos.coords.latitude, pos.coords.longitude);
          setUserPosition(newPos);
          
          if (mapRef.current && !hasCenteredOnUser.current && !selectedReport) {
            mapRef.current.flyTo(newPos, 17);
            hasCenteredOnUser.current = true;
          }
        },
        (err) => {
          console.error("Silent geolocation error on initial load:", err.message);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    }, []);

    useEffect(() => {
      if (selectedReport && mapRef.current) {
        const map = mapRef.current;
        const marker = markerRefs.current[selectedReport.id];
        const targetZoom = 17;

        if (marker) {
            const latLng = marker.getLatLng();
            const targetPoint = map.project(latLng, targetZoom);
            const offset = 150; 
            const newCenterPoint = L.point(targetPoint.x, targetPoint.y - offset);
            const newCenterLatLng = map.unproject(newCenterPoint, targetZoom);
            map.flyTo(newCenterLatLng, targetZoom, { animate: true, duration: 1 });
            marker.openPopup();
        } else {
            map.flyTo([selectedReport.lat, selectedReport.lng], targetZoom, { animate: true, duration: 1 });
        }
      }
    }, [selectedReport]);

    return (
      <MapContainer 
        center={initialCenter} 
        zoom={initialZoom} 
        className="h-full w-full" 
        ref={mapRef} 
        zoomControl={false}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; OpenStreetMap' />
        
        {reports.map((report) => {
            let icon = problemIcon;

            if (selectedReport && report.id === selectedReport.id) {
                icon = highlightIcon;
            } 
            else if (report.type === 'safe' || report.type === 'Разрешен' || report.type === 'Разрешен сигнал') {
                icon = safeIcon;
            }

            return (
              <Marker
                key={report.id}
                position={[report.lat, report.lng]}
                ref={(el) => { markerRefs.current[report.id] = el; }}
                icon={icon}
                zIndexOffset={selectedReport && report.id === selectedReport.id ? 1000 : 0}
                eventHandlers={{
                  click: (e) => {
                    const map = mapRef.current;
                    if (map) {
                        const targetZoom = 17;
                        const targetPoint = map.project(e.latlng, targetZoom);
                        const offset = 150; 
                        const newCenterPoint = L.point(targetPoint.x, targetPoint.y - offset);
                        const newCenterLatLng = map.unproject(newCenterPoint, targetZoom);
                        map.flyTo(newCenterLatLng, targetZoom, { animate: true, duration: 1 });
                    }
                    if (onMarkerClick) {
                        onMarkerClick(report);
                    }
                  },
                  popupclose: onPopupClose,
                }}
              >
                <Popup>
                  <div className="font-sans w-60">
                    {report.image_url && (
                      <div className="mb-3 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                        <img 
                          src={report.image_url} 
                          alt="Снимка на проблема" 
                          className="w-full h-32 object-cover"
                        />
                      </div>
                    )}
                    <h3 className="font-bold text-lg mb-1 leading-tight">{report.title}</h3>
                    <p className="text-base mb-2 text-gray-700">{report.description}</p>
                    <p className="text-sm text-gray-500 capitalize border-t pt-2 mt-2">
                      Тип: <strong className="text-gray-800">{report.type}</strong>
                    </p>
                  </div>
                </Popup>
              </Marker>
            );
        })}

        {userPosition && (
          <Marker position={userPosition} icon={userLocationIcon}>
            <Popup>Ти си тук 📍</Popup>
          </Marker>
        )}

        <div className="absolute bottom-5 right-5 z-[1000] hidden md:block">
          <button
            onClick={centerOnUser}
            className="flex items-center gap-2 backdrop-blur-lg bg-white/80 dark:bg-black/80 border border-white/30 dark:border-black/30 text-foreground px-4 py-2 rounded-lg shadow-lg hover:scale-105 transition-transform"
          >
            <FaLocationArrow />
            Моята локация
          </button>
        </div>
      </MapContainer>
    );
  }
);

MapComponent.displayName = 'MapComponent';
export default MapComponent;