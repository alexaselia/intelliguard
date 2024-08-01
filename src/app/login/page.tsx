'use client';

import React, { useState } from 'react';
import { login } from './actions';
import LoginCard from '@/components/ui/LoginCard';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

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
      <div className="flex flex-col items-center">
        <div className="mb-4" style={{ width: '80%', maxWidth: '200px' }}>
          <img src="/images/logo.svg" alt="Logo" style={{ width: '100%' }} />
        </div>
        <div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg">
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
