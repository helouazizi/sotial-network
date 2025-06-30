"use client"
import { usePathname } from "next/navigation"
import React, { createContext, useEffect, useRef, useState, ReactNode, RefObject } from "react"
import { Message, User } from "../types/chat";
export interface SocketContextType {
  ws: RefObject<WebSocket | null>
  messages: Message[]
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>
  user: User | null
  setUser: React.Dispatch<React.SetStateAction<User | null>>
  friends: User[] | null
  setFriends: React.Dispatch<React.SetStateAction<User[] | null>>
  sendMessage: Message | undefined
  setSendMessage: React.Dispatch<React.SetStateAction<Message | undefined>>
}

export const SocketContext = createContext<SocketContextType | null>(null);

export default function SocketProvider({ children }: { children: ReactNode }) {
  const ws = useRef<WebSocket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null)
  const [friends, setFriends] = useState<User[] | null>(null)
  const [sendMessage, setSendMessage] = useState<Message | undefined>(undefined)


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

    ws.current.onmessage = (event: MessageEvent) => {
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

      if (res.type === "getFriends") {
        const friendsList: User[] = res?.data?.map((friend: any) => {
          return {
            id: friend.ID,
            nickname: friend.nickname,
            firstName: friend.firstname,
            lastName: friend.lastname
          }
        })
        setFriends(friendsList)
      }

      if (res.type === "getMessages") {
        if (res.data) {
          let reverseData = res.data.reverse()
          setMessages(prev => [...reverseData, ...prev])
        }
      }

      if (res.type === "saveMessage") {
        setSendMessage(res.message)
      }

    };

    ws.current.onclose = () => {
      console.log("web socket closed");
    };

    return () => ws.current?.close();
  }, [shouldConnect]);

  return (
    <SocketContext.Provider value={{
      ws,
      messages,
      setMessages,
      user,
      setUser,
      friends,
      setFriends,
      sendMessage,
      setSendMessage
    }}>
      {children}
    </SocketContext.Provider>
  );
}
