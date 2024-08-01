import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface ResetPasswordCardProps {
  onResetPasswordClick: (formData: FormData) => void;
  email: string;
  setEmail: (email: string) => void;
}

const ResetPasswordCard: React.FC<ResetPasswordCardProps> = ({
  onResetPasswordClick,
  email,
  setEmail,
}) => {
  return (
    <Card className="bg-[#2D3343] rounded-lg p-2 shadow-none max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg flex flex-col justify-between h-flex">
      <div>
        <CardContent className="px-6 py-4">
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                Email de Acesso
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 text-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                placeholder="Seu email aqui."
                required
              />
            </div>
            <div className="pt-2">
              <div className="flex flex-row justify-between space-x-4">
                <Button type="submit" className="w-full bg-white bg-opacity-80 text-black hover:bg-white hover:bg-opacity-100">
                  Mandar Link
                </Button>
                <Link href="/login" className="w-full">
                <Button type="submit" className="w-full bg-white bg-opacity-20 text-white hover:bg-white hover:bg-opacity-30">
                  Cancelar
                </Button>
                </Link>
              </div>
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  );
};

export default ResetPasswordCard;
