// src/lib/utils.ts
import { createClient } from '@/lib/utils/supabase/client';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const supabase = createClient(); // Create the client instance here

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface CameraData {
  name: string;
  id: string;
  ip: string;
  codec: string;
  size: string;
  fps: number;
  url: string;
}

export interface CameraLocation {
  id: string;
  ip: string;
  codec: string;
  size: string;
  fps: number;
  name: string;
  latitude: number;
  longitude: number;
  shared: boolean;
  ownership: string;
  url: string;
  category: string;
  thumbnail: string;
}

export const readCamerasFromSupabase = async (): Promise<CameraLocation[]> => {
  const { data, error } = await supabase.from('cameras').select('*');

  if (error) {
    console.error('Error fetching cameras from Supabase:', error);
    return [];
  }

  const cameras: CameraLocation[] = data.map((camera: any) => ({
    id: camera.id,
    ip: camera.ip,
    codec: camera.codec,
    size: camera.size,
    fps: camera.fps,
    name: camera.name,
    latitude: camera.latitude,
    longitude: camera.longitude,
    shared: camera.shared,
    ownership: camera.ownership,
    url: camera.url,
    category: camera.ownership ? 'Casa' : (camera.shared ? 'Comunidade' : ''),
    thumbnail: camera.thumbnail,
  }));

  return cameras;
};

export const getUserPlan = async (userId: string) => {
  const { data: userData, error: userError } = await supabase
    .from('people')
    .select('plan')
    .eq('user_uid', userId)
    .single();

  if (userError) {
    console.error('Failed to fetch user plan:', userError);
    return null;
  }

  const { data: planData, error: planError } = await supabase
    .from('plans')
    .select('capture_duration_days')
    .eq('plan_id', userData.plan)
    .single();

  if (planError) {
    console.error('Failed to fetch plan details:', planError);
    return null;
  }

  return planData.capture_duration_days;
};
