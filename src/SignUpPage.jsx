import React from 'react';
import { SignUp } from '@clerk/clerk-react';

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="max-w-md w-full p-8 bg-gray-50 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-6 text-teal-700">
          Create your CarMitra account
        </h2>
        <SignUp path="/sign-up" routing="path" signInUrl="/auth" />
      </div>
    </div>
  );
}
