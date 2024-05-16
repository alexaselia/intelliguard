"use client";

import React, { useEffect, useState } from 'react';
import MonitoringCard from '@/components/ui/MonitoringCard';
import EntranceCard from '@/components/ui/EntranceCard';
import RecentAlerts from '@/components/ui/RecentAlertsCard';
import SystemStatus from '@/components/ui/SystemStatusCard';

const Home: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: false,
    };
    return date.toLocaleDateString('pt-BR', options);
  };

  return (
    <div className="p-6 pt-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-4xl font-bold text-white">Home</h1>
          <p className="text-gray-400">Mantenha-se calmo, tranquilo e protegido! Veja o que está acontecendo na sua casa.</p>
        </div>
        <p className="text-custom-blue">
          {formatDate(currentTime)}
        </p>
      </div>
      <div className="grid grid-cols-2 gap-10">
        <MonitoringCard />
        <EntranceCard />
        <RecentAlerts />
        <SystemStatus />
      </div>
    </div>
  );
};

export default Home;
