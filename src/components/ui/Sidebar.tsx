"use client";

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import MenuItem from './MenuItem';

const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();

  const menuItems = [
    { name: 'Home', href: '/', description: 'Acompanhamento das câmeras em tempo real.', iconPath: '/icons/home.svg' },
    { name: 'Câmeras', href: '/cameras', description: 'Veja as câmeras ao vivo.', iconPath: '/icons/cameras.svg' },
    { name: 'Gravações', href: '/gravacoes', description: 'Acesse gravações anteriores.', iconPath: '/icons/gravacoes.svg' },
    { name: 'Alarmes', href: '/alarmes', description: 'Gerencie e veja alarmes.', iconPath: '/icons/alarmes.svg' },
    { name: 'Configurações', href: '/configuracoes', description: 'Ajuste suas preferências.', iconPath: '/icons/configuracoes.svg' },
    { name: 'Ajuda', href: '/ajuda', description: 'Obtenha suporte e ajuda.', iconPath: '/icons/ajuda.svg' },
  ];

  const handleNavigation = (href: string) => {
    const isAuthenticated = sessionStorage.getItem('authenticated') === 'true';
    if (isAuthenticated) {
      const url = href === '/' ? '/?authenticated=true' : `${href}?authenticated=true`;
      router.push(url);
    } else {
      router.push('/login');
    }
  };

  return (
    <div className="fixed top-16 left-0 h-full w-[254px] bg-[hsl(var(--sidebar-background))] p-0 flex flex-col items-start">
      <ul className="w-full">
        {menuItems.slice(0, 4).map((item) => (
          <li key={item.name} className="w-full py-1">
            <MenuItem
              name={item.name}
              href="#"
              description={item.description}
              iconPath={item.iconPath}
              isActive={pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))}
              onClick={() => handleNavigation(item.href)} // Pass handleNavigation to onClick
            />
          </li>
        ))}
        <hr className="border-t border-gray-600 my-2 w-full" />
        {menuItems.slice(4).map((item) => (
          <li key={item.name} className="w-full py-1">
            <MenuItem
              name={item.name}
              href="#"
              description={item.description}
              iconPath={item.iconPath}
              isActive={pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))}
              onClick={() => handleNavigation(item.href)} // Pass handleNavigation to onClick
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
