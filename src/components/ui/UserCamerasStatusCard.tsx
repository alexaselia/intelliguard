"use client";

import React, { useEffect, useState } from 'react';
import { createClient } from '@/lib/utils/supabase/client';
import { User } from '@supabase/supabase-js';
import Loading from './Loading'; // Adjust the path accordingly
import { Cctv } from 'lucide-react';
import { Pie, PieChart, Label } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart';

interface Camera {
  id: string;
  online: boolean;
}

const UserCamerasStatusCard: React.FC<{ user: User }> = ({ user }) => {
  const [cameras, setCameras] = useState<Camera[]>([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return <Loading />; // Show loading state while fetching data
  }

  const onlineCameras = cameras.filter(camera => camera.online).length;
  const offlineCameras = cameras.length - onlineCameras;

  const chartData = [
    { name: "Online", value: onlineCameras, fill: "#5EDC8F" },
    { name: "Offline", value: offlineCameras, fill: "#F64F64" }
  ];

  const totalCameras = cameras.length;

  const chartConfig = {
    online: {
      label: "Online",
      color: "hsl(var(--chart-online))",
    },
    offline: {
      label: "Offline",
      color: "hsl(var(--chart-offline))",
    },
  } satisfies ChartConfig;

  return (
    <div className="bg-[#262B31] p-4 rounded-lg shadow-md relative">
      <h2 className="text-xl font-bold text-white mb-4">Status das Minhas Câmeras</h2>
      <ChartContainer config={chartConfig} className="relative mx-auto aspect-square max-h-[250px]">
        <PieChart>
          <ChartTooltip content={<ChartTooltipContent hideLabel />} />
          <Pie data={chartData} dataKey="value" nameKey="name" innerRadius={60} strokeWidth={5}>
            <Label
              content={({ viewBox }) => {
                if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                  return (
                    <text
                      x={viewBox.cx}
                      y={viewBox.cy}
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      <tspan
                        x={viewBox.cx}
                        y={viewBox.cy}
                        className="fill-foreground text-3xl font-bold"
                      >
                        {totalCameras}
                      </tspan>
                      <tspan
                        x={viewBox.cx}
                        y={(viewBox.cy || 0) + 24}
                        className="fill-muted-foreground"
                      >
                        Total Cameras
                      </tspan>
                    </text>
                  );
                }
                return null;
              }}
            />
          </Pie>
        </PieChart>
      </ChartContainer>
      <div className="flex justify-around text-white mt-4">
        <div className="flex items-center">
          <span className="inline-block w-4 h-4 bg-[#5EDC8F] rounded-full mr-2"></span>
          Online: {onlineCameras}
        </div>
        <div className="flex items-center">
          <span className="inline-block w-4 h-4 bg-[#F64F64] rounded-full mr-2"></span>
          Offline: {offlineCameras}
        </div>
        <div className="flex items-center">
          Total: {totalCameras}
        </div>
      </div>
    </div>
  );
};

export default UserCamerasStatusCard;
