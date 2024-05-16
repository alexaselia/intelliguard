import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import HlsPlayer from '@/components/ui/HlsPlayer'; // Adjust the path as necessary

const EntranceCard: React.FC = () => {
  const streamUrl = "http://rtmp.megaguardiao.com.br:8000/live/intebrasdanilo/index.m3u8"; // Stream URL

  return (
    <Card className="bg-[#262B31] p-0 cursor-pointer h-80">
      <CardContent className="relative p-0 h-3/4">
        <div className="relative bg-gray-700 rounded-lg overflow-hidden h-full flex items-center justify-center">
          <HlsPlayer src={streamUrl} />
        </div>
      </CardContent>
      <CardFooter className="h-1/4 flex justify-between items-center p-4">
        <div className="text-white flex-1">
          <h3 className="text-lg font-bold mb-1">Entrada Principal</h3>
          <p className="text-gray-400 text-sm">Eventos da porta principal</p>
        </div>
        <button className="text-white ml-2">
          <i className="fa fa-clock-o"></i> {/* Placeholder for clock icon */}
        </button>
      </CardFooter>
    </Card>
  );
};

export default EntranceCard;
