"use client";

import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useRouter } from 'next/navigation';
import logoSvg from '/public/images/logo.svg'; // Import SVG as raw content
import LoginCard from '@/components/ui/LoginCard'; // Adjust the import path as necessary

const LoginPage: React.FC = () => {
  const router = useRouter();
  const logoContainerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const logoContainer = logoContainerRef.current;
    const card = cardRef.current;

    if (logoContainer && card) {
      const svg = logoContainer.querySelector('svg');
      const tiles = logoContainer.querySelectorAll('rect, path, circle'); // Select all elements within the SVG

      if (svg && tiles.length > 0) {
        // Ensure the logo container is initially centered and hidden
        gsap.set(logoContainer, { position: 'absolute', top: '50%', left: '50%', xPercent: -50, yPercent: -50, opacity: 0 });
        gsap.set(tiles, { autoAlpha: 0, y: 50 });
        gsap.set(card, { autoAlpha: 0, opacity: 0 });

        // Remove hidden-init class immediately before the animation starts
        gsap.set(logoContainer, { opacity: 1 });
        gsap.set(card, { opacity: 1 });

        const timeline = gsap.timeline();

        // Animate each tile into place
        tiles.forEach((tile, index) => {
          timeline.to(tile, { autoAlpha: 1, y: 0, duration: 0.3, ease: 'power2.inOut' }, index * 0.1);
        });

        // Move logo to final position dynamically
        const logoHeight = logoContainer.clientHeight;
        const cardHeight = card.clientHeight;
        const padding = 10; // Small padding between logo bottom edge and card top edge
        const moveUpDistance = -(logoHeight / 2 + padding + cardHeight / 2);

        timeline.to(logoContainer, { y: moveUpDistance, duration: 1, ease: 'power2.inOut' });

        // Animate card into view after logo assembles
        timeline.to(card, { autoAlpha: 1, y: 0, duration: 0.8, ease: 'power2.inOut' }, "-=0.5"); // Overlap with the end of the logo animation
      } else {
        console.error("SVG elements not found within container");
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
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div ref={logoContainerRef} dangerouslySetInnerHTML={{ __html: logoSvg }} className="hidden-init" />
        <div ref={cardRef} className="mt-20 hidden-init">
          <LoginCard onLoginClick={handleLoginClick} />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
