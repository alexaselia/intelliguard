import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import HlsPlayer from '@/components/ui/HlsPlayer';
import ViewRecordingsButton from '@/components/ui/ViewRecordingsButton';

const EntranceCard: React.FC = () => {
  const streamUrl = "http://rtmp.megaguardiao.com.br:8000/live/intebrasdanilo/index.m3u8";
  const cameraId = "intebrasdanilo";

  return (
    <Card className="bg-[#262B31] p-0 cursor-pointer h-80">
      <CardContent className="relative p-0 h-3/4">
        <div className="relative bg-gray-700 rounded-lg overflow-hidden h-full flex items-center justify-center">
          <HlsPlayer src={streamUrl} />
        </div>
      </CardContent>
      <CardFooter className="h-1/4 flex justify-between items-center p-2 md:p-4">
        <div className="text-white flex-1">
          <h3 className="text-base md:text-lg lg:text-xl font-bold mb-1">Entrada Principal</h3>
          <p className="text-xs md:text-sm lg:text-base text-gray-400">Eventos da porta principal</p>
        </div>
        <button className="text-white ml-2 text-xs md:text-sm lg:text-base">
          <i className="fa fa-clock-o"></i>
        </button>
        <ViewRecordingsButton cameraId={cameraId} /> {/* Use the new button component */}
      </CardFooter>
    </Card>
  );
};

export default EntranceCard;
