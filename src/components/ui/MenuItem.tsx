import Image from 'next/image';
import React from 'react';

interface MenuItemProps {
  name: string;
  href: string;
  description: string;
  iconPath: string;
  isActive: boolean;
  onClick: () => void;
  className?: string;
  activeClassName?: string;
}

const MenuItem: React.FC<MenuItemProps> = ({ name, href, description, iconPath, isActive, onClick, className, activeClassName }) => {
  return (
    <div
      onClick={onClick}
      className={`relative flex items-center p-3 text-sm font-medium ${
        isActive ? activeClassName : className
      } hover:bg-gray-700 cursor-pointer`}
    >
      <Image
        src={iconPath}
        alt={`${name} icon`}
        width={24}
        height={24}
        className="mr-3"
        style={{ width: '24px', height: '24px' }}
      />
      <div className="hidden md:block">
        <p className="font-semibold">{name}</p>
        <p className="text-gray-400">{description}</p>
      </div>
      {isActive && <div className="absolute left-0 top-0 h-full w-1 bg-green-500"></div>}
    </div>
  );
};

export default MenuItem;
