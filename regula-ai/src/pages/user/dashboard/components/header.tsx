import React, { useEffect, useState } from "react";
import { useMatches, useLocation } from "react-router-dom";
import styled from "styled-components";
import { getUserName } from "./api/header";
import { Bell, Gear } from "@phosphor-icons/react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "../../../../components/ui/breadcrumb";

interface HeaderProps {
  onToggleMenu?: () => void;
}

export function Header({ onToggleMenu }: HeaderProps) {
  const matches = useMatches();
  const location = useLocation();
  const [userName, setUserName] = useState<string | null>(null);
  const [notificationCount, setNotificationCount] = useState<number>(2); // Simulando 2 notificações

  useEffect(() => {
    async function fetchUserNameData() {
      try {
        const response = await getUserName();
        setUserName(response.user_name);
      } catch (error) {
        console.error("Erro ao obter nome do usuário:", error);
      }
    }
    fetchUserNameData();
  }, []);

  // Rotas específicas do Admin + rotas genéricas
  const routeLabels: Record<string, string> = {
    dashboard: "Dashboard",
    home: "Página Inicial",
    profile: "Perfil",
    users: "Usuários",
    contact: "Contato"
  };

  const capitalizeFirstLetter = (str: string): string =>
    str.charAt(0).toUpperCase() + str.slice(1);

  // Pega o título da página atual
  const getCurrentPageTitle = () => {
    const key = location.pathname.split("/").pop() || "";
    return routeLabels[key] || capitalizeFirstLetter(key);
  };

  return (
    <HeaderStyle>
      {/* Breadcrumbs e título da página */}
      <div className="page-section">
        <h1 className="page-title">{getCurrentPageTitle()}</h1>
        <Breadcrumb>
          <BreadcrumbList className="breadcrumb-list">
            {matches.map((match, index) => {
              const key = match.pathname.split("/").pop() || "";
              const breadcrumbLabel =
                routeLabels[key] || capitalizeFirstLetter(key);

              return (
                <React.Fragment key={index}>
                  <BreadcrumbItem>
                    <BreadcrumbLink
                      href={match.pathname}
                      className="breadcrumb-link"
                    >
                      {breadcrumbLabel}
                    </BreadcrumbLink>
                  </BreadcrumbItem>

                  {index < matches.length - 1 && (
                    <BreadcrumbSeparator className="breadcrumb-separator" />
                  )}
                </React.Fragment>
              );
            })}
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* User Section */}
      <div className="user-section">
        <div className="notification-bell">
          <Bell weight="fill" size={22} />
          {notificationCount > 0 && <span className="notification-badge">{notificationCount}</span>}
        </div>
        
        <div className="settings-icon">
          <Gear weight="fill" size={22} />
        </div>
        
        {userName && (
          <div className="user-profile">
            <div className="user-avatar">
              {userName.charAt(0).toUpperCase()}
            </div>
            <span className="user-name">{userName}</span>
          </div>
        )}
      </div>

      {/* Botão Hamburger (somente para mobile) */}
      <button className="hamburger" onClick={onToggleMenu} aria-label="Menu">
        <svg
          className="hamburger-icon"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
    </HeaderStyle>
  );
}

const HeaderStyle = styled.div`
  width: 100%;
  background-color: white;
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.05);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 25px;
  height: 115px;

  .page-section {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 2px;
  }

  .page-title {
    font-size: 1.4rem;
    font-weight: 600;
    color: #222;
    margin-bottom: 4px;
  }

  .breadcrumb-list {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .breadcrumb-link {
    font-size: 0.9rem;
    color: #666;
    text-decoration: none;
    
    &:hover {
      color: #0095ff;
      text-decoration: underline;
    }
  }

  .breadcrumb-separator {
    font-size: 0.9rem;
    color: #999;
  }

  .user-section {
    display: flex;
    align-items: center;
    gap: 20px;
  }

  .notification-bell, .settings-icon {
    position: relative;
    color: #555;
    cursor: pointer;
    transition: color 0.2s ease;
    
    &:hover {
      color: #0095ff;
    }
  }

  .notification-badge {
    position: absolute;
    top: -6px;
    right: -6px;
    background-color: #ff3e3e;
    color: white;
    font-size: 0.7rem;
    font-weight: bold;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .user-profile {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-left: 5px;
  }

  .user-avatar {
    width: 38px;
    height: 38px;
    border-radius: 50%;
    background: linear-gradient(45deg, #0095ff, #006edc);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.1rem;
    font-weight: 600;
  }

  .user-name {
    font-size: 1rem;
    font-weight: 500;
    color: #333;
    max-width: 150px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .hamburger {
    display: none;
    background: transparent;
    border: none;
    cursor: pointer;
    
    @media (max-width: 768px) {
      display: block;
    }
  }

  .hamburger-icon {
    width: 26px;
    height: 26px;
    color: #333;
  }

  @media (max-width: 991px) {
    .user-name {
      max-width: 100px;
    }
  }

  @media (max-width: 768px) {
    .page-section {
      flex: 1;
    }
    
    .user-profile {
      .user-name {
        display: none;
      }
    }
  }
`;

export default Header;