"use client";

import React, { useEffect, useState } from 'react';
import UserCamerasStatusCard from '@/components/ui/UserCamerasStatusCard';
import UserPlanCard from '@/components/ui/UserPlanCard';
import CaptureDaysCard from '@/components/ui/CaptureDaysCard'; // Adjust the path accordingly
import { createClient } from '@/lib/utils/supabase/client';
import { redirect } from 'next/navigation';
import { User } from '@supabase/supabase-js';
import { motion } from 'framer-motion';
import Loading from '@/components/ui/Loading';


const Home: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserSession = async () => {
      const supabase = createClient();
      const { data, error } = await supabase.auth.getSession();
      if (error || !data.session) {
        console.log('No user found, redirecting to login');
        redirect('/login');
      } else {
        console.log('User authenticated:', data.session.user);
        setUser(data.session.user);
      }
      // Add an extra delay before ending the loading state
      setTimeout(() => setLoading(false), 1000); // 1 second delay
    };

    fetchUserSession();
  }, []);

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
    return <Loading />; // Show loading state while checking user session
  }

  if (!user) {
    return null; // If user is not authenticated, return null to avoid rendering the page content
  }

  return (
    <div className="p-4 md:p-6 pt-4 md:pt-6">
      <motion.div
        className="flex justify-between items-center mb-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">Home</h1>
        </div>
      </motion.div>
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        <UserCamerasStatusCard user={user} />
        <UserPlanCard user={user} />
        <CaptureDaysCard user={user} />
      </motion.div>
    </div>
  );
};

export default Home;
