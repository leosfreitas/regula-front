import { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import styled from 'styled-components';

import { Header } from './components/header';
import { Menu } from './components/menu';

import { Home } from './nested/home/homepage';
import { Profile } from './nested/profile/profile';

export const Dashboard = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <DashboardStyles>
            <Header onToggleMenu={toggleMobileMenu} />

            <Menu isMobileMenuOpen={isMobileMenuOpen} />

            <Routes>
                <Route path="home" element={<Home />}/>
                <Route path="profile" element={<Profile />}/>
            </Routes>
        </DashboardStyles>
    )
}

const DashboardStyles = styled.div`
    display: grid;
    grid-template-columns: 260px 1fr;
    min-height: 100vh;
    max-height: 100vh;
    width: 100%;
    background-color: #f5f7fa;
    position: relative;
    overflow: hidden;

    @media (max-width: 768px) {
        grid-template-columns: 1fr;
    }
`;

const MainContent = styled.div`
    display: flex;
    flex-direction: column;
    overflow: hidden;
`;

const ContentArea = styled.main`
    padding: 25px;
    overflow-y: auto;
    height: calc(100vh - 80px); /* 80px é a altura do Header */
    
    @media (max-width: 768px) {
        padding: 16px;
        height: calc(100vh - 70px);
    }
`;

const Overlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 998;
`;
