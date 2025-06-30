"use client"

import ChatFooter from "@/app/components/chat/chatFooter";
import { SocketContext } from "@/app/context/socketContext";
import { Message, User } from "@/app/types/chat";
import { useParams } from "next/navigation";
import React, { useContext, useEffect, useRef, useState } from "react";
import { FaUser } from "react-icons/fa";
import Chat from "../page";

export default function PrivateChat() {
    const { id } = useParams()
    const { ws, friends, messages, setMessages, sendMessage, setSendMessage, scrollHeight } = useContext(SocketContext) ?? {}
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

        if (messages && messages.length > 0 && chatBodyRef.current) {
            const isAtBottom = chatBodyRef.current?.scrollTop + chatBodyRef.current?.clientHeight >= chatBodyRef.current?.scrollHeight - 100;
            if (messages[messages?.length - 1].sender_id !== friend?.id || isAtBottom) {
                chatBodyRef.current?.scrollTo({
                    top: chatBodyRef.current.scrollHeight,
                    behavior: "smooth"
                })
            }
        }

        return () => {
            if (setSendMessage) setSendMessage(undefined)
        }
    }, [sendMessage])

    useEffect(() => {
        if (chatBodyRef.current) {
            chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight - previousScrollHeight.current
            // previousScrollHeight.current = 0
        }
    }, [scrollHeight])

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
            const messageLines = message.message.split("\n").map((line, index) => (
                <React.Fragment key={index}>
                    {line}
                    <br />
                </React.Fragment>
            ))


            if (message.receiver_id === friend?.id) {
                return (
                    <div key={message.id} id={`${message.id}`} className="receiver">
                        <p>
                            {messageLines}
                        </p>
                    </div>
                );
            }

            if (message.sender_id === friend?.id) {
                return (
                    <div key={message.id} id={`${message.id}`} className="sender">
                        <p>
                            {messageLines}
                        </p>
                    </div>
                );
            }
        });
    };


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