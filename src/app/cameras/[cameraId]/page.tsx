"use client";

import { usePathname } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import DynamicCameraCard from '@/components/ui/DynamicCameraCard';
import ViewToggle from '@/components/ui/ViewToggle';
import Timeline from '@/components/ui/Timeline';
import VideoPlayer from '@/components/ui/VideoPlayer';

interface Camera {
  id: string;
  name: string;
  url: string;
  // Add other relevant properties of the camera object if any
}

interface Recording {
  path: string;
  startTime: number;
  endTime: number;
  time: string; // Assuming 'time' is a string, update this type if necessary
}

const CameraChannelPage: React.FC = () => {
  const pathname = usePathname();
  const cameraId = pathname.split('/').pop();
  const [camera, setCamera] = useState<Camera | null>(null);
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [viewMode, setViewMode] = useState('channel');
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [selectedRecording, setSelectedRecording] = useState<string>('');

  useEffect(() => {
    const fetchCameraData = async () => {
      try {
        const response = await fetch('/api/cameras');
        const cameras: Camera[] = await response.json();
        const selectedCamera = cameras.find((cam: Camera) => cam.id === cameraId) || null;
        setCamera(selectedCamera);

        if (selectedCamera) {
          console.log(`Selected camera: ${JSON.stringify(selectedCamera)}`);

          const playbackResponse = await fetch(`/api/playback/${cameraId}`);
          if (playbackResponse.ok) {
            const data = await playbackResponse.json();
            console.log(`Recordings fetched: ${JSON.stringify(data.recordings)}`);
            setRecordings(data.recordings);

            if (data.recordings.length > 0) {
              const totalDuration = data.recordings.reduce(
                (acc: number, recording: Recording) => acc + (recording.endTime - recording.startTime),
                0
              );
              setDuration(totalDuration);
              setSelectedRecording(data.recordings[0].path); // Default to the first recording
            }
          }
        }
      } catch (error) {
        console.error('Error fetching camera data:', error);
      }
    };
    fetchCameraData();
  }, [cameraId]);

  if (!camera) {
    return <div>Loading...</div>;
  }

  const handleScroll = (scrollTop: number) => {
    const newTime = (scrollTop / (duration ? (scrollTop * duration) / 100 : 1)); // Adjust this calculation as needed
    setCurrentTime(newTime);

    // Find the corresponding recording based on currentTime
    let accumulatedTime = 0;
    for (let recording of recordings) {
      accumulatedTime += recording.endTime - recording.startTime;
      if (currentTime <= accumulatedTime) {
        setSelectedRecording(recording.path);
        break;
      }
    }
  };

  const handleTimeUpdate = (time: number) => {
    setCurrentTime(time);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold text-white">Camera Channel: {camera.name}</h1>
        <ViewToggle onViewChange={setViewMode} currentView={viewMode} />
      </div>
      {viewMode === 'channel' ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <DynamicCameraCard
            key={camera.id}
            name="Live Feed"
            streamUrl={camera.url}
            cameraId={camera.id}
            isLive={true}
            showViewRecordingsButton={false}
            thumbnail={camera.thumbnail}
          />
          {recordings.map((recording, index) => (
            <DynamicCameraCard
              key={`${camera.id}-${index}`}
              name={`Recording from ${recording.time}`}
              streamUrl={recording.path}
              cameraId={`${camera.id}-${index}`}
              showViewRecordingsButton={false}
            />
          ))}
        </div>
      ) : (
        selectedRecording && (
          <div className="flex">
            <div className="flex-1">
              <VideoPlayer
                videoUrl={selectedRecording}
                currentTime={currentTime}
                onTimeUpdate={handleTimeUpdate}
              />
            </div>
            <div className="flex-1 overflow-hidden">
              <Timeline duration={duration} currentTime={currentTime} onScroll={handleScroll} />
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default CameraChannelPage;
