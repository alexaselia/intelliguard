import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button'; // Adjust the path as necessary

interface ViewRecordingsButtonProps {
  cameraId: string; // Unique identifier for the camera
}

const ViewRecordingsButton: React.FC<ViewRecordingsButtonProps> = ({ cameraId }) => {
  const router = useRouter();

  const handleViewRecordings = () => {
    router.push(`/camera/${cameraId}`); // Navigate to the camera's channel page
  };

  return (
    <Button
      onClick={handleViewRecordings}
      className="bg-primaryBlue text-white flex items-center hover:bg-primaryBlue-hover"
    >
      <img src="/icons/clock.svg" alt="Clock Icon" className="w-4 h-4 mr-2" />
      Ver Gravações
    </Button>
  );
};

export default ViewRecordingsButton;
