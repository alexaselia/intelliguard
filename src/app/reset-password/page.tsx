"use client";

import React, { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

const ResetPasswordContent: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || new URLSearchParams(window.location.hash.slice(1)).get('token');
  const type = searchParams.get('type') || new URLSearchParams(window.location.hash.slice(1)).get('type');

  useEffect(() => {
    if (token && type === 'recovery') {
      // Store the token in localStorage
      localStorage.setItem('recoveryToken', token);
      // Redirect to the change password page
      router.push('/change-password');
    } else {
      console.error('Invalid or missing token. Please try resetting your password again.');
    }
  }, [token, type, router]);

  return <div>Loading...</div>;
};

const ResetPasswordPage: React.FC = () => {
  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordContent />
    </React.Suspense>
  );
};

export default ResetPasswordPage;
