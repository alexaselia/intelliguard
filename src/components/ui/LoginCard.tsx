import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface LoginCardProps {
  onLoginClick: () => void;
}

const LoginCard: React.FC<LoginCardProps> = ({ onLoginClick }) => {
  return (
    <Card className="bg-[#2D3343] rounded-lg p-4 shadow-none max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg">
      <CardHeader className="p-4">
        <CardTitle className="text-gray-300">Login</CardTitle>
        <CardDescription className="text-gray-400">Enter your credentials to access your account</CardDescription>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-300">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 text-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 text-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            />
          </div>
          <div>
            <Button type="button" onClick={onLoginClick} className="w-full bg-[#1E90FF] hover:bg-[#1C86EE]">
              Login
            </Button>
          </div>
        </div>
      </CardContent>
      <CardFooter className="text-center p-4">
        <p className="text-sm text-gray-400">
          Don't have an account? <a href="#" className="text-primary-500 hover:underline">Sign up</a>
        </p>
      </CardFooter>
    </Card>
  );
};

export default LoginCard;
