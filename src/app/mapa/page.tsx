"use client";

import React from 'react';
import dynamic from 'next/dynamic';

const MapboxMap = dynamic(() => import('@/components/MapboxMap'), { ssr: false });

const MapaPage: React.FC = () => {
  return (
    <div className="map-container">
      <MapboxMap />
    </div>
  );
};

export default MapaPage;
