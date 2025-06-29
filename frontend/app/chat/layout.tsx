"use client"

import { FaUser } from "react-icons/fa";
import ChatNav from "../components/chat/chatNav";
import { ReactNode, useContext } from "react";
import { SocketContext } from "../context/socketContext";
import Friends from "../components/chat/friends";

export default function ChatLayout({ children } : {children : ReactNode}) {
  const {user} = useContext(SocketContext) ?? {}

  return (
    <main className="container chatPage">
      <section className="sidebar">
        <div className="myName">
          <p>
            <FaUser /> {user?.firstName} {user?.lastName || `Loading my name...`}
          </p>
        </div>
        <div className="friends">
          <ChatNav />
          <div className="friends-list">
            <ul><Friends /></ul>
          </div>
        </div>
      </section>
      <section className="chatMessages">
        {children}
      </section>
    </main>
  );
}
