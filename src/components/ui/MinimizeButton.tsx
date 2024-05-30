// src/components/ui/MinimizeButton.tsx
import React from 'react';
import { Button } from '@/components/ui/button';

interface MinimizeButtonProps {
  onClick: () => void;
}

const MinimizeButton: React.FC<MinimizeButtonProps> = ({ onClick }) => {
  return (
    <Button
      onClick={onClick}
      className="bg-primaryBlue-opacity-0 text-white flex items-center justify-center hover:bg-primaryBlue-hover text-xs md:text-sm lg:text-base px-2 md:px-4"
    >
      <img src="/icons/minimize.svg" alt="Minimize Icon" className="w-4 h-4 md:w-5 md:h-5" />
    </Button>
  );
};

export default MinimizeButton;
