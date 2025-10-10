// app/map/page.tsx

"use client";
import { useState, useEffect } from "react";
import { FaMapMarkerAlt, FaWheelchair, FaExclamationTriangle } from "react-icons/fa";
import dynamic from "next/dynamic";

// ✨ НОВО: Преместваме интерфейса тук или в отделен types.ts файл, за да се ползва и в Map.tsx
export interface Report {
  id: number;
  title: string;
  description: string;
  type: string;
  lat: number;
  lng: number;
  image_url?: string; // Добавяме и снимката, може да потрябва
}

const MapComponent = dynamic(() => import("../components/Map"), { ssr: false });

export default function MapPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [filter, setFilter] = useState("all");
  // ✨ НОВО: State, който пази кой репорт е избран в момента.
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  useEffect(() => {
    async function fetchReports() {
      try {
        const res = await fetch("/api/reports");
        const data = await res.json();
        if (data.success) {
          setReports(data.data);
        } else {
          console.error("Error fetching reports:", data.error);
        }
      } catch (err) {
        console.error("Fetch failed:", err);
      }
    }
    fetchReports();
  }, []);

  const filteredReports = reports.filter((r) => {
    if (filter === "all") return true;
    // 🔄 ПРОМЯНА: Малка промяна в логиката - всичко, което не е 'safe' е 'obstacle'
    if (filter === "obstacle") return r.type !== "safe";
    if (filter === "safe") return r.type === "safe";
    return true;
  });

  // ✨ НОВО: Функция, която се извиква при затваряне на popup-а на картата
  const handlePopupClose = () => {
    setSelectedReport(null);
  };

  return (
    <div className="relative flex flex-col md:flex-row h-screen pt-16">
      {/* Map Area */}
      {/* 🔄 ПРОМЯНА: Предаваме данните към MapComponent */}
      <div className="flex-1">
        <MapComponent
          reports={filteredReports}
          selectedReport={selectedReport}
          onPopupClose={handlePopupClose}
        />
      </div>

      {/* Filter Panel (Desktop View) */}
      <div className="hidden md:block w-1/3 lg:w-1/4 bg-background border-l border-border p-6 overflow-y-auto">
        <h2 className="text-2xl font-bold font-sofia mb-4">Филтри</h2>
        <div className="grid grid-cols-1 gap-4">
          {/* ... бутоните за филтриране остават същите ... */}
          <button
             onClick={() => setFilter("all")}
             className={`flex items-center justify-center p-3 rounded-full font-semibold transition-all duration-300 shadow-sm
               ${filter === "all"
                 ? "bg-gray-300 dark:bg-gray-700 text-foreground"
                 : "bg-muted text-muted-foreground hover:bg-muted-foreground/10"}`}
           >
             <FaMapMarkerAlt className="mr-2" />
             Всички
           </button>
           <button
             onClick={() => setFilter("obstacle")}
             className={`flex items-center justify-center p-3 rounded-full font-semibold transition-all duration-300 shadow-sm
               ${filter === "obstacle"
                 ? "bg-red-500 text-white"
                 : "bg-muted text-muted-foreground hover:bg-muted-foreground/10"}`}
           >
             <FaExclamationTriangle className="mr-2" />
             Препятствия
           </button>
           <button
             onClick={() => setFilter("safe")}
             className={`flex items-center justify-center p-3 rounded-full font-semibold transition-all duration-300 shadow-sm
               ${filter === "safe"
                 ? "bg-green-500 text-white"
                 : "bg-muted text-muted-foreground hover:bg-muted-foreground/10"}`}
           >
             <FaWheelchair className="mr-2" />
             Достъпни маршрути
           </button>
        </div>
        <div className="mt-8">
          <h3 className="text-xl font-bold font-sofia mb-4">Докладвани проблеми ({filteredReports.length})</h3>
          <ul className="space-y-4">
            {filteredReports.map((r) => (
              <li
                key={r.id}
                // ✨ НОВО: При клик, задаваме този репорт като "избран"
                onClick={() => setSelectedReport(r)}
                className={`p-4 rounded-xl shadow-sm transition-all duration-200 hover:scale-[1.02] cursor-pointer border
                  ${r.type === "safe"
                    ? "bg-green-500/10 border-green-500"
                    : "bg-red-500/10 border-red-500"}
                  {/* ✨ НОВО: Добавяме стил за селектирания елемент */}
                  ${selectedReport?.id === r.id ? 'ring-2 ring-primary' : ''}`}
              >
                <p className="font-bold text-foreground">{r.title}</p>
                <p className="text-sm text-muted-foreground mt-1">{r.description}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}