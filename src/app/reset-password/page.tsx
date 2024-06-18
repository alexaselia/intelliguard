"use client";

import React, { Suspense, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';

const ResetPasswordContent: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const type = searchParams.get('type');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!token || type !== 'recovery') {
      setErrorMessage('Invalid or missing token. Please try resetting your password again.');
    }
  }, [token, type]);

  const handleResetPassword = async () => {
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!token || type !== 'recovery') {
      setErrorMessage('Invalid or missing token. Please try resetting your password again.');
      return;
    }

    const { data: session, error: verifyError } = await supabase.auth.verifyRecovery(token);
    if (verifyError) {
      setErrorMessage('Error verifying token. Please try again.');
      console.error('Error verifying token:', verifyError.message);
      return;
    }

    const { error: updateError } = await supabase.auth.updateUser({ password });
    if (updateError) {
      setErrorMessage(updateError.message);
      console.error('Error resetting password:', updateError.message);
    } else {
      setSuccessMessage('Password updated successfully. You can now log in with your new password.');
      setTimeout(() => router.push('/login'), 3000); // Redirect to login page after 3 seconds
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#13171E] p-4">
      <div className="max-w-xs w-full space-y-6">
        <h2 className="text-center text-3xl font-extrabold text-gray-300">Redefinir Senha</h2>
        <div className="rounded-md shadow-sm -space-y-px">
          <div>
            <label htmlFor="password" className="sr-only">Nova Senha</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 text-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              placeholder="Nova Senha"
            />
          </div>
        </div>
        <div>
          <Button type="button" onClick={handleResetPassword} className="w-full bg-[#1E90FF] hover:bg-[#1C86EE]">
            Redefinir Senha
          </Button>
        </div>
        {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}
        {successMessage && <p className="text-green-500 mt-2">{successMessage}</p>}
      </div>
    </div>
  );
};

const ResetPasswordPage: React.FC = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordContent />
    </Suspense>
  );
};

export default ResetPasswordPage;
