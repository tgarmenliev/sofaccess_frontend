import type { Metadata } from "next";
import "./globals.css";
import { Inter, Sofia_Sans } from "next/font/google";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const sofiaSans = Sofia_Sans({
  subsets: ["latin"],
  variable: "--font-sofia-sans",
});

export const metadata: Metadata = {
  title: "SOFaccess",
  description:
    "Лесно навигирайте в София. Докладвайте препятствия и намирайте достъпни маршрути.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bg">
      <body className={`${inter.variable} ${sofiaSans.variable} font-sans bg-background text-foreground`}>
        <Navbar />
        <main className="pt-16">{children}</main>
      </body>
    </html>
  );
}