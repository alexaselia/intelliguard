"use client";

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import MenuItem from './MenuItem';

const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();

  const menuItems = [
    { name: 'Home', href: '/', description: 'Seu painel geral.', iconPath: '/icons/home.svg' },
    { name: 'Câmeras', href: '/cameras', description: 'Assista ao vivo e acesse gravações.', iconPath: '/icons/cameras.svg' },
    { name: 'Mapa', href: '/mapa', description: 'Veja suas câmeras e as compartilhadas em um mapa.', iconPath: '/icons/map.svg' },
    { name: 'IA', href: '/ia', description: 'Gerencie alarmes e notificações.', iconPath: '/icons/ia.svg' },
    { name: 'Configurações', href: '/configuracoes', description: 'Ajuste suas preferências.', iconPath: '/icons/configuracoes.svg' },
    { name: 'Ajuda', href: '/ajuda', description: 'Acesse suporte e assistência.', iconPath: '/icons/ajuda.svg' },
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
    <div className="fixed top-16 left-0 h-[calc(100%-4rem)] bg-[hsl(var(--sidebar-background))] p-0 flex flex-col justify-between items-start w-[60px] md:w-[254px]">
      <ul className="w-full">
        {menuItems.slice(0, 4).map((item) => (
          <li key={item.name} className="w-full py-1">
            <MenuItem
              name={item.name}
              href="#"
              description={item.description}
              iconPath={item.iconPath}
              isActive={pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))}
              onClick={() => handleNavigation(item.href)}
            />
          </li>
        ))}
      </ul>
      <div className="w-full">
        <hr className="border-t border-gray-600 my-2 w-full" />
        <ul className="w-full">
          {menuItems.slice(4).map((item) => (
            <li key={item.name} className="w-full py-1">
              <MenuItem
                name={item.name}
                href="#"
                description={item.description}
                iconPath={item.iconPath}
                isActive={pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))}
                onClick={() => handleNavigation(item.href)}
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
