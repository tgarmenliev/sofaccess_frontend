import { FaMapMarkedAlt, FaHandsHelping, FaEnvelope } from "react-icons/fa";
import Image from "next/image"; // Import the Image component from Next.js

export default function AboutPage() {
  return (
    <div className="relative bg-background text-foreground min-h-screen pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
        {/* Header Section */}
        <div className="pt-10 pb-12 w-full max-w-4xl">
          <h2 className="text-base text-primary font-semibold tracking-wide uppercase">За нас</h2>
          <h1 className="mt-2 text-4xl md:text-5xl font-extrabold tracking-tight sm:text-6xl font-sofia text-balance">
            SOFaccess: Град, Достъпен за Всички
          </h1>
          <p className="mt-6 max-w-2xl text-lg md:text-xl text-muted-foreground mx-auto leading-relaxed">
            SOFaccess е гражданска инициатива, посветена на преобразяването на София в един по-отворен, по-сигурен и по-приобщаващ град за всички негови жители.
          </p>
        </div>

        {/* Mission and Vision Section */}
        <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-12 mt-10">
          <div className="flex flex-col items-center text-center">
            <FaMapMarkedAlt className="text-primary h-12 w-12 mb-4" />
            <h3 className="text-2xl font-semibold text-foreground mb-2">Нашата Мисия</h3>
            <p className="text-base text-muted-foreground leading-relaxed">
              Нашата мисия е да дадем на хората силата да навигират своя град безопасно и да докладват за препятствията в градската среда. Вярваме, че чрез събиране на данни от общността, можем да създадем изчерпателна карта на градската достъпност и да подкрепим изграждането на един по-достъпен град.
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <FaHandsHelping className="text-primary h-12 w-12 mb-4" />
            <h3 className="text-2xl font-semibold text-foreground mb-2">Нашата Визия</h3>
            <p className="text-base text-muted-foreground leading-relaxed">
              Визията ни е за град, в който хората с увреждания, родителите с детски колички и възрастните граждани могат да се движат свободно и без бариери. Град, който е проектиран с мисъл за всеки, където достъпността не е изключение, а основна норма.
            </p>
          </div>
        </div>

        {/* Visionaries Academy Section */}
        <div className="w-full max-w-3xl mt-20">
          <div className="bg-muted/50 rounded-2xl border border-border p-6 flex flex-col sm:flex-row items-center gap-6">
            <Image
              src="https://upload.wikimedia.org/wikipedia/commons/f/fc/BG_Sofia_coa.svg"
              alt="Герб на Столична община"
              width={80}
              height={80}
              className="flex-shrink-0"
            />
            <p className="text-base font-medium text-muted-foreground text-balance">
              Проектът е част от <strong className="font-semibold text-foreground">Академия за ВИЗИОНЕРИ 2025</strong> към Столична община.
            </p>
          </div>
        </div>

        {/* Contact Section */}
        <div className="w-full max-w-2xl mt-20 mb-10 text-center">
          <h3 className="text-2xl font-semibold text-foreground mb-4">Свържете се с нас</h3>
          <p className="text-lg text-muted-foreground mb-4">
            Ако имате въпроси, предложения или искате да се включите в инициативата, не се колебайте да ни пишете.
          </p>
          <div className="flex items-center justify-center gap-4 text-lg">
            <FaEnvelope className="text-primary h-6 w-6" />
            <a href="mailto:sofaccess.project@gmail.com" className="text-primary font-medium hover:underline transition-colors">
              sofaccess.project@gmail.com
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}