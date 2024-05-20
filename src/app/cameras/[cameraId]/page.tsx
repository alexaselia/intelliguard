"use client";

import { usePathname } from 'next/navigation';
import React from 'react';

const CameraChannelPage: React.FC = () => {
  const pathname = usePathname();
  const cameraId = pathname.split('/').pop();

  return (
    <div>
      <h1>Camera Channel: {cameraId}</h1>
      {/* Add your live feed and past recordings here */}
    </div>
  );
};

export default CameraChannelPage;
