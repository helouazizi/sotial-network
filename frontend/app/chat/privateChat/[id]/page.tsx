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
    const previousScrollHeight = useRef<number>(0)

    const getMessages = (lastID: number) => {
        if (ws?.current && friend) {
            ws.current.send(JSON.stringify({
                "type": "getMessages",
                "receiver_id": friend.id,
                "last_id": lastID
            }))
        }
    }

    useEffect(() => {
        getMessages(-1)
    }, [friend])

    useEffect(() => {
        let friend: User | undefined = friends?.find((f: User) => {
            return f.id === Number(id)
        })

        setFriend(friend)

        return () => {
            if (setMessages) setMessages([])
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
        if (chatBodyRef.current) {
            chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight - previousScrollHeight.current
            previousScrollHeight.current = 0
        }
    }, [messages])

    const handleScroll = () => {
        if (chatBodyRef.current) {
            if (chatBodyRef.current.scrollTop === 0) {
                previousScrollHeight.current = chatBodyRef.current.scrollHeight
                if (messages) getMessages(messages[0].id)
            }
        }
    }

    const displayMessages = () => {
        return messages?.map((message: Message) => {
            if (message.receiver_id === friend?.id) {
                return (
                    <div key={message.id} id={`${message.id}`} className="receiver">
                        <p>{message.message}</p>
                    </div>
                )
            }

            return (
                <div key={message.id} id={`${message.id}`} className="sender">
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
                    <div ref={chatBodyRef} onScroll={handleScroll} className="chatBody">{displayMessages()}</div>
                    <ChatFooter receiverId={friend.id} />
                </>
            )}
        </>
    );
}