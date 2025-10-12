"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { FaBars, FaTimes } from "react-icons/fa";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > window.innerHeight * 0.8;
      setScrolled(isScrolled);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isHomePage = pathname === "/";
  const scrolledOnHomepage = isHomePage && scrolled;
  const isNotHomePage = !isHomePage;

  const textColor = (scrolledOnHomepage || isNotHomePage) ? "text-foreground" : "text-white";
  const logoColor = (scrolledOnHomepage || isNotHomePage) ? "text-primary" : "text-white";
  const mobileTextColor = "text-foreground dark:text-white";

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ease-in-out
        ${
          scrolledOnHomepage || isNotHomePage
            ? "backdrop-blur-xl bg-white/30 dark:bg-black/30 shadow-lg border-b border-white/30 dark:border-black/30"
            : "bg-transparent"
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className={`font-sofia text-2xl font-bold ${logoColor}`}>
            SOFaccess
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-6">
            <Link href="/map" className={`${textColor} hover:text-primary transition`}>
              Карта
            </Link>
            <Link href="/report" className={`${textColor} hover:text-primary transition`}>
              Докладвай
            </Link>
            <Link href="/faq" className={`${textColor} hover:text-primary transition`}>
              ЧЗВ
            </Link>
            <Link href="/about" className={`${textColor} hover:text-primary transition`}>
              За нас
            </Link>
          </div>

          {/* Mobile Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`${textColor} md:hidden p-2 rounded-md hover:bg-primary/20 transition`}
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