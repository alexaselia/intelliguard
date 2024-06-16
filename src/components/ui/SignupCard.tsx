import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface SignupCardProps {
  onSignupClick: () => void;
  email: string;
  password: string;
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
}

const SignupCard: React.FC<SignupCardProps> = ({
  onSignupClick,
  email,
  password,
  setEmail,
  setPassword,
}) => {
  return (
    <Card className="bg-[#2D3343] rounded-lg p-4 shadow-none max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg">
      <CardHeader className="p-4">
        <CardTitle className="text-gray-300">Inscrever-se</CardTitle>
        <CardDescription className="text-gray-400">Crie uma nova conta</CardDescription>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300">Email</label>
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
            <label htmlFor="password" className="block text-sm font-medium text-gray-300">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 text-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            />
          </div>
          <div>
            <Button type="button" onClick={onSignupClick} className="w-full bg-[#1E90FF] hover:bg-[#1C86EE]">Sign Up</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SignupCard;
