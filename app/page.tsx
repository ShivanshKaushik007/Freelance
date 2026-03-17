import Image from "next/image";
import Link from "next/link";

const services = [
  {
    title: "नवजात शिशु से 17 वर्ष तक",
    detail: "बच्चों का सम्पूर्ण इलाज और सतत फॉलो-अप।",
  },
  {
    title: "24 x 7 बाल रोग विशेषज्ञ",
    detail: "प्रशिक्षित NICU नर्सिंग स्टाफ हर समय उपलब्ध।",
  },
  {
    title: "24 x 7 इमरजेंसी सुविधा",
    detail: "आपातकालीन स्थिति में तुरंत चिकित्सा सहायता।",
  },
  {
    title: "नवजात एम्बुलेंस ट्रांसपोर्ट",
    detail: "समर्पित नवजात एम्बुलेंस सेवा सुरक्षित ट्रांसफर हेतु।",
  },
];

const doctorQualifications = [
  "एम.बी.बी.एस., डी.एन.बी. (स्वामी दयानंद हॉस्पिटल, दिल्ली)",
  "डी.सी.एच. (जी.एस.वी.एम., कानपुर)",
  "फेलोशिप इन पीडियाट्रिक पल्मोनोलॉजी एंड ब्रोंकोस्कोपी",
  "एस.एन.एन.एफ., पी.जी.पी.एन. (बोस्टन)",
  "पूर्व सीनियर रेजिडेंट (सरस्वती मेडिकल कॉलेज, लखनऊ)",
];

const faqs = [
  {
    q: "अपॉइंटमेंट कैसे बुक करें?",
    a: "अपनी पसंद का स्लॉट चुनें, डॉक्टर चुनें, मरीज विवरण भरें और भुगतान करें।",
  },
  {
    q: "रिपोर्ट कितने समय में मिलती है?",
    a: "अधिकांश जांच रिपोर्ट 6 से 24 घंटे में उपलब्ध हो जाती हैं।",
  },
  {
    q: "क्या इमरजेंसी में अग्रिम भुगतान जरूरी है?",
    a: "इमरजेंसी में तुरंत इलाज शुरू किया जाता है, भुगतान बाद में किया जा सकता है।",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b border-black/5 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="relative h-20 w-20 overflow-hidden rounded-full bg-white shadow">
              <Image
                src="/logo.png"
                alt="Ayushman Well Baby Hospital"
                fill
                className="object-contain"
                priority
              />
            </div>
            <div>
              <p className="text-lg font-semibold text-teal-900">
                Ayushman Well Baby Hospital
              </p>
              <p className="text-xs uppercase tracking-[0.24em] text-teal-700">
                Care That Never Quits
              </p>
            </div>
          </div>
          <nav className="hidden items-center gap-6 text-base font-medium text-slate-700 md:flex">
            <a href="#services" className="hover:text-teal-800">
              सेवाएं
            </a>
            <a href="#doctors" className="hover:text-teal-800">
              डॉक्टर
            </a>
            <a href="#process" className="hover:text-teal-800">
              प्रक्रिया
            </a>
            <a href="#faq" className="hover:text-teal-800">
              प्रश्न
            </a>
            <a href="#contact" className="hover:text-teal-800">
              संपर्क
            </a>
          </nav>
          <Link
            href="/booking"
            className="rounded-full bg-teal-800 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-teal-900/20 transition hover:bg-teal-900"
          >
            बुक अपॉइंटमेंट
          </Link>
        </div>
      </header>

      <main>
        <section className="section-pad">
          <div className="mx-auto grid max-w-6xl items-center gap-10 px-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full bg-teal-100 px-4 py-1 text-xs font-semibold text-teal-800">
                भरोसेमंद देखभाल
              </p>
              <h1 className="mt-6 text-4xl font-semibold leading-tight text-slate-900 sm:text-5xl">
                परिवार के लिए सुरक्षित, आधुनिक और मानवीय स्वास्थ्य सेवा
              </h1>
              <p className="mt-4 max-w-xl text-lg text-slate-700">
                Ayushman Well Baby Hospital में उन्नत तकनीक, अनुभवी डॉक्टर और दयालु
                देखभाल का संगम है। अब स्लॉट चुनें, डॉक्टर चुनें और सुरक्षित
                ऑनलाइन भुगतान के साथ अपॉइंटमेंट पक्का करें।
              </p>
              <div className="mt-6 flex flex-wrap gap-4">
                <Link
                  href="/booking"
                  className="rounded-full bg-teal-800 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-teal-900/20 transition hover:bg-teal-900"
                >
                  अपॉइंटमेंट बुक करें
                </Link>
                <a
                  href="#services"
                  className="rounded-full border border-teal-800/30 px-6 py-3 text-sm font-semibold text-teal-900 transition hover:border-teal-800"
                >
                  सेवाएं देखें
                </a>
              </div>
              <div className="mt-8 grid grid-cols-3 gap-4 text-center text-sm text-slate-700">
                <div className="glass rounded-2xl px-4 py-3">
                  <p className="text-xl font-semibold text-slate-900">40+</p>
                  <p>विशेषज्ञ डॉक्टर</p>
                </div>
                <div className="glass rounded-2xl px-4 py-3">
                  <p className="text-xl font-semibold text-slate-900">98%</p>
                  <p>मरीज संतुष्टि</p>
                </div>
                <div className="glass rounded-2xl px-4 py-3">
                  <p className="text-xl font-semibold text-slate-900">15k+</p>
                  <p>सफल उपचार</p>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="glass rounded-[32px] p-6">
                <div className="rounded-3xl bg-gradient-to-br from-teal-100 via-white to-amber-100 ">
                  <div className="relative w-full">
                    <Image
                      src="/doctor.jpeg"
                      alt="Doctor"
                      width={640}
                      height={480}
                      className="h-auto w-full rounded-2xl object-contain"
                      sizes="(max-width: 1024px) 100vw, 480px"
                    />
                  </div>

                  
                  
                </div>
              </div>
              <div className="absolute -bottom-8 -left-6 hidden rounded-2xl bg-white px-5 py-4 shadow-lg lg:block">
                <p className="text-xl font-semibold text-slate-900">डॉ० रवि एस० त्रिपाठी</p>
              </div>
            </div>
          </div>
        </section>

        <section id="services" className="section-pad">
          <div className="mx-auto max-w-6xl px-6">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase  text-teal-700">
                  हमारी सेवाएं
                </p>
                <h2 className="mt-3 text-3xl font-semibold text-slate-900">
                  हर चरण में विशेषज्ञ देखभाल
                </h2>
              </div>
              <p className="max-w-md text-sm text-slate-600">
                मल्टीस्पेशलिटी टीम, आधुनिक इंफ्रास्ट्रक्चर और मरीज-केंद्रित अनुभव।
              </p>
            </div>
            <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {services.map((service) => (
                <div key={service.title} className="glass rounded-3xl p-6">
                  <h3 className="text-lg font-semibold text-slate-900">
                    {service.title}
                  </h3>
                  <p className="mt-2 text-sm text-slate-600">{service.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="doctors" className="section-pad">
          <div className="mx-auto max-w-6xl px-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase  text-teal-700">
                  डॉक्टर परिचय
                </p>
                <h2 className="mt-3 text-3xl font-semibold text-slate-900">
                  डॉ. रवि एस० त्रिपाठी
                </h2>
              </div>
              <Link
                href="/booking"
                className="rounded-full border border-slate-200 px-5 py-2 text-sm font-semibold text-slate-700 hover:border-teal-600 hover:text-teal-700"
              >
                अपॉइंटमेंट लें
              </Link>
            </div>
            <div className="mt-10 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
              <div className="glass rounded-3xl p-6">
                <p className="text-sm font-semibold text-teal-700">
                  योग्यता और अनुभव
                </p>
                <ul className="mt-4 space-y-3 text-sm text-slate-700">
                  {doctorQualifications.map((item) => (
                    <li key={item} className="flex gap-3">
                      <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-teal-700"></span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="glass rounded-3xl p-6">
                <div className="rounded-2xl bg-gradient-to-br from-teal-100 via-white to-amber-100 p-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-teal-700">
                    एकमात्र विशेषज्ञ डॉक्टर
                  </p>
                  <p className="mt-3 text-lg font-semibold text-slate-900">
                    बच्चों की श्वसन एवं सामान्य देखभाल
                  </p>
                  <p className="mt-2 text-sm text-slate-600">
                    परिवार-केंद्रित परामर्श, सटीक डायग्नोसिस और दयालु उपचार।
                  </p>
                  <Link
                    href="/booking"
                    className="mt-5 inline-flex rounded-full bg-teal-800 px-5 py-2 text-sm font-semibold text-white"
                  >
                    समय बुक करें
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="process" className="section-pad">
          <div className="mx-auto max-w-6xl px-6">
            <div className="glass rounded-[32px] p-10">
              <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr]">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.32em] text-teal-700">
                    बुकिंग प्रक्रिया
                  </p>
                  <h2 className="mt-4 text-3xl font-semibold text-slate-900">
                    4 आसान कदमों में अपॉइंटमेंट
                  </h2>
                  <p className="mt-3 text-sm text-slate-600">
                    स्लॉट चुनें, डॉक्टर चुनें, मरीज जानकारी भरें और तुरंत पुष्टि पाएं।
                  </p>
                  <Link
                    href="/booking"
                    className="mt-6 inline-flex rounded-full bg-teal-800 px-6 py-3 text-sm font-semibold text-white"
                  >
                    अभी बुक करें
                  </Link>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  {[
                    "अपना पसंदीदा दिन और समय चुनें",
                    "विशेषज्ञ डॉक्टर का चयन करें",
                    "मरीज का विवरण भरें",
                    "बुकिंग कन्फर्म करें",
                  ].map((step, index) => (
                    <div
                      key={step}
                      className="rounded-3xl bg-white/90 p-5 text-sm text-slate-700 shadow"
                    >
                      <p className="text-xs font-semibold text-teal-700">
                        चरण {index + 1}
                      </p>
                      <p className="mt-2 font-medium text-slate-900">{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section-pad">
          <div className="mx-auto max-w-6xl px-6">
            <div className="grid gap-6 lg:grid-cols-3">
              {[
                {
                  title: "मरीज फीडबैक",
                  text: "आरोग्यदीप में प्रक्रिया बेहद आसान और टीम बहुत सहयोगी है।",
                  name: "नेहा शर्मा",
                },
                {
                  title: "आपातकालीन सेवा",
                  text: "कम समय में सही उपचार मिला, बहुत धन्यवाद।",
                  name: "अमित गुप्ता",
                },
                {
                  title: "ऑनलाइन अपॉइंटमेंट",
                  text: "बुकिंग से लेकर रिपोर्ट तक सब कुछ व्यवस्थित रहा।",
                  name: "रितिका नायर",
                },
              ].map((story) => (
                <div key={story.name} className="glass rounded-3xl p-6">
                  <p className="text-sm font-semibold text-teal-700">
                    {story.title}
                  </p>
                  <p className="mt-3 text-base text-slate-700">{story.text}</p>
                  <p className="mt-4 text-xs font-semibold text-slate-500">
                    — {story.name}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="faq" className="section-pad">
          <div className="mx-auto max-w-5xl px-6">
            <div className="text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-teal-700">
                सामान्य प्रश्न
              </p>
              <h2 className="mt-3 text-3xl font-semibold text-slate-900">
                आपके सवाल, हमारे जवाब
              </h2>
            </div>
            <div className="mt-10 grid gap-4">
              {faqs.map((faq) => (
                <div key={faq.q} className="glass rounded-3xl p-6">
                  <h3 className="text-base font-semibold text-slate-900">
                    {faq.q}
                  </h3>
                  <p className="mt-2 text-sm text-slate-600">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="contact" className="section-pad">
          <div className="mx-auto max-w-6xl px-6">
            <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="glass rounded-[32px] p-8">
                <h2 className="text-3xl font-semibold text-slate-900">
                  हमसे जुड़े, हम हमेशा पास हैं
                </h2>
                <p className="mt-3 text-sm text-slate-600">
                  24x7 इमरजेंसी हेल्पलाइन, लाइव चैट और त्वरित सहायता।
                </p>
                <div className="mt-6 grid gap-4 text-sm text-slate-700">
                  <div>
                    <p className="font-semibold text-slate-900">फोन</p>
                    <p>7607711316, 9990222604</p>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">ईमेल</p>
                    <p>ayushmanhospital55@gmail.com</p>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">पता</p>
                    <p>निकट-फातिमा इंटर कॉलेज, सरकुलर रोड-गोंडा</p>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">परामर्श समय</p>
                    <p>प्रतिदिन सुबह 10:00 बजे से रात 08:00 बजे तक</p>
                  </div>
                </div>
              </div>
              <div className="rounded-[32px] bg-slate-900 p-8 text-white">
                <p className="text-xs font-semibold uppercase text-amber-200">
                  आपातकालीन हेल्पलाइन
                </p>
                <h3 className="mt-4 text-3xl font-semibold">7607711316</h3>
                <p className="mt-3 text-sm text-slate-200">
                  तुरंत सहायता के लिए कॉल करें। हमारी टीम हर समय तैयार है।
                </p>
                <div className="mt-5 overflow-hidden rounded-2xl border border-white/10">
                  <a
                    href="https://maps.google.com/?q=27.138079,81.971970"
                    target="_blank"
                    rel="noreferrer"
                    className="block"
                    aria-label="Open hospital location in Google Maps"
                  >
                    <iframe
                      title="Hospital location"
                      src="https://www.google.com/maps?q=27.138079,81.971970&output=embed"
                      className="h-44 w-full border-0"
                      loading="lazy"
                    />
                  </a>
                </div>
                <Link
                  href="/booking"
                  className="mt-6 inline-flex rounded-full bg-amber-200 px-5 py-3 text-sm font-semibold text-slate-900"
                >
                  ऑनलाइन अपॉइंटमेंट
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-black/5 bg-white/70">
        <div className="mx-auto flex flex-wrap items-center justify-between gap-4 px-6 py-6 text-xs text-slate-500">
          <div className="flex items-center gap-3">
            <div className="relative h-12 w-12 overflow-hidden rounded-full bg-white shadow">
              <Image
                src="/logo.png"
                alt="Ayushman Well Baby Hospital"
                fill
                className="object-contain"
              />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800">
                Ayushman Well Baby Hospital
              </p>
              <p className="text-[11px] uppercase tracking-[0.2em] text-teal-700">
                Care That Never Quits
              </p>
            </div>
          </div>
          <p>© 2026 Ayushman Well Baby Hospital. सभी अधिकार सुरक्षित।</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-slate-700">
              प्राइवेसी
            </a>
            <a href="#" className="hover:text-slate-700">
              शर्तें
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
