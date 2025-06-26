"use client"

import ChatFooter from "@/app/components/chat/chatFooter";
import { SocketContext } from "@/app/context/socketContext";
import { Message, User } from "@/app/types/chat";
import { useParams } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { FaUser } from "react-icons/fa";

export default function PrivateChat() {
    const { id } = useParams()
    const { ws, friends, messages } = useContext(SocketContext) ?? {}
    let [friend, setFriend] = useState<User | undefined>(undefined)

    useEffect(() => {
        let friend: User | undefined = friends?.find((f: User) => {
            return f.id === Number(id)
        })

        setFriend(friend)

        if (ws?.current && friend) {
            ws.current.send(JSON.stringify({
                "type": "getMessages",
                "receiver_id": friend.id
            }))
        }
    }, [friends])

    const displayMessages = () => {
        return messages?.map((message: Message) => {
            if (message.receiver_id === friend?.id) {
                return (
                    <div key={message.id} className="receiver">
                        <p>{message.message}</p>
                    </div>
                )
            }

            return (
                <div key={message.id} className="sender">
                    <p>{message.message}</p>
                </div>
            )
        })
    }

    return (
        <>
            <div className="chatHeader">
                <p className="userName"><FaUser /> <span id={`${friend?.id}`}>{friend?.firstName} {friend?.lastName}</span></p>
                <p className="online"><span></span> online</p>
            </div>
            <div className="chatBody">
                {displayMessages()}
            </div>
            <ChatFooter />
        </>
    )
}