import { FaMapPin, FaLocationArrow, FaExclamationTriangle, FaCamera, FaPaperPlane } from "react-icons/fa";

export default function ReportPage() {
  return (
    <div className="bg-background text-foreground min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl mx-auto backdrop-blur-md bg-white/20 dark:bg-black/20 rounded-3xl shadow-2xl overflow-hidden p-8 transition-all duration-500 hover:shadow-primary/20">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold font-sofia text-balance">
            Докладвайте препятствие
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-lg mx-auto">
            Помогнете ни да направим София по-достъпна, като съобщите за проблем в градската среда.
          </p>
          <p className="mt-2 text-sm text-red-500 font-semibold max-w-lg mx-auto">
            Моля, имайте предвид, че платформата е предназначена само за докладване на проблеми, свързани с пешеходната инфраструктура (тротоари, рампи и др.).
          </p>
        </div>

        <form className="mt-12 space-y-8">
          {/* Location Section */}
          <div>
            <div className="flex items-center text-primary mb-2">
              <FaMapPin className="h-6 w-6 mr-2" />
              <h2 className="text-xl font-semibold">Местоположение</h2>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Моля, посочете точното място на проблема.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                type="button"
                className="flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground dark:text-white rounded-full font-medium text-sm shadow-md hover:scale-105 transition-transform w-full"
              >
                <FaLocationArrow className="h-4 w-4 mr-2" />
                Използвай текущо местоположение
              </button>
              <input
                id="location"
                name="location"
                type="text"
                required
                className="block w-full px-4 py-3 border border-border rounded-full bg-background/50 placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-sm"
                placeholder="Или въведете адрес..."
              />
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
              className="mt-1 block w-full px-4 py-3 text-sm border border-border rounded-full bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-foreground"
            >
              <option>Счупен тротоар</option>
              <option>Стълби без рампа</option>
              <option>Счупен асансьор/ескалатор</option>
              <option>Паркирано превозно средство</option>
              <option>Друго</option>
            </select>
          </div>

          {/* Description Section */}
          <div>
            <label htmlFor="description" className="sr-only">Описание</label>
            <textarea
              id="description"
              name="description"
              rows={4}
              required
              className="block w-full px-4 py-3 border border-border rounded-2xl bg-background/50 placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-sm"
              placeholder="Подробно описание на проблема..."
            ></textarea>
          </div>

          {/* Photo Upload Section */}
          <div>
            <div className="flex items-center text-primary mb-2">
              <FaCamera className="h-6 w-6 mr-2" />
              <h2 className="text-xl font-semibold">Прикачи снимка</h2>
            </div>
            <p className="text-sm text-muted-foreground mb-4 italic">
              Снимката прави вашия сигнал много по-ефективен и помага за по-бързото му разрешаване.
            </p>
            <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-border border-dashed rounded-xl">
              <div className="space-y-1 text-center">
                <svg className="mx-auto h-12 w-12 text-muted-foreground" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <div className="flex text-sm text-muted-foreground justify-center">
                  <label htmlFor="file-upload" className="relative cursor-pointer font-medium text-primary hover:text-blue-700 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary">
                    <span>Качи файл</span>
                    <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                  </label>
                  <p className="pl-1">или плъзни и пусни</p>
                </div>
                <p className="text-xs text-muted-foreground/80">PNG, JPG, GIF до 10MB</p>
              </div>
            </div>
          </div>
          
          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-full bg-primary shadow-lg hover:scale-105 transition-transform text-primary-foreground dark:text-white"
            >
              <FaPaperPlane className="mr-2" />
              Изпрати сигнал
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}