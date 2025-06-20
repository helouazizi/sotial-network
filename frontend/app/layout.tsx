import { ReactNode } from "react";
import "./globals.css";
import Header from "@/app/components/header/header";

interface RootLayoutProps {
  children: ReactNode;
}

export const metadata = {
  title: "Social Network",
  description:
    "Social Network is a web app to share and comunnicate with the world",
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css"
          integrity="sha512-Evv84Mr4kqVGRNSgIGL/F/aIDqQb7xQ2vcrdIwxfjThSH8CSR7PBEakCr51Ck+w+/U6swU2Im1vVX0SVk9ABhg=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      </head>
      <body suppressHydrationWarning={true}>
        <Header />
        {children}
      </body>
    </html>
  );
}