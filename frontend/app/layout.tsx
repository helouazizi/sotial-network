import { ReactNode } from 'react';
import './globals.css'

interface RootLayoutProps {
  children: ReactNode;
}

export const metadata = {
  title: 'My Blog',
  description: 'Learning Next.js with the App Router!',
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>
  
        {children}
      
      </body>
    </html>
  );
}
