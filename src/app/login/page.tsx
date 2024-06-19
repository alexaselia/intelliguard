'use client';

import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { login } from './actions';
import LoginCard from '@/components/ui/LoginCard';

const LoginPage: React.FC = () => {
  const logoContainerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

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
        .to(logoContainer, { y: '-=140', duration: 1, ease: 'power2.inOut' })
        .to(card, { autoAlpha: 1, duration: 1, ease: 'power2.inOut' }, "-=0.5");
    } else {
      console.error("Logo container or card element not found");
    }
  }, []);

  const handleLoginClick = async (formData: FormData) => {
    setErrorMessage(null);

    try {
      await login(formData);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage('An unexpected error occurred');
      }
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#13171E] p-4">
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div ref={logoContainerRef} className="hidden-init" style={{ width: '80%', maxWidth: '200px' }}>
          <img src="/images/logo.svg" alt="Logo" style={{ width: '100%' }} />
        </div>
        <div ref={cardRef} className="mt-20 hidden-init">
          <form onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            handleLoginClick(formData);
          }}>
            <LoginCard
              onLoginClick={handleLoginClick}
              email={email}
              password={password}
              setEmail={setEmail}
              setPassword={setPassword}
            />
          </form>
          {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}
          {successMessage && <p className="text-green-500 mt-2">{successMessage}</p>}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
