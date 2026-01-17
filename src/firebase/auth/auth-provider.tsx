'use client';

import { useEffect, type ReactNode } from 'react';
import { useAuth, useUser } from '@/firebase';
import { initiateAnonymousSignIn } from '@/firebase/non-blocking-login';
import { Loader2 } from 'lucide-react';
import { Toaster } from '@/components/ui/toaster';

/**
 * AuthProvider handles the anonymous authentication flow for the application.
 * It ensures a user is signed in before rendering the main content.
 * While waiting for the authentication status, it displays a loading spinner.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const auth = useAuth();
  const { user, isUserLoading } = useUser();

  useEffect(() => {
    // If the user is not logged in and the initial auth check is complete,
    // initiate an anonymous sign-in.
    if (!user && !isUserLoading) {
      initiateAnonymousSignIn(auth);
    }
  }, [user, isUserLoading, auth]);

  // While the auth state is being determined, show a full-screen loader
  // to prevent rendering content that might depend on the user's auth status.
  if (isUserLoading) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  // Once the user is authenticated (or the sign-in process is initiated),
  // render the main application content.
  return <>{children}</>;
}
