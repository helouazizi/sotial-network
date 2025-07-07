"use client"
import { usePathname } from "next/navigation"
import React, { createContext, useEffect, useRef, useState, ReactNode, RefObject } from "react"
import { Message, User } from "../types/chat";
import { getUserInfos } from "@/services/user";
import { NumOfREquests } from "@/types/Request";
import { type } from "os";
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
  scrollHeight: boolean
  setScrollHeight: React.Dispatch<React.SetStateAction<boolean>>
  numsNotif: NumOfREquests | undefined
  setNumNotif: React.Dispatch<React.SetStateAction<NumOfREquests | undefined>>
}

export const SocketContext = createContext<SocketContextType | null>(null);

export default function SocketProvider({ children }: { children: ReactNode }) {
  const ws = useRef<WebSocket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null)
  const [friends, setFriends] = useState<User[] | null>(null)
  const [sendMessage, setSendMessage] = useState<Message | undefined>(undefined)
  const [scrollHeight, setScrollHeight] = useState<boolean>(false)
  const [numsNotif, setNumNotif] = useState<NumOfREquests | undefined>(undefined)

  const excludedPaths = ["/login", "/register"];
  const shouldConnect = !excludedPaths.includes(pathname);

  useEffect(() => {
    if (!shouldConnect) {
      return
    }

    ws.current = new WebSocket("ws://localhost:8080/ws");

    ws.current.onopen = async () => {
      console.log("web socket open");
      const userRes = await getUserInfos()
      const userInfos: User = {
        id: userRes.ID,
        nickname: userRes.nickname,
        firstName: userRes.firstname,
        lastName: userRes.lastname,
        avatar: userRes.avatar,
      }
      setUser(userInfos)
      ws.current?.send(JSON.stringify({
        type: "GetNumNotif"
      }))
    };

    ws.current.onmessage = (event: MessageEvent) => {
      let res = JSON.parse(event.data)

      console.log(res)

      if (res.type === "getUser") {
        const userInfos: User = {
          id: res.data.ID,
          nickname: res.data.nickname,
          firstName: res.data.firstname,
          lastName: res.data.lastname,
          avatar: res.data.avatar,
        }
        setUser(userInfos)
      }

      if (res.type === "CountNotifs") {
        console.log(res.data);

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
        } else {
          setMessages(prev => [...[], ...prev])
        }

        setScrollHeight(prev => !prev)
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
      setSendMessage,
      scrollHeight,
      setScrollHeight,
      numsNotif,
      setNumNotif
    }}>
      {children}
    </SocketContext.Provider>
  );
}
