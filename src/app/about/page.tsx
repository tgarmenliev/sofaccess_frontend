export default function AboutPage() {
  return (
    <div className="bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-base text-primary font-semibold tracking-wide uppercase">За нас</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl font-sofia">
            Правим София по-достъпна за всички
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            SOFaccess е проект за гражданска технология, посветен на подобряване на градската достъпност за всички.
          </p>
        </div>

        <div className="mt-10">
          <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
            <div className="relative">
              <dt>
                <p className="text-lg leading-6 font-medium text-gray-900">Our Mission</p>
              </dt>
              <dd className="mt-2 text-base text-gray-500">
                Our mission is to empower citizens with the tools to navigate their city safely and report accessibility barriers. We believe that by crowdsourcing this data, we can create a comprehensive, real-time map of urban accessibility and advocate for a more inclusive urban environment.
              </dd>
            </div>
            <div className="relative">
              <dt>
                <p className="text-lg leading-6 font-medium text-gray-900">Our Vision</p>
              </dt>
              <dd className="mt-2 text-base text-gray-500">
                We envision a city where people with disabilities, parents with strollers, and the elderly can move freely and without barriers. A city that is designed with everyone in mind.
              </dd>
            </div>
          </div>
        </div>
         <div className="mt-12 lg:text-center">
            <h3 className="text-2xl font-extrabold text-gray-900 font-sofia">Our Partners</h3>
            <div className="mt-4 flex justify-center">
                <img className="h-28" src="https://ogf-sofia.com/wp-content/uploads/2018/05/stolichna-obshtina.png" alt="Sofia Municipality" />
            </div>
        </div>
      </div>
    </div>
  );
}