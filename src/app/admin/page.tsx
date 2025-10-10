"use client";
import { useState, useEffect, Fragment } from "react";
import Link from "next/link";
import { FaTrash, FaEye, FaEyeSlash } from "react-icons/fa";

interface Report {
  id: number;
  created_at: string;
  title: string;
  description: string;
  type: string;
  image_url?: string;
  sent: boolean;
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
  const [updatingSentId, setUpdatingSentId] = useState<number | null>(null);
  const [changedIds, setChangedIds] = useState<Set<number>>(new Set());
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const [expandedReportId, setExpandedReportId] = useState<number | null>(null);

  async function fetchReports() {
    try {
      setLoading(true);
      const res = await fetch("/api/reports");
      const data = await res.json();
      if (data.success) {
        setReports(data.data);
      }
    } catch (err) {
      console.error("Fetch failed:", err);
      setMessage({ text: "Грешка при зареждане на сигналите.", type: "error"});
    } finally {
      setLoading(false);
    }
  }
  
  useEffect(() => { fetchReports(); }, []);

  const handleCheckboxChange = (id: number) => {
    const newChangedIds = new Set(changedIds);
    if (newChangedIds.has(id)) {
      newChangedIds.delete(id);
    } else {
      newChangedIds.add(id);
    }
    setChangedIds(newChangedIds);
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
      } else {
        const data = await res.json();
        setMessage({ text: data.error || "Грешка при запазване.", type: "error" });
      }
    } catch (err) {
      setMessage({ text: "Възникна грешка при комуникацията със сървъра.", type: "error" });
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
        setReports(prevReports => prevReports.filter(report => report.id !== id));
      } else {
        const data = await res.json();
        setMessage({ text: data.error || "Грешка при изтриване.", type: 'error'});
      }
    } catch (err) {
      setMessage({ text: "Възникна грешка при комуникацията.", type: 'error'});
    }
  };

  const handleSentChange = async (reportId: number, currentStatus: boolean) => {
    setUpdatingSentId(reportId);
    try {
      const res = await fetch('/api/reports', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: reportId, sent: !currentStatus })
      });

      if (res.ok) {
        setReports(reports.map(r => r.id === reportId ? { ...r, sent: !currentStatus } : r));
      } else {
        setMessage({ text: "Грешка при обновяване на статуса.", type: "error" });
      }
    } catch (err) {
        setMessage({ text: "Възникна грешка.", type: "error" });
    } finally {
      setUpdatingSentId(null);
    }
  };

  const handleToggleDescription = (id: number) => {
    if (expandedReportId === id) {
      setExpandedReportId(null);
    } else {
      setExpandedReportId(id);
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Зареждане на сигналите...</div>;
  }
  
  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-6">Админ панел - Сигнали</h1>
      
      <div className="overflow-x-auto bg-background rounded-lg shadow border border-border">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted text-muted-foreground uppercase">
            <tr>
              <th scope="col" className="px-4 py-3 w-32 text-center">Действия</th>
              <th scope="col" className="px-4 py-3 w-40">Дата и час</th>
              <th scope="col" className="px-4 py-3">Адрес</th>
              <th scope="col" className="px-4 py-3 w-40">Тип</th>
              <th scope="col" className="px-4 py-3 w-28">Снимка</th>
              <th scope="col" className="px-4 py-3 w-28 text-center">Изпратен</th>
              <th scope="col" className="px-4 py-3 w-28 text-center">Разрешен</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report) => (
              <Fragment key={report.id}>
                <tr className="border-b border-border hover:bg-muted/50">
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-4">
                      <button onClick={() => handleToggleDescription(report.id)} className="text-blue-500 hover:text-blue-700 transition-colors" title="Покажи описание">
                        {expandedReportId === report.id ? <FaEyeSlash /> : <FaEye />}
                      </button>
                      <button onClick={() => handleDelete(report.id)} className="text-red-500 hover:text-red-700 transition-colors" title="Изтрий сигнал">
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs">{formatDate(report.created_at)}</td>
                  <td className="px-4 py-3 whitespace-normal break-words">{report.title}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      report.type === 'Разрешен' ? 'bg-green-500/20 text-green-700' : 'bg-red-500/20 text-red-700'
                    }`}>
                      {report.type}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {report.image_url ? (
                      <Link href={report.image_url} target="_blank" className="text-primary hover:underline">
                        Виж
                      </Link>
                    ) : 'Няма'}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {updatingSentId === report.id ? (
                      <div className="w-5 h-5 border-2 border-dashed border-primary rounded-full animate-spin mx-auto"></div>
                    ) : (
                      <input
                        type="checkbox"
                        className="w-5 h-5 rounded text-primary focus:ring-primary"
                        checked={report.sent}
                        onChange={() => handleSentChange(report.id, report.sent)}
                      />
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <input
                      type="checkbox"
                      className="w-5 h-5 rounded text-primary focus:ring-primary disabled:opacity-50"
                      checked={report.type === 'Разрешен' || changedIds.has(report.id)}
                      disabled={report.type === 'Разрешен'}
                      onChange={() => handleCheckboxChange(report.id)}
                    />
                  </td>
                </tr>
                {expandedReportId === report.id && (
                  <tr className="bg-muted/30">
                    <td colSpan={7} className="p-4">
                      <h4 className="font-semibold mb-2">Пълно описание:</h4>
                      <p className="text-muted-foreground whitespace-pre-wrap">{report.description}</p>
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
    </div>
  );
}