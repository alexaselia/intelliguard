"use client";

import React, { useEffect, useState } from 'react';
import { createClient } from '@/lib/utils/supabase/client';
import { User } from '@supabase/supabase-js';
import { Shield, Sparkle, SquareArrowOutUpRight } from 'lucide-react';
import Loading from './Loading'; // Adjust the path accordingly

interface Plan {
  id: string;
  name: string;
}

const UserPlanCard: React.FC<{ user: User }> = ({ user }) => {
  const [plan, setPlan] = useState<Plan | null>(null);
  const [loading, setLoading] = useState(true);

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
        setLoading(false);
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
        setLoading(false);
        return;
      }

      setPlan({ id: planId, name: planData.name });
      setLoading(false);
    };

    fetchUserPlan();
  }, [user]);

  if (loading) {
    return <Loading />; // Show loading state while fetching data
  }

  const renderSparkles = (count: number) => {
    return Array.from({ length: count }, (_, i) => (
      <Sparkle key={i} className="fill fill-white text-white w-6 h-6 mx-1" />
    ));
  };

  return (
    <div className="bg-[#262B31] p-4 rounded-lg shadow-md relative">
      <h2 className="text-xl font-bold text-white mb-4 text-left">Meu Plano</h2>
      <div className="flex flex-col justify-center items-center mb-1">
        <Shield className="text-white w-24 h-24 mb-2" />
        <div className="flex justify-center items-center mb-2">
          {plan ? renderSparkles(plan.id) : null}
        </div>
      </div>
      {plan ? (
        <>
          <p className="text-white text-lg text-center">{plan.name}</p>
          <div className="mt-1 text-center">
            <a href="#" className="text-blue-500 flex justify-center items-center">
              Comparar planos
              <SquareArrowOutUpRight className="ml-1 w-4 h-4" />
            </a>
          </div>
        </>
      ) : (
        <p className="text-white text-lg text-center">Plano não encontrado</p>
      )}
    </div>
  );
};

export default UserPlanCard;
