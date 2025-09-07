"use client";
import { useState, useEffect } from "react";
import { FaMapMarkerAlt, FaWheelchair, FaExclamationTriangle, FaTimes, FaFilter } from "react-icons/fa";
import dynamic from "next/dynamic";

const MapComponent = dynamic(() => import("../components/Map"), { ssr: false });

interface Report {
  id: number;
  title: string;
  description: string;
  type: string;
  lat: number;
  lng: number;
}

export default function MapPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [filter, setFilter] = useState("all");
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);

  useEffect(() => {
    async function fetchReports() {
      try {
        const res = await fetch("/api/reports");
        const data = await res.json();
        if (data.success) {
          setReports(data.data); // от Supabase
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
    if (filter === "obstacle") return r.type !== "safe"; // всичко освен "safe"
    if (filter === "safe") return r.type === "safe";
    return true;
  });

  return (
    <div className="relative flex flex-col md:flex-row h-screen pt-16">
      {/* Map Area */}
      {/* <div className="flex-1 bg-gray-200 dark:bg-gray-800 flex items-center justify-center p-4">
        <div className="text-center p-8 rounded-lg shadow-lg backdrop-blur-sm bg-white/50 dark:bg-black/50 border border-border">
          <h3 className="text-3xl font-bold font-sofia text-foreground">Интерактивна карта</h3>
          <p className="text-muted-foreground mt-2">Тук ще бъде интегрирана картата.</p>
          <p className="text-sm mt-4 text-muted-foreground/80">
            (Показва {filteredReports.length} сигнала според филтъра)
          </p>
        </div>
      </div> */}
      <MapComponent />

      {/* Filter Panel (Desktop View) */}
      <div className="hidden md:block w-1/3 lg:w-1/4 bg-background border-l border-border p-6 overflow-y-auto">
        <h2 className="text-2xl font-bold font-sofia mb-4">Филтри</h2>
        <div className="grid grid-cols-1 gap-4">
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
          <h3 className="text-xl font-bold font-sofia mb-4">Докладвани проблеми</h3>
          <ul className="space-y-4">
            {filteredReports.map((r) => (
              <li
                key={r.id}
                className={`p-4 rounded-xl shadow-sm transition-all duration-200 hover:scale-[1.02] cursor-pointer border
                  ${r.type === "safe"
                    ? "bg-green-500/10 border-green-500"
                    : "bg-red-500/10 border-red-500"}`}
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
