"use client"

import { SocketContext } from "@/context/socketContext";
import { User } from "@/types/user";
import { useRouter } from "next/navigation";
import { useContext, useEffect } from "react";
import PostHeader from "../post/postHeader";


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
                return <li
                 key={friend.id} id={`${friend.id}`}
                 onClick={handleClickUser}>
                 <PostHeader author={friend.nickname ? friend.nickname : friend.firstname + "-" + friend.lastname} firstname={friend.firstname} lastname={friend.lastname} createdAt='' avatarUrl={friend.avatar} />
                 </li>
            }) || <li>No friends Yet</li>}
        </>
    );
}