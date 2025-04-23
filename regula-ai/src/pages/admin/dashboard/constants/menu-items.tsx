import { House } from '@phosphor-icons/react';
import { User } from '@phosphor-icons/react';
import { Users } from '@phosphor-icons/react';

export const menuItems = [
    {
        label: 'Página Inicial',
        icon: <House />,
        href: '/admin/dashboard/home',
    },
    {
        label: 'Usuários',
        icon: <Users />,
        href: '/admin/dashboard/users',
    },
    {
        label: 'Perfil',
        icon: <User />,
        href: '/admin/dashboard/profile',
    },
];
