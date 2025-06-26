"use client"

import ChatFooter from "@/app/components/chat/chatFooter";
import { SocketContext } from "@/app/context/socketContext";
import { User } from "@/app/types/user";
import { useParams } from "next/navigation";
import { useContext, useEffect } from "react";
import { FaUser } from "react-icons/fa";

export default function PrivateChat() {
    const { id } = useParams()
    const { friends } = useContext(SocketContext) ?? {}
    // let [friend, setFriend] = 

    useEffect(() => {
        let friend: User | undefined = friends?.find((f: User) => {
            return f.id === Number(id)
        })
    }, [])

    return (
        <>
            <div className="chatHeader">
                <p className="userName"><FaUser /> Youssef</p>
                <p className="online"><span></span> online</p>
            </div>
            <div className="chatBody">

                <div className="sender">
                    <p>ana sender</p>
                </div>
                <div className="receiver">
                    <p>ana receiver</p>
                </div>
                <div className="sender">
                    <p>ana sender</p>
                </div>
                <div className="receiver">
                    <p>ana receiver</p>
                </div>
                <div className="sender">
                    <p>ana sender</p>
                </div>
                <div className="receiver">
                    <p>ana receiver</p>
                </div>
            </div>
            <ChatFooter />
        </>
    )
}