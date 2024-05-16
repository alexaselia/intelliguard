// src/components/ui/CameraCard.tsx
"use client";  // This line marks the component as a client component

import React from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardFooter } from '@/components/ui/card';

const CameraCard: React.FC = () => {
  const router = useRouter();

  const handleCardClick = () => {
    router.push('/cameras/video');
  };

  return (
    <Card className="bg-[#262B31] p-0 cursor-pointer" onClick={handleCardClick}>
      <CardContent className="relative p-0">
        <div className="relative bg-gray-700 rounded-lg overflow-hidden h-52 flex items-center justify-center">
          <img
            src="/images/camerathumbnail.png"
            alt="Camera Thumbnail"
            className="object-cover w-full h-full"
          />
          <button className="absolute inset-0 flex items-center justify-center">
            <img
              src="/icons/play-circle.svg"
              alt="Play Button"
              className="h-16 w-16 md:h-20 md:w-20 lg:h-24 lg:w-24 shadow-lg"
              style={{ filter: 'drop-shadow(0 0 10px rgba(0, 0, 0, 0.7))' }} // Increased opacity of shadow
            />
          </button>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center p-4">
        <div className="text-white flex-1">
          <h3 className="text-lg font-bold mb-1">Entrada Principal</h3>
          <p className="text-gray-400 text-sm">Imagem miniatura de 1 minuto atrás</p>
        </div>
        <button className="text-white ml-2">
          <i className="fa fa-clock-o"></i> {/* Placeholder for clock icon */}
        </button>
      </CardFooter>
    </Card>
  );
};

export default CameraCard;
