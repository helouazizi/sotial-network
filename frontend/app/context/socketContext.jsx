"use client"

import { usePathname, useRouter } from "next/navigation"
import { createContext, useEffect, useRef, useState } from "react"

export const SocketContext = createContext(null)

export default function SocketProvider({ children }) {
    const ws = useRef(null)
    const [messages, setMessages] = useState([])
    const pathname = usePathname()
    const router = useRouter();


    const excludedPaths = ["/login", "/register"];
    const shouldConnect = !excludedPaths.includes(pathname);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await fetch('http://localhost:8080/app/v1/user/Auth', {
                    credentials: 'include',
                });

                if (res.ok) {
                    if (pathname == '/register' || pathname == '/login') {
                        router.push('/')
                    }
                } else {
                    if (pathname !== '/register' && pathname !== '/login') {
                        router.push('/login');
                    }
                }
            } catch (err) {
                console.error('Error checking auth:', err);
                if (pathname !== '/register' && pathname !== '/login') {
                    router.push('/login');
                }
            }
        }

        checkAuth()

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
