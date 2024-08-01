"use client";

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { fetchRecordingsGroupedByDay } from '@/lib/utils/groupplaybackbyday';
import { readCamerasFromSupabase, getUserPlan, CameraLocation } from '@/lib/utils';
import { createClient } from '@/lib/utils/supabase/client';
import { VidstackPlayer } from '@/components/players/core/VidstackPlayer';
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

const GravacoesPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialCameraId = searchParams.get('cameraId');
  const [cameraId, setCameraId] = useState<string | null>(initialCameraId);
  const [camera, setCamera] = useState<CameraLocation | null>(null);
  const [recordings, setRecordings] = useState<{ [day: string]: Recording[] }>({});
  const [currentTime, setCurrentTime] = useState(0);
  const [selectedRecording, setSelectedRecording] = useState<string | null>(null);
  const [isLive, setIsLive] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [planDuration, setPlanDuration] = useState<number>(0);
  const [showOwnershipAlert, setShowOwnershipAlert] = useState(false);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [cameras, setCameras] = useState<Camera[]>([]);

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
      if (!user) return;
      const cameras = await readCamerasFromSupabase();
      const userCameras = cameras.filter((cam) => cam.ownership === user.id);
      setCameras(userCameras);
      if (cameraId) {
        const foundCamera = userCameras.find((cam) => cam.id === cameraId);
        if (foundCamera) {
          setCamera(foundCamera);
        }
      }
    };

    fetchCameraDetails();
  }, [cameraId, user]);

  useEffect(() => {
    if (camera && user && camera.ownership !== user.id) {
      setShowOwnershipAlert(true);
    } else {
      setShowOwnershipAlert(false);
    }
  }, [camera, user]);

  useEffect(() => {
    if (cameraId) {
      setSelectedRecording(`https://nginx.megaguardiao.com.br/live/hls/${cameraId}.m3u8`);
    }
  }, [cameraId]);

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
    setCameraId(cameraId);
    setSelectedRecording(`https://nginx.megaguardiao.com.br/live/hls/${cameraId}.m3u8`);
    const foundCamera = cameras.find((cam) => cam.id === cameraId);
    if (foundCamera) {
      setCamera(foundCamera);
    }
  };

  if (!user) {
    return <Loading />;
  }

  return (
    <div className="p-6">
      <div className="mb-4 w-full">
        <Select value={cameraId} onValueChange={handleCameraChange}>
          <SelectTrigger className="w-flex">
            <SelectValue placeholder="Selecione uma câmera">
              {cameraId ? cameras.find(camera => camera.id === cameraId)?.name : 'Selecione uma câmera'}
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="w-56 bg-[#2D3343] text-white rounded-md shadow-md border border-[#1E242D]">
            {cameras.map(camera => (
              <SelectItem className="focus:bg-gray-700 focus:text-white focus:bg-opacity-100" key={camera.id} value={camera.id}>
                {camera.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
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
                <VidstackPlayer
                  videoUrl={selectedRecording}
                  currentTime={currentTime}
                  onTimeUpdate={(time) => setCurrentTime(time)}
                  isLive={isLive}
                />
              </div>
              <div className="mt-4">
                <h2 className="text-2xl font-bold text-white">Galeria de Eventos</h2>
                <div className="rounded-md border border-dashed border-gray-700 p-4 mt-2 text-white">
                  Em breve seus eventos identificados por IA.
                </div>
              </div>
            </div>
            <div className="w-full h-full md:w-1/3">
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
          </div>
        )}
      </div>
    </div>
  );
};

export default GravacoesPage;
