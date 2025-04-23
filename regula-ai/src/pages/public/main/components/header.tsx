import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import styled from "styled-components";
import { headerItems } from "../constants/header-items";

export const Header = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <HeaderStyles>
      <div className="header-container">
        {/* MENU DESKTOP */}
        <nav className="nav-desktop">
          {headerItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={`nav-link ${location.pathname === item.href ? "active" : ""}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* HAMBÚRGUER (somente mobile) */}
        <button
          className="hamburger md:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* MENU MOBILE */}
      {isMobileMenuOpen && (
        <div className="mobile-menu md:hidden">
          <nav className="mobile-links">
            {headerItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={`mobile-nav-link ${location.pathname === item.href ? "active" : ""}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </HeaderStyles>
  );
};

const HeaderStyles = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 99999;
  padding: 22px 0;
  background-color: transparent;

  .header-container {
    background-color: #0d2c40;
    border-radius: 50px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 24px 36px;
    width: 90%;
    max-width: 1600px;
    margin: 0 auto;
  }

  .nav-desktop {
    display: flex;
    gap: 56px;

    .nav-link {
      color: white;
      font-size: 30px;
      font-weight: 800;
      text-decoration: none;
      transition: all 0.3s ease;

      &.active {
        color: #4fc3f7;
      }
    }

    @media (max-width: 768px) {
      display: none;
    }
  }

  .hamburger {
    background: transparent;
    border: none;
    cursor: pointer;
    display: none;

    @media (max-width: 768px) {
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }

  .mobile-menu {
    background-color: #0d2c40;
    width: 100%;
    padding: 16px 0;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .mobile-links {
    display: flex;
    flex-direction: column;
    gap: 16px;
    width: 100%;
    align-items: center;

    .mobile-nav-link {
      color: white;
      font-size: 24px;
      font-weight: 700;
      text-decoration: none;
      transition: all 0.3s ease;

      &.active {
        color: #4fc3f7;
      }
    }
  }
`;
