"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const LoginPage: React.FC = () => {
  const router = useRouter();

  const handleLoginClick = () => {
    console.log('Login button clicked');

    // Simulate login by setting session storage
    sessionStorage.setItem('authenticated', 'true');
    router.push('/?authenticated=true');
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#13171E]">
      <img src="/images/logo.svg" alt="CITITECH Logo" className="mb-6" />
      <Card className="w-full max-w-md p-6 bg-[#2D3343]">
        <CardHeader>
          <CardTitle className="text-gray-300">Login</CardTitle>
          <CardDescription className="text-gray-400">Enter your credentials to access your account</CardDescription>
        </CardHeader>
        <CardContent>
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
              <Button type="button" onClick={handleLoginClick} className="w-full bg-[#1E90FF] hover:bg-[#1C86EE]">
                Login
              </Button>
            </div>
          </div>
        </CardContent>
        <CardFooter className="text-center">
          <p className="text-sm text-gray-400">
            Don't have an account? <a href="#" className="text-primary-500 hover:underline">Sign up</a>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginPage;
