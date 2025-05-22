import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import cn from "clsx";
import { headerItems } from "../constants/header-items";

export const BlackHeader = () => {
  const { pathname } = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showHeader, setShowHeader] = useState(true);
  const [isAtTop, setIsAtTop] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      setIsAtTop(currentY === 0);
      setShowHeader(!(currentY > lastScrollY.current && currentY > 50));
      lastScrollY.current = currentY;
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 w-full z-50 transition-all duration-500 ease-in-out",
        showHeader ? "translate-y-0" : "-translate-y-full",
        isAtTop
          ? "bg-transparent backdrop-blur-0 text-black"
          : "bg-black/60 backdrop-blur-sm text-white"
      )}
    >
      <div className="flex items-center justify-between max-w-[95%] mx-auto py-6">
        <Link to="/home" className="flex items-center">
          <img
            src={isAtTop ? "RegulaAI_Black.png" : "RegulaAI.png"}
            alt="Logo"
            className="w-60 transition-all duration-300"
          />
        </Link>

        <div className="hidden md:flex items-center gap-10">
          <nav className="flex items-center gap-10">
            {headerItems.map(({ href, label }) => (
              <Link
                key={href}
                to={href}
                className={cn(
                  "font-bold text-xl transition-all duration-300 hover:text-gray-300",
                  pathname === href
                    ? "text-[#4fc3f7] border-b-2 border-[#4fc3f7]"
                    : "border-b-2 border-transparent"
                )}
              >
                {label}
              </Link>
            ))}
          </nav>

          <Link
            to="/auth/select"
            className={cn(
              "ml-10 font-bold px-7 py-3 rounded-full transition-all duration-300 text-xl border-2",
              isAtTop
                ? "border-black/70 text-black hover:bg-black/5"
                : "border-white/70 text-white hover:bg-white/10"
            )}
          >
            Login
          </Link>
        </div>

        <button
          className="md:hidden bg-transparent border-none"
          onClick={() => setIsMobileMenuOpen((open) => !open)}
        >
          <svg
            className="w-7 h-7"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden flex flex-col items-center w-full py-4 bg-[#0d2c40]/90 backdrop-blur">
          {headerItems.map(({ href, label }) => (
            <Link
              key={href}
              to={href}
              className={cn(
                "text-xl font-bold py-2 transition-all duration-300 hover:text-[#0575E6]",
                pathname === href && "text-[#4fc3f7]"
              )}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {label}
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