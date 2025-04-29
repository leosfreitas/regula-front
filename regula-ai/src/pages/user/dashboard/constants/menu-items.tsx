import { House } from '@phosphor-icons/react';
import { User } from '@phosphor-icons/react';
import { Users } from '@phosphor-icons/react';

export const menuItems = [
    {
        label: 'Página Inicial',
        icon: <House />,
        href: '/user/dashboard/home',
    },
    {
        label: 'Perfil',
        icon: <User />,
        href: '/user/dashboard/profile',
    },
];
