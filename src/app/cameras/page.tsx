// src/app/cameras/page.tsx
import React from 'react';
import SecondaryHeader from '@/components/ui/SecondaryHeader';
import CameraCard from '@/components/ui/CameraCard';

const Cameras: React.FC = () => {
  return (
    <div className="p-6 pt-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-4xl font-bold text-white">Câmeras</h1>
          <p className="text-gray-400">Veja as câmeras ao vivo.</p>
        </div>
      </div>
      <SecondaryHeader />
      <div className="grid grid-cols-2 gap-10">
        <CameraCard />
        <CameraCard />
        <CameraCard />
        <CameraCard />
      </div>
    </div>
  );
}

export default Cameras;
