// src/components/ui/ExpandButton.tsx
import React from 'react';
import { Button } from '@/components/ui/button';

interface ExpandButtonProps {
  onClick: () => void;
}

const ExpandButton: React.FC<ExpandButtonProps> = ({ onClick }) => {
  return (
    <Button
      onClick={onClick}
      className="bg-primaryBlue-opacity-0 text-white flex items-center justify-center hover:bg-primaryBlue-hover text-xs md:text-sm lg:text-base px-2 md:px-4"
    >
      <img src="/icons/expand.svg" alt="Expand Icon" className="w-4 h-4 md:w-5 md:h-5" />
    </Button>
  );
};

export default ExpandButton;
