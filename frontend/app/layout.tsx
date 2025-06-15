import { ReactNode } from 'react';
import './globals.css'
import Footer from '@/components/clients/footer/footer';
import Header from '@/components/clients/header/header';

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
        <Header/>
        <main>
          {children}
        </main>

        {/* <Footer/> */}
      </body>
    </html>
  );
}
