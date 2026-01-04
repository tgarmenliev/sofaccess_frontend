import Link from "next/link";
import { FaWheelchair, FaBabyCarriage, FaBlind, FaMapMarkedAlt, FaExclamationTriangle, FaUsers, FaShieldAlt } from "react-icons/fa";
import Image from "next/image";
import StatsCounter from "./components/StatsCounter";
import ChristmasHero from "./components/ChristmasHero";

export default function LandingPage() {
  return (
    <div className="relative bg-background text-foreground">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <Image
          src="https://velstana.com/wp-content/uploads/Example_Bulgaria_Culture-trip_Sofia-Aleksander-Nevsky.jpeg"
          alt="City of Sofia"
          fill
          className="object-cover brightness-75"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-br from-background/70 to-primary/30 backdrop-blur-sm" />

        {/* <ChristmasHero /> */}

        <div className="relative z-10 text-center max-w-3xl px-4 md:px-6">
          <h1 className="font-sofia font-extrabold text-5xl md:text-6xl lg:text-7xl text-white drop-shadow-lg break-words text-balance">
            София - достъпна за всички
          </h1>
          <p className="mt-6 text-lg md:text-2xl text-white/90 leading-relaxed break-words text-balance">
            Намерете достъпни маршрути, докладвайте препятствия и помогнете за изграждането на по-достъпен град.
          </p>

          {/* CTA Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center w-full">
            <Link
              href="/map"
              className="px-6 py-4 bg-primary text-white rounded-xl text-lg font-semibold shadow-lg hover:scale-105 transition-transform backdrop-blur-md max-w-xs w-full mx-auto"
            >
              <FaMapMarkedAlt className="inline-block mr-2" />
              Виж картата
            </Link>
            <Link
              href="/report"
              className="px-6 py-4 bg-white/20 text-white rounded-xl text-lg font-semibold shadow-lg hover:bg-white/30 hover:scale-105 transition-transform backdrop-blur-md max-w-xs w-full mx-auto"
            >
              <FaExclamationTriangle className="inline-block mr-2" />
              Докладвай проблем
            </Link>
          </div>

          {/* User Groups */}
          <div className="mt-10 flex flex-col md:flex-row justify-center gap-4 md:gap-8 text-white/90 w-full">
            <div className="flex items-center gap-2 justify-center">
              <FaWheelchair className="h-6 w-6 text-primary" />
              <span>Хора с увреждания</span>
            </div>
            <div className="flex items-center gap-2 justify-center">
              <FaBabyCarriage className="h-6 w-6 text-primary" />
              <span>Родители с колички</span>
            </div>
            <div className="flex items-center gap-2 justify-center">
              <FaBlind className="h-6 w-6 text-primary" />
              <span>Възрастни граждани</span>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-background">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 font-sofia">
            Какво е SOFaccess?
          </h2>
          <p className="text-muted-foreground max-w-3xl mx-auto text-lg mb-12">
            SOFaccess е платформа, създадена да направи София по-достъпна за всеки.
            Чрез общността, технологиите и споделените данни можем да създадем
            по-сигурен и удобен град.
          </p>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Card 1: Map */}
            <Link href="/map" className="block h-full">
              <div className="p-6 rounded-2xl bg-background/60 backdrop-blur-sm shadow-lg border border-border hover:shadow-strong hover:scale-[1.02] transition-all duration-300 h-full cursor-pointer group">
                <FaMapMarkedAlt className="text-primary h-10 w-10 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">Виж картата</h3>
                <p className="text-muted-foreground">И намери безопасни и достъпни маршрути в цяла София.</p>
              </div>
            </Link>

            {/* Card 2: Report */}
            <Link href="/report" className="block h-full">
              <div className="p-6 rounded-2xl bg-background/60 backdrop-blur-sm shadow-lg border border-border hover:shadow-strong hover:scale-[1.02] transition-all duration-300 h-full cursor-pointer group">
                <FaExclamationTriangle className="text-primary h-10 w-10 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">Докладвай проблем</h3>
                <p className="text-muted-foreground">Съобщи за препятствия и помогни на общността.</p>
              </div>
            </Link>

            {/* Card 3: About/Community */}
            <Link href="/about" className="block h-full">
              <div className="p-6 rounded-2xl bg-background/60 backdrop-blur-sm shadow-lg border border-border hover:shadow-strong hover:scale-[1.02] transition-all duration-300 h-full cursor-pointer group">
                <FaUsers className="text-primary h-10 w-10 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">Общност</h3>
                <p className="text-muted-foreground">Присъедини се към гражданите, които изграждат по-добра София.</p>
              </div>
            </Link>

          </div>
        </div>
      </section>
      
      <StatsCounter />

      {/* Call to Action */}
      <section className="relative py-28 overflow-hidden bg-gray-100 dark:bg-gray-700 flex items-center justify-center min-h-[420px]">

        {/* Report now section */}
        <div className="relative z-10 max-w-3xl w-full mx-auto px-6">
          <div className="backdrop-blur-2xl bg-white/20 dark:bg-gray-900/30 rounded-3xl shadow-2xl border border-white/30 dark:border-gray-700/60 px-8 py-14 flex flex-col items-center gap-6 animate-fade-in-up">
            <h2 className="text-4xl md:text-5xl font-extrabold font-sofia text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-blue-500 to-emerald-500 drop-shadow-xl mb-2 animate-text-glow py-2">
              Вашият сигнал прави София по-достъпна
            </h2>
            <p className="text-xl md:text-2xl text-primary dark:text-white/80 font-medium mb-6 max-w-2xl animate-fade-in">
              Присъединете се към общността и направете своя принос. Заедно можем да изградим по-добър град за всички.
            </p>
            <Link
              href="/report"
              className="inline-flex items-center gap-2 px-12 py-5 bg-gradient-to-r from-blue-400 via-blue-500 to-emerald-500 text-white rounded-full text-2xl font-bold shadow-xl hover:scale-105 transition-transform hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-primary/40"
            >
              <FaShieldAlt className="inline-block text-3xl" />
              Докладвай сега
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}