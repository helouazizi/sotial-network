"use client"

import { useContext, useRef } from "react"
import { SocketContext } from "../../context/socketContext"

export default function ChatFooter() {
    const {messages, setMessages} = useContext(SocketContext)
    const textarea = useRef()

    const handleClick = () => {
        console.log(textarea.current.value)
    }

    return (
        <div className="chatFooter">
            <textarea ref={textarea} placeholder="Type a message..."></textarea>
            <button onClick={handleClick}>Send</button>
        </div>
    )
}