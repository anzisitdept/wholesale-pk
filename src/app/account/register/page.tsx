'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import AuthModal from '@/components/auth/AuthModal';

export default function RegisterPage() {
  const router = useRouter();

  return (
    <AuthModal
      isOpen={true}
      initialMode="register"
      onClose={() => router.push('/')}
    />
  );
}
