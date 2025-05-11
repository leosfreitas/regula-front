import { House } from '@phosphor-icons/react';
import { User } from '@phosphor-icons/react';
import { Users } from '@phosphor-icons/react';

export const menuItems = [
    {
        label: 'Página Inicial',
        icon: <House weight='bold' />,
        href: '/user/dashboard/home',
    },
    {
        label: 'Perfil',
        icon: <User weight='bold' />,
        href: '/user/dashboard/profile',
    },
];
