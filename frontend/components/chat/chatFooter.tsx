"use client"

import React, { useContext, useEffect, useRef, useState } from "react"
import { SocketContext } from "../../context/socketContext"
import EmojiList from "./emojiList"

export default function ChatFooter({ receiverId }: { receiverId: number }) {
    const { ws, user } = useContext(SocketContext) ?? {}
    const textarea = useRef<HTMLTextAreaElement>(null)

    const sendMessage = () => {
        let message = textarea.current?.value.trim()
        if (!message) {
            return
        }

        if (ws?.current) {
            ws.current.send(JSON.stringify({
                "message": message,
                "receiver_id": receiverId,
                "fullName": `${user?.firstname} ${user?.lastname}`,
                "type": "saveMessage",
            }))
        }

        if (textarea.current) {
            textarea.current.value = ""
        }
    }

    useEffect(() => {
        if (textarea) {
            textarea.current?.focus()
        }
    }, [])

    const handleClick = () => {
        sendMessage()
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            sendMessage()
        }
    }

    return (
        <div className="chatFooter">
            <textarea maxLength={3000} ref={textarea} onKeyDown={handleKeyDown} placeholder="Type a message..." ></textarea>
            <EmojiList textarea={textarea.current} />
            <button onClick={handleClick}>Send</button>
        </div>
    )
}