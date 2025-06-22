"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function ChatNav() {
  const pathname = usePathname();

  return (
    <div className="chatNav">
      <Link
        href="/chat/privateChat"
        className={pathname === "/chat/privateChat" ? "active" : ""}
      >
        Private
      </Link>
      <Link
        href="/chat/groups"
        className={pathname === "/chat/groups" ? "active" : ""}
      >
        Groups
      </Link>
    </div>
  );
}
