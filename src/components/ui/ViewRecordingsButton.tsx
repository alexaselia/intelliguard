import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { History } from 'lucide-react';

interface ViewRecordingsButtonProps {
  cameraId: string;
}

const ViewRecordingsButton: React.FC<ViewRecordingsButtonProps> = ({ cameraId }) => {
  const router = useRouter();

  const handleViewRecordings = () => {
    router.push(`/gravacoes?cameraId=${cameraId}`);
  };

  return (
    <Button
      onClick={handleViewRecordings}
      className="bg-primaryBlue-opacity-0 text-white flex items-center justify-center hover:bg-primaryBlue-hover text-xs md:text-sm lg:text-base px-2 md:px-4"
    >
      <History className="w-4 h-4 md:w-5 md:h-5" />
    </Button>
  );
};

export default ViewRecordingsButton;
