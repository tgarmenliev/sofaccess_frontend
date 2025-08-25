"use client"
import { useState } from 'react';

// Mock data for map markers
const markers = [
  { id: 1, type: 'obstacle', position: { lat: 42.6977, lng: 23.3219 }, title: 'Broken Sidewalk', description: 'Large cracks near the National Palace of Culture.' },
  { id: 2, type: 'obstacle', position: { lat: 42.695, lng: 23.325 }, title: 'Stairs, No Ramp', description: 'Access to Vitosha Blvd from a side street.' },
  { id: 3, type: 'safe', position: { lat: 42.700, lng: 23.330 }, title: 'Accessible Ramp', description: 'Newly installed ramp at Serdika Metro Station.' },
  { id: 4, type: 'obstacle', position: { lat: 42.698, lng: 23.318 }, title: 'Broken Elevator', description: 'Elevator at the underpass is out of order.' },
];

export default function MapPage() {
    const [filter, setFilter] = useState('all');

    const filteredMarkers = markers.filter(marker => {
        if (filter === 'all') return true;
        return marker.type === filter;
    });

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-4rem)]">
      {/* Filter Panel */}
      <div className="w-full md:w-1/4 bg-lightgray p-4 overflow-y-auto">
        <h2 className="text-2xl font-bold font-sofia mb-4">Filters</h2>
        <div className="space-y-2">
            <button onClick={() => setFilter('all')} className={`w-full text-left p-2 rounded-md ${filter === 'all' ? 'bg-primary text-white' : 'hover:bg-gray-200'}`}>All</button>
            <button onClick={() => setFilter('obstacle')} className={`w-full text-left p-2 rounded-md ${filter === 'obstacle' ? 'bg-red-500 text-white' : 'hover:bg-gray-200'}`}>Obstacles</button>
            <button onClick={() => setFilter('safe')} className={`w-full text-left p-2 rounded-md ${filter === 'safe' ? 'bg-green-500 text-white' : 'hover:bg-gray-200'}`}>Safe Routes</button>
        </div>
        <div className="mt-6">
            <h3 className="text-xl font-bold font-sofia mb-2">Reported Issues</h3>
            <ul>
                {filteredMarkers.map(marker => (
                    <li key={marker.id} className={`p-2 my-1 rounded-md ${marker.type === 'obstacle' ? 'bg-red-100' : 'bg-green-100'}`}>
                        <p className="font-bold">{marker.title}</p>
                        <p className="text-sm text-gray-600">{marker.description}</p>
                    </li>
                ))}
            </ul>
        </div>
      </div>

      {/* Map Area */}
      <div className="w-full md:w-3/4 bg-gray-300 flex items-center justify-center">
         {/* This would be your interactive map component, e.g., Google Maps, Leaflet, or Mapbox */}
         <div className="text-center p-8 bg-white rounded-lg shadow-lg">
            <h3 className="text-3xl font-bold font-sofia">Interactive Map</h3>
            <p className="text-gray-600 mt-2">Map integration would go here.</p>
            <p className="text-sm mt-4 text-gray-500">(Showing {filteredMarkers.length} markers based on filter)</p>
         </div>
      </div>
    </div>
  );
}