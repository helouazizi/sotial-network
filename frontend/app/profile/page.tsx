'use client';

import { SocketContext } from '@/context/socketContext';
import { useRouter } from 'next/navigation';
import { useContext, useEffect } from 'react';

const PageProfile = () => {
  const { user } = useContext(SocketContext) ?? {};

  const router = useRouter();

  useEffect(() => {
    if (!user?.id) return;

    const interval = setInterval(() => {
      router.push(`/profile/${user.id}`);
    }, 200);

    return () => clearInterval(interval);
  }, [router, user?.id]);

  return null;
};

export default PageProfile;
