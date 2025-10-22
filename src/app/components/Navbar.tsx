"use client";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { FaBars, FaTimes } from "react-icons/fa";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      // Scroll threshold
      const isScrolled = window.scrollY > window.innerHeight * 0.8; 
      setScrolled(isScrolled);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial check
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isHomePage = pathname === "/";
  // Determine if the navbar should have a visible background
  const hasBackground = !isHomePage || scrolled; 

  // --- Color Logic ---
  const textColor = hasBackground ? "text-foreground" : "text-white"; 
  const logoTextColor = hasBackground ? "text-primary" : "text-white";
  const mobileTextColor = "text-foreground dark:text-white"; 

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ease-in-out
        ${ 
          hasBackground
            ? "backdrop-blur-xl bg-white/30 dark:bg-black/30 shadow-lg border-b border-white/30 dark:border-black/30"
            : "bg-transparent border-b border-transparent" 
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Section */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative w-6 h-6 group-hover:scale-110 transition-transform duration-300">
              {/* Blue Logo (Visible in Light mode with background, Hidden otherwise) */}
              <Image
                src="/PinLogo.png" 
                alt="SOFaccess Logo Pin"
                width={24}
                height={24}
                // Visible only when background exists AND in light mode. Hidden in dark mode.
                className={`absolute inset-0 transition-opacity duration-300 ${
                  hasBackground ? 'opacity-100' : 'opacity-0' 
                } dark:opacity-0`} // Force hidden in dark mode
              />
              {/* White Logo (Visible in Dark mode always, Visible in Light mode without background) */}
              <Image
                src="/PinLogo-white.png"
                alt="SOFaccess Logo Pin White"
                width={24}
                height={24}
                // Visible when background is transparent OR when in dark mode.
                 className={`absolute inset-0 transition-opacity duration-300 ${
                  hasBackground ? 'opacity-0' : 'opacity-100' 
                 } dark:opacity-100`} // Force visible in dark mode
              />
            </div>
            <span className={`font-sofia text-2xl font-bold transition-colors duration-300 ${logoTextColor}`}>
              SOFaccess
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/map" className={`${textColor} hover:text-primary transition-colors duration-300`}>
              Карта
            </Link>
            <Link href="/report" className={`${textColor} hover:text-primary transition-colors duration-300`}>
              Докладвай
            </Link>
            <Link href="/faq" className={`${textColor} hover:text-primary transition-colors duration-300`}>
              ЧЗВ
            </Link>
            <Link href="/about" className={`${textColor} hover:text-primary transition-colors duration-300`}>
              За нас
            </Link>
          </div>

          {/* Mobile Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`${textColor} md:hidden p-2 rounded-md hover:bg-primary/20 transition-colors duration-300`}
          >
            {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white/90 dark:bg-black/90 backdrop-blur-md shadow">
          <div className="px-4 py-3 space-y-2">
             <Link onClick={() => setIsOpen(false)} href="/map" className={`block ${mobileTextColor} hover:text-primary dark:hover:text-primary transition`}>
              Карта
            </Link>
            <Link onClick={() => setIsOpen(false)} href="/report" className={`block ${mobileTextColor} hover:text-primary dark:hover:text-primary transition`}>
              Докладвай
            </Link>
            <Link onClick={() => setIsOpen(false)} href="/faq" className={`block ${mobileTextColor} hover:text-primary dark:hover:text-primary transition`}>
              ЧЗВ
            </Link>
            <Link onClick={() => setIsOpen(false)} href="/about" className={`block ${mobileTextColor} hover:text-primary dark:hover:text-primary transition`}>
              За нас
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;