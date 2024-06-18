"use client";

import React, { Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

const ResetPasswordContent: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || window.location.hash.split('=')[1];
  const type = searchParams.get('type');

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
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordContent />
    </Suspense>
  );
};

export default ResetPasswordPage;
