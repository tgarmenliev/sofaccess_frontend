// app/privacy/page.tsx

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-background">
      <div className="container mx-auto px-6 py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-foreground">
          <h1 className="text-4xl font-bold font-sofia mb-4 text-center">Политика за поверителност на SOFaccess</h1>
          <p className="text-muted-foreground mb-12 text-center">
            <strong>Дата на последна актуализация: 11 октомври 2025 г.</strong>
          </p>

          <p className="text-lg leading-relaxed mb-6">
            Добре дошли в SOFaccess! Ние ценим Вашата поверителност и сме ангажирани да я защитаваме. Тази Политика за поверителност обяснява каква информация събираме, как я използваме и какви са Вашите права.
          </p>

          <h2 className="text-3xl font-bold font-sofia mt-10 mb-4">1. Каква информация събираме?</h2>
          <p className="text-lg leading-relaxed mb-4">
            Когато използвате нашия уебсайт, за да подадете сигнал, ние събираме следната информация, която Вие предоставяте доброволно:
          </p>
          <ul className="list-disc list-inside space-y-2 text-lg leading-relaxed pl-5 mb-4">
            <li>
              <strong className="font-semibold">Местоположение:</strong> Географски координати (ширина и дължина) и/или текстов адрес на проблема, който докладвате. Това е необходимо, за да можем да поставим маркера на правилното място на картата.
            </li>
            <li>
              <strong className="font-semibold">Описание на проблема:</strong> Текстът, който въвеждате, за да опишете естеството на препятствието.
            </li>
            <li>
              <strong className="font-semibold">Снимка:</strong> Файлът със снимка, който прикачвате към сигнала, за да илюстрирате проблема.
            </li>
          </ul>
          <p className="text-lg leading-relaxed mb-6">
            Ние <strong className="font-semibold">не</strong> събираме лична информация като Вашето име, имейл или IP адрес при подаване на сигнал. Процесът е анонимен.
          </p>

          <h2 className="text-3xl font-bold font-sofia mt-10 mb-4">2. Как използваме Вашата информация?</h2>
          <p className="text-lg leading-relaxed mb-4">
            Информацията, която събираме, се използва изключително за следните цели:
          </p>
          <ul className="list-disc list-inside space-y-2 text-lg leading-relaxed pl-5 mb-4">
            <li>За да публикуваме Вашия сигнал на интерактивната карта на SOFaccess.</li>
            <li>За да предоставим на администраторите и (евентуално) на Столична община информация за съществуващи проблеми с достъпността.</li>
            <li>За да водим статистика за броя подадени и разрешени сигнали.</li>
          </ul>

          <h2 className="text-3xl font-bold font-sofia mt-10 mb-4">3. С кого споделяме Вашата информация?</h2>
          <p className="text-lg leading-relaxed mb-4">
            Сигналите, които подавате (включително местоположение, описание и снимка), са <strong className="font-semibold">публично видими</strong> на картата на уебсайта.
          </p>
          <p className="text-lg leading-relaxed mb-4">
            Ние използваме услугите на трети страни, които ни помагат да функционираме. Това са:
          </p>
          <ul className="list-disc list-inside space-y-2 text-lg leading-relaxed pl-5 mb-4">
            <li><strong className="font-semibold">Supabase:</strong> За съхранение на базата данни (сигнали) и файловете (снимките).</li>
            <li><strong className="font-semibold">Vercel:</strong> За хостинг на уебсайта.</li>
            <li><strong className="font-semibold">OpenStreetMap/Nominatim:</strong> За обработка на адреси и географски данни.</li>
          </ul>
          <p className="text-lg leading-relaxed mb-6">
            Ние не продаваме и не споделяме Вашата информация с трети страни за маркетингови цели.
          </p>
          
          <h2 className="text-3xl font-bold font-sofia mt-10 mb-4">4. Колко време пазим Вашите данни?</h2>
          <p className="text-lg leading-relaxed mb-6">
            Сигналите за проблеми остават в нашата система, докато не бъдат разрешени. След като един сигнал бъде маркиран като "Разрешен" от администратор, той се <strong className="font-semibold">изтрива автоматично и перманентно</strong> от нашата база данни след 7 дни.
          </p>

          <h2 className="text-3xl font-bold font-sofia mt-10 mb-4">5. Вашите права</h2>
          <p className="text-lg leading-relaxed mb-6">
            Въпреки че подаването на сигнали е анонимно, Вие имате право да се свържете с нас, ако смятате, че даден сигнал съдържа чувствителна информация и желаете той да бъде премахнат.
          </p>

          <h2 className="text-3xl font-bold font-sofia mt-10 mb-4">6. Промени в тази политика</h2>
          <p className="text-lg leading-relaxed mb-6">
            Възможно е да актуализираме тази Политика за поверителност периодично. Всички промени ще бъдат публикувани на тази страница.
          </p>
          
          <h2 className="text-3xl font-bold font-sofia mt-10 mb-4">7. Свържете се с нас</h2>
          <p className="text-lg leading-relaxed">
            Ако имате въпроси относно тази Политика за поверителност, можете да се свържете с нас на имейл: sofaccess.project@gmail.com.
          </p>
        </div>
      </div>
    </div>
  );
}