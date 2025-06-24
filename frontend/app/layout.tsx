import { ReactNode } from "react";
import "./globals.css";
import ClientLayout from './ClientLayout';
import SocketProvider from "./context/socketContext";

interface RootLayoutProps {
  children: ReactNode;
}

export const metadata = {
  title: "Social Network",
  description: "Social Network is a web app to share and communicate with the world",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ClientLayout>
          <SocketProvider>
            {children}
          </SocketProvider>
        </ClientLayout>
      </body>
    </html>
  );
}

