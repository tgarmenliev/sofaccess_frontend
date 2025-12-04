"use client";
import { useState, useEffect, Fragment } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaTrash, FaEye, FaEyeSlash, FaSignOutAlt, FaMap, FaTimes, FaCheckCircle, FaPaperPlane, FaGlobeEurope, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

const MapComponent = dynamic(() => import("../components/Map"), {
  ssr: false,
  loading: () => <div className="h-full w-full flex items-center justify-center bg-gray-100 dark:bg-gray-800 text-muted-foreground">Зареждане на картата...</div>
});

interface Report {
  id: number;
  created_at: string;
  title: string;
  description: string;
  type: string;
  lat: number;
  lng: number;
  image_url?: string;
  sent: boolean;
  is_visible: boolean;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  date.setHours(date.getHours() + 3);
  return date.toLocaleString("bg-BG", {
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit'
  });
};

export default function AdminPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [changedIds, setChangedIds] = useState<Set<number>>(new Set());
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const [expandedReportId, setExpandedReportId] = useState<number | null>(null);
  
  const [mapViewReport, setMapViewReport] = useState<Report | null>(null);

  const supabase = createClientComponentClient();
  const router = useRouter();

  async function fetchReports() {
    try {
      setLoading(true);
      const res = await fetch("/api/reports?admin=true");
      const data = await res.json();
      if (data.success) {
        setReports(data.data);
      }
    } catch (err) {
      const error = err as Error;
      console.error("Fetch failed:", error.message);
      setMessage({ text: "Грешка при зареждане на сигналите.", type: "error"});
    } finally {
      setLoading(false);
    }
  }
  
  useEffect(() => {
    fetchReports();
  }, []);

  const handleCheckboxChange = (id: number) => {
    const newChangedIds = new Set(changedIds);
    if (newChangedIds.has(id)) {
      newChangedIds.delete(id);
    } else {
      newChangedIds.add(id);
    }
    setChangedIds(newChangedIds);
    
    if (mapViewReport?.id === id) {
        setMapViewReport({ ...mapViewReport }); 
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setMessage(null);
    try {
      const res = await fetch("/api/reports", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: Array.from(changedIds) }),
      });

      if (res.ok) {
        setMessage({ text: "Промените са запазени успешно!", type: "success" });
        setChangedIds(new Set());
        await fetchReports();
        if (mapViewReport) {
             setMapViewReport({ ...mapViewReport, type: 'Разрешен' });
        }
      } else {
        const data = await res.json();
        setMessage({ text: data.error || "Грешка при запазване.", type: "error" });
      }
    } catch (err) {
      const error = err as Error;
      setMessage({ text: `Възникна грешка: ${error.message}`, type: "error" });
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleDelete = async (id: number) => {
    if (!window.confirm(`Сигурен ли си, че искаш да изтриеш сигнал #${id}?`)) {
      return;
    }
    
    try {
      const res = await fetch(`/api/reports?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setMessage({ text: `Сигнал #${id} е изтрит успешно.`, type: 'success'});
        
        if (mapViewReport?.id === id) {
             const currentIndex = reports.findIndex(r => r.id === id);
             const nextReport = reports[currentIndex + 1] || reports[currentIndex - 1];
             if (nextReport) {
                 setMapViewReport(nextReport);
             } else {
                 setMapViewReport(null);
             }
        }

        setReports(prevReports => prevReports.filter(report => report.id !== id));
      } else {
        const data = await res.json();
        setMessage({ text: data.error || "Грешка при изтриване.", type: 'error'});
      }
    } catch (err) {
      const error = err as Error;
      setMessage({ text: `Възникна грешка: ${error.message}`, type: 'error'});
    }
  };
  
  const handleUpdateStatus = async (reportId: number, field: 'sent' | 'is_visible', value: boolean) => {
    setUpdatingId(reportId);
    try {
      const res = await fetch('/api/reports', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: reportId, [field]: value })
      });

      if (res.ok) {
        const updatedReports = reports.map(r => r.id === reportId ? { ...r, [field]: value } : r);
        setReports(updatedReports);
        
        if (mapViewReport?.id === reportId) {
            setMapViewReport({ ...mapViewReport, [field]: value });
        }
      } else {
        setMessage({ text: "Грешка при обновяване.", type: "error" });
      }
    } catch (err) {
      const error = err as Error;
      setMessage({ text: `Възникна грешка: ${error.message}`, type: "error" });
    } finally {
      setUpdatingId(null);
    }
  };

  const handleToggleDescription = (id: number) => {
    if (expandedReportId === id) {
      setExpandedReportId(null);
    } else {
      setExpandedReportId(id);
    }
  };
  
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  // --- Modal Action Handlers ---
  
  const onModalToggleVisible = async (report: Report) => {
    await handleUpdateStatus(report.id, 'is_visible', !report.is_visible);
  };

  const onModalToggleSent = async (report: Report) => {
    await handleUpdateStatus(report.id, 'sent', !report.sent);
  };

  const onModalToggleResolved = (report: Report) => {
    handleCheckboxChange(report.id);
  };

  // --- Navigation Logic ---
  const currentReportIndex = mapViewReport ? reports.findIndex(r => r.id === mapViewReport.id) : -1;
  const prevReport = currentReportIndex > 0 ? reports[currentReportIndex - 1] : null;
  const nextReport = currentReportIndex < reports.length - 1 ? reports[currentReportIndex + 1] : null;

  const handlePrev = () => {
      if (prevReport) setMapViewReport(prevReport);
  };

  const handleNext = () => {
      if (nextReport) setMapViewReport(nextReport);
  };


  if (loading) {
    return <div className="p-8 text-center">Зареждане на сигналите...</div>;
  }

  // Filter reports for map: Current + Visible
  const reportsToDisplayOnMap = mapViewReport 
    ? reports.filter(r => r.id === mapViewReport.id || r.is_visible)
    : [];
  
  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Админ панел - Сигнали</h1>
        <button
          onClick={handleSignOut}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg font-semibold shadow hover:bg-red-700 transition"
        >
          <FaSignOutAlt />
          Изход
        </button>
      </div>
      
      <div className="overflow-x-auto bg-background rounded-lg shadow border border-border">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted text-muted-foreground uppercase">
            <tr>
              <th scope="col" className="px-4 py-3 w-40 text-center">Действия</th>
              <th scope="col" className="px-4 py-3 w-40">Дата и час</th>
              <th scope="col" className="px-4 py-3">Адрес</th>
              <th scope="col" className="px-4 py-3 w-28">Снимка</th>
              <th scope="col" className="px-4 py-3 w-28 text-center">Видим</th>
              <th scope="col" className="px-4 py-3 w-28 text-center">Изпратен</th>
              <th scope="col" className="px-4 py-3 w-28 text-center">Разрешен</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report) => (
              <Fragment key={report.id}>
                <tr className="border-b border-border hover:bg-muted/50">
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-3">
                      <button 
                        onClick={() => setMapViewReport(report)} 
                        className="text-green-600 hover:text-green-800 transition-colors p-1" 
                        title="Виж на картата и редактирай"
                      >
                        <FaMap size={16} />
                      </button>
                      
                      <button onClick={() => handleToggleDescription(report.id)} className="text-blue-500 hover:text-blue-700 transition-colors p-1" title="Покажи описание">
                        {expandedReportId === report.id ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                      </button>
                      
                      <button onClick={() => handleDelete(report.id)} className="text-red-500 hover:text-red-700 transition-colors p-1" title="Изтрий сигнал">
                        <FaTrash size={16} />
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs">{formatDate(report.created_at)}</td>
                  <td className="px-4 py-3 whitespace-normal break-words">{report.title}</td>
                  
                  <td className="px-4 py-3">
                    {report.image_url ? (
                      <Link href={report.image_url} target="_blank" className="text-primary hover:underline">
                        Виж
                      </Link>
                    ) : 'Няма'}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {updatingId === report.id ? (
                      <div className="w-5 h-5 border-2 border-dashed rounded-full animate-spin mx-auto"></div>
                    ) : (
                      <input
                        type="checkbox"
                        className="w-5 h-5 rounded text-primary focus:ring-primary"
                        checked={report.is_visible}
                        onChange={() => handleUpdateStatus(report.id, 'is_visible', !report.is_visible)}
                      />
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {updatingId === report.id ? (
                        <div className="w-5 h-5 border-2 border-dashed rounded-full animate-spin mx-auto"></div>
                    ) : (
                      <input
                        type="checkbox"
                        className="w-5 h-5 rounded text-primary focus:ring-primary"
                        checked={report.sent}
                        onChange={() => handleUpdateStatus(report.id, 'sent', !report.sent)}
                      />
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <input
                      type="checkbox"
                      className="w-5 h-5 rounded text-primary focus:ring-primary disabled:opacity-50"
                      checked={report.type === 'Разрешен сигнал' || changedIds.has(report.id)}
                      disabled={report.type === 'Разрешен сигнал'}
                      onChange={() => handleCheckboxChange(report.id)}
                    />
                  </td>
                </tr>
                {expandedReportId === report.id && (
                  <tr className="bg-muted/30">
                    <td colSpan={7} className="p-4 space-y-4">
                      <div>
                        <h4 className="font-semibold mb-1">Тип на сигнала:</h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          report.type === 'Разрешен сигнал' ? 'bg-green-100 dark:bg-green-500/20 text-green-800 dark:text-green-300' : 'bg-red-100 dark:bg-red-500/20 text-red-800 dark:text-red-300'
                        }`}>
                          {report.type}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">Пълно описание:</h4>
                        <p className="text-muted-foreground whitespace-pre-wrap">{report.description}</p>
                      </div>
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex items-center justify-end gap-4">
        {message && (
          <p className={`text-sm font-medium ${message.type === 'success' ? 'text-green-500' : 'text-red-500'}`}>
            {message.text}
          </p>
        )}
        <button
          onClick={handleSave}
          disabled={isSaving || changedIds.size === 0}
          className="bg-primary text-primary-foreground px-6 py-2 rounded-lg font-semibold shadow hover:bg-primary/90 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isSaving ? 'Запазване...' : 'Запази промените'}
        </button>
      </div>

      {/* --- MAP MODAL WITH DETAILS --- */}
      {mapViewReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-background w-full max-w-7xl h-[90vh] rounded-2xl shadow-2xl flex flex-col lg:flex-row overflow-hidden relative border border-border">
            
            {/* LEFT SIDE: MAP */}
            <div className="flex-1 lg:w-2/3 relative h-1/2 lg:h-full border-b lg:border-b-0 lg:border-r border-border">
                <MapComponent 
                  reports={reportsToDisplayOnMap}
                  selectedReport={mapViewReport}
                  onPopupClose={() => {}}
                  onGeolocationError={(msg) => console.log(msg)}
                />
                <button 
                  onClick={() => setMapViewReport(null)}
                  className="absolute top-4 right-4 z-[1000] lg:hidden p-3 bg-background/80 backdrop-blur-md rounded-full shadow-lg text-muted-foreground hover:text-red-600 border border-border"
                >
                  <FaTimes size={20} />
                </button>
            </div>

            {/* RIGHT SIDE: DETAILS & CONTROLS */}
            <div className="lg:w-1/3 bg-background flex flex-col h-1/2 lg:h-full">
               
               {/* Modal Header (Desktop) with Navigation */}
               <div className="hidden lg:flex items-center justify-between p-4 border-b border-border bg-muted/20">
                 <h3 className="font-bold text-lg">Преглед на сигнал</h3>
                 
                 {/* Navigation Controls */}
                 <div className="flex items-center gap-2">
                    <button 
                        onClick={handlePrev} 
                        disabled={!prevReport}
                        className="p-2 rounded-full hover:bg-white dark:hover:bg-black/20 disabled:opacity-30 transition-colors border border-transparent hover:border-border"
                        title="Предишен сигнал"
                    >
                        <FaChevronLeft />
                    </button>
                    <span className="text-sm text-muted-foreground">
                        {currentReportIndex + 1} / {reports.length}
                    </span>
                    <button 
                        onClick={handleNext} 
                        disabled={!nextReport}
                        className="p-2 rounded-full hover:bg-white dark:hover:bg-black/20 disabled:opacity-30 transition-colors border border-transparent hover:border-border"
                        title="Следващ сигнал"
                    >
                        <FaChevronRight />
                    </button>
                 </div>

                 <button 
                    onClick={() => setMapViewReport(null)}
                    className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 text-muted-foreground hover:text-red-600 rounded-full transition-colors"
                  >
                    <FaTimes size={24} />
                  </button>
               </div>

               {/* Scrollable Content */}
               <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  
                  {/* Report Image */}
                  {mapViewReport.image_url ? (
                    <div className="relative w-full h-96 rounded-xl overflow-hidden border border-border shadow-sm bg-black/5 dark:bg-white/5">
                      <Image 
                        src={mapViewReport.image_url} 
                        alt="Снимка на сигнала"
                        fill
                        className="object-contain"
                      />
                    </div>
                  ) : (
                    <div className="w-full h-64 rounded-xl bg-muted flex items-center justify-center text-muted-foreground border border-border">
                      Няма снимка
                    </div>
                  )}

                  {/* Info */}
                  <div>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-bold mb-3 ${
                          mapViewReport.type === 'Разрешен сигнал' ? 'bg-green-100 dark:bg-green-500/20 text-green-800 dark:text-green-300' : 'bg-red-100 dark:bg-red-500/20 text-red-800 dark:text-red-300'
                        }`}>
                      {mapViewReport.type}
                    </span>
                    <h2 className="text-2xl font-bold mb-2">{mapViewReport.title}</h2>
                    <p className="text-sm text-muted-foreground mb-4">
                      Подаден на: {formatDate(mapViewReport.created_at)}
                    </p>
                    <div className="bg-muted/30 p-4 rounded-lg border border-border">
                        <p className="whitespace-pre-wrap text-base">{mapViewReport.description}</p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3 pt-4 border-t border-border">
                    <h4 className="font-semibold text-muted-foreground text-sm uppercase tracking-wide">Бързи действия:</h4>
                    
                    <button 
                      onClick={() => onModalToggleVisible(mapViewReport)}
                      className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all hover:scale-[1.02] active:scale-95 ${
                        mapViewReport.is_visible 
                          ? "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800" 
                          : "bg-background border-border hover:bg-muted"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <FaGlobeEurope className={mapViewReport.is_visible ? "text-blue-600" : "text-muted-foreground"} size={20} />
                        <span className="font-medium">Публично видим</span>
                      </div>
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        mapViewReport.is_visible ? "bg-blue-600 border-blue-600" : "border-muted-foreground"
                      }`}>
                        {mapViewReport.is_visible && <FaCheckCircle className="text-white" size={12} />}
                      </div>
                    </button>

                    <button 
                      onClick={() => onModalToggleSent(mapViewReport)}
                      className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all hover:scale-[1.02] active:scale-95 ${
                        mapViewReport.sent 
                          ? "bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800" 
                          : "bg-background border-border hover:bg-muted"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <FaPaperPlane className={mapViewReport.sent ? "text-purple-600" : "text-muted-foreground"} size={20} />
                        <span className="font-medium">Изпратен към Общината</span>
                      </div>
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        mapViewReport.sent ? "bg-purple-600 border-purple-600" : "border-muted-foreground"
                      }`}>
                        {mapViewReport.sent && <FaCheckCircle className="text-white" size={12} />}
                      </div>
                    </button>

                    <button 
                       onClick={() => onModalToggleResolved(mapViewReport)}
                       disabled={mapViewReport.type === 'Разрешен сигнал'}
                       className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all hover:scale-[1.02] active:scale-95 ${
                        (mapViewReport.type === 'Разрешен сигнал' || changedIds.has(mapViewReport.id))
                          ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 cursor-not-allowed opacity-80" 
                          : "bg-background border-border hover:bg-muted"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <FaCheckCircle className={(mapViewReport.type === 'Разрешен сигнал' || changedIds.has(mapViewReport.id)) ? "text-green-600" : "text-muted-foreground"} size={20} />
                        <span className="font-medium">Маркирай като Разрешен</span>
                      </div>
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                         (mapViewReport.type === 'Разрешен сигнал' || changedIds.has(mapViewReport.id)) ? "bg-green-600 border-green-600" : "border-muted-foreground"
                      }`}>
                        {(mapViewReport.type === 'Разрешен сигнал' || changedIds.has(mapViewReport.id)) && <FaCheckCircle className="text-white" size={12} />}
                      </div>
                    </button>

                    <button 
                       onClick={() => handleDelete(mapViewReport.id)}
                       className="w-full flex items-center justify-between p-4 rounded-xl border transition-all hover:scale-[1.02] active:scale-95 bg-background border-red-200 dark:border-red-900/50 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400"
                    >
                      <div className="flex items-center gap-3">
                        <FaTrash size={20} />
                        <span className="font-medium">Изтрий сигнала напълно</span>
                      </div>
                    </button>
                  </div>

               </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}