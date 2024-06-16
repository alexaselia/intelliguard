"use client";

import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import MenuItem from './MenuItem';

const Sidebar: React.FC = () => {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [indicatorStyle, setIndicatorStyle] = useState<{ left: number; width: number }>({ left: 0, width: 0 });

  const menuItems = [
    { name: 'Home', href: '/', description: 'Seu painel geral.', iconPath: '/icons/home.svg' },
    { name: 'Câmeras', href: '/cameras', description: 'Assista ao vivo e acesse gravações.', iconPath: '/icons/cameras.svg' },
    { name: 'Mapa', href: '/mapa', description: 'Veja as câmeras em um mapa.', iconPath: '/icons/map.svg' },
    { name: 'Configurações', href: '/configuracoes', description: 'Ajuste suas preferências.', iconPath: '/icons/configuracoes.svg' },
  ];

  const updateIndicator = () => {
    const activeIndex = menuItems.findIndex(
      (item) => pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))
    );
    if (activeIndex !== -1) {
      const activeButton = document.getElementById(`menu-item-${activeIndex}`);
      if (activeButton) {
        const { offsetLeft, offsetWidth } = activeButton;
        const padding = 10; // Adjust this value to control the extra width
        setIndicatorStyle({ left: offsetLeft - padding / 2, width: offsetWidth + padding });
      }
    }
  };

  useEffect(() => {
    updateIndicator();
  }, [pathname]);

  useEffect(() => {
    const handleResize = () => {
      updateIndicator();
    };

    window.addEventListener('resize', handleResize);
    updateIndicator();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [pathname]);

  const handleNavigation = (href: string) => {
    if (loading) return; // Wait until loading state is finished
    if (user) {
      router.push(href);
    } else {
      router.push('/login');
    }
  };

  return (
    <>
      <div className="fixed top-16 left-0 h-[calc(100%-4rem)] bg-[hsl(var(--sidebar-background))] p-0 flex flex-col justify-between items-start w-[60px] md:w-[254px] hidden md:flex">
        <ul className="w-full">
          {menuItems.slice(0, 3).map((item, index) => (
            <li key={item.name} className="w-full py-1">
              <MenuItem
                name={item.name}
                href={item.href}
                description={item.description}
                iconPath={item.iconPath}
                isActive={pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))}
                onClick={() => handleNavigation(item.href)}
                className="text-white hover:text-white"
                activeClassName="bg-gray-800 text-white md:rounded-none md:w-full"
              />
            </li>
          ))}
        </ul>
        <div className="w-full">
          <hr className="border-t border-gray-600 my-2 w-full" />
          <ul className="w-full">
            {menuItems.slice(3).map((item, index) => (
              <li key={item.name} className="w-full py-1">
                <MenuItem
                  name={item.name}
                  href={item.href}
                  description={item.description}
                  iconPath={item.iconPath}
                  isActive={pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))}
                  onClick={() => handleNavigation(item.href)}
                  className="text-white hover:text-white"
                  activeClassName="bg-gray-800 text-white md:rounded-none md:w-full"
                />
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 w-full bg-[hsl(var(--sidebar-background))] p-2 flex justify-around items-center md:hidden z-50">
        <div
          className="absolute top-0 h-1 bg-[#22C55E] transition-all duration-300"
          style={{ left: indicatorStyle.left, width: indicatorStyle.width }}
        ></div>
        {menuItems.map((item, index) => (
          <button
            key={item.name}
            id={`menu-item-${index}`}
            onClick={() => handleNavigation(item.href)}
            className={`flex items-center cursor-pointer p-3 transition-all duration-300 ${
              pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))
                ? 'bg-[#1F2937] text-white rounded-full'
                : 'text-[#748287] hover:text-white'
            }`}
          >
            <img
              src={item.iconPath}
              alt={`${item.name} icon`}
              className={`h-6 w-6 transition-all duration-300 ${
                pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))
                  ? 'mr-2'
                  : ''
              }`}
            />
            {(pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))) && (
              <span className="text-xs">
                {item.name}
              </span>
            )}
          </button>
        ))}
      </div>
    </>
  );
};

export default Sidebar;
