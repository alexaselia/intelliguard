import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface LoginCardProps {
  onLoginClick: () => void;
  email: string;
  password: string;
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  isSignUp?: boolean;
  setIsSignUp: (isSignUp: boolean) => void;
  onForgotPasswordClick: () => void;
}

const LoginCard: React.FC<LoginCardProps> = ({
  onLoginClick,
  email,
  password,
  setEmail,
  setPassword,
  isSignUp = false,
  setIsSignUp,
  onForgotPasswordClick,
}) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        onLoginClick();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onLoginClick]);

  return (
    <Card className="bg-[#2D3343] rounded-lg p-2 shadow-none max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg flex flex-col justify-between h-flex">
      <div>
        <CardHeader className="p-4">
          <CardTitle className="text-gray-300">{isSignUp ? 'Inscrever-se' : 'Entrar'}</CardTitle>
          <CardDescription className="text-gray-400">
            {isSignUp ? 'Criar uma nova conta' : 'Entre com suas credenciais'}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4">
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 text-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                Senha
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 text-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              />
            </div>
            <div className="pt-3">
              <div>
                <Button type="button" onClick={onLoginClick} className="w-full bg-[#1E90FF] hover:bg-[#1C86EE]">
                  {isSignUp ? 'Inscrever-se' : 'Entrar'}
                  </Button>
              </div>
            </div>
            {!isSignUp && (
              <div className="text-center">
                <a href="#" onClick={onForgotPasswordClick} className="block text-sm font-medium hover:underline text-gray-300">
                  Esqueceu sua senha?
                </a>
              </div>
            )}
          </div>
        </CardContent>
      </div>
    </Card>
  );
};

export default LoginCard;
