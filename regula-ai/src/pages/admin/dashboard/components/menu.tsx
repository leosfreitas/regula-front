import { menuItems } from "../constants/menu-items";
import styled from "styled-components";
import { logout } from "../../auth/logout/api/logout";
import { SignOut } from '@phosphor-icons/react';
import { toast } from "react-hot-toast";
import { useLocation } from "react-router-dom";

interface MenuProps {
  isMobileMenuOpen?: boolean;
}

export const Menu = ({ isMobileMenuOpen }: MenuProps) => {
  const location = useLocation();
  
  const handleLogout = async () => {
    try {
      toast.loading("Realizando logout...");
      await logout();
      toast.dismiss();
      toast.success("Logout realizado com sucesso!");
      window.location.href = '/auth/select';
    } catch (error) {
      toast.dismiss();
      toast.error("Não foi possível realizar o logout. Tente novamente.");
      console.error('Erro ao fazer logout:', error);
    }
  };

  const isActiveRoute = (href: string) => {
    return location.pathname === href;
  };

  return (
    <MenuStyles isOpen={isMobileMenuOpen}>
      <div className="logo-container">
        <img src="/RegulaAI.png" alt="Logo Regula AI" width={180} height={50} />
      </div>

      <div className="menu-items">
        {menuItems.map((item, index) => (
          <a 
            key={index} 
            href={item.href} 
            className={isActiveRoute(item.href) ? "active" : ""}
          >
            <span className="icon-container">{item.icon}</span>
            <span className="label">{item.label}</span>
            {isActiveRoute(item.href) && <div className="active-indicator" />}
          </a>
        ))}
      </div>

      <div className="spacer"></div>

      <div className="footer-section">
        <button onClick={handleLogout} className="logout-btn">
          <SignOut weight="bold" />
          <span>Sair da conta</span>
        </button>
      </div>
    </MenuStyles>
  );
};

const MenuStyles = styled.div<{ isOpen?: boolean }>`
  grid-column: 1;
  grid-row: 1 / span 2;
  background: linear-gradient(180deg, #003666 0%, #002649 100%);
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  max-height: 100vh;
  transition: all 0.3s ease;
  overflow-y: auto;
  width: 260px; 
  box-shadow: 4px 0 10px rgba(0, 0, 0, 0.1);

  .logo-container {
    padding: 35px 30px;
    display: flex;
    justify-content: left;
    align-items: left;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    margin-bottom: 20px;
  }

  .menu-items {
    display: flex;
    flex-direction: column;
    padding: 0 15px;
  }

  a {
    display: flex;
    align-items: center;
    padding: 14px 16px;
    margin: 5px 0;
    border-radius: 10px;
    font-size: 1.05rem;
    font-weight: 500;
    color: rgba(255, 255, 255, 0.85);
    text-decoration: none;
    transition: all 0.2s ease;
    position: relative;

    .icon-container {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 12px;
      font-size: 1.4rem;
    }

    .label {
      transition: transform 0.2s ease;
    }

    &:hover {
      background-color: rgba(255, 255, 255, 0.1);
      color: white;
      
      .label {
        transform: translateX(3px);
      }
    }

    &.active {
      background-color: rgba(0, 149, 255, 0.15);
      color: #00a5e8;
      font-weight: 600;
      
      .active-indicator {
        position: absolute;
        left: 0;
        top: 0;
        width: 4px;
        height: 100%;
        background: #00a5e8;
        border-radius: 0 4px 4px 0;
      }
    }
  }

  .spacer {
    flex-grow: 1;
  }

  .footer-section {
    padding: 20px 15px;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
  }

  .logout-btn {
    display: flex;
    align-items: center;
    width: 100%;
    padding: 14px 16px;
    border-radius: 10px;
    font-size: 1.05rem;
    font-weight: 500;
    color: rgba(255, 255, 255, 0.85);
    background: none;
    border: none;
    cursor: pointer;
    transition: all 0.2s ease;
    
    svg {
      font-size: 1.4rem;
      margin-right: 12px;
    }

    &:hover {
      background-color: rgba(255, 54, 54, 0.15);
      color: #ff5e5e;
    }
  }

  @media (max-width: 768px) {
    position: fixed;
    top: 0;
    left: ${({ isOpen }) => (isOpen ? '0' : '-100%')};
    width: 250px;
    height: 100vh;
    z-index: 9999;
    box-shadow: ${({ isOpen }) => (isOpen ? '4px 0 20px rgba(0, 0, 0, 0.25)' : 'none')};
  }
`;

export default Menu;