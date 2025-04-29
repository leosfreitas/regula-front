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
    grid-template-columns: 35vh 1fr;
    grid-template-rows: 15vh 1fr;

    /* Faz o background ocupar pelo menos a altura da tela em desktops */
    min-height: 100vh;
    width: 100vw;
    background-color: #eff3f7;

    /* Se quiser manter o max-height no desktop, coloque num @media (min-width) */
    @media (min-width: 1024px) {
        /* Mantém em desktops grandes a altura travada, se for desejado */
        max-height: 100vh;
    }

    /* Em telas menores, deixa a altura livre para crescer além de 100vh */
    @media (max-width: 1024px) {
        max-height: none;
    }

    @media (max-width: 768px) {
        grid-template-columns: 1fr;
        grid-template-rows: auto 1fr;
    }

    @media (max-width: 480px) {
        grid-template-columns: 1fr;
        grid-template-rows: auto 1fr;
    }
`;
