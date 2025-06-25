"use client"
import { SocketContext } from "@/app/context/socketContext";
import { User } from "@/app/types/user";
import { useContext, useEffect } from "react";
import { FaUser } from "react-icons/fa";

export default function PrivateChat() {
  const { ws, friends, setFriends } = useContext(SocketContext) ?? {}

  useEffect(() => {
    if (ws?.current) {
      ws.current.send(JSON.stringify({
        type: "getFriends"
      }));
    }

    return () => {
      if (setFriends) setFriends(null)
    }
  }, [ws?.current]) 

  return (
    <>
      {friends?.map((friend: User) => {
        return <li key={friend.id}><FaUser /> {friend.firstName} {friend.lastName}</li>
      }) || <li>Loading friends...</li> }
    </>
  );
}
