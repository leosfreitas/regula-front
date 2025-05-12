import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { headerItems } from "../constants/header-items";

export const Header = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showHeader, setShowHeader] = useState(true);
  const [isAtTop, setIsAtTop] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;

      setIsAtTop(currentY === 0);

      if (currentY > lastScrollY.current && currentY > 50) {
        setShowHeader(false);
      } else {
        setShowHeader(true);
      }

      lastScrollY.current = currentY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 
        transition-all duration-500 ease-in-out
        ${showHeader ? "translate-y-0" : "-translate-y-full"}
        ${isAtTop ? "bg-transparent backdrop-blur-0" : "bg-black/60 backdrop-blur-sm"}
      `}
    >
      <div className="flex items-center justify-between max-w-[95%] mx-auto py-4">
        {/* LOGO */}
        <Link to="/home" className="flex items-center">
          <img src="RegulaAI.png" alt="Logo" className="w-64 transition-all duration-300" />
        </Link>

        {/* LINKS E LOGIN BUTTON (Desktop) */}
        <div className="hidden md:flex items-center gap-10">
          <nav className="flex items-center gap-10">
            {headerItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={`text-white font-bold transition-all duration-300 hover:text-gray-300 ${
                  location.pathname === item.href
                    ? "text-[#4fc3f7] border-b-2 border-[#4fc3f7]"
                    : "border-b-2 border-transparent"
                } text-xl`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <Link
            to="/auth/select"
            className="ml-10 border-2 border-white/70 text-white font-bold px-7 py-3 rounded-full transition-all duration-300 hover:bg-white/20 text-xl"
          >
            Login
          </Link>
        </div>

        {/* BOTÃO HAMBURGUER */}
        <button
          className="md:hidden bg-transparent border-none"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* MOBILE MENU */}
      {isMobileMenuOpen && (
        <div className="md:hidden flex flex-col items-center w-full py-4 bg-[#0d2c40]/90 backdrop-blur">
          {headerItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={`text-white text-xl font-bold py-2 transition-all duration-300 hover:text-[#0575E6] ${
                location.pathname === item.href ? "text-[#4fc3f7]" : ""
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <Link
            to="/auth/select"
            className="text-white text-xl font-bold py-2 transition-all duration-300 hover:text-[#0575E6]"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Login
          </Link>
        </div>
      )}
    </header>
  );
};
