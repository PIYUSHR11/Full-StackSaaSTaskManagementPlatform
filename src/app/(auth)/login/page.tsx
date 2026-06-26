//v5
// src/app/(auth)/login/page.tsx
import { Suspense } from 'react';
import LoginPageContent from './login-content';

// This is safe to export because it doesn't use hooks directly
export const dynamic = 'force-dynamic';

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <LoginPageContent />
    </Suspense>
  );
}