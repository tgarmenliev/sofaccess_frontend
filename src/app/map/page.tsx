"use client"
import { useState } from 'react';
import { FaMapMarkerAlt, FaWheelchair, FaExclamationTriangle, FaTimes, FaFilter } from "react-icons/fa";

// Mock data for map markers
const markers = [
  { id: 1, type: 'obstacle', position: { lat: 42.6977, lng: 23.3219 }, title: 'Счупен тротоар', description: 'Големи пукнатини до Националния дворец на културата.' },
  { id: 2, type: 'obstacle', position: { lat: 42.695, lng: 23.325 }, title: 'Стълби, без рампа', description: 'Достъп до бул. Витоша от странична улица.' },
  { id: 3, type: 'safe', position: { lat: 42.700, lng: 23.330 }, title: 'Достъпна рампа', description: 'Новоинсталирана рампа на метростанция Сердика.' },
  { id: 4, type: 'obstacle', position: { lat: 42.698, lng: 23.318 }, title: 'Счупен асансьор', description: 'Асансьорът в подлеза е извън строя.' },
];

export default function MapPage() {
    const [filter, setFilter] = useState('all');
    const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);

    const filteredMarkers = markers.filter(marker => {
        if (filter === 'all') return true;
        return marker.type === filter;
    });

  return (
    <div className="relative flex flex-col md:flex-row h-screen pt-16">
      {/* Map Area */}
      <div className="flex-1 bg-gray-200 dark:bg-gray-800 flex items-center justify-center p-4">
         <div className="text-center p-8 rounded-lg shadow-lg backdrop-blur-sm bg-white/50 dark:bg-black/50 border border-border">
            <h3 className="text-3xl font-bold font-sofia text-foreground">Интерактивна карта</h3>
            <p className="text-muted-foreground mt-2">Тук ще бъде интегрирана картата.</p>
            <p className="text-sm mt-4 text-muted-foreground/80">(Показва {filteredMarkers.length} маркера според филтъра)</p>
         </div>
      </div>

      {/* Filter Panel (Desktop View) */}
      <div className="hidden md:block w-1/3 lg:w-1/4 bg-background border-l border-border p-6 overflow-y-auto">
        <h2 className="text-2xl font-bold font-sofia mb-4">Филтри</h2>
        <div className="grid grid-cols-1 gap-4">
            <button 
                onClick={() => setFilter('all')} 
                className={`flex items-center justify-center p-3 rounded-full font-semibold transition-all duration-300 shadow-sm
                    ${filter === 'all' 
                        ? 'bg-gray-300 dark:bg-gray-700 text-foreground' 
                        : 'bg-muted text-muted-foreground hover:bg-muted-foreground/10'}`}
            >
                <FaMapMarkerAlt className="mr-2" />
                Всички
            </button>
            <button 
                onClick={() => setFilter('obstacle')} 
                className={`flex items-center justify-center p-3 rounded-full font-semibold transition-all duration-300 shadow-sm
                    ${filter === 'obstacle' 
                        ? 'bg-red-500 text-white' 
                        : 'bg-muted text-muted-foreground hover:bg-muted-foreground/10'}`}
            >
                <FaExclamationTriangle className="mr-2" />
                Препятствия
            </button>
            <button 
                onClick={() => setFilter('safe')} 
                className={`flex items-center justify-center p-3 rounded-full font-semibold transition-all duration-300 shadow-sm
                    ${filter === 'safe' 
                        ? 'bg-green-500 text-white' 
                        : 'bg-muted text-muted-foreground hover:bg-muted-foreground/10'}`}
            >
                <FaWheelchair className="mr-2" />
                Достъпни маршрути
            </button>
        </div>
        <div className="mt-8">
            <h3 className="text-xl font-bold font-sofia mb-4">Докладвани проблеми</h3>
            <ul className="space-y-4">
                {filteredMarkers.map(marker => (
                    <li key={marker.id} className={`p-4 rounded-xl shadow-sm transition-all duration-200 hover:scale-[1.02] cursor-pointer border
                        ${marker.type === 'obstacle' 
                            ? 'bg-red-500/10 border-red-500' 
                            : 'bg-green-500/10 border-green-500'}`}
                    >
                        <p className="font-bold text-foreground">{marker.title}</p>
                        <p className="text-sm text-muted-foreground mt-1">{marker.description}</p>
                    </li>
                ))}
            </ul>
        </div>
      </div>

      {/* Mobile Filter Button */}
      <div className="md:hidden fixed bottom-4 right-4 z-40">
        <button 
          onClick={() => setIsFilterPanelOpen(true)}
          className="p-4 rounded-full bg-primary text-white shadow-lg transition-transform hover:scale-110"
        >
          <FaFilter size={24} />
        </button>
      </div>

      {/* Mobile Filter Panel (Bottom Sheet) */}
      <div className={`fixed bottom-0 left-0 w-full bg-white dark:bg-black z-50 p-6 transition-transform duration-500 ease-in-out
        ${isFilterPanelOpen ? 'translate-y-0' : 'translate-y-full'}`}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold font-sofia">Филтри и проблеми</h2>
          <button 
            onClick={() => setIsFilterPanelOpen(false)}
            className="p-2 rounded-full text-foreground hover:bg-muted-foreground/10 transition-colors"
          >
            <FaTimes size={24} />
          </button>
        </div>
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4">
            <button 
                onClick={() => {setFilter('all'); setIsFilterPanelOpen(false);}}
                className={`flex items-center justify-center p-3 rounded-full font-semibold transition-all duration-300 shadow-sm
                    ${filter === 'all' 
                        ? 'bg-gray-300 dark:bg-gray-700 text-foreground' 
                        : 'bg-muted text-muted-foreground hover:bg-muted-foreground/10'}`}
            >
                <FaMapMarkerAlt className="mr-2" />
                Всички
            </button>
            <button 
                onClick={() => {setFilter('obstacle'); setIsFilterPanelOpen(false);}} 
                className={`flex items-center justify-center p-3 rounded-full font-semibold transition-all duration-300 shadow-sm
                    ${filter === 'obstacle' 
                        ? 'bg-red-500 text-white' 
                        : 'bg-muted text-muted-foreground hover:bg-muted-foreground/10'}`}
            >
                <FaExclamationTriangle className="mr-2" />
                Препятствия
            </button>
            <button 
                onClick={() => {setFilter('safe'); setIsFilterPanelOpen(false);}} 
                className={`flex items-center justify-center p-3 rounded-full font-semibold transition-all duration-300 shadow-sm
                    ${filter === 'safe' 
                        ? 'bg-green-500 text-white' 
                        : 'bg-muted text-muted-foreground hover:bg-muted-foreground/10'}`}
            >
                <FaWheelchair className="mr-2" />
                Достъпни маршрути
            </button>
          </div>
          <div className="mt-8">
            <h3 className="text-xl font-bold font-sofia mb-4">Докладвани проблеми</h3>
            <ul className="space-y-4 max-h-[30vh] overflow-y-auto">
                {filteredMarkers.map(marker => (
                    <li key={marker.id} className={`p-4 rounded-xl shadow-sm transition-all duration-200 hover:scale-[1.02] cursor-pointer border
                        ${marker.type === 'obstacle' 
                            ? 'bg-red-500/10 border-red-500' 
                            : 'bg-green-500/10 border-green-500'}`}
                    >
                        <p className="font-bold text-foreground">{marker.title}</p>
                        <p className="text-sm text-muted-foreground mt-1">{marker.description}</p>
                    </li>
                ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}