// app/camera/[cameraId]/page.tsx
"use client";

import { useRouter } from 'next/navigation';
import React from 'react';

const CameraChannelPage: React.FC = () => {
  const router = useRouter();
  const { cameraId } = router.query;

  return (
    <div>
      <h1>Camera Channel: {cameraId}</h1>
      {/* Add your live feed and past recordings here */}
    </div>
  );
};

export default CameraChannelPage;
