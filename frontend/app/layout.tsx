import { ReactNode } from 'react';
import { PostProvider } from '@/context/PostContext';
import './globals.css'

interface RootLayoutProps {
  children: ReactNode;
}


export const metadata = {
  title: 'Social Network',
  description: 'Social Network is a web app to share and comunnicate with the world',
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>
        <PostProvider>
          {children}
        </PostProvider>
      </body>
    </html>
  );
}
