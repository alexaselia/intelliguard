// src/components/ui/SecondaryHeader.tsx
"use client";

import React, { useState } from 'react';

const categories = ["Casa", "Condomínio", "Comunidade"];

const SecondaryHeader: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState("Casa");

  return (
    <div className="flex justify-start space-x-4 bg-[hsl(var(--sidebar-background))] p-4 rounded-lg mb-6">
      {categories.map((category) => (
        <button
          key={category}
          className={`px-4 py-2 text-white rounded-lg focus:outline-none relative ${selectedCategory === category ? 'bg-gray-600' : 'hover:bg-gray-600'}`}
          onClick={() => setSelectedCategory(category)}
        >
          {category}
          {selectedCategory === category && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-500 rounded-full" />
          )}
        </button>
      ))}
    </div>
  );
}

export default SecondaryHeader;
