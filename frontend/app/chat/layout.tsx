"use client"
import { FaUser } from "react-icons/fa";
import ChatNav from "../../components/chat/chatNav";
import { ReactNode, useContext } from "react";
import { SocketContext } from "../../context/socketContext";
import Friends from "../../components/chat/friends";
import { usePathname } from "next/navigation";
import GroupsChat from "@/components/groups/GroupsChat";
import { GroupsProvider } from "@/context/GroupsContext";

export default function ChatLayout({ children }: { children: ReactNode }) {
  const { user } = useContext(SocketContext) ?? {}
  let pathName = usePathname()
  let isPrivateChat = pathName.startsWith("/chat/privateChat")

  return (
    <GroupsProvider>
      <main className="container chatPage">
        <section className="sidebar">
          <div className="myName">
            <p>
              <FaUser /> {user?.firstname} {user?.lastname || `Loading my name...`}
            </p>
          </div>
          <div className="friends">
            <ChatNav />
            <div className="friends-list">

              <ul>{isPrivateChat ? <Friends /> :

                <GroupsChat />
              }</ul>

            </div>
          </div>

        </section>
        <section className="chatMessages">
          {children}
        </section>
      </main>
    </GroupsProvider>
  );
}
