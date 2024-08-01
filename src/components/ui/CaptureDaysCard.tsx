"use client";

import React, { useEffect, useState } from 'react';
import { createClient } from '@/lib/utils/supabase/client';
import { User } from '@supabase/supabase-js';

interface Plan {
  capture_duration_days: number;
}

const CaptureDaysCard: React.FC<{ user: User }> = ({ user }) => {
  const [captureDays, setCaptureDays] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCaptureDays = async () => {
      const supabase = createClient();

      // Fetch user's plan ID from people table
      const { data: userData, error: userError } = await supabase
        .from('people')
        .select('plan')
        .eq('user_uid', user.id)
        .single();

      if (userError || !userData) {
        console.error('Error fetching user data:', userError);
        setError('Erro ao buscar dados do usuário');
        return;
      }

      const planId = userData.plan;

      // Fetch capture duration days from plans table using plan_id
      const { data: planData, error: planError } = await supabase
        .from('plans')
        .select('capture_duration_days')
        .eq('plan_id', planId)
        .single();

      if (planError || !planData) {
        console.error('Error fetching plan data:', planError);
        setError('Erro ao buscar dados do plano');
        return;
      }

      setCaptureDays(planData.capture_duration_days);
    };

    fetchCaptureDays();
  }, [user]);

  if (error) {
    return <p className="text-white text-lg text-center">{error}</p>;
  }

  return (
    <div className="bg-[#262B31] p-4 rounded-lg shadow-md relative flex flex-col justify-center h-full">
      <h2 className="text-xl font-bold text-white text-left">Dias Guardados no Meu Plano</h2>
      <div className="flex justify-center items-center flex-grow">
        {captureDays !== null ? (
          <p className="text-white text-6xl">{captureDays}</p>
        ) : (
          <p className="text-white text-lg text-center">Dias não encontrados</p>
        )}
      </div>
    </div>
  );
};

export default CaptureDaysCard;
