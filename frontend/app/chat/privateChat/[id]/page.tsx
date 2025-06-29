"use client"

import ChatFooter from "@/app/components/chat/chatFooter";
import { SocketContext } from "@/app/context/socketContext";
import { Message, User } from "@/app/types/chat";
import { useParams } from "next/navigation";
import { useContext, useEffect, useRef, useState } from "react";
import { FaUser } from "react-icons/fa";
import Chat from "../page";

export default function PrivateChat() {
    const { id } = useParams()
    const { ws, friends, messages, setMessages, sendMessage, setSendMessage } = useContext(SocketContext) ?? {}
    let [friend, setFriend] = useState<User | undefined>(undefined)
    const chatBodyRef = useRef<HTMLDivElement>(null)

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

    useEffect(() => {
        if (sendMessage && setMessages) {
            setMessages(prev => [...prev ?? [], sendMessage])
        }


        return () => {
            if (setSendMessage) setSendMessage(undefined)
        }
    }, [sendMessage])

    useEffect(() => {
        chatBodyRef.current?.scrollTo({
            top: chatBodyRef.current.scrollHeight,
        })
    }, [messages])

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
            {friend === undefined ? (
                <Chat />
            ) : (
                <>
                    <div className="chatHeader">
                        <p className="userName">
                            <FaUser />
                            <span id={`${friend?.id}`}>
                                {friend?.firstName} {friend?.lastName}
                            </span>
                        </p>
                        <p className="online">
                            <span></span> online
                        </p>
                    </div>
                    <div ref={chatBodyRef} className="chatBody">{displayMessages()}</div>
                    <ChatFooter receiverId={friend.id} />
                </>
            )}
        </>
    );
}