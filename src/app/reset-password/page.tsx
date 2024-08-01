'use client';

import React, { useState } from 'react';
import { createClient } from '@/lib/utils/supabase/client'; // Adjust the import as needed
import ResetPasswordCard from '@/components/ui/ResetPasswordCard'; // Adjust the import as needed
import { ChevronLeft, CircleCheckBig } from 'lucide-react'; // Correctly import icons
import Link from 'next/link';

const supabase = createClient();

const ResetPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleResetPasswordClick = async (formData: FormData) => {
    setIsLoading(true);
    const email = formData.get('email') as string;

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'http://localhost:3000/change-password',
    });

    if (error) {
      setIsLoading(false);
      alert(`Error: ${error.message}`); // Display an alert on error
    } else {
      setIsSuccess(true);
    }
  };

  const handleGoBack = () => {
    // Implement the logic to go back to the login page
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#13171E] p-4 pb-28">
      <div className="flex flex-col items-center">
        <div className="mb-6" style={{ width: '80%', maxWidth: '200px' }}>
          <img src="/images/logo.svg" alt="Logo" style={{ width: '100%' }} />
        </div>
        <div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg">
          <h1 className="text-2xl font-semibold text-white mb-2 text-center">Recuperar a Senha</h1>
          <p className="text-sm md:text-sm sm:text-[0.95rem] text-white text-center mb-6">Insira o email usado para acessar o Guardião, e mandaremos um link para criar uma nova senha.</p>
          <form onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            handleResetPasswordClick(formData);
          }}>
            <ResetPasswordCard
              onResetPasswordClick={handleResetPasswordClick}
              email={email}
              setEmail={setEmail}
            />
          </form>
        </div>
      </div>

      {/* Overlay and Popup */}
      {isLoading && (
        <div className="overlay p-4">
          {isSuccess ? (
            <div className="popup flex flex-col items-center p-8 bg-[#2D3343] text-white">
              <CircleCheckBig className="popup-icon" size={64} />
              <h1 className="text-2xl md:text-2xl font-bold text-white pb-2">Link enviado com sucesso</h1>
              <p className="pb-4">Agora vá até sua caixa de entrada e siga o link para redefinir sua senha.</p>
              <Link href="/login">
              <button className="popup-button bg-white bg-opacity-80 hover:bg-white hover:bg-opacity-100 flex flex-row items-center justify-between px-8 transition duration-300">
                <ChevronLeft />
                Voltar para tela de login
              </button>
              </Link>
            </div>
          ) : (
            <div className="loading-spinner"></div>
          )}
        </div>
      )}
    </div>
  );
};

export default ResetPasswordPage;
