"use client"
import { FaUser } from "react-icons/fa";
import { usePathname } from "next/navigation";
import Link from "next/link";


export default function ChatLayout({ children }) {
  const pathname = usePathname()

  return (
    <main className="container chatPage">
      <section>
        <div className="myName">
          <p>
            <FaUser /> Africano
          </p>
        </div>
        <div className="friends">
          <div className="type">
            <Link href="/chat/privateChat" className={pathname === "/chat/privateChat" ? "active" : ""}>Private</Link>
            <Link href="/chat/groups" className={pathname === "/chat/groups" ? "active" : ""}>Groups</Link>
          </div>
          <ul>{children}</ul>
        </div>
      </section>
      <section className="chat"></section>
    </main>
  );
}
