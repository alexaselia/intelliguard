"use client";

import React, { useEffect, useState } from 'react';
import RecentAlerts from '@/components/ui/RecentAlertsCard';
import SystemStatus from '@/components/ui/SystemStatusCard';
import { createClient } from '@/lib/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { User } from '@supabase/supabase-js';

const Home: React.FC = () => {
  const router = useRouter();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserSession = async () => {
      const supabase = createClient();
      const { data, error } = await supabase.auth.getUser();
      if (error || !data.user) {
        console.log('No user found, redirecting to login');
        router.push('/login');
      } else {
        console.log('User authenticated:', data.user);
        setUser(data.user);
      }
      setLoading(false);
    };

    fetchUserSession();
  }, [router]);

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
