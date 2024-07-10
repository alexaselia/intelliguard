"use client";

import React, { useEffect, useState, useRef } from 'react';
import { createClient } from '@/lib/utils/supabase/client';
import { User } from '@supabase/supabase-js';
import Loading from './Loading'; // Adjust the path accordingly
import Chart from 'chart.js';
import { Cctv } from 'lucide-react';

interface Camera {
  id: string;
  online: boolean;
}

const UserCamerasStatusCard: React.FC<{ user: User }> = ({ user }) => {
  const [cameras, setCameras] = useState<Camera[]>([]);
  const [loading, setLoading] = useState(true);
  const chartRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const fetchCameras = async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('cameras')
        .select('id, online')
        .eq('ownership', user.id);

      if (error) {
        console.error('Error fetching cameras:', error);
      } else {
        setCameras(data || []);
      }
      setLoading(false);
    };

    fetchCameras();
  }, [user]);

  useEffect(() => {
    if (chartRef.current && !loading) {
      const onlineCameras = cameras.filter(camera => camera.online).length;
      const offlineCameras = cameras.length - onlineCameras;

      const data = [];
      const backgroundColor = [];
      const hoverBackgroundColor = [];

      for (let i = 0; i < offlineCameras; i++) {
        data.push(1);
        backgroundColor.push('#F64F64');
        hoverBackgroundColor.push('#F64F64');
      }

      for (let i = 0; i < onlineCameras; i++) {
        data.push(1);
        backgroundColor.push('#5EDC8F');
        hoverBackgroundColor.push('#5EDC8F');
      }

      new Chart(chartRef.current, {
        type: 'doughnut',
        data: {
          labels: Array(cameras.length).fill(''),
          datasets: [
            {
              data: data,
              backgroundColor: backgroundColor,
              hoverBackgroundColor: hoverBackgroundColor,
              borderWidth: 3, // Adjust border width to create space between segments
              borderColor: '#262B31', // Border color to enhance the separation effect
            },
          ],
        },
        options: {
          cutoutPercentage: 70, // Adjust the size of the inner cutout
          maintainAspectRatio: false,
          legend: {
            display: false,
          },
          tooltips: {
            enabled: true,
          },
        },
      });
    }
  }, [cameras, loading]);

  if (loading) {
    return <Loading />; // Show loading state while fetching data
  }

  return (
    <div className="bg-[#262B31] p-4 rounded-lg shadow-md relative">
      <h2 className="text-xl font-bold text-white mb-4">Status das Minhas Câmeras</h2>
      <div className="relative">
        <canvas ref={chartRef}></canvas>
        <div className="absolute inset-0 flex items-center justify-center">
          <Cctv className="text-white w-12 h-12" />
        </div>
      </div>
      <div className="flex justify-around text-white mt-4">
        <div className="flex items-center">
          <span className="inline-block w-4 h-4 bg-[#5EDC8F] rounded-full mr-2"></span>
          Online: {cameras.filter(camera => camera.online).length}
        </div>
        <div className="flex items-center">
          <span className="inline-block w-4 h-4 bg-[#F64F64] rounded-full mr-2"></span>
          Offline: {cameras.filter(camera => !camera.online).length}
        </div>
        <div className="flex items-center">
          Total: {cameras.length}
        </div>
      </div>
    </div>
  );
};

export default UserCamerasStatusCard;
