"use client"

import React, { useContext, useEffect, useRef } from "react"
import { SocketContext } from "../../context/socketContext"

export default function ChatFooter({ receiverId }: { receiverId: number }) {
    const { ws } = useContext(SocketContext) ?? {}
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
    }) 

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
            <button onClick={handleClick}>Send</button>
        </div>
    )
}