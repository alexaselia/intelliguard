"use client";

import { usePathname } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import VideoPlayer from '@/components/ui/VideoPlayer';
import TimelineVideoPlayer from '@/components/ui/TimelineVideoPlayer';
import { fetchRecordingsGroupedByDay } from '@/lib/utils/groupplaybackbyday';
import { readCamerasFromSupabase, getUserPlan, CameraLocation } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CircleAlert, Sparkles, Calendar } from 'lucide-react';
import { createClient } from '@/lib/utils/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Calendar as ShadcnCalendar } from '@/components/ui/calendar';
import crypto from 'crypto';
import Timeline from '@/components/ui/Timeline';

const supabase = createClient(); // Use the singleton instance

const md5Hash = (str: string) => {
  return crypto.createHash('md5').update(str).digest('hex');
};

const CameraChannelPage: React.FC = () => {
  const pathname = usePathname();
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

  useEffect(() => {
    const fetchUserSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error || !data.session) {
        console.log('No user found, redirecting to login');
        // Redirect to login page
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
      // Replace this with the actual path to your frames
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

  if (!camera) {
    return <div>Loading...</div>;
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
              <Button onClick={handleLiveFeedClick} className="mb-4 w-full bg-gray-700 hover:bg-gray-800 hover:bg-opacity-50">
                Ver Ao Vivo
              </Button>
              <div className="flex items-center justify-between mb-1 text-white">
                <span>Gravações</span>
                <Popover>
                  <PopoverTrigger>
                    <Calendar className="cursor-pointer" />
                  </PopoverTrigger>
                  <PopoverContent>
                    <ShadcnCalendar
                      selectedDate={selectedDay ? new Date(selectedDay) : undefined}
                      onSelectDate={(date) => handleCalendarDayClick(date.toISOString().split('T')[0])}
                      renderDay={renderDay}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="h-full w-full custom-scroll-area">
                <div className="h-full max-h-[600px] custom-scroll-area">
                  <Accordion type="single" collapsible className="text-white">
                    <AccordionItem value="escolha-o-dia" className="max-h-100 custom-scroll-area flex flex-col rounded-md mt-1 border border-gray-700 p-2 hover:bg-gray-700 hover:bg-opacity-20">
                      <AccordionTrigger>Escolha o Dia</AccordionTrigger>
                      <AccordionContent className="max-h-96">
                        <Accordion type="single" collapsible className="text-white">
                          {Object.keys(getFilteredRecordings()).map((day) => (
                            <AccordionItem key={day} value={day} className="rounded-md mt-1 border border-gray-700 p-2 hover:bg-gray-700 hover:bg-opacity-20">
                              <AccordionTrigger>{day}</AccordionTrigger>
                              <AccordionContent className="max-h-48 custom-scroll-area">
                                {recordings[day].map((recording, index) => (
                                  <div
                                    key={`${cameraId}-${index}`}
                                    className="p-2 rounded-md cursor-pointer hover:bg-gray-700 text-white"
                                    onClick={() => handleRecordingClick(recording.path)}
                                  >
                                    {new Date(recording.startTime).toLocaleTimeString('en-GB')}
                                  </div>
                                ))}
                              </AccordionContent>
                            </AccordionItem>
                          ))}
                        </Accordion>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                  <Card className="mt-4 bg-background rounded-md border border-yellow-500 p-2 hover:bg-yellow-500 hover:bg-opacity-10 cursor-pointer" onClick={() => window.open('https://megabitfibra.com.br/', '_blank')}>
                    <CardContent className="flex items-center justify-center space-x-4">
                      <Sparkles className="h-16 w-16 text-yellow-500" />
                      <div className="text-white">Quer gravar por mais tempo? Faça um upgrade!</div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CameraChannelPage;
