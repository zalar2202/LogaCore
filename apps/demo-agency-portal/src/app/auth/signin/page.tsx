import { Suspense } from 'react';
import { SignInForm } from './SignInForm';

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950">
      <div className="w-full max-w-sm space-y-6 rounded-xl border border-slate-800 bg-slate-900 p-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-100">LogaCore</h1>
          <p className="mt-1 text-sm text-slate-400">
            Sign in to the admin panel
          </p>
        </div>

        <Suspense>
          <SignInForm />
        </Suspense>
      </div>
    </div>
  );
}
