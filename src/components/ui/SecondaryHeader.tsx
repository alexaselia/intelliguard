"use client";

import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

const categories = ["Casa", "Comunidade"];

interface SecondaryHeaderProps {
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
}

const SecondaryHeader: React.FC<SecondaryHeaderProps> = ({ selectedCategory, setSelectedCategory }) => {
  return (
    <>
      {/* Desktop Version */}
      <div className="hidden md:block bg-[hsl(var(--sidebar-background))] px-4 py-3 rounded-lg mb-4">
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
          <TabsList className="flex justify-start space-x-2 lg:space-x-4">
            {categories.map((category) => (
              <TabsTrigger
                key={category}
                value={category}
                className={`relative text-base lg:text-lg px-3 py-1 ${
                  selectedCategory === category
                    ? 'bg-gray-700 text-white rounded-none'
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
      </div>

      {/* Mobile Version */}
      <div className="md:hidden px-2 py-2 rounded-lg mb-2" style={{ backgroundColor: 'transparent' }}>
        <div className="flex space-x-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`text-sm px-5 py-2 rounded-full text-left ${
                selectedCategory === category
                  ? 'bg-[#0E1F3B] text-[#3B82F6] border border-[#3B82F6]'
                  : 'bg-[#242B33] text-gray-400 hover:bg-gray-600 hover:text-white'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
    </>
  );
};

export default SecondaryHeader;
