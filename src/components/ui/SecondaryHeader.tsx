"use client";

import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

const categories = ["Casa", "Condomínio", "Comunidade"];

interface SecondaryHeaderProps {
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
}

const SecondaryHeader: React.FC<SecondaryHeaderProps> = ({ selectedCategory, setSelectedCategory }) => {
  return (
    <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="bg-[hsl(var(--sidebar-background))] px-2 md:px-4 py-2 md:py-3 rounded-lg mb-2 md:mb-4">
      <TabsList className="flex flex-wrap justify-center md:justify-start space-x-1 md:space-x-2 lg:space-x-4">
        {categories.map((category) => (
          <TabsTrigger
            key={category}
            value={category}
            className={`relative text-xs sm:text-sm md:text-base lg:text-lg px-2 md:px-3 py-1 ${
              selectedCategory === category
                ? 'bg-gray-700 text-white'
                : 'hover:bg-gray-600 hover:text-white'
            }`}
          >
            {category}
            {selectedCategory === category && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-500 rounded-full" />
            )}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}

export default SecondaryHeader;
