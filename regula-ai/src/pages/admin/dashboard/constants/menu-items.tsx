import React from 'react';
import { House, User, Users, Phone, ChartLine, FileText } from '@phosphor-icons/react';

export const menuItems = [
    {
        label: 'Página Inicial',
        icon: <House weight="bold" />,
        href: '/admin/dashboard/home',
    },
    {
        label: 'Contato',
        icon: <Phone weight="bold" />,
        href: '/admin/dashboard/contact',
    },
    {
        label: 'Usuários',
        icon: <Users weight="bold" />,
        href: '/admin/dashboard/users',
    },
    {
        label: 'Perfil',
        icon: <User weight="bold" />,
        href: '/admin/dashboard/profile',
    },
];

export default menuItems;