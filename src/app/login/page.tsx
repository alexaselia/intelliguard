"use client";

import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import logoSvg from '/public/images/logo.svg'; // Import SVG as raw content

const LoginPage: React.FC = () => {
  const router = useRouter();
  const logoContainerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const logoContainer = logoContainerRef.current;
    const card = cardRef.current;

    if (logoContainer && card) {
      const svg = logoContainer.querySelector('svg');

      if (svg) {
        // Set initial positions for animation
        gsap.set(svg, { autoAlpha: 0, y: -50 });
        gsap.set(card, { autoAlpha: 0, y: 50 });

        const timeline = gsap.timeline();

        // Animate logo and card to final positions
        timeline.to(svg, { autoAlpha: 1, y: 0, duration: 1.5, ease: 'power2.inOut' });
        timeline.to(card, { autoAlpha: 1, y: 0, duration: 0.8, ease: 'power2.inOut' }, "-=1"); // Overlap with the end of the logo animation
      } else {
        console.error("SVG element not found within container");
      }
    } else {
      console.error("Logo container or card element not found");
    }
  }, []);

  const handleLoginClick = () => {
    console.log('Login button clicked');

    // Simulate login by setting session storage
    sessionStorage.setItem('authenticated', 'true');
    router.push('/?authenticated=true');
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#13171E] p-4">
      <div className="flex flex-col items-center space-y-6">
        <div ref={logoContainerRef} dangerouslySetInnerHTML={{ __html: logoSvg }} className="w-flex max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg mb-6" />
        <Card ref={cardRef} className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg p-6 bg-[#2D3343]">
          <CardHeader>
            <CardTitle className="text-gray-300">Login</CardTitle>
            <CardDescription className="text-gray-400">Enter your credentials to access your account</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-300">
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 text-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 text-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                />
              </div>
              <div>
                <Button type="button" onClick={handleLoginClick} className="w-full bg-[#1E90FF] hover:bg-[#1C86EE]">
                  Login
                </Button>
              </div>
            </div>
          </CardContent>
          <CardFooter className="text-center">
            <p className="text-sm text-gray-400">
              Don't have an account? <a href="#" className="text-primary-500 hover:underline">Sign up</a>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
