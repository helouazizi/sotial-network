"use client"
import { usePathname } from "next/navigation"
import React, { createContext, useEffect, useRef, useState, ReactNode, RefObject } from "react"
import { Message } from "../types/chat";
import { getUserInfos } from "@/services/user";
import { NumOfREquests } from "@/types/Request";
import { ProfileInt } from "@/types/profiles";
import { User } from "@/types/user";
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
  reqFollowers: ProfileInt[] | []
  setReqFollowers: React.Dispatch<React.SetStateAction<ProfileInt[] | []>>
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
  const [reqFollowers, setReqFollowers] = useState<ProfileInt[] | []>([])

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

      setUser(userRes)
      ws.current?.send(JSON.stringify({
        type: "GetNumNotif"
      }))
      ws.current?.send(JSON.stringify({ type: "GetFollowersRequest" }))
    };

    ws.current.onmessage = (event: MessageEvent) => {
      let res = JSON.parse(event.data)
      if (res.type === "CountNotifs") {
        const countotifs: NumOfREquests = {
          followersCount: res.data.followersCount,
          groupeReqCount: res.data.groupeCount,
          total: res.data.total
        }
        setNumNotif(countotifs)
      }
      if (res.type === 'requestsFollowers') {
        console.log("mcha");

        setReqFollowers((prev) => {
          if (!prev || !res.data) return []
          return [...res.data]
        });
      }

      if (res.type === "getFriends") {

        setFriends(res.data)
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
      if (res.type === "ResponseRequestsFollowers") {
        setNumNotif((prev) => {
          if (!prev || typeof prev.followersCount !== 'number') return prev
          return {
            ...prev,
            followersCount: prev.followersCount > 0 ? +prev.followersCount - 1 : 0,
            total: +prev.total > 0 ? +prev.total - 1 : 0,
          }
        })
        setReqFollowers(prev => {
          console.log("before filter:", prev);
          return prev.filter(ele => ele.request_id !== res.ReqID);
        });
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
      setNumNotif,
      reqFollowers,
      setReqFollowers
    }}>
      {children}
    </SocketContext.Provider>
  );
}
