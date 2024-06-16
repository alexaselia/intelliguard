"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { User, CreditCard, Settings, LogOut } from 'lucide-react';

const Header: React.FC = () => {
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = () => {
    // Clear authentication state
    sessionStorage.removeItem('authenticated');
    // Redirect to login page
    router.push('/login');
  };

  useEffect(() => {
    if (isDropdownOpen) {
      document.body.style.overflowY = 'hidden';
    } else {
      document.body.style.overflowY = 'auto';
    }
    // Clean up effect
    return () => {
      document.body.style.overflowY = 'auto';
    };
  }, [isDropdownOpen]);

  return (
    <div className="fixed top-0 left-0 right-0 h-16 bg-[hsl(var(--sidebar-background))] flex items-center justify-between px-2 md:px-4 pr-6 md:pr-10 z-10">
      <div className="flex items-center">
        <img src="/images/logo.svg" alt="Company Logo" className="h-16 w-32 ml-2 md:ml-4" />
      </div>
      <div className="flex items-center space-x-2 md:space-x-4">
        <button className="text-white">
          <i className="fa fa-phone"></i> {/* Placeholder for call icon */}
        </button>
        <button className="text-white">
          <i className="fa fa-bell"></i> {/* Placeholder for notification icon */}
        </button>
        <DropdownMenu onOpenChange={setIsDropdownOpen}>
          <DropdownMenuTrigger asChild>
            <img src="/images/avatar.png" alt="User Profile" className="h-10 w-10 rounded-full cursor-pointer" />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 bg-[#2D3343] text-white rounded-md shadow-md border border-[#1E242D]">
            <DropdownMenuLabel className="text-white">Menu</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} >
              <LogOut className="mr-2 h-4 w-4 text-white" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default Header;
