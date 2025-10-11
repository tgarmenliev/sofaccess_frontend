export default function TermsOfUsePage() {
  return (
    <div className="bg-background">
      <div className="container mx-auto px-6 py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-foreground">
          <h1 className="text-4xl font-bold font-sofia mb-4 text-center">Условия за ползване на SOFaccess</h1>
          <p className="text-muted-foreground mb-12 text-center">
            <strong>Дата на последна актуализация: 11 октомври 2025 г.</strong>
          </p>

          <p className="text-lg leading-relaxed mb-6">
            Добре дошли в SOFaccess! Моля, прочетете внимателно тези Условия за ползване (&apos;Условията&apos;), преди да използвате нашия уебсайт. Използвайки сайта, вие се съгласявате да бъдете обвързани с тези Условия.
          </p>

          <h2 className="text-3xl font-bold font-sofia mt-10 mb-4">1. Описание на услугата</h2>
          <p className="text-lg leading-relaxed mb-6">
            SOFaccess е гражданска онлайн платформа, която позволява на потребителите анонимно да докладват проблеми с достъпността в градската среда на София. Целта на сайта е да събира и визуализира информация, която да помогне за подобряването на достъпността в града.
          </p>

          <h2 className="text-3xl font-bold font-sofia mt-10 mb-4">2. Отговорности на потребителя</h2>
          <p className="text-lg leading-relaxed mb-4">
            Като потребител на SOFaccess, Вие се съгласявате да НЕ публикувате съдържание (сигнали, описания, снимки), което е:
          </p>
          <ul className="list-disc list-inside space-y-2 text-lg leading-relaxed pl-5 mb-4">
            <li>Незаконно, обидно, заплашително, клеветническо или дискриминационно.</li>
            <li>Невярно, подвеждащо или съзнателно неточно.</li>
            <li>Спам или нежелана реклама.</li>
            <li>Съдържащо лична информация за трети лица без тяхното съгласие.</li>
            <li>Защитено с авторски права, които не притежавате.</li>
          </ul>
          <p className="text-lg leading-relaxed mb-6">
            Вие носите пълна отговорност за съдържанието, което публикувате.
          </p>
          
          <h2 className="text-3xl font-bold font-sofia mt-10 mb-4">3. Права на SOFaccess</h2>
          <p className="text-lg leading-relaxed mb-6">
            Ние си запазваме правото, но не и задължението, да преглеждаме, редактираме или <strong className="font-semibold">премахваме по наша преценка</strong> всяко съдържание (сигнали), което нарушава тези Условия или което сметнем за неподходящо, без предварително уведомление.
          </p>
          
          <h2 className="text-3xl font-bold font-sofia mt-10 mb-4">4. Отказ от отговорност</h2>
          <p className="text-lg leading-relaxed mb-6">
            Информацията на този уебсайт се предоставя на принципа &apos;както е&apos;, без каквито и да било гаранции. Ние не гарантираме точността, пълнотата или актуалността на информацията, публикувана от потребителите. SOFaccess не носи отговорност за каквито и да било щети, произтичащи от използването или невъзможността за използване на този сайт. Вие носите пълна отговорност за решенията, които взимате на база информацията от сайта.
          </p>

          <h2 className="text-3xl font-bold font-sofia mt-10 mb-4">5. Интелектуална собственост</h2>
          <p className="text-lg leading-relaxed mb-6">
            Името SOFaccess, логото, дизайнът и оригиналното съдържание на уебсайта са наша интелектуална собственост и са защитени от закона. Съдържанието, генерирано от потребителите (сигнали), може да бъде свободно използвано за целите на платформата.
          </p>

          <h2 className="text-3xl font-bold font-sofia mt-10 mb-4">6. Промени в Условията</h2>
          <p className="text-lg leading-relaxed mb-6">
            Ние си запазваме правото да променяме тези Условия по всяко време. Вашето продължаващо използване на сайта след такива промени представлява Вашето съгласие с новите Условия.
          </p>

          <h2 className="text-3xl font-bold font-sofia mt-10 mb-4">7. Свържете се с нас</h2>
          <p className="text-lg leading-relaxed">
            Ако имате въпроси относно тези Условия, можете да се свържете с нас на имейл: sofaccess.project@gmail.com.
          </p>
        </div>
      </div>
    </div>
  );
}