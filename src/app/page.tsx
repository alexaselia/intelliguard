"use client";

import React, { useEffect, useState } from 'react';
import RecentAlerts from '@/components/ui/RecentAlertsCard';
import SystemStatus from '@/components/ui/SystemStatusCard';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

const Home: React.FC = () => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        console.log('No user found, redirecting to login');
        router.push('/login');
      } else {
        console.log('User authenticated:', user);
      }
    }
  }, [user, loading, router]);

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

  if (loading) {
    return <p>Loading...</p>; // Show a loading state while checking user session
  }

  if (!user) {
    return null; // If user is not authenticated, return null to avoid rendering the page content
  }

  return (
    <div className="p-6 pt-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">Home</h1>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <RecentAlerts />
        <SystemStatus />
      </div>
    </div>
  );
};

export default Home;
