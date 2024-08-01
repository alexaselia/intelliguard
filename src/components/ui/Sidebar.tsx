"use client";

import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/utils/supabase/client';
import MenuItem from './MenuItem';
import { Home, Cctv, MapPin, Film, Settings2, LayoutDashboard } from 'lucide-react'; // Importing icons from Lucide

const Sidebar: React.FC = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();
  const [indicatorStyle, setIndicatorStyle] = useState<{ left: number; width: number }>({ left: 0, width: 0 });

  const supabase = createClient();

  const menuItems = [
    { name: 'Home', href: '/', description: 'Meu painel geral.', IconComponent: Home },
    { name: 'Câmeras', href: '/cameras', description: 'Minhas e da comunidade.', IconComponent: Cctv },
    { name: 'Mosaico', href: '/mosaico', description: 'Câmeras em mosaico.', IconComponent: LayoutDashboard }, 
    { name: 'Gravações', href: '/gravacoes', description: 'Meu histórico.', IconComponent: Film },
    { name: 'Mapa', href: '/mapa', description: 'Câmeras em um mapa.', IconComponent: MapPin },
    { name: 'Configurações', href: '/configuracoes', description: 'Ajustar minhas preferências.', IconComponent: Settings2 },
  ];

  const [currentIndex, setCurrentIndex] = useState(menuItems.findIndex(item => item.href === pathname));

  const updateIndicator = () => {
    const activeIndex = menuItems.findIndex(
      (item) => pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))
    );
    setCurrentIndex(activeIndex);
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
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error || !data.session) {
        setUser(null);
      } else {
        setUser(data.session.user);
      }
      setLoading(false);
    };

    fetchUser();
  }, [supabase]);

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
          {menuItems.slice(0, 5).map((item, index) => ( // Updated slice to include new item
            <li key={item.name} className="w-full py-1">
              <MenuItem
                name={item.name}
                href={item.href}
                description={item.description}
                IconComponent={item.IconComponent}
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
            {menuItems.slice(5).map((item, index) => (
              <li key={item.name} className="w-full py-1">
                <MenuItem
                  name={item.name}
                  href={item.href}
                  description={item.description}
                  IconComponent={item.IconComponent}
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
            <item.IconComponent
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
