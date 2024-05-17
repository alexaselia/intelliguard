"use client"; // Add this line

import React, { useEffect, useState } from 'react';
import SecondaryHeader from '@/components/ui/SecondaryHeader';
import DynamicCameraCard from '@/components/ui/DynamicCameraCard';

interface CameraData {
  name: string;
  id: string;
  ip: string;
  codec: string;
  size: string;
  fps: number;
}

const Cameras: React.FC = () => {
  const [cameraData, setCameraData] = useState<CameraData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('/api/readExcel');
      const data: CameraData[] = await response.json();
      setCameraData(data);
    };
    fetchData();
  }, []);

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
        {cameraData.map((camera) => (
          <DynamicCameraCard
            key={camera.id}
            name={camera.name}
            streamUrl={`http://rtmp.megaguardiao.com.br:8000/live/${camera.name}/index.m3u8`}
            cameraId={camera.name}
          />
        ))}
      </div>
    </div>
  );
}

export default Cameras;
