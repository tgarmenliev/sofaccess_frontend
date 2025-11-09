"use client";
import { useState, useRef, Fragment } from "react";
import { FaMapPin, FaLocationArrow, FaExclamationTriangle, FaCamera, FaPaperPlane, FaCheckCircle, FaMap, FaQuestionCircle } from "react-icons/fa";
import dynamic from "next/dynamic";
import Link from "next/link";
//import heic2any from "heic2any";

const LocationPickerMap = dynamic(() => import("../components/LocationPickerMap"), {
  ssr: false,
  loading: () => <p className="text-center p-8">Зареждане на картата...</p>
});

const SOFIA_BOUNDING_BOX = {
  minLat: 42.63,
  maxLat: 42.75,
  minLng: 23.20,
  maxLng: 23.45,
};

const isWithinSofia = (lat: number, lng: number): boolean => {
  return (
    lat >= SOFIA_BOUNDING_BOX.minLat &&
    lat <= SOFIA_BOUNDING_BOX.maxLat &&
    lng >= SOFIA_BOUNDING_BOX.minLng &&
    lng <= SOFIA_BOUNDING_BOX.maxLng
  );
};

interface NominatimSuggestion {
  place_id: number;
  lat: string;
  lon: string;
  display_name: string;
  address: {
    road?: string;
    house_number?: string;
    suburb?: string;
    city?: string;
  }
}

const defaultFileText = "Качи файл (Задължително)";

const compressImageWithCanvas = (file: File): Promise<File> => {
  return new Promise((resolve, reject) => {
    const MAX_WIDTH_HEIGHT = 1920;
    const QUALITY = 0.7;
    
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = (e) => {
      const img = new Image();
      img.src = e.target?.result as string;

      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH_HEIGHT) {
            height *= MAX_WIDTH_HEIGHT / width;
            width = MAX_WIDTH_HEIGHT;
          }
        } else {
          if (height > MAX_WIDTH_HEIGHT) {
            width *= MAX_WIDTH_HEIGHT / height;
            height = MAX_WIDTH_HEIGHT;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          return reject(new Error("Неуспешно създаване на платно за снимка."));
        }

        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob((blob) => {
          if (!blob) {
            return reject(new Error("Неуспешно конвертиране на снимка."));
          }
          
          const newFile = new File([blob], file.name.replace(/\.[^/.]+$/, ".jpg"), {
            type: 'image/jpeg',
            lastModified: Date.now(),
          });

          console.log(`Финално компресиран файл: ${newFile.size / 1024 / 1024} MB`);

          if (newFile.size > 4 * 1024 * 1024) {
            return reject(new Error("Снимката е твърде голяма дори след компресия."));
          }
          resolve(newFile);
        }, 'image/jpeg', QUALITY);
      };
      img.onerror = () => reject(new Error("Непознат формат на изображение."));
    };
    reader.onerror = () => reject(new Error("Неуспешно четене на файла."));
  });
};


export default function ReportPage() {
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState("");
  const [suggestions, setSuggestions] = useState<NominatimSuggestion[]>([]);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [fileLabel, setFileLabel] = useState(defaultFileText);
  const [locationMessage, setLocationMessage] = useState<{ text: string; type: "error" | "warning" } | null>(null);
  const [submitMessage, setSubmitMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [reportType, setReportType] = useState("Разбит тротоар");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isFormReady = !loading && coords && file;

  const formatAddress = (item: NominatimSuggestion): string => {
    if (item.address) {
      const { road, house_number, suburb, city } = item.address;
      const parts = [];
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
    setLocationMessage(null);
    if (query.length < 3) {
      setSuggestions([]);
      return;
    }

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            query
          )}&addressdetails=1&limit=10&bounded=1&viewbox=23.20,42.63,23.45,42.75`,
          { headers: { "User-Agent": "sof-access/1.0", "Accept-Language": "bg" } }
        );
        const data: NominatimSuggestion[] = await res.json();
        setSuggestions(data);
      } catch (err) {
        console.error("Fetch error:", err);
        setSuggestions([]);
      }
    }, 300);
  };

  const useCurrentLocation = () => {
    setLoading(true);
    setLocationMessage(null);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude, longitude } = pos.coords;

          if (!isWithinSofia(latitude, longitude)) {
            setLocationMessage({ text: "Вашето местоположение е извън София. Моля, докладвайте само проблеми в града.", type: "warning" });
            setAddress("");
            setCoords(null);
            setLoading(false);
            return;
          }

          try {
            const res = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}&addressdetails=1&zoom=18&accept-language=bg`
            );
            const data: NominatimSuggestion = await res.json();
            const fullAddress = formatAddress(data);
            setAddress(fullAddress);
            setCoords({ lat: latitude, lng: longitude });
          } catch {
            setLocationMessage({ text: "Не успяхме да намерим точен адрес.", type: "error" });
          } finally {
            setLoading(false);
          }
        },
        () => {
          setLocationMessage({ text: "Няма достъп до местоположението.", type: "error" });
          setLoading(false);
        }
      );
    } else {
      setLocationMessage({ text: "Геолокацията не се поддържа.", type: "error" });
      setLoading(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setLoading(true);
    setSubmitMessage({ text: "Обработка на снимка...", type: "success" });
    setFile(null);
    setFileLabel(selectedFile.name);

    try {
      let fileToProcess = selectedFile;

      if (fileToProcess.type === 'image/heic' || fileToProcess.type === 'image/heif' || fileToProcess.name.toLowerCase().endsWith('.heic')) {
        setSubmitMessage({ text: "Конвертиране на HEIC...", type: "success" });
        
        const heic2any = (await import('heic2any')).default;

        const convertedBlob = await heic2any({
          blob: fileToProcess,
          toType: "image/jpeg",
          quality: 0.8,
        }) as Blob;
        fileToProcess = new File([convertedBlob], selectedFile.name.replace(/\.[^/.]+$/, ".jpg"), { type: 'image/jpeg' });
      }

      setSubmitMessage({ text: "Компресиране на снимка...", type: "success" });
      const compressedFile = await compressImageWithCanvas(fileToProcess);

      setFile(compressedFile);
      setFileLabel(compressedFile.name);
      setSubmitMessage(null);

    } catch (err) {
      const error = err as Error;
      console.error("Image processing error:", error);
      setSubmitMessage({ text: `Грешка: Не можем да обработим тази снимка. Моля, опитайте със скрийншот.`, type: "error" });
      setFile(null);
      setFileLabel(defaultFileText);
    } finally {
      setLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!isFormReady) return;

    setLoading(true);
    setSubmitMessage({ text: "Изпращане на сигнал...", type: "success" });

    try {
      const form = e.currentTarget;
      const fd = new FormData();

      fd.append("file", file as File, file!.name); 
      fd.append("address", address);
      fd.append("description", (form.elements.namedItem("description") as HTMLTextAreaElement).value);
      fd.append("type", (form.elements.namedItem("barrier-type") as HTMLSelectElement).value);
      fd.append("lat", String(coords?.lat));
      fd.append("lng", String(coords?.lng));

      const res = await fetch("/api/reports", { method: "POST", body: fd });
      
      if (!res.ok) {
        throw new Error(`Грешка от сървъра: ${res.status}`);
      }

      const data = await res.json();

      if (data.success) {
        setSubmitMessage({ text: "Сигналът ви е изпратен за одобрение!", type: "success" });
        form.reset();
        setFile(null);
        setFileLabel(defaultFileText);
        setAddress("");
        setCoords(null);
        setReportType("Разбит тротоар");
      } else {
        setSubmitMessage({ text: data?.error || "Неуспех при изпращане", type: "error" });
      }
    } catch (err) {
      const error = err as Error;
      console.error("Submit error:", error);
      if (error.message.includes("413") || error.message.includes("JSON")) {
         setSubmitMessage({ text: "Грешка: Файлът е твърде голям. Моля, опитайте друга снимка.", type: "error" });
      } else {
         setSubmitMessage({ text: `Възникна грешка при изпращане.`, type: "error" });
      }
    } finally {
      setLoading(false);
    }
  }

  const getLocationMessageColor = () => {
    if (!locationMessage) return "";
    return locationMessage.type === "error" ? "text-red-500" : "text-yellow-500";
  };
  
  const handleLocationSelect = (selectedCoords: { lat: number; lng: number }, selectedAddress: string) => {
    setCoords(selectedCoords);
    setAddress(selectedAddress);
    setIsMapOpen(false);
    setLocationMessage(null);
  };

  return (
    <Fragment>
      <div className="bg-background text-foreground min-h-screen py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-xl mx-auto backdrop-blur-md bg-white/20 dark:bg-black/20 rounded-3xl shadow-2xl overflow-hidden p-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold font-sofia">Докладвай препятствие</h1>
            <p className="mt-4 text-lg text-muted-foreground">Помогнете ни да направим София по-достъпна.</p>
          </div>

          <form onSubmit={handleSubmit} className="mt-12 space-y-8">
            <div>
              <div className="flex items-center text-primary mb-2">
                <FaMapPin className="h-6 w-6 mr-2" />
                <h2 className="text-xl font-semibold">Местоположение</h2>
              </div>
              {locationMessage && <div className={`mt-2 p-3 rounded-md text-sm font-medium ${getLocationMessageColor()}`}>{locationMessage.text}</div>}
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <button
                  type="button"
                  onClick={useCurrentLocation}
                  disabled={loading}
                  className="flex items-center justify-center px-6 py-3 bg-white/20 dark:bg-black/20 backdrop-blur-sm border border-white/30 dark:border-black/30 text-foreground rounded-full font-semibold text-sm shadow-lg hover:scale-105 hover:bg-white/30 dark:hover:bg-black/30 transition-all"
                >
                  <FaLocationArrow className="h-4 w-4 mr-2" />
                  {loading ? "Зареждане..." : "Текущо"}
                </button>
                <button
                  type="button"
                  onClick={() => setIsMapOpen(true)}
                  disabled={loading}
                  className="flex items-center justify-center px-6 py-3 bg-white/20 dark:bg-black/20 backdrop-blur-sm border border-white/30 dark:border-black/30 text-foreground rounded-full font-semibold text-sm shadow-lg hover:scale-105 hover:bg-white/30 dark:hover:bg-black/30 transition-all"
                >
                  <FaMap className="h-4 w-4 mr-2" />
                  Избор от карта
                </button>
              </div>

              <div className="relative w-full">
                <input
                  value={address}
                  onChange={(e) => searchAddress(e.target.value)}
                  className="block w-full px-4 py-3 border border-border rounded-full bg-background/50 placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                  placeholder="Въведете адрес или изберете от картата..."
                  required
                />
                {suggestions.length > 0 && (
                  <ul className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 border border-border rounded-xl shadow-lg max-h-60 overflow-y-auto">
                    {suggestions.map((s) => (
                      <li
                        key={s.place_id}
                        className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                        onClick={() => {
                          setAddress(formatAddress(s));
                          setCoords({ lat: parseFloat(s.lat), lng: parseFloat(s.lon) });
                          setSuggestions([]);
                          setLocationMessage(null);
                        }}
                      >
                        {formatAddress(s)}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
            
            <div>
              <div className="flex items-center text-primary mb-2">
                <FaExclamationTriangle className="h-6 w-6 mr-2" />
                <h2 className="text-xl font-semibold">Тип на проблема</h2>
              </div>
              <select
                id="barrier-type"
                name="barrier-type"
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="block w-full px-4 py-3 text-sm border border-border rounded-full bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
              >
                <option>Разбит тротоар</option>
                <option>Препятствие на тротоара</option>
                <option>Стълби без рампа</option>
                <option>Счупен асансьор/ескалатор</option>
                <option>Липсващ/повреден капак на шахта</option>
                <option>Разрешен сигнал</option>
                <option>Друго</option>
              </select>

              {reportType === "Разрешен сигнал" && (
                <div className="mt-3 text-sm text-center">
                  <Link href="/faq#why-resolved" target="_blank" className="text-primary hover:underline inline-flex items-center gap-2">
                    <FaQuestionCircle />
                    Защо мога да докладвам разрешен сигнал?
                  </Link>
                </div>
              )}
            </div>

            <textarea
              id="description"
              name="description"
              rows={4}
              required
              className="block w-full px-4 py-3 border border-border rounded-2xl bg-background/50 placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
              placeholder="Подробно описание на проблема и местоположението му..."
            ></textarea>

            <div>
              <div className="flex items-center text-primary mb-2">
                <FaCamera className="h-6 w-6 mr-2" />
                <h2 className="text-xl font-semibold">Прикачи снимка</h2>
              </div>
              <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-border border-dashed rounded-xl">
                <input
                  id="file-upload"
                  name="file-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="sr-only"
                  ref={fileInputRef}
                />
                <label htmlFor="file-upload" className="cursor-pointer text-primary hover:text-blue-700">
                  {fileLabel}
                </label>
              </div>
            </div>
            
            {submitMessage && (
              <div
                className={`flex items-center justify-center p-3 rounded-lg text-sm font-medium transition-all duration-300 ease-in-out animate-fade-in-up ${
                  submitMessage.type === 'success'
                    ? 'bg-green-500/10 text-green-500'
                    : 'bg-red-500/10 text-red-500'
                }`}
              >
                {submitMessage.type === 'success' ? <FaCheckCircle className="mr-2" /> : <FaExclamationTriangle className="mr-2" />}
                {submitMessage.text}
              </div>
            )}

            <button
              type="submit"
              disabled={!isFormReady || loading}
              className={`group relative w-full flex justify-center py-3 px-4 rounded-full bg-primary text-primary-foreground shadow-lg transition-transform disabled:bg-gray-400 disabled:cursor-not-allowed ${isFormReady && !loading ? 'hover:scale-105 animate-pulse' : ''}`}
            >
              <FaPaperPlane className={`mr-2 ${isFormReady && !loading ? 'animate-bounce' : ''}`} />
              {loading ? "Обработка..." : "Изпрати сигнал"}
            </button>
          </form>
        </div>
      </div>
      
      {isMapOpen && (
        <LocationPickerMap 
          onClose={() => setIsMapOpen(false)} 
          onLocationSelect={handleLocationSelect}
        />
      )}
    </Fragment>
  );
}