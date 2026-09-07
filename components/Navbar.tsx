"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { useRouter } from 'next/navigation';

export function Navbar({ clientId: serverClientId }: { clientId?: string }) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchUser = async () => {
    try {
      const res = await fetch('/api/auth/me');
      const data = await res.json();
      if (data.authenticated) {
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    router.push('/');
  };

  let clientId = serverClientId || process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';
  if (clientId) {
    clientId = clientId.replace(/^https?:\/\//, '').replace(/["']/g, '').trim();
  }

  return (
    <nav className="border-b border-white/5 bg-neutral-950/80 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="font-display font-bold text-xl text-white tracking-tight">
          NANOWARE AI
        </Link>
        
        <div className="flex items-center gap-4">
          {loading ? (
            <div className="w-24 h-8 bg-neutral-900 animate-pulse rounded-md"></div>
          ) : user ? (
            <div className="flex items-center gap-4">
              <Link href="/dashboard" className="text-sm font-medium hover:text-white text-neutral-300">
                Dashboard
              </Link>
              {user.role === 'admin' || user.role === 'owner' ? (
                <Link href="/admin" className="text-sm font-medium hover:text-white text-amber-400">
                  Admin
                </Link>
              ) : null}
              <div className="flex items-center gap-2 pl-4 border-l border-white/10">
                {user.picture ? (
                  <img src={user.picture} alt="" className="w-8 h-8 rounded-full border border-white/10" referrerPolicy="no-referrer" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-bold text-white">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <button onClick={handleLogout} className="text-xs text-neutral-500 hover:text-red-400 transition-colors">
                  Sign Out
                </button>
              </div>
            </div>
          ) : clientId && clientId !== 'YOUR_GOOGLE_CLIENT_ID' ? (
            <GoogleOAuthProvider clientId={clientId}>
              <GoogleLogin
                onSuccess={async (credentialResponse) => {
                  try {
                    const res = await fetch('/api/auth/google', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ credential: credentialResponse.credential }),
                    });
                    if (res.ok) {
                      await fetchUser();
                    }
                  } catch (e) {
                    console.error("Login failed", e);
                  }
                }}
                onError={() => {
                  console.error('Login Failed');
                }}
                use_fedcm_for_prompt={false}
                theme="filled_black"
                shape="pill"
              />
            </GoogleOAuthProvider>
          ) : (
            <div className="text-xs font-medium text-amber-400 border border-amber-500/20 bg-amber-500/10 px-4 py-2 rounded-full">
              Google Auth Disabled (ID: {clientId ? 'Invalid/Default' : 'Missing'})
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
