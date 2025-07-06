import { ReactNode } from "react";
import "./globals.css";
import SocketProvider from "../context/socketContext";
import Header from "../components/header/header";
import { RequetsProvider } from "@/context/RequestContext";

export const metadata = {
  title: "Social Network",
  description: "Social Network is a web app to share and communicate with the world",
};

export default function RootLayout({ children }: { children: ReactNode }) {

  return (
    <html lang="en">
      <body>
        <SocketProvider>
          <RequetsProvider>
            <Header />
          </RequetsProvider>
          {children}
        </SocketProvider>
      </body>
    </html>
  );
}

