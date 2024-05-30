"use client";

import React, { useEffect, useState } from 'react';
import SecondaryHeader from '@/components/ui/SecondaryHeader';
import DynamicCameraCard from '@/components/ui/DynamicCameraCard';
import { CameraLocation } from '@/lib/utils';

const Cameras: React.FC = () => {
  const [streams, setStreams] = useState<CameraLocation[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('Casa'); // Set default to 'Casa'

  useEffect(() => {
    const fetchStreams = async () => {
      try {
        const response = await fetch('/api/cameras');
        if (response.ok) {
          const streamsData = await response.json();
          console.log('Fetched streams data:', streamsData);
          setStreams(streamsData);
        } else {
          console.error('Failed to fetch streams data');
        }
      } catch (error) {
        console.error('Error fetching streams data:', error);
      }
    };
    fetchStreams();
  }, []);

  const filteredStreams = streams.filter(stream => stream.category === selectedCategory);
  console.log('Filtered streams:', filteredStreams);

  return (
    <div className="p-6 pt-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-4xl font-bold text-white">Câmeras</h1>
          <p className="text-gray-400">Veja as câmeras ao vivo.</p>
        </div>
      </div>
      <SecondaryHeader selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
        {filteredStreams.length > 0 ? (
          filteredStreams.map((stream) => (
            <DynamicCameraCard
              key={stream.id}
              name={stream.name}
              streamUrl={stream.url}
              cameraId={stream.id}
            />
          ))
        ) : (
          <p className="text-white">No streams available.</p>
        )}
      </div>
    </div>
  );
}

export default Cameras;
