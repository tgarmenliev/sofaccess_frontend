// app/map/page.tsx

"use client";
import { useState, useEffect } from "react";
import { FaMapMarkerAlt, FaExclamationTriangle, FaListUl, FaCheckCircle } from "react-icons/fa";
import dynamic from "next/dynamic";

export interface Report {
  id: number;
  title: string;
  description: string;
  type: string;
  lat: number;
  lng: number;
  image_url?: string;
}

// This line is the key to fixing the errors.
// It tells Next.js to load the map component ONLY on the client-side.
const MapComponent = dynamic(() => import("../components/Map"), { 
  ssr: false 
});

export default function MapPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [filter, setFilter] = useState("all");
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [isMobileSheetOpen, setIsMobileSheetOpen] = useState(false);

  useEffect(() => {
    async function fetchReports() {
      try {
        const res = await fetch("/api/reports");
        const data = await res.json();
        if (data.success) { setReports(data.data); } 
        else { console.error("Error fetching reports:", data.error); }
      } catch (err) { console.error("Fetch failed:", err); }
    }
    fetchReports();
  }, []);

  const isResolvedType = (type: string) => type === 'safe' || type === 'Разрешен';

  const filteredReports = reports.filter((r) => {
    if (filter === "all") return true;
    if (filter === "resolved") return isResolvedType(r.type);
    if (filter === "obstacle") return !isResolvedType(r.type);
    return true;
  });

  const handlePopupClose = () => {
    setSelectedReport(null);
  };

  const handleMobileReportSelect = (report: Report) => {
    setSelectedReport(report);
    setIsMobileSheetOpen(false);
  };

  const ReportList = ({ onReportClick }: { onReportClick: (report: Report) => void }) => (
    <div className="mt-8">
      <h3 className="text-xl font-bold font-sofia mb-4">Докладвани проблеми ({filteredReports.length})</h3>
       {filteredReports.length === 0 ? (
        <p className="text-muted-foreground text-center py-4">Няма намерени сигнали.</p>
      ) : (
      <ul className="space-y-3">
        {filteredReports.map((r) => (
          <li key={r.id} onClick={() => onReportClick(r)}
            className={`p-4 rounded-xl shadow-sm transition-all duration-200 hover:scale-[1.02] cursor-pointer border ${
              isResolvedType(r.type) ? "bg-green-500/10 border-green-500" : "bg-red-500/10 border-red-500"
            } ${selectedReport?.id === r.id ? 'ring-2 ring-primary' : ''}`}
          >
            <p className="font-bold text-foreground">{r.title}</p>
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{r.description}</p>
          </li>
        ))}
      </ul>
      )}
    </div>
  );

  return (
    <div className="relative flex flex-col md:flex-row h-[calc(100vh-4rem)]">
      <div className="flex-1 h-full w-full z-0">
        <MapComponent reports={filteredReports} selectedReport={selectedReport} onPopupClose={handlePopupClose} />
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden md:block w-1/3 lg:w-1/4 bg-background border-l border-border p-6 overflow-y-auto">
        <h2 className="text-2xl font-bold font-sofia mb-4">Филтри</h2>
        <div className="grid grid-cols-1 gap-4">
            <button
                onClick={() => setFilter("all")}
                className={`flex items-center justify-center p-3 rounded-full font-semibold transition-all duration-300 shadow-sm ${
                filter === "all"
                    ? "bg-gray-300 dark:bg-gray-700 text-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted-foreground/10"
                }`}
            >
                <FaMapMarkerAlt className="mr-2" />
                Всички
            </button>
            <button
                onClick={() => setFilter("obstacle")}
                className={`flex items-center justify-center p-3 rounded-full font-semibold transition-all duration-300 shadow-sm ${
                filter === "obstacle"
                    ? "bg-red-500 text-white"
                    : "bg-muted text-muted-foreground hover:bg-muted-foreground/10"
                }`}
            >
                <FaExclamationTriangle className="mr-2" />
                Препятствия
            </button>
            <button
                onClick={() => setFilter("resolved")}
                className={`flex items-center justify-center p-3 rounded-full font-semibold transition-all duration-300 shadow-sm ${
                filter === "resolved"
                    ? "bg-green-500 text-white"
                    : "bg-muted text-muted-foreground hover:bg-muted-foreground/10"
                }`}
            >
                <FaCheckCircle className="mr-2" />
                Разрешени сигнали
            </button>
        </div>
        <ReportList onReportClick={(report) => setSelectedReport(report)} />
      </div>
      
      {/* Mobile UI elements */}
      <div className="md:hidden fixed bottom-6 right-6 z-20">
        <button
          onClick={() => setIsMobileSheetOpen(true)}
          className="backdrop-blur-lg bg-white/50 dark:bg-black/50 border border-white/30 dark:border-black/30 text-foreground p-4 rounded-full shadow-lg hover:scale-110 transition-transform"
        >
          <FaListUl size={24} />
        </button>
      </div>
      <div
        className={`md:hidden fixed inset-0 z-30 transition-opacity duration-300 ${
          isMobileSheetOpen ? "bg-black/20 backdrop-blur-sm" : "bg-transparent pointer-events-none"
        }`}
        onClick={() => setIsMobileSheetOpen(false)}
      />
      <div
        className={`md:hidden fixed bottom-4 left-4 right-4 z-40 backdrop-blur-lg bg-white/80 dark:bg-black/80 border border-white/30 dark:border-black/30 rounded-2xl shadow-2xl p-4 transition-all duration-500 ease-in-out ${
          isMobileSheetOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-full pointer-events-none"
        }`}
        style={{ maxHeight: 'calc(100vh - 4rem - 3rem)' }}
      >
        <div className="overflow-y-auto h-full">
          <div className="w-16 h-1.5 bg-muted rounded-full mx-auto mb-2" />
          <ReportList onReportClick={handleMobileReportSelect} />
        </div>
      </div>
    </div>
  );
}