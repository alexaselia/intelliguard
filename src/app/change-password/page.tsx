'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/utils/supabase/client'; // Adjust the import as needed
import { ChevronLeft, CircleCheckBig, CircleX } from 'lucide-react'; // Correctly import icons
import Link from 'next/link';

const supabase = createClient();

const ChangePasswordPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get('code');

  const [newPassword, setNewPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [message, setMessage] = useState('');

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setIsError(false);

    if (!newPassword) {
      setMessage('Senha não pode ficar vazia.');
      setIsLoading(false);
      return;
    }

    const { error } = await supabase.auth.updateUser({ password: newPassword });

    if (error) {
      setIsLoading(false);
      setIsError(true);
      setMessage(`Error: ${error.message}`);
    } else {
      setIsSuccess(true);
      setMessage('Senha alterada com sucesso.');
      setTimeout(() => {
        router.push('/login'); // Redirect to the login page after a successful password change
      }, 3000); // Display the success message for 3 seconds before redirecting
    }
  };

  const handleRetry = () => {
    setIsError(false);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#13171E] p-4">
      <div className="flex flex-col items-center">
        <div className="mb-10" style={{ width: '80%', maxWidth: '200px' }}>
          <img src="/images/logo.svg" alt="Logo" style={{ width: '100%' }} />
        </div>
        <h1 className="text-2xl font-semibold text-white mb-2 text-center">Mudança de Senha</h1>
        <p className="text-sm md:text-sm sm:text-[0.95rem] text-white text-center mb-6">Use o campo abaixo para restaurar seu acesso.</p>
        <div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg bg-[#2D3343] p-8 rounded-lg">
          <form onSubmit={(e) => {
            e.preventDefault();
            handleChangePassword(e);
          }}>
            <div className="space-y-4">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                  Nova Senha
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 text-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  placeholder="Crie sua nova senha"
                  required
                />
              </div>
              <div className="pt-2">
                <div>
                  <button type="submit" className="w-full bg-white bg-opacity-80 hover:bg-white hover:bg-opacity-100 text-background py-2 px-4 rounded-full transition duration-300">
                    Concluir
                  </button>
                </div>
              </div>
            </div>
          </form>
          {message && <p className={`mt-2 ${isSuccess ? 'text-green-500' : 'text-red-500'}`}>{message}</p>}
        </div>
      </div>

      {/* Overlay and Popup */}
      {isLoading && (
        <div className="overlay p-4">
          {isSuccess ? (
            <div className="popup flex flex-col items-center p-8 bg-[#2D3343] text-white">
              <CircleCheckBig className="popup-icon" size={64} />
              <h1 className="text-2xl md:text-2xl font-bold text-white pb-2">Senha Alterada com Sucesso</h1>
              <p className="pb-4">Redirecionando para tela de login automaticamente.</p>
            </div>
          ) : isError ? (
            <div className="popup flex flex-col items-center p-8 bg-[#2D3343] text-white">
              <CircleX className="popup-icon" size={64} />
              <h1 className="text-2xl md:text-2xl font-bold text-white pb-2">Não conseguimos mudar sua senha</h1>
              <p className="pb-4">Cheque novamente se inseriu a senha corretamente. Se esse erro persistir, entre em contato com nosso suporte.</p>
              <button onClick={handleRetry} className="popup-button bg-white bg-opacity-80 hover:bg-white hover:bg-opacity-100 flex flex-row items-center justify-between px-8">
                <ChevronLeft />
                Tentar novamente
              </button>
            </div>
          ) : (
            <div className="loading-spinner"></div>
          )}
        </div>
      )}
    </div>
  );
};

export default ChangePasswordPage;
