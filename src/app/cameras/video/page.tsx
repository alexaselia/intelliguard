import React from 'react';
import VideoPlayer from '@/components/ui/VideoPlayer';
import SecondaryHeader from '@/components/ui/SecondaryHeader';

const VideoPage: React.FC = () => {
  const videoSrc = 'http://rtmp.megaguardiao.com.br/assets/media/live/mac-0003/2024-05-13-19-14-26.mp4'; // External video URL

  return (
    <div className="p-6 pt-4 h-screen flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-4xl font-bold text-white">Câmeras</h1>
          <p className="text-gray-400">Veja as câmeras ao vivo.</p>
        </div>
      </div>
      <SecondaryHeader />
      <div className="flex-grow p-4">
        <VideoPlayer src={videoSrc} />
      </div>
    </div>
  );
};

export default VideoPage;
