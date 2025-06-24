import './globals.css';
import { ReactNode } from 'react';

import ClientLayout from './ClientLayout';


export const metadata = {
  title: "Social Network",
  description: "Social Network is a web app to share and communicate with the world",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>

        <ClientLayout>Add commentMore actions
          {children}
        </ClientLayout>

      </body>
    </html>
  );
}
