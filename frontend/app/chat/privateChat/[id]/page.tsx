"use client"

import ChatFooter from "@/components/chat/chatFooter";
import { SocketContext } from "@/context/socketContext";
import { Message } from "@/types/chat";
import { useParams } from "next/navigation";
import React, { useContext, useEffect, useRef, useState } from "react";
import { FaUser } from "react-icons/fa";
import { FaArrowAltCircleDown } from "react-icons/fa";
import Chat from "../page";
import { User } from "@/types/user";

export default function PrivateChat() {
    const { id } = useParams()
    const { ws, friends, messages, setMessages, sendMessage, setSendMessage, scrollHeight, user } = useContext(SocketContext) ?? {}
    let [friend, setFriend] = useState<User | undefined>(undefined)
    const chatBodyRef = useRef<HTMLDivElement>(null)
    const previousScrollHeight = useRef<number>(0)
    const [scrollToBottom, setScrollToBottom] = useState<boolean>(false)
    const [showScrollButton, setShowScrollButton] = useState<boolean>(false)

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
        return () => {
            if (setSendMessage) setSendMessage(undefined)
        }
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
        if (!sendMessage) return;
        if (setMessages) setMessages(prev => [...prev ?? [], sendMessage])
        setScrollToBottom(prev => !prev)
        if (setSendMessage) setSendMessage(undefined)
    }, [sendMessage])

    useEffect(() => {
        if (chatBodyRef.current) {
            chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight - previousScrollHeight.current
        }
    }, [scrollHeight])

    useEffect(() => {
        if (messages && messages.length > 0 && chatBodyRef.current) {
            const isAtBottom = chatBodyRef.current?.scrollTop + chatBodyRef.current?.clientHeight >= chatBodyRef.current?.scrollHeight - 100;
            let lastMessage = messages[messages.length - 1]

            if (!isAtBottom && lastMessage.sender_id === friend?.id) {
                setShowScrollButton(true)
            }

            if ((lastMessage.sender_id !== friend?.id || isAtBottom) && (lastMessage.sender_id === friend?.id || lastMessage.receiver_id === friend?.id)) {
                chatBodyRef.current?.scrollTo({
                    top: chatBodyRef.current.scrollHeight,
                    behavior: "smooth"
                })
                setShowScrollButton(false)
            }
        }
    }, [scrollToBottom])

    const handleScroll = () => {
        if (chatBodyRef.current) {
            if (chatBodyRef.current.scrollTop === 0) {
                previousScrollHeight.current = chatBodyRef.current.scrollHeight
                if (messages) getMessages(messages[0].id)
            } else {
                const isAtBottom = chatBodyRef.current?.scrollTop + chatBodyRef.current?.clientHeight >= chatBodyRef.current?.scrollHeight - 100;
                if (isAtBottom) {
                    setShowScrollButton(false)
                }
            }
        }
    }

    const displayMessages = () => {
        return messages?.map((message: Message) => {
            const isSender = message.receiver_id === friend?.id;
            const isReceiver = message.sender_id === friend?.id;

            if (!isSender && !isReceiver) return null;

            const messageLines = message.message.split("\n").map((line, index) => (
                <React.Fragment key={index}>
                    {line}
                    <br />
                </React.Fragment>
            ));

            const className = isSender ? "sender" : "receiver";

            return (
                <div key={message.id} id={`${message.id}`} className={className}>
                    <div className="msg">
                        {messageLines}
                        <span>{message.sent_at_str.slice(0, 16)}</span>
                    </div>
                </div>
            );
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
                                {friend?.firstname} {friend?.lastname}
                            </span>
                        </p>
                        <p className="online">
                            <span></span> online
                        </p>
                    </div>
                    <div ref={chatBodyRef} onScroll={handleScroll} className="chatBody">
                        {displayMessages()}
                        {showScrollButton && (
                            <button onClick={() => {
                                chatBodyRef.current?.scrollTo({
                                    top: chatBodyRef.current.scrollHeight,
                                    behavior: "smooth"
                                })
                                setShowScrollButton(false)
                            }} className="showScrollButton"><FaArrowAltCircleDown /></button>
                        )}
                    </div>
                    <ChatFooter receiverId={friend.id} />
                </>
            )}
        </>
    );
}