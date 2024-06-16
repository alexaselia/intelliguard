"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import LoginCard from '@/components/ui/LoginCard'; // Reusing the LoginCard for styling purposes

const SignUpPage: React.FC = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSignUpClick = async () => {
    setErrorMessage(null); // Clear any previous error messages

    // Sign up using Supabase
    const { user, error } = await supabase.auth.signUp({ email, password });

    if (error) {
      setErrorMessage(error.message);
      console.error('Error signing up:', error.message);
    } else {
      console.log('User signed up:', user);
      router.push('/login'); // Redirect to login page after successful sign-up
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#13171E] p-4">
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="mt-20">
          <LoginCard
            onLoginClick={handleSignUpClick}
            email={email}
            password={password}
            setEmail={setEmail}
            setPassword={setPassword}
            isSignUp={true}
          />
          {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
