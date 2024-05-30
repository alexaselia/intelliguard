import React from 'react';
import { Tabs, TabsList, TabsTrigger } from './tabs';
import Image from 'next/image';
import { Separator } from './separator'; // Import the Separator component

interface ViewToggleProps {
  onViewChange: (view: string) => void;
  currentView: string;
}

const ViewToggle: React.FC<ViewToggleProps> = ({ onViewChange, currentView }) => {
  return (
    <Tabs value={currentView} onValueChange={onViewChange} className="custom-tabs">
      <TabsList className="flex items-center space-x-2 bg-[var(--sidebar-background)] p-2 rounded-md">
        <TabsTrigger
          value="channel"
          className="flex items-center justify-center p-2 rounded-md hover:bg-gray-700 transition-all"
          style={{ width: '36px', height: '36px' }} // Standardize sizes
        >
          <Image src="/icons/channelgrid.svg" alt="Channel View" width={24} height={24} />
        </TabsTrigger>
        <Separator orientation="vertical" className="h-full bg-gray-500" />
        <TabsTrigger
          value="timeline"
          className="flex items-center justify-center p-2 rounded-md hover:bg-gray-700 transition-all"
          style={{ width: '36px', height: '36px' }} // Standardize sizes
        >
          <Image src="/icons/timeline.svg" alt="Timeline View" width={24} height={24} />
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export default ViewToggle;
