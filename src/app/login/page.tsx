"use client";

import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import LoginCard from '@/components/ui/LoginCard';

const LoginPage: React.FC = () => {
  const router = useRouter();
  const logoContainerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const logoContainer = logoContainerRef.current;
    const card = cardRef.current;

    if (logoContainer && card) {
      gsap.set([logoContainer, card], { autoAlpha: 0 });
      gsap.set(logoContainer, { position: 'absolute', top: '50%', left: '50%', xPercent: -50, yPercent: -50 });
      gsap.set(card, { autoAlpha: 0, opacity: 0 });

      const timeline = gsap.timeline();

      timeline
        .to(logoContainer, { autoAlpha: 1, duration: 1, ease: 'power2.inOut' })
        .to(logoContainer, { y: '-=200', duration: 1, ease: 'power2.inOut' })
        .to(card, { autoAlpha: 1, duration: 1, ease: 'power2.inOut' }, "-=0.5");
    } else {
      console.error("Logo container or card element not found");
    }
  }, []);

  const handleLoginClick = async () => {
    setErrorMessage(null);

    const { user, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setErrorMessage(error.message);
      console.error('Error logging in:', error.message);
    } else {
      console.log('User logged in:', user);
      router.push('/?authenticated=true');
    }
  };

  const handleSignupClick = async () => {
    setErrorMessage(null);

    const { user, error } = await supabase.auth.signUp({ email, password });

    if (error) {
      setErrorMessage(error.message);
      console.error('Error signing up:', error.message);
    } else {
      console.log('User signed up:', user);
      router.push('/login');
    }
  };

  const handleToggle = () => {
    gsap.to(cardRef.current, { autoAlpha: 0, y: -20, duration: 0.3, ease: 'power2.inOut', onComplete: () => {
      setIsSignup(!isSignup);
      setEmail('');
      setPassword('');
      setErrorMessage(null);
      gsap.to(cardRef.current, { autoAlpha: 1, y: 40, duration: 0.3, ease: 'power2.inOut' });
    }});
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#13171E] p-4">
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div ref={logoContainerRef} className="hidden-init" style={{ width: '80%', maxWidth: '200px' }}>
          <img src="/images/logo.svg" alt="Logo" style={{ width: '100%' }} />
        </div>
        <div ref={cardRef} className="mt-20 hidden-init">
          <LoginCard
            onLoginClick={isSignup ? handleSignupClick : handleLoginClick}
            email={email}
            password={password}
            setEmail={setEmail}
            setPassword={setPassword}
            isSignUp={isSignup}
            setIsSignUp={setIsSignup}
          />
          {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}
          <div className="text-sm text-gray-400 mt-4">
            {isSignup ? (
              <p>
                Já tem uma conta? <a href="#" className="text-primary-500 hover:underline" onClick={handleToggle}>Log in</a>
              </p>
            ) : (
              <p>
                Ainda não tem uma conta? <a href="#" className="text-primary-500 hover:underline" onClick={handleToggle}>Inscreva-se</a>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
