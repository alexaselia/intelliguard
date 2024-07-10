// components/ui/LoadingScreen.tsx
import React, { useEffect, useState } from 'react';
import { Progress } from '@/components/ui/progress';

interface LoadingScreenProps {
  progress: number;
}

const phrases = [
  'Preparando o mapa...',
  'Checando câmeras...',
  'Acessando dados com segurança...',
  'Protegendo seu acesso...',
  'Atualizando listas...',
];

const LoadingScreen: React.FC<LoadingScreenProps> = ({ progress }) => {
  const [currentPhrase, setCurrentPhrase] = useState(phrases[0]);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrentPhrase(phrases[Math.floor(Math.random() * phrases.length)]);
        setFade(true);
      }, 500);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="loading-screen absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-30 z-50">
      <div className={`text-white text-lg mb-1 transition-opacity duration-500 ${fade ? 'opacity-100' : 'opacity-0'}`}>
        {currentPhrase}
      </div>
      <Progress value={progress} />
    </div>
  );
};

export default LoadingScreen;
