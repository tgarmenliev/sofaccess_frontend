"use client";
import { useState } from "react";
import { 
  FaMapPin, FaLocationArrow, FaExclamationTriangle, 
  FaCamera, FaPaperPlane 
} from "react-icons/fa";

export default function ReportPage() {
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);

  function formatAddress(item: any) {
    if (item.address) {
      const { road, house_number, suburb, city } = item.address;
      let parts = [];
      if (road) parts.push(road);
      if (house_number) parts.push(house_number);
      if (suburb) parts.push(suburb);
      if (city && city === "Sofia") parts.push("София");

      return parts.join(", ");
    }

    return item.display_name.split(",").slice(0, 3).join(", ");
  }

  async function searchAddress(query: string) {
    setAddress(query);
    if (query.length < 3) {
      setSuggestions([]);
      return;
    }
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          query
        )}&addressdetails=1&limit=5&bounded=1&viewbox=23.20,42.63,23.45,42.75`,
        {
          headers: {
            "User-Agent": "sof-access/1.0",
            "Accept-Language": "bg",
          },
        }
      );
      const data = await res.json();
      setSuggestions(data);
    } catch (err) {
      console.error("Fetch error:", err);
      setSuggestions([]);
    }
  }

  // текущо местоположение
  function useCurrentLocation() {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCoords({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
          setAddress(
            `Моето местоположение (${pos.coords.latitude.toFixed(
              4
            )}, ${pos.coords.longitude.toFixed(4)})`
          );
        },
        (err) => console.error("Geolocation error:", err),
        { enableHighAccuracy: true }
      );
    }
  }

  // изпращане към API
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const payload = {
      title: address,
      description: formData.get("description"),
      type: formData.get("barrier-type"),
      lat: coords?.lat || 42.6977, // fallback: София
      lng: coords?.lng || 23.3219,
    };

    const res = await fetch("/api/reports", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    console.log("Response:", data);
    setLoading(false);
  }

  return (
    <div className="bg-background text-foreground min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl mx-auto backdrop-blur-md bg-white/20 dark:bg-black/20 rounded-3xl shadow-2xl overflow-hidden p-8">
        
        {/* Заглавие */}
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold font-sofia">
            Докладвайте препятствие
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Помогнете ни да направим София по-достъпна, като съобщите за проблем.
          </p>
        </div>

        {/* Форма */}
        <form onSubmit={handleSubmit} className="mt-12 space-y-8">
          
          {/* Location Section */}
          <div>
            <div className="flex items-center text-primary mb-2">
              <FaMapPin className="h-6 w-6 mr-2" />
              <h2 className="text-xl font-semibold">Местоположение</h2>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 relative">
              <button
                type="button"
                onClick={useCurrentLocation}
                className="flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-full font-medium text-sm shadow-md hover:scale-105 transition-transform w-full sm:w-auto"
              >
                <FaLocationArrow className="h-4 w-4 mr-2" />
                Използвай текущо местоположение
              </button>
              <div className="relative w-full">
                <input
                  value={address}
                  onChange={(e) => searchAddress(e.target.value)}
                  className="block w-full px-4 py-3 border border-border rounded-full bg-background/50 placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                  placeholder="Или въведете адрес..."
                  required
                />
                {suggestions.length > 0 && (
                  <ul className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 border border-border rounded-xl shadow-lg max-h-60 overflow-y-auto">
                    {suggestions.map((s, i) => (
                      <li
                        key={i}
                        className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                        onClick={() => {
                          setAddress(formatAddress(s));
                          setCoords({
                            lat: parseFloat(s.lat),
                            lng: parseFloat(s.lon),
                          });
                          setSuggestions([]);
                        }}
                      >
                        {formatAddress(s)}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>

          {/* Barrier Type Section */}
          <div>
            <div className="flex items-center text-primary mb-2">
              <FaExclamationTriangle className="h-6 w-6 mr-2" />
              <h2 className="text-xl font-semibold">Тип на проблема</h2>
            </div>
            <select
              id="barrier-type"
              name="barrier-type"
              className="block w-full px-4 py-3 text-sm border border-border rounded-full bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
            >
              <option>Счупен тротоар</option>
              <option>Стълби без рампа</option>
              <option>Счупен асансьор/ескалатор</option>
              <option>Паркирано превозно средство</option>
              <option>Друго</option>
            </select>
          </div>

          {/* Description Section */}
          <textarea
            id="description"
            name="description"
            rows={4}
            required
            className="block w-full px-4 py-3 border border-border rounded-2xl bg-background/50 placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            placeholder="Подробно описание на проблема..."
          ></textarea>

          {/* Photo Upload Section */}
          <div>
            <div className="flex items-center text-primary mb-2">
              <FaCamera className="h-6 w-6 mr-2" />
              <h2 className="text-xl font-semibold">Прикачи снимка</h2>
            </div>
            <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-border border-dashed rounded-xl">
              <input id="file-upload" name="file-upload" type="file" className="sr-only" />
              <label
                htmlFor="file-upload"
                className="cursor-pointer text-primary hover:text-blue-700"
              >
                Качи файл
              </label>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="group relative w-full flex justify-center py-3 px-4 rounded-full bg-primary text-primary-foreground shadow-lg hover:scale-105 transition-transform"
          >
            <FaPaperPlane className="mr-2" />
            {loading ? "Изпращане..." : "Изпрати сигнал"}
          </button>
        </form>
      </div>
    </div>
  );
}
