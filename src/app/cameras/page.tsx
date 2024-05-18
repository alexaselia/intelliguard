"use client"; // Add this line

import React, { useEffect, useState } from 'react';
import SecondaryHeader from '@/components/ui/SecondaryHeader';
import DynamicCameraCard from '@/components/ui/DynamicCameraCard';

interface Stream {
  id: string;
  name: string;
  streamUrl: string;
}

const Cameras: React.FC = () => {
  const [streams, setStreams] = useState<Stream[]>([]);

  useEffect(() => {
    const fetchStreams = async () => {
      try {
        const response = await fetch('/api/streams');
        const data: Stream[] = await response.json();
        console.log('Fetched Streams:', data); // Debug log
        setStreams(data);
      } catch (error) {
        console.error('Failed to fetch streams:', error);
      }
    };
    fetchStreams();
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
        {streams.map((stream) => (
          <DynamicCameraCard
            key={stream.id}
            name={stream.name}
            streamUrl={stream.streamUrl}
            cameraId={stream.id}
          />
        ))}
      </div>
    </div>
  );
}

export default Cameras;
