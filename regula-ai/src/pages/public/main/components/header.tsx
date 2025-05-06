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
        <Link to="/home" className="logo">
          <img src="RegulaAI.png" alt="Logo Regula.ai" className="w-64" />
        </Link>

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

        <Link to="/auth/select" className="login-button">
          Login
        </Link>

        <button className="hamburger md:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

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
            <Link to="/auth/select" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>
              Login
            </Link>
          </nav>
        </div>
      )}
    </HeaderStyles>
  );
};


const HeaderStyles = styled.header`
  position: fixed;
  top: 2%;
  left: 0;
  width: 100%;
  z-index: 99999;
  padding: 20px 0;
  background-color: transparent;

  .header-container {
    display: flex;
    align-items: center;
    max-width: 95%;
    margin: 0 auto;
  }

  .logo {
    flex-grow: 1;
    display: flex;
    align-items: center;
    text-decoration: none;

    img {
      max-width: 240px;
      height: auto;
    }
  }

  .nav-desktop {
    display: flex;
    align-items: center;
    gap: 64px;

    .nav-link {
      color: white;
      font-size: 24px;
      font-weight: 700;
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

  .login-button {
    margin-left: 48px;
    background: none;
    border: 2px solid #ffffffaa;
    color: white;
    padding: 12px 28px;
    border-radius: 9999px;
    font-weight: 700;
    font-size: 18px;
    text-decoration: none;
    transition: background 0.3s ease;

    &:hover {
      background: #ffffff22;
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
    gap: 20px;
    width: 100%;
    align-items: center;

    .mobile-nav-link {
      color: white;
      font-size: 22px;
      font-weight: 700;
      text-decoration: none;
      transition: all 0.3s ease;

      &.active {
        color: #4fc3f7;
      }
    }
  }
`;

