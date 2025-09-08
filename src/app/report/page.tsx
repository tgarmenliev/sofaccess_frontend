"use client";
import { useState, useRef } from "react";
import { 
  FaMapPin, FaLocationArrow, FaExclamationTriangle, 
  FaCamera, FaPaperPlane 
} from "react-icons/fa";

// Bounding box for Sofia coordinates (min_lon, min_lat, max_lon, max_lat)
const SOFIA_BOUNDING_BOX = {
  minLat: 42.63,
  maxLat: 42.75,
  minLng: 23.20,
  maxLng: 23.45,
};

// Function to check if coordinates are within Sofia
const isWithinSofia = (lat: number, lng: number): boolean => {
  return (
    lat >= SOFIA_BOUNDING_BOX.minLat &&
    lat <= SOFIA_BOUNDING_BOX.maxLat &&
    lng >= SOFIA_BOUNDING_BOX.minLng &&
    lng <= SOFIA_BOUNDING_BOX.maxLng
  );
};

export default function ReportPage() {
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' | 'warning' } | null>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const formatAddress = (item: any) => {
    if (item.address) {
      const { road, house_number, suburb, city } = item.address;
      let parts = [];
      if (road) parts.push(road);
      if (house_number) parts.push(house_number);
      if (suburb && suburb !== city) parts.push(suburb);
      if (city && city === "Sofia") parts.push("София");
      return parts.join(", ");
    }
    const parts = item.display_name.split(",").slice(0, 3);
    if (parts.length > 0 && parts[parts.length - 1].trim() === "София") {
      return parts.join(", ");
    }
    return parts.join(", ");
  };

  const searchAddress = (query: string) => {
    setAddress(query);
    setMessage(null);
    if (query.length < 3) {
      setSuggestions([]);
      return;
    }

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            query
          )}&addressdetails=1&limit=10&bounded=1&viewbox=23.20,42.63,23.45,42.75`,
          {
            headers: {
              "User-Agent": "sof-access/1.0",
              "Accept-Language": "bg",
            },
          }
        );
        const data = await res.json();
        const uniqueSuggestions = Array.from(new Set(data.map((item: any) => JSON.stringify(item)))).map((item: any) => JSON.parse(item));
        setSuggestions(uniqueSuggestions);
      } catch (err) {
        console.error("Fetch error:", err);
        setSuggestions([]);
      }
    }, 300);
  };

  const useCurrentLocation = () => {
    setLoading(true);
    setMessage(null);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude, longitude } = pos.coords;

          if (!isWithinSofia(latitude, longitude)) {
            setMessage({
              text: "Вашето местоположение е извън София. Моля, докладвайте проблеми само от територията на града.",
              type: "warning",
            });
            setAddress("");
            setCoords(null);
            setLoading(false);
            return;
          }

          try {
            const res = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}&addressdetails=1&zoom=18&accept-language=bg`,
              {
                headers: {
                  "User-Agent": "sof-access/1.0",
                },
              }
            );
            const data = await res.json();
            const fullAddress = formatAddress(data);
            setAddress(fullAddress);
            setCoords({ lat: latitude, lng: longitude });
          } catch (err) {
            console.error("Reverse geocoding error:", err);
            setMessage({
              text: "Не можахме да намерим точен адрес за вашето местоположение, но координатите са запазени.",
              type: "error",
            });
            setAddress(`Координати: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
            setCoords({ lat: latitude, lng: longitude });
          } finally {
            setLoading(false);
          }
        },
        (err) => {
          console.error("Geolocation error:", err);
          setMessage({
            text: "Не можахме да получим вашето местоположение. Проверете дали сте дали разрешение.",
            type: "error",
          });
          setLoading(false);
        },
        { enableHighAccuracy: true }
      );
    } else {
      setMessage({
        text: "Геолокацията не се поддържа от вашия браузър.",
        type: "error",
      });
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!coords) {
      setMessage({
        text: "Моля, въведете валиден адрес или използвайте текущото си местоположение.",
        type: "error",
      });
      return;
    }
    setLoading(true);
    setMessage(null);

    const formData = new FormData(e.currentTarget);
    const payload = {
      address: address,
      description: formData.get("description"),
      type: formData.get("barrier-type"),
      lat: coords.lat,
      lng: coords.lng,
    };

    try {
        const res = await fetch("/api/reports", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });
        if (res.ok) {
            setMessage({ text: "Сигналът е изпратен успешно!", type: "success" });
        } else {
            setMessage({ text: "Неуспешно изпращане на сигнала. Моля, опитайте отново.", type: "error" });
        }
        const data = await res.json();
        console.log("Response:", data);
    } catch (err) {
        console.error("Submit error:", err);
        setMessage({ text: "Възникна грешка при изпращането. Моля, проверете връзката си.", type: "error" });
    } finally {
        setLoading(false);
    }
  };

  const getMessageColor = () => {
    if (!message) return "";
    switch (message.type) {
      case "success":
        return "text-green-500";
      case "error":
        return "text-red-500";
      case "warning":
        return "text-yellow-500";
      default:
        return "";
    }
  };

  return (
    <div className="bg-background text-foreground min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl mx-auto backdrop-blur-md bg-white/20 dark:bg-black/20 rounded-3xl shadow-2xl overflow-hidden p-8">
        
        {/* Заглавие */}
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold font-sofia">
            Докладвай препятствие
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
            {message && (
                <div className={`mt-2 p-3 rounded-md text-sm font-medium ${getMessageColor()}`}>
                    {message.text}
                </div>
            )}
            <div className="flex flex-col sm:flex-row gap-4 relative">
              <button
                type="button"
                onClick={useCurrentLocation}
                disabled={loading}
                className="flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-full font-medium text-sm shadow-md hover:scale-105 transition-transform w-full sm:w-auto"
              >
                <FaLocationArrow className="h-4 w-4 mr-2" />
                {loading ? "Зареждане..." : "Използвай текущо местоположение"}
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
                          setMessage(null);
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
            disabled={loading || !coords}
            className="group relative w-full flex justify-center py-3 px-4 rounded-full bg-primary text-primary-foreground shadow-lg hover:scale-105 transition-transform disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            <FaPaperPlane className="mr-2" />
            {loading ? "Изпращане..." : "Изпрати сигнал"}
          </button>
        </form>
      </div>
    </div>
  );
}