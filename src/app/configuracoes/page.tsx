"use client";

import React, { useEffect, useState, useRef } from 'react';
import { createClient } from '@/lib/utils/supabase/client';
import { useRouter } from 'next/navigation';
import AvatarUploader from '@/components/ui/settings/AvatarUploader';
import UserSettings from '@/components/ui/settings/UserSettings';
import CameraSettings from '@/components/ui/settings/CameraSettings';
import ShareSettings from '@/components/ui/settings/ShareSettings';
import Loading from '@/components/ui/Loading'; // Adjust the path accordingly
import { motion } from 'framer-motion';

interface Configuracoes {
  name: string;
  share: boolean;
  share_distance: number;
  image: string; // Add image property
}

interface Camera {
  id: string;
  name: string;
  shared: boolean;
  ownership: string;
}

const supabase = createClient(); // Use the singleton instance

const ConfiguracoesPage: React.FC = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [settings, setSettings] = useState<Configuracoes | null>(null);
  const [cameras, setCameras] = useState<Camera[]>([]);
  const [hasSharedCameras, setHasSharedCameras] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const hasFetchedSettings = useRef(false);
  const hasFetchedCameras = useRef(false);

  useEffect(() => {
    const fetchUserSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error || !data.session) {
        console.log('No user found, redirecting to login');
        router.push('/login');
      } else {
        console.log('User authenticated:', data.session.user);
        setUser(data.session.user);
      }
      // Add an extra delay before ending the loading state
      setTimeout(() => setLoading(false), 1000); // 1 second delay
    };

    fetchUserSession();
  }, [router]);

  const fetchSettings = async () => {
    if (loading || !user || hasFetchedSettings.current) return;

    try {
      console.log('Fetching settings for user:', user.id);
      const { data, error } = await supabase
        .from('people')
        .select('name, share, share_distance, image') // Add image to select
        .eq('user_uid', user.id)
        .single();

      if (error) {
        console.error('Failed to fetch user settings:', error);
      } else if (!data) {
        console.error('No user settings found for user:', user.id);
      } else {
        console.log('Fetched settings:', data);
        setSettings(data);
        if (data.image) {
          const signedUrl = await fetchImageURL(data.image);
          setAvatarUrl(signedUrl);
        }
        hasFetchedSettings.current = true;
      }
    } catch (error) {
      console.error('Error fetching user settings:', error);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, [user, loading]);

  useEffect(() => {
    const fetchCameras = async () => {
      if (!user || hasFetchedCameras.current) return;

      try {
        const { data, error } = await supabase
          .from('cameras')
          .select('*')
          .eq('ownership', user.id);

        if (error) {
          console.error('Failed to fetch cameras:', error);
        } else {
          setCameras(data);
          const shared = data.some((camera: Camera) => camera.shared);
          setHasSharedCameras(shared);
          hasFetchedCameras.current = true;
        }
      } catch (error) {
        console.error('Error fetching cameras:', error);
      }
    };
    fetchCameras();
  }, [user]);

  const handleShareChange = async (checked: boolean) => {
    if (!settings || !user) return;

    console.log('Toggling share to:', checked);

    const updatedSettings = { ...settings, share: checked };
    setSettings(updatedSettings);

    try {
      const { error } = await supabase
        .from('people')
        .update({ share: checked })
        .eq('user_uid', user.id);

      if (error) {
        console.error('Failed to update share setting:', error);
      }
    } catch (error) {
      console.error('Error updating share setting:', error);
    }
  };

  const handleShareDistanceChange = async (value: number) => {
    if (!settings || !user) return;

    console.log('Updating share distance to:', value);

    const updatedSettings = { ...settings, share_distance: value };
    setSettings(updatedSettings);

    try {
      const { error } = await supabase
        .from('people')
        .update({ share_distance: value })
        .eq('user_uid', user.id);

      if (error) {
        console.error('Failed to update share distance setting:', error);
      }
    } catch (error) {
      console.error('Error updating share distance setting:', error);
    }
  };

  const handleCameraShareChange = async (cameraId: string, shared: boolean) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('cameras')
        .update({ shared })
        .eq('id', cameraId);

      if (error) {
        console.error('Failed to update camera share setting:', error);
      } else {
        // Re-fetch cameras after updating
        const { data, error: fetchError } = await supabase
          .from('cameras')
          .select('*')
          .eq('ownership', user.id);

        if (fetchError) {
          console.error('Error re-fetching cameras:', fetchError);
        } else {
          setCameras(data);
          const shared = data.some((camera: Camera) => camera.shared);
          setHasSharedCameras(shared);
        }
      }
    } catch (error) {
      console.error('Error updating camera share setting:', error);
    }
  };

  const handleImageUpload = async (file: File) => {
    if (!user) return;

    const fileName = `${user.id}/${file.name}`;

    try {
      const { data, error } = await supabase.storage.from('avatars').upload(fileName, file);

      if (error) {
        console.error('Error uploading image:', error.message);
        return;
      }

      if (data) {
        console.log('File uploaded successfully:', data);

        // Save the file path to the user's profile
        const { error: updateError } = await supabase
          .from('people')
          .update({ image: data.path })
          .eq('user_uid', user.id);

        if (updateError) {
          console.error('Error updating user profile with image path:', updateError.message);
        } else {
          console.log('User profile updated with image path:', data.path);

          // Dispatch custom event to notify Header component
          const avatarUpdateEvent = new CustomEvent('avatarUpdate');
          window.dispatchEvent(avatarUpdateEvent);

          // Refresh user settings
          fetchSettings();
        }
      }
    } catch (error) {
      console.error('Unexpected error uploading image:', error);
    }
  };

  const fetchImageURL = async (imagePath: string) => {
    try {
      const { data, error } = await supabase.storage.from('avatars').createSignedUrl(imagePath, 60);

      if (error) {
        console.error('Error fetching signed URL:', error.message);
        return '';
      }

      return data.signedUrl;
    } catch (error) {
      console.error('Unexpected error fetching signed URL:', error);
      return '';
    }
  };

  if (loading || !settings) {
    return <Loading />; // Show custom loading state while checking user session
  }

  console.log('Current settings:', settings);

  return (
    <div className="p-6 pt-4">
      <style jsx global>{`
        input[type="number"]::-webkit-inner-spin-button,
        input[type="number"]::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }

        input[type="number"] {
          -moz-appearance: textfield;
        }
        .fade-enter {
          opacity: 0;
          transform: translateY(-20px);
        }
        .fade-enter-active {
          opacity: 1;
          transform: translateY(0);
          transition: opacity 300ms, transform 300ms;
        }
        .fade-exit {
          opacity: 1;
          transform: translateY(0);
        }
        .fade-exit-active {
          opacity: 0;
          transform: translateY(-20px);
          transition: opacity 300ms, transform 300ms;
        }
      `}</style>
      <motion.div
        className="flex justify-between items-center mb-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">Configurações</h1>
          <p className="text-gray-400">Meu perfil</p>
        </div>
      </motion.div>
      <motion.div
        className="space-y-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        <AvatarUploader avatarUrl={avatarUrl} userName={settings?.name || 'User'} onImageUpload={handleImageUpload} />
        <UserSettings userName={settings?.name || 'User'} />
        <ShareSettings
          share={settings?.share || false}
          shareDistance={settings?.share_distance || 0}
          hasSharedCameras={hasSharedCameras}
          onShareChange={handleShareChange}
          onShareDistanceChange={handleShareDistanceChange}
        />
        {settings?.share && (
          <CameraSettings cameras={cameras} onCameraShareChange={handleCameraShareChange} />
        )}
      </motion.div>
    </div>
  );
};

export default ConfiguracoesPage;
