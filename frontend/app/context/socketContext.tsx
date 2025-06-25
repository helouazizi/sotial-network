"use client"
import { usePathname } from "next/navigation"
import React, { createContext, useEffect, useRef, useState, ReactNode, RefObject } from "react"
import { User } from "../types/user";
export interface SocketContextType {
  ws: RefObject<WebSocket | null>
  messages: any[]
  setMessages: React.Dispatch<React.SetStateAction<any[]>>
  user: User | null
  setUser: React.Dispatch<React.SetStateAction<User | null>>
}

export const SocketContext = createContext<SocketContextType | null>(null);

export default function SocketProvider({ children }: { children: ReactNode }) {
  const ws = useRef<WebSocket | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null)

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
      let res = JSON.parse(event.data) 

      if (res.type === "getUser") {
        const userInfos: User = {
          id: res.data.ID,
          nickname: res.data.nickname,
          firstName: res.data.firstname,
          lastName: res.data.lastname,
        }

        setUser(userInfos)
      }
    };

    ws.current.onclose = () => {
      console.log("web socket closed");
    };

    return () => ws.current?.close();
  }, [shouldConnect]);

  return (
    <SocketContext.Provider value={{ ws, messages, setMessages, user, setUser }}>
      {children}
    </SocketContext.Provider>
  );
}
