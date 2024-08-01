import React from 'react';
import { Icon } from 'lucide-react';

interface MenuItemProps {
  name: string;
  href: string;
  description: string;
  IconComponent: Icon;
  isActive: boolean;
  onClick: () => void;
  className?: string;
  activeClassName?: string;
}

const MenuItem: React.FC<MenuItemProps> = ({ name, href, description, IconComponent, isActive, onClick, className, activeClassName }) => {
  return (
    <div
      onClick={onClick}
      className={`relative flex items-center p-3 text-sm font-medium ${
        isActive ? activeClassName : className
      } hover:bg-gray-700 cursor-pointer`}
    >
      <IconComponent className="mr-3" size={24} />
      <div className="hidden md:block">
        <p className="font-semibold">{name}</p>
        <p className="text-gray-400">{description}</p>
      </div>
      {isActive && <div className="absolute left-0 top-0 h-full w-1 bg-green-500"></div>}
    </div>
  );
};

export default MenuItem;
