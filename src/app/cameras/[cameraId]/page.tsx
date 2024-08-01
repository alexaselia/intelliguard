"use client";

import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { fetchRecordingsGroupedByDay } from '@/lib/utils/groupplaybackbyday';
import { readCamerasFromSupabase, getUserPlan, CameraLocation } from '@/lib/utils';
import { createClient } from '@/lib/utils/supabase/client';
import VideoPlayer from '@/components/ui/VideoPlayer';
import TimelineVideoPlayer from '@/components/ui/TimelineVideoPlayer';
import Timeline from '@/components/ui/Timeline';
import Loading from '@/components/ui/Loading';
import RecordingsAccordion from '@/components/ui/RecordingsAccordion';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CircleAlert } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import crypto from 'crypto';

const supabase = createClient();

const md5Hash = (str: string) => crypto.createHash('md5').update(str).digest('hex');

const formatDate = (dateString: string) => {
  const [year, month, day] = dateString.split('-');
  return `${day}/${month}/${year}`;
};

const extractTimeFromFilename = (filename: string) => {
  const parts = filename.split('-');
  const timePart = parts[parts.length - 1].split('.')[0];
  const hours = timePart.slice(0, 2);
  const minutes = timePart.slice(2, 4);
  const seconds = timePart.slice(4, 6);
  return `${hours}:${minutes}:${seconds}`;
};

const CameraChannelPage: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const cameraId = pathname.split('/').pop();
  const [camera, setCamera] = useState<CameraLocation | null>(null);
  const [recordings, setRecordings] = useState<{ [day: string]: Recording[] }>({});
  const [currentTime, setCurrentTime] = useState(0);
  const [selectedRecording, setSelectedRecording] = useState<string>(`https://nginx.megaguardiao.com.br/live/hls/${cameraId}.m3u8`);
  const [isLive, setIsLive] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [planDuration, setPlanDuration] = useState<number>(0);
  const [showOwnershipAlert, setShowOwnershipAlert] = useState(false);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [isTimelineView, setIsTimelineView] = useState(false);
  const [frames, setFrames] = useState<string[]>([]);
  const [isScrolling, setIsScrolling] = useState(false);
  const [cameras, setCameras] = useState<Camera[]>([]);
  const [selectedCamera, setSelectedCamera] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error || !data.session) {
        console.log('No user found, redirecting to login');
        return;
      } else {
        console.log('User authenticated:', data.session.user);
        setUser(data.session.user);
        const duration = await getUserPlan(data.session.user.id);
        setPlanDuration(duration);
      }
    };

    fetchUserSession();
  }, []);

  useEffect(() => {
    const fetchRecordings = async () => {
      if (!cameraId) return;
      const data = await fetchRecordingsGroupedByDay(cameraId);
      setRecordings(data);
    };

    fetchRecordings();
  }, [cameraId]);

  useEffect(() => {
    const fetchCameraDetails = async () => {
      const cameras = await readCamerasFromSupabase();
      const foundCamera = cameras.find((cam) => cam.id === cameraId);
      if (foundCamera) {
        setCamera(foundCamera);
      }
    };

    fetchCameraDetails();
  }, [cameraId]);

  useEffect(() => {
    if (camera && user && camera.ownership !== user.id) {
      setShowOwnershipAlert(true);
    } else {
      setShowOwnershipAlert(false);
    }
  }, [camera, user]);

  useEffect(() => {
    const fetchFrames = async () => {
      const frameBasePath = '/example/frames/';
      const frameList = [];
      for (let i = 1; i <= 60; i++) {
        frameList.push(`${frameBasePath}51d768dae4a9d672e4d92cf0b27c1fee-20240704-162650-${i}.jpg`);
      }
      setFrames(frameList);
    };

    if (isTimelineView) {
      fetchFrames();
    }
  }, [isTimelineView]);

  useEffect(() => {
    const fetchCameras = async () => {
      if (!user) return;
      const { data, error } = await supabase
        .from('cameras')
        .select('id, name')
        .eq('ownership', user.id);

      if (error) {
        console.error('Error fetching cameras:', error);
      } else {
        setCameras(data);
      }
    };

    fetchCameras();
  }, [user]);

  const handleLiveFeedClick = () => {
    setIsLive(true);
    setSelectedRecording(`https://nginx.megaguardiao.com.br/live/hls/${cameraId}.m3u8`);
  };

  const handleRecordingClick = (recording: string) => {
    const cameraIdHash = md5Hash(cameraId!);
    setIsLive(false);
    setSelectedRecording(`https://nginx.megaguardiao.com.br/play/${cameraIdHash}/${recording}`);
  };

  const handleCalendarDayClick = (day: string) => {
    setSelectedDay(day);
  };

  const handleToggleView = () => {
    setIsTimelineView((prev) => !prev);
  };

  const handleFrameClick = (frameIndex: number) => {
    const cameraIdHash = md5Hash(cameraId!);
    setSelectedRecording(`https://nginx.megaguardiao.com.br/play/${cameraIdHash}/51d768dae4a9d672e4d92cf0b27c1fee-20240704-162650.mp4#t=${frameIndex}`);
    setCurrentTime(frameIndex);
    setIsLive(false);
  };

  const getFilteredRecordings = () => {
    const filteredRecordings: { [day: string]: Recording[] } = {};
    const now = new Date();
    for (const day in recordings) {
      const date = new Date(day);
      const diffTime = Math.abs(now.getTime() - date.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays <= planDuration) {
        filteredRecordings[day] = recordings[day];
      }
    }
    return filteredRecordings;
  };

  const renderDay = (day: Date) => {
    const formattedDay = day.toISOString().split('T')[0];
    const hasRecordings = Object.keys(recordings).includes(formattedDay);
    return (
      <div
        className={`p-2 ${hasRecordings ? 'border border-black' : ''}`}
        onClick={() => handleCalendarDayClick(formattedDay)}
      >
        {day.getDate()}
      </div>
    );
  };

  const handleCameraChange = (cameraId: string) => {
    setSelectedCamera(cameraId);
    router.push(`/cameras/${cameraId}`);
  };

  if (!camera) {
    return <Loading />;
  }

  return (
    <div className="p-6">
      <div className="mb-4 w-full">
        <h1 className="text-3xl font-bold text-white">{camera.name}</h1>
      </div>
      <Button onClick={handleToggleView} className="mb-4">
        {isTimelineView ? 'Voltar para Vista Normal' : 'Ver Timeline'}
      </Button>
      {showOwnershipAlert ? (
        <Alert className="mb-4">
          <CircleAlert className="h-4 w-4" />
          <AlertTitle>Atenção!</AlertTitle>
          <AlertDescription>
            Esta câmera é de outro usuário. Você só pode ver o playback de câmeras próprias.
          </AlertDescription>
        </Alert>
      ) : (
        <div className="flex flex-col md:flex-row gap-4 md:gap-8">
          <div className="flex-1 relative">
            <div className="flex-1">
              {isTimelineView ? (
                <TimelineVideoPlayer
                  videoUrl="https://nginx.megaguardiao.com.br/play/51d768dae4a9d672e4d92cf0b27c1fee/51d768dae4a9d672e4d92cf0b27c1fee-20240704-162650.mp4"
                  currentTime={currentTime}
                  isScrolling={isScrolling}
                  frameUrl={frames[currentTime]}
                />
              ) : (
                <VideoPlayer
                  videoUrl={selectedRecording}
                  currentTime={currentTime}
                  onTimeUpdate={(time) => setCurrentTime(time)}
                  isLive={isLive}
                />
              )}
            </div>
            {isTimelineView ? (
              <Timeline
                currentTime={currentTime}
                setCurrentTime={setCurrentTime}
                onTimeSelected={handleFrameClick}
              />
            ) : (
              <div className="mt-4">
                <h2 className="text-2xl font-bold text-white">Galeria de Eventos</h2>
                <div className="rounded-md border border-dashed border-gray-700 p-4 mt-2 text-white">
                  Em breve seus eventos identificados por IA.
                </div>
              </div>
            )}
          </div>
          {!isTimelineView && (
            <div className="w-full h-full md:w-1/3">
              {user && (
                <div className="mb-4 w-full">
                  <Select onValueChange={handleCameraChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={camera.name} />
                    </SelectTrigger>
                    <SelectContent>
                      {cameras.map(camera => (
                        <SelectItem key={camera.id} value={camera.id}>
                          {camera.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              <RecordingsAccordion
                cameraId={cameraId!}
                recordings={recordings}
                planDuration={planDuration}
                selectedDay={selectedDay}
                handleLiveFeedClick={handleLiveFeedClick}
                handleRecordingClick={handleRecordingClick}
                handleCalendarDayClick={handleCalendarDayClick}
                formatDate={formatDate}
                extractTimeFromFilename={extractTimeFromFilename}
                getFilteredRecordings={getFilteredRecordings}
                renderDay={renderDay}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CameraChannelPage;
