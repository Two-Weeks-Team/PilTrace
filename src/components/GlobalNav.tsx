'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function GlobalNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const supabase = createClient();

    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setIsLoggedIn(!!user);
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session?.user);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Hide on these paths
  const hiddenPaths = ['/login', '/signup', '/write/generating', '/write/survey'];
  
  if (
    !pathname ||
    hiddenPaths.includes(pathname) || 
    pathname.startsWith('/write/generating/') || 
    pathname.startsWith('/write/survey/')
  ) {
    return null;
  }

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/auth/logout', { method: 'POST' });
      if (res.ok) {
        setIsLoggedIn(false);
        router.refresh();
      }
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  if (!isMounted) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 max-w-lg mx-auto bg-[var(--cream,#fdfbf7)] shadow-lg border-t border-[var(--border-light,#e5e7eb)] rounded-t-xl pb-[env(safe-area-inset-bottom)]">
      <div className="flex justify-around items-center px-2 py-1.5">
        <Link 
          href="/" 
          className={`flex flex-col items-center justify-center gap-1 w-14 ${pathname === '/' ? 'text-[var(--sage-green,#849b87)]' : 'text-[var(--text-muted,#6b7280)]'}`}
        >
          <span className="text-lg">🏠</span>
          <span className="text-[10px] font-handwriting">홈</span>
        </Link>
        
        <Link 
          href="/write" 
          className={`flex flex-col items-center justify-center gap-1 w-14 ${pathname === '/write' ? 'text-[var(--sage-green,#849b87)]' : 'text-[var(--text-muted,#6b7280)]'}`}
        >
          <span className="text-lg">✍️</span>
          <span className="text-[10px] font-handwriting">쓰기</span>
        </Link>

        {isLoggedIn && (
          <Link 
            href="/drawer" 
            className={`flex flex-col items-center justify-center gap-1 w-14 ${pathname === '/drawer' ? 'text-[var(--sage-green,#849b87)]' : 'text-[var(--text-muted,#6b7280)]'}`}
          >
            <span className="text-lg">📂</span>
            <span className="text-[10px] font-handwriting">서랍</span>
          </Link>
        )}

        <Link 
          href="/access" 
          className={`flex flex-col items-center justify-center gap-1 w-14 ${pathname === '/access' ? 'text-[var(--sage-green,#849b87)]' : 'text-[var(--text-muted,#6b7280)]'}`}
        >
          <span className="text-lg">🔑</span>
          <span className="text-[10px] font-handwriting">조회</span>
        </Link>

        {!isLoggedIn ? (
          <Link 
            href="/login" 
            className={`flex flex-col items-center justify-center gap-1 w-14 ${pathname === '/login' ? 'text-[var(--sage-green,#849b87)]' : 'text-[var(--text-muted,#6b7280)]'}`}
          >
            <span className="text-lg">🔐</span>
            <span className="text-[10px] font-handwriting">로그인</span>
          </Link>
        ) : (
          <button 
            onClick={handleLogout} 
            className="flex flex-col items-center justify-center gap-1 w-14 text-[var(--text-muted,#6b7280)]"
          >
            <span className="text-lg">🚪</span>
            <span className="text-[10px] font-handwriting">로그아웃</span>
          </button>
        )}
      </div>
    </nav>
  );
}
