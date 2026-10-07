import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { AuthProvider } from "@/context/AuthContext";
import "./globals.css";

export const metadata: Metadata = {
  title: "मंगलम विंध्याचल धाम — RAKA Mishra | दर्शन, पूजा, पंडित जी, होटल सहायता",
  description:
    "विंध्याचल यात्रा में दर्शन सहायता, वैदिक पूजा, पंडित जी, माँ श्रृंगार, होटल, भोजन एवं वाहन सेवा। RAKA Mishra — स्थानीय तीर्थ सहायक। हेल्पलाइन: 8739000333",
  keywords: "विंध्याचल दर्शन, माँ विंध्यवासिनी, RAKA Mishra, पंडित जी, त्रिकोण परिक्रमा, विंध्याचल होटल, पूजा सेवा, तीर्थ सहायता, मुंडन संस्कार, गंगा स्नान",
  openGraph: {
    title: "मंगलम विंध्याचल धाम — RAKA Mishra",
    description: "विंध्याचल यात्रा में दर्शन, पूजा, ठहरने और वाहन सहायता। हेल्पलाइन: 8739000333",
    locale: "hi_IN",
    type: "website",
  },
};


export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale} className="h-full">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#FFFFFF" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@300;400;500;600;700;800&family=Mukta:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="h-full" suppressHydrationWarning>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <AuthProvider>{children}</AuthProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
