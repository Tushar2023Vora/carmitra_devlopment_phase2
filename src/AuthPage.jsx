import React from 'react';
import { SignIn } from '@clerk/clerk-react';

export default function AuthPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="max-w-md w-full p-8 bg-gray-50 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-6 text-teal-700">Sign in to CarMitra</h2>
        <SignIn path="/auth" routing="path" signUpUrl="/sign-up" />
      </div>
    </div>
  );
}
