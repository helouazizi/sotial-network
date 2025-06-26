"use client"

import ChatFooter from "@/app/components/chat/chatFooter";
import { FaUser } from "react-icons/fa";

export default function PrivateChat() {
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