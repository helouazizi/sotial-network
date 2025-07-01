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
    const { ws, friends, messages, setMessages, sendMessage, setSendMessage, scrollHeight, user } = useContext(SocketContext) ?? {}
    let [friend, setFriend] = useState<User | undefined>(undefined)
    const chatBodyRef = useRef<HTMLDivElement>(null)
    const previousScrollHeight = useRef<number>(0)
    const [scrollToBottom, setScrollToBottom] = useState<boolean>(false)

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
            // console.log(isAtBottom, lastMessage.sender_id, lastMessage.receiver_id, friend?.id)
            if ((lastMessage.sender_id !== friend?.id || isAtBottom) && (lastMessage.sender_id === friend?.id || lastMessage.receiver_id === friend?.id)){
                chatBodyRef.current?.scrollTo({
                    top: chatBodyRef.current.scrollHeight,
                    behavior: "smooth"
                })
            }
        }
    }, [scrollToBottom])

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

            console.log(user)

            if (message.receiver_id === friend?.id) {
                return (
                    <div key={message.id} id={`${message.id}`} className="sender">
                        <div>
                            <p>{user?.firstName} {user?.lastName}</p>
                            {messageLines}
                        </div>
                    </div>
                );
            }


            if (message.sender_id === friend?.id) {
                return (
                    <div key={message.id} id={`${message.id}`} className="receiver">
                        <div>
                            {/* <p>{user?.firstName} {user?.lastName}</p> */}
                            <br />
                            {messageLines}
                        </div>
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