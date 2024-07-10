import { useEffect } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import the components from the app directory
const Home = dynamic(() => import('@/app/page'), { ssr: false });
const Cameras = dynamic(() => import('@/app/cameras/page'), { ssr: false });
const Mapa = dynamic(() => import('@/app/mapa/page'), { ssr: false });
const Configuracoes = dynamic(() => import('@/app/configuracoes/page'), { ssr: false });

const PreloadPages: React.FC = () => {
  useEffect(() => {
    // Load the pages in the background
    Home.preload();
    Cameras.preload();
    Mapa.preload();
    Configuracoes.preload();
  }, []);

  return null;
};

export default PreloadPages;
