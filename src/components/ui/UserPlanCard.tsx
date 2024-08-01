"use client";

import React, { useEffect, useState } from 'react';
import { createClient } from '@/lib/utils/supabase/client';
import { User } from '@supabase/supabase-js';
import { Shield, Sparkle } from 'lucide-react';

interface Plan {
  id: string;
  name: string;
}

const UserPlanCard: React.FC<{ user: User }> = ({ user }) => {
  const [plan, setPlan] = useState<Plan | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserPlan = async () => {
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

      // Fetch plan name from plans table using plan_id
      const { data: planData, error: planError } = await supabase
        .from('plans')
        .select('name')
        .eq('plan_id', planId)
        .single();

      if (planError || !planData) {
        console.error('Error fetching plan data:', planError);
        setError('Erro ao buscar dados do plano');
        return;
      }

      setPlan({ id: planId, name: planData.name });
    };

    fetchUserPlan();
  }, [user]);

  if (error) {
    return <p className="text-white text-lg text-center">{error}</p>;
  }

  const renderSparkles = (count: number) => {
    return Array.from({ length: count }, (_, i) => (
      <Sparkle key={i} className="fill fill-white text-white w-6 h-6 mx-1" />
    ));
  };

  return (
    <div className="bg-[#262B31] p-4 rounded-lg shadow-md relative">
      <h2 className="text-xl font-bold text-white mb-4 text-left">Meu Plano</h2>
      <div className="flex flex-col justify-center items-center flex-grow">
        <div className="flex flex-col justify-center items-center mb-1">
          <Shield className="text-white w-24 h-24 mb-4" />
          <div className="flex justify-center items-center mb-0">
            {plan ? renderSparkles(plan.id) : null}
          </div>
        </div>
        {plan ? (
          <p className="text-white text-lg text-center">{plan.name}</p>
        ) : (
          <p className="text-white text-lg text-center">Plano não encontrado</p>
        )}
      </div>
    </div>
  );
};

export default UserPlanCard;
