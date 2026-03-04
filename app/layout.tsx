import type { Metadata } from "next";
import Script from "next/script";
import { Noto_Sans_Devanagari, Noto_Serif_Devanagari } from "next/font/google";
import "./globals.css";

const sans = Noto_Sans_Devanagari({
  variable: "--font-sans",
  subsets: ["devanagari", "latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const serif = Noto_Serif_Devanagari({
  variable: "--font-serif",
  subsets: ["devanagari", "latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Ayushman Well Baby Hospital | Care That Never Quits",
  description:
    "Ayushman Well Baby Hospital: आधुनिक सुविधाएं, अनुभवी डॉक्टर, आसान अपॉइंटमेंट और सुरक्षित ऑनलाइन भुगतान।",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID;

  return (
    <html lang="hi">
      <body className={`${sans.variable} ${serif.variable} antialiased`}>
        {gtmId ? (
          <>
            <Script id="gtm" strategy="afterInteractive">
              {`
                (function(w,d,s,l,i){
                  w[l]=w[l]||[];
                  w[l].push({'gtm.start': new Date().getTime(), event:'gtm.js'});
                  var f=d.getElementsByTagName(s)[0],
                    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';
                  j.async=true;
                  j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
                  f.parentNode.insertBefore(j,f);
                })(window,document,'script','dataLayer','${gtmId}');
              `}
            </Script>
            <noscript>
              <iframe
                src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
                height="0"
                width="0"
                style={{ display: "none", visibility: "hidden" }}
              ></iframe>
            </noscript>
          </>
        ) : null}
        {children}
      </body>
    </html>
  );
}
