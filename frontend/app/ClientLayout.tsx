'use client';

import { ReactNode, useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Header from '@/app/components/header/header';

interface ClientLayoutProps {
  children: ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('http://localhost:8080/app/v1/user/Auth', {
          credentials: 'include',
        });

        if (res.ok) {
          setIsAuthenticated(true);
        } else {
          if (pathname !== '/register' && pathname !== '/login') {
            router.push('/login');
          }
        }
      } catch (err) {
        console.error('Error checking auth:', err);
        if (pathname !== '/register' && pathname !== '/login') {
          router.push('/login');
        }
      }
    };

    checkAuth();
  }, [pathname, router]);


  return (
    <>
      {isAuthenticated && <Header />}
      {children}
    </>
  );
}
