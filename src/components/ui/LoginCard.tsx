import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface LoginCardProps {
  onLoginClick: (formData: FormData) => void;
  email: string;
  password: string;
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
}

const LoginCard: React.FC<LoginCardProps> = ({
  onLoginClick,
  email,
  password,
  setEmail,
  setPassword,
}) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        const formData = new FormData();
        formData.append('email', email);
        formData.append('password', password);
        onLoginClick(formData);
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [email, password, onLoginClick]);

  return (
    <Card className="bg-[#2D3343] rounded-lg p-2 shadow-none max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg flex flex-col justify-between h-flex">
      <div>
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
                <Button type="submit" className="w-full bg-[#1E90FF] hover:bg-[#1C86EE]">
                  Entrar
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  );
};

export default LoginCard;
