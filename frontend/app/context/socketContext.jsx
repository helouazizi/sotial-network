"use client"

import { usePathname } from "next/navigation"
import { createContext, useEffect, useRef, useState } from "react"

export const SocketContext = createContext(null)

export default function SocketProvider({ children }) {
    const ws = useRef(null)
    const [messages, setMessages] = useState([])
    const pathname = usePathname()

    const excludedPaths = ["/login", "/register"];
    const shouldConnect = !excludedPaths.includes(pathname);

    useEffect(() => {
        if (!shouldConnect) {
            console.log(ws.current)
            return
        }

        ws.current = new WebSocket("ws://localhost:8080/ws")

        ws.current.onopen = () => {
            console.log('web socket open')
        }

        ws.current.close = () => {
            console.log('web socket closed')
        }

        return () => ws.current.close()
    }, [shouldConnect])

    return (
        <SocketContext.Provider value={{ messages, setMessages, ws }}>
            {children}
        </SocketContext.Provider>
    )
}