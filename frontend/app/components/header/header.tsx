"use client";
import Link from "next/link";
import { TiHome } from "react-icons/ti";
import { MdGroups2 } from "react-icons/md";
import { LuMessageCircleMore } from "react-icons/lu";
import { IoIosNotifications } from "react-icons/io";
import { FaUser } from "react-icons/fa";
import { usePathname } from "next/navigation";
import { IoIosLogOut } from "react-icons/io";
import { useRouter } from 'next/navigation';
import { useContext } from "react";
import { SocketContext, SocketContextType } from "@/app/context/socketContext";
export default function Header() {
  const router = useRouter();
  const pathname = usePathname()
  const { ws } = useContext(SocketContext) as SocketContextType
  const handleClickLogout = async () => {
    try {
      const res = await fetch("http://localhost:8080/app/v1/user/logout", {
        method: 'GET',
        credentials: 'include',
      });
      console.log(res);

      if (res.ok) {
        if (ws.current) {
          ws.current.close()
        }
        router.push('/login')
        console.log("Iam heer");

      }

    } catch (error) {
      if (ws.current) {
        ws.current.close()
      }
      router.push('/login')
    }

  }

  return (
    <header>
      <nav>
        <Link href={"/"} className="logo">
          Social <span>Net</span>work
        </Link>
        <ul>
          <li>
            <Link href={"/"}><TiHome className={pathname === "/" ? "active" : " "} /></Link>
          </li>
          <li>
            <Link href={"/chat/privateChat"}><LuMessageCircleMore className={pathname.startsWith("/chat/privateChat") ? "active" : ""} /></Link>
          </li>
          <li>
            <Link href={"/chat/groups"}><MdGroups2 className={pathname === "/chat/groups" ? "active groupIconHeader" : "groupIconHeader"} /></Link>
          </li>
        </ul>
        <div>
          <button className="notification"><IoIosNotifications /></button>
          <Link href={"/profile/1"}>
            <button className="profile"><FaUser /></button>
          </Link>

          <button className="user-logout" onClick={handleClickLogout}><IoIosLogOut /></button>

        </div>

      </nav>
    </header>
  );
}
