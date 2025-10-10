// app/layout.tsx

"use client";
import "./globals.css";
import { Inter, Sofia_Sans } from "next/font/google";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { usePathname } from "next/navigation";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const sofiaSans = Sofia_Sans({
  subsets: ["latin"],
  variable: "--font-sofia-sans",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  return (
    <html lang="bg">
      <head>
          <title>SOFaccess</title>
          <meta name="description" content="Лесно навигирайте в София. Докладвайте препятствия и намирайте достъпни маршрути." />
      </head>
      <body className={`${inter.variable} ${sofiaSans.variable} font-sans`} suppressHydrationWarning>
        <Navbar />
        <main className={isHomePage ? "" : "pt-16"}>{children}</main>
        <Footer />
      </body>
    </html>
  );
}