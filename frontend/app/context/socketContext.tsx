"use client"
import { usePathname } from "next/navigation"
import { createContext, useEffect, useRef, useState, ReactNode } from "react"

// ✅ 1. Define a type for the context value
export interface SocketContextType {
  ws: React.MutableRefObject<WebSocket | null>;
  messages: any[];
  setMessages: React.Dispatch<React.SetStateAction<any[]>>;
}

// ✅ 2. Create the context with that type
export const SocketContext = createContext<SocketContextType | null>(null);

export default function SocketProvider({ children }: { children: ReactNode }) {
  const ws = useRef<WebSocket | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const pathname = usePathname();

  const excludedPaths = ["/login", "/register"];
  const shouldConnect = !excludedPaths.includes(pathname);

  useEffect(() => {
    if (!shouldConnect) {
      return
    }

    ws.current = new WebSocket("ws://localhost:8080/ws");

    ws.current.onopen = () => {
      console.log("web socket open");
      ws.current?.send(
        JSON.stringify({
          type: "getUser",
        })
      );
    };

    ws.current.onmessage = (event) => {
      console.log(JSON.parse(event.data));
    };

    ws.current.onclose = () => {
      console.log("web socket closed");
    };

    return () => ws.current?.close();
  }, [shouldConnect]);

  return (
    <SocketContext.Provider value={{ ws, messages, setMessages }}>
      {children}
    </SocketContext.Provider>
  );
}
