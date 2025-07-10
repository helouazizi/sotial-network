"use client"

import { SocketContext } from "@/context/socketContext";
import { User } from "@/types/user";
import { useRouter } from "next/navigation";
import { useContext, useEffect } from "react";
import { FaUser } from "react-icons/fa";


export default function Friends() {
    const { ws, friends, setFriends } = useContext(SocketContext) ?? {}
    const router = useRouter()

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
    
    const handleClickUser = (e: React.MouseEvent<HTMLElement>) => {
        router.push("/chat/privateChat/" + e.currentTarget.id)
    }

    return (
        <>
            {friends?.map((friend: User) => {
                return <li key={friend.id} id={`${friend.id}`} onClick={handleClickUser}><FaUser /> {friend.firstname} {friend.lastname}</li>
            }) || <li>Loading friends...</li>}
        </>
    );
}