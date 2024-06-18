"use client";

import React, { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

const ResetPasswordPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const type = searchParams.get('type');

  useEffect(() => {
    if (token && type === 'recovery') {
      // Store the token in localStorage or a state management library
      localStorage.setItem('recoveryToken', token);
      // Redirect to the change password page
      router.push('/change-password');
    } else {
      // Handle the error state
      console.error('Invalid or missing token. Please try resetting your password again.');
    }
  }, [token, type, router]);

  return <div>Loading...</div>;
};

export default ResetPasswordPage;
