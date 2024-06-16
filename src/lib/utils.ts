// src/lib/utils.ts
import { supabase } from './supabaseClient';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

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
  ownership: boolean;
  url: string;
  category: string;
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
  }));

  return cameras;
};
