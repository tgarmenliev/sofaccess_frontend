// app/admin/layout.tsx

"use client";

import { useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClientComponentClient();

  useEffect(() => {
    const handleSignOut = async () => {
      await supabase.auth.signOut();
      console.log("User signed out.");
    };

    // This function runs when the user CLOSES the tab/browser
    window.addEventListener('beforeunload', handleSignOut);

    // The cleanup function of this effect runs when the user NAVIGATES AWAY
    // from the admin section to another part of the site.
    return () => {
      console.log("Navigating away from admin, signing out...");
      handleSignOut();
      window.removeEventListener('beforeunload', handleSignOut);
    };
  }, [supabase]); // The effect depends on the supabase client

  return (
    <>
      {children}
    </>
  );
}