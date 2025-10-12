"use client";

import { useState, useEffect } from "react";
import { FaChevronRight } from "react-icons/fa";
import Link from "next/link";

const faqData = [
  {
    question: "Какво е SOFaccess?",
    answer: (
      <>
        <p>Накратко: SOFaccess е гражданска инициатива, създадена <strong className="font-semibold text-foreground">за хората</strong>, с цел докладване на проблеми с достъпността в градската среда на София. Това включва всичко, което затруднява свободното придвижване – разбити тротоари, липса на рампи, счупени асансьори в подлези, неправилно паркирани автомобили и други.</p>
        <p>Идеята е чрез силата на общността да съберем актуална информация на едно място и да я визуализираме на карта, така че да бъде полезна както за гражданите, така и за институциите.</p>
        <p className="font-semibold">Проектът е част от <strong className="text-primary">Академия за ВИЗИОНЕРИ 2025</strong> към Столична община.</p>
      </>
    ),
  },
  {
    question: "Как да подам сигнал?",
    answer: (
      <p>
        Лесно е! Просто отидете на страницата <Link href="/report" className="text-primary font-bold hover:underline">&apos;Докладвай&apos;</Link>. Формата ще ви преведе през три лесни стъпки: задаване на местоположение, добавяне на кратко описание и прикачване на снимка. Това е всичко!
      </p>
    ),
  },
  {
    question: "Къде отива моят сигнал, след като го изпратя?",
    answer: (
      <>
        <p>Вашият сигнал е важен за нас! За да избегнем злоупотреби и спам, всеки подаден сигнал първо се преглежда от наш администратор.</p>
        <p>След като бъде одобрен, той става **публично видим** за всички на <Link href="/map" className="text-primary font-bold hover:underline">интерактивната карта</Link>. Работим активно и по интеграция със Столична община, така че в бъдеще одобрените сигнали да достигат директно и до тях.</p>
      </>
    )
  },
    {
    question: "Как да разглеждам вече подадени сигнали?",
    answer: (
      <p>
        Всички активни и одобрени сигнали са визуализирани на <Link href="/map" className="text-primary font-bold hover:underline">интерактивната карта</Link>. Червените точки показват нерешени проблеми, а зелените – разрешени. Можете да кликнете на всяка точка, за да видите повече детайли.
      </p>
    ),
  },
  {
    question: "За кого е насочен проектът?",
    answer: (
      <>
        <p>
          SOFaccess е за <strong>всеки</strong>, който се сблъсква с предизвикателства в градската среда. Проектът е особено полезен за:
        </p>
        <ul className="list-disc list-inside mt-2 pl-4">
          <li>Хора с двигателни увреждания.</li>
          <li>Родители с детски колички.</li>
          <li>Възрастни граждани.</li>
          <li>Хора с временно намалена подвижност.</li>
          <li>Всеки гражданин, който иска да помогне за една по-достъпна София.</li>
        </ul>
      </>
    ),
  },
  {
    question: "Безплатно ли е използването на платформата?",
    answer: (
      <p>
        Да, абсолютно! SOFaccess е напълно безплатна гражданска инициатива и винаги ще бъде такава.
      </p>
    ),
  },
  {
    question: "Какво е нужно от мен, за да подам сигнал?",
    answer: (
      <p>
        Нужно е само желание! Не се изисква регистрация и целият процес е анонимен. Единственото, което трябва да направите, е да опишете проблема, да посочите мястото и да прикачите снимка, за да е ясен казусът. Вашият глас има значение!
      </p>
    ),
  },
  {
    id: "why-resolved",
    question: "Защо мога да подавам сигнал за вече разрешен проблем?",
    answer: (
        <>
            <p>Чудесен въпрос! Нашият екип от администратори следи активно подадените сигнали и проверява дали са разрешени. Но градът е голям и понякога Вие, гражданите, сте първите, които забелязват, че даден проблем е отстранен.</p>
            <p>Тази опция Ви дава възможност да ни помогнете, като ни информирате за разрешен казус. Всеки такъв сигнал ще бъде прегледан внимателно от администратор и ако информацията се потвърди, ще актуализираме статуса на картата. Благодарим Ви, че помагате!</p>
        </>
    )
  },
  {
    question: "Изписва ми грешка за местоположението. Как да го оправя?",
    answer: (
      <>
        <p>Това обикновено означава, че сте отказали достъп до местоположението на браузъра си. За да го разрешите, трябва да промените настройките за достъп на сайта в самия браузър.</p>
        <h3 className="text-lg font-semibold mt-4 mb-2">На телефон или таблет:</h3>
        <ul className="list-disc list-inside pl-4 space-y-2">
          <li>
            <strong>iPhone/iPad:</strong> Отидете в Настройки → Поверителност и сигурност → Услуги за местоположение. Уверете се, че са включени. След това намерете Safari в списъка и му разрешете достъп.
            <Link href="https://support.apple.com/bg-bg/102422" target="_blank" rel="noopener noreferrer" className="text-primary text-sm block hover:underline">Официално ръководство от Apple</Link>
          </li>
          <li>
            <strong>Android:</strong> Отворете Chrome, отидете на сайта, натиснете иконата с катинарче 🔒 вляво от адреса, изберете &apos;Разрешения&apos; и включете &apos;Местоположение&apos;.
            <Link href="https://support.google.com/chrome/answer/142065?hl=bg" target="_blank" rel="noopener noreferrer" className="text-primary text-sm block hover:underline">Официално ръководство от Google</Link>
          </li>
        </ul>
        <h3 className="text-lg font-semibold mt-4 mb-2">На компютър:</h3>
        <ul className="list-disc list-inside pl-4 space-y-2">
          <li><strong>Chrome:</strong> Кликнете на катинарчето 🔒 вляво от адреса, намерете &apos;Местоположение&apos; и го разрешете.</li>
          <li><strong>Firefox:</strong> Кликнете на иконата вляво от адреса, намерете реда за &apos;Достъп до местоположението&apos; и премахнете временната или постоянна забрана.
            <Link href="https://support.mozilla.org/bg/kb/does-firefox-share-my-location-websites" target="_blank" rel="noopener noreferrer" className="text-primary text-sm block hover:underline">Официално ръководство от Mozilla</Link>
          </li>
          <li><strong>Safari:</strong> Отворете Safari → Настройки → Уебсайтове. Отляво изберете &apos;Местоположение&apos;, намерете сайта в списъка и му задайте &apos;Позволи&apos;.</li>
        </ul>
        <p className="mt-4">След като промените настройките, презаредете страницата.</p>
      </>
    ),
  },
    {
    question: "Искам да помогна или имам въпрос, как да се свържа?",
    answer: (
      <p>
        Страхотно! Всяка помощ е добре дошла. Ако искате да се включите към екипа или имате въпроси, ще се радваме да ни пишете. Можете да намерите имейл за контакт и повече информация за инициативата на страницата <Link href="/about" className="text-primary font-bold hover:underline">&apos;За нас&apos;</Link>.
      </p>
    ),
  },
];

const AccordionItem = ({
  id,
  question,
  answer,
  isOpen,
  onClick,
}: {
  id?: string;
  question: string;
  answer: React.ReactNode;
  isOpen: boolean;
  onClick: () => void;
}) => {
  return (
    <div className="border-b border-border" id={id}>
      <button
        onClick={onClick}
        className="flex justify-between items-center w-full py-5 text-left text-lg font-semibold"
      >
        <span>{question}</span>
        <FaChevronRight
          className={`transform transition-transform duration-300 ${
            isOpen ? "rotate-90" : ""
          }`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-screen" : "max-h-0"
        }`}
      >
        <div className="pb-5 pr-4 text-muted-foreground leading-relaxed">{answer}</div>
      </div>
    </div>
  );
};


export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  // This effect runs once when the component mounts on the client
  useEffect(() => {
    // Check if there is a hash in the URL
    const hash = window.location.hash;
    if (hash) {
      // Remove the '#' symbol to get the ID
      const targetId = hash.substring(1);
      // Find the index of the FAQ item with the matching ID
      const targetIndex = faqData.findIndex(faq => faq.id === targetId);
      
      // If found, set it as the open accordion item
      if (targetIndex !== -1) {
        setOpenIndex(targetIndex);
      }
    }
  }, []);

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-base text-primary font-semibold tracking-wide uppercase">Често задавани въпроси</h2>
          <h1 className="mt-2 text-4xl md:text-5xl font-extrabold tracking-tight sm:text-6xl font-sofia">
            Как можем да помогнем?
          </h1>
          <p className="mt-6 text-lg text-muted-foreground">
            Тук сме събрали отговори на най-често срещаните въпроси относно платформата SOFaccess.
          </p>
        </div>

        <div className="mt-16 max-w-3xl mx-auto">
          {faqData.map((faq, index) => (
            <AccordionItem
              key={index}
              id={faq.id}
              question={faq.question}
              answer={faq.answer}
              isOpen={openIndex === index}
              onClick={() => handleToggle(index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}