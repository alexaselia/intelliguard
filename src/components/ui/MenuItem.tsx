import React from 'react';
import Image from 'next/image';

interface MenuItemProps {
  name: string;
  href: string;
  description: string;
  iconPath: string;
  isActive: boolean;
  onClick: () => void; // Add onClick prop
}

const MenuItem: React.FC<MenuItemProps> = ({ name, href, description, iconPath, isActive, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`relative flex items-center p-3 text-sm font-medium text-white ${
        isActive ? 'bg-gray-800' : ''
      } hover:bg-gray-700 cursor-pointer`} // Add cursor-pointer for better UX
    >
      <Image src={iconPath} alt={`${name} icon`} width={24} height={24} className="mr-3" />
      <div>
        <p className="font-semibold">{name}</p>
        <p className="text-gray-400">{description}</p>
      </div>
      {isActive && <div className="absolute left-0 top-0 h-full w-1 bg-green-500"></div>}
    </div>
  );
};

export default MenuItem;
